import crypto from 'crypto';
import db from './db.js';

// Limitador de tasa respaldado por Postgres.
//
// En serverless no sirve un contador en memoria: cada instancia tendria el suyo
// y el limite se multiplicaria por el numero de instancias vivas. La tabla
// rate_limits la crea la migracion 0011.

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'desconocido';
}

function hashKey(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 40);
}

/**
 * Middleware de limite de tasa por ventana fija.
 *
 * @param {object} options
 * @param {string} options.bucket      Nombre logico del limite.
 * @param {number} options.max         Peticiones permitidas por ventana.
 * @param {number} options.windowSec   Duracion de la ventana en segundos.
 * @param {(req) => string} [options.identify]  Identificador extra ademas de la IP.
 */
export function rateLimit({ bucket, max, windowSec, identify }) {
  return async (req, res, next) => {
    let key = `${bucket}:${clientIp(req)}`;
    if (identify) {
      const extra = identify(req);
      if (extra) key += `:${hashKey(String(extra).toLowerCase())}`;
    }

    try {
      const row = await db.get(
        `INSERT INTO rate_limits (key, count, window_start)
         VALUES (?, 1, NOW())
         ON CONFLICT (key) DO UPDATE SET
           count = CASE
             WHEN rate_limits.window_start < NOW() - (? || ' seconds')::interval THEN 1
             ELSE rate_limits.count + 1
           END,
           window_start = CASE
             WHEN rate_limits.window_start < NOW() - (? || ' seconds')::interval THEN NOW()
             ELSE rate_limits.window_start
           END
         RETURNING count, window_start`,
        key, String(windowSec), String(windowSec)
      );

      // Purga oportunista: evita un cron para una tabla que se limpia sola.
      if (Math.random() < 0.01) {
        db.run(
          `DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 day'`
        ).catch(() => {});
      }

      if (row && row.count > max) {
        const elapsed = (Date.now() - new Date(row.window_start).getTime()) / 1000;
        const retryAfter = Math.max(1, Math.ceil(windowSec - elapsed));
        res.set('Retry-After', String(retryAfter));
        return res.status(429).json({
          error: 'Demasiados intentos. Espera un momento y vuelve a intentarlo.',
          retryAfter,
        });
      }
    } catch (err) {
      // Si el contador falla, dejamos pasar: la base de datos caida ya impide
      // completar la peticion, y no queremos que el limitador sea el que tire
      // el login.
      console.error('[RateLimit] Error:', err.message);
    }

    next();
  };
}

/** Comparacion en tiempo constante para secretos compartidos. */
export function secretsMatch(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string') return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
