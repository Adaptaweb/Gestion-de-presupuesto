import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js';
import { fetchLatestTransactions, getLastCheckTime } from './gmailService.js';
import { getAuthUrl, exchangeCode, hasValidTokens } from './gmailAuth.js';
import { parseHTML } from './transactionParser.js';
import cache from './cache.js';
import { createJob, getJob } from './jobQueue.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gestion-presupuesto-secret-key-2025';

const app = express();
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Requiere permisos de administrador' });
  next();
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const row = await db.get('SELECT COUNT(*) as count FROM users');
    const role = row.count === 0 ? 'admin' : 'user';

    await db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      id, name, email, hashedPassword, role);

    const token = jwt.sign({ id, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name, email, role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    if (user.blocked) return res.status(403).json({ error: 'Usuario bloqueado. Contacta al administrador.' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ user });
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, email, role, blocked, created_at FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Rol inválido' });
    await db.run('UPDATE users SET role = ? WHERE id = ?', role, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    await db.run('DELETE FROM users WHERE id = ?', req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });

    const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userRole = role || 'user';

    await db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      id, name, email, hashedPassword, userRole);

    res.json({ success: true, user: { id, name, email, role: userRole, blocked: 0 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.put('/api/admin/users/:id/block', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'No puedes bloquearte a ti mismo' });
    const user = await db.get('SELECT blocked FROM users WHERE id = ?', req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const newBlocked = user.blocked ? 0 : 1;
    await db.run('UPDATE users SET blocked = ? WHERE id = ?', newBlocked, req.params.id);
    res.json({ success: true, blocked: newBlocked });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
});

app.put('/api/admin/users/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ error: 'Contraseña requerida' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ? WHERE id = ?', hashedPassword, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al resetear contraseña' });
  }
});

app.get('/api/data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `data:${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE] HIT data:${userId}`);
      return res.json(cached);
    }
    console.log(`[CACHE] MISS data:${userId}`);
    const monthRows = await db.all('SELECT mes FROM meses WHERE user_id = ?', userId);
    const months = monthRows.map(m => m.mes);

    const deudasRows = await db.all('SELECT * FROM deudas WHERE user_id = ?', userId);
    const pagosDeudasRows = await db.all('SELECT pd.* FROM pagos_deudas pd JOIN deudas d ON pd.deuda_id = d.id WHERE d.user_id = ?', userId);
    const deudas = deudasRows.map(d => {
      const pagos = {};
      pagosDeudasRows.filter(p => p.deuda_id === d.id).forEach(p => { pagos[p.mes] = { estado: p.estado }; });
      return { ...d, isContribuciones: Boolean(d.isContribuciones), diaPago: d.diaPago, facturacionAuto: Boolean(d.facturacionAuto), banco: d.banco, bancoLogo: d.bancoLogo, tipoTarjeta: d.tipoTarjeta, pagos };
    });

    const gastosRows = await db.all('SELECT * FROM gastos_fijos WHERE user_id = ?', userId);
    const pagosGastosRows = await db.all('SELECT pg.* FROM pagos_gastos pg JOIN gastos_fijos g ON pg.gasto_id = g.id WHERE g.user_id = ?', userId);
    const gastosFijos = gastosRows.map(g => {
      const pagos = {};
      pagosGastosRows.filter(p => p.gasto_id === g.id).forEach(p => { pagos[p.mes] = { monto: p.monto, estado: p.estado }; });
      return { ...g, diaPago: g.diaPago, facturacionAuto: Boolean(g.facturacionAuto), pagos };
    });

    const sueldosRows = await db.all('SELECT mes, monto FROM sueldos WHERE user_id = ?', userId);
    const sueldos = {};
    sueldosRows.forEach(s => sueldos[s.mes] = s.monto);

    const cuentasAhorro = await db.all('SELECT * FROM cuentas_ahorro WHERE user_id = ?', userId);
    const ahorrosDataRows = await db.all('SELECT ad.* FROM ahorros_data ad JOIN cuentas_ahorro c ON ad.cuenta_id = c.id WHERE c.user_id = ?', userId);
    const ahorrosData = {};
    ahorrosDataRows.forEach(a => {
      if (!ahorrosData[a.cuenta_id]) ahorrosData[a.cuenta_id] = {};
      ahorrosData[a.cuenta_id][a.mes] = { deposito: a.deposito, gasto: a.gasto };
    });

    console.log(`[GET /api/data] User ${userId}: cuentasAhorro=${cuentasAhorro.length}, ahorrosData entries=${ahorrosDataRows.length}`, JSON.stringify(ahorrosData));

    const subsRows = await db.all('SELECT * FROM suscripciones WHERE user_id = ?', userId);
    const pagosSubsRows = await db.all('SELECT ps.* FROM pagos_suscripciones ps JOIN suscripciones s ON ps.suscripcion_id = s.id WHERE s.user_id = ?', userId);
    const suscripciones = subsRows.map(s => {
      const pagos = {};
      pagosSubsRows.filter(p => p.suscripcion_id === s.id).forEach(p => { pagos[p.mes] = { monto: p.monto, estado: p.estado }; });
      return { ...s, pagos };
    });

    const abonosRows = await db.all('SELECT * FROM abonos WHERE user_id = ?', userId);
    const pagosAbonosRows = await db.all('SELECT pa.* FROM pagos_abonos pa JOIN abonos a ON pa.abono_id = a.id WHERE a.user_id = ?', userId);
    const abonos = abonosRows.map(a => {
      const pagos = {};
      pagosAbonosRows.filter(p => p.abono_id === a.id).forEach(p => { pagos[p.mes] = { monto: p.monto, estado: p.estado }; });
      return { ...a, diaPago: a.diaPago, facturacionAuto: Boolean(a.facturacionAuto), pagos };
    });

    const payload = { months, deudas, gastosFijos, sueldos, cuentasAhorro, ahorrosData, suscripciones, abonos };
    cache.set(cacheKey, payload, 300);
    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading data' });
  }
});

app.post('/api/sync', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { deudas, months, gastosFijos, sueldos, cuentasAhorro, ahorrosData, suscripciones, abonos } = req.body;

  cache.del(`data:${userId}`);

  try {
    await db.transaction(async (tx) => {
      if (months) {
        await tx.run('DELETE FROM meses WHERE user_id = ?', userId);
        for (let i = 0; i < months.length; i++) {
          await tx.run('INSERT INTO meses (id, user_id, mes) VALUES (?, ?, ?)', `month-${userId}-${i}`, userId, months[i]);
        }
      }

      if (deudas) {
        await tx.run('DELETE FROM deudas WHERE user_id = ?', userId);
        for (const d of deudas) {
          await tx.run(
            'INSERT INTO deudas (id, user_id, descripcion, "cuotasTotales", "valorCuota", "mesInicio", "isContribuciones", "diaPago", "facturacionAuto", banco, "bancoLogo", "tipoTarjeta", "iconType", "iconValue", "iconUrl") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            d.id, userId, d.descripcion, d.cuotasTotales, d.valorCuota, d.mesInicio, d.isContribuciones ? 1 : 0, d.diaPago || 1, d.facturacionAuto ? 1 : 0, d.banco || '', d.bancoLogo || '', d.tipoTarjeta || '', d.iconType || 'default', d.iconValue || 'layout', d.iconUrl || '');
          if (d.pagos) {
            for (const [mes, pago] of Object.entries(d.pagos)) {
              await tx.run('INSERT INTO pagos_deudas ("deuda_id", mes, estado) VALUES (?, ?, ?)', d.id, mes, pago.estado);
            }
          }
        }
      }

      if (gastosFijos) {
        await tx.run('DELETE FROM gastos_fijos WHERE user_id = ?', userId);
        for (const g of gastosFijos) {
          await tx.run('INSERT INTO gastos_fijos (id, user_id, descripcion, "diaPago", "facturacionAuto", "iconType", "iconValue", "iconUrl") VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            g.id, userId, g.descripcion, g.diaPago || 1, g.facturacionAuto ? 1 : 0, g.iconType || 'preset', g.iconValue || 'layout', g.iconUrl || '');
          if (g.pagos) {
            for (const [mes, pago] of Object.entries(g.pagos)) {
              await tx.run('INSERT INTO pagos_gastos ("gasto_id", mes, monto, estado) VALUES (?, ?, ?, ?)', g.id, mes, pago.monto || 0, pago.estado);
            }
          }
        }
      }

      if (sueldos) {
        await tx.run('DELETE FROM sueldos WHERE user_id = ?', userId);
        let i = 0;
        for (const [mes, monto] of Object.entries(sueldos)) {
          await tx.run('INSERT INTO sueldos (id, user_id, mes, monto) VALUES (?, ?, ?, ?)', `sueldo-${userId}-${i++}`, userId, mes, monto);
        }
      }

      if (cuentasAhorro !== undefined || ahorrosData !== undefined) {
        if (cuentasAhorro !== undefined) {
          await tx.run('DELETE FROM cuentas_ahorro WHERE user_id = ?', userId);

          if (cuentasAhorro.length > 0) {
            for (const c of cuentasAhorro) {
              await tx.run('INSERT INTO cuentas_ahorro (id, user_id, nombre, banco) VALUES (?, ?, ?, ?)', c.id, userId, c.nombre, c.banco);
            }
            console.log(`[SYNC] cuentasAhorro: ${cuentasAhorro.length} cuentas saved`);
          } else {
            console.log(`[SYNC] cuentasAhorro: cleared (empty array)`);
          }
        }

        if (ahorrosData !== undefined) {
          await tx.run('DELETE FROM ahorros_data WHERE cuenta_id IN (SELECT id FROM cuentas_ahorro WHERE user_id = ?)', userId);

          if (Object.keys(ahorrosData).length > 0) {
            let i = 0;
            for (const [cuentaId, data] of Object.entries(ahorrosData)) {
              for (const [mes, a] of Object.entries(data)) {
                await tx.run('INSERT INTO ahorros_data (id, cuenta_id, mes, deposito, gasto) VALUES (?, ?, ?, ?, ?)',
                  `ahorro-${userId}-${cuentaId}-${mes.replace(/\s/g, '-')}`, cuentaId, mes, a.deposito || 0, a.gasto || 0);
                i++;
              }
            }
            console.log(`[SYNC] ahorrosData: ${i} entries saved`);
          } else {
            console.log(`[SYNC] ahorrosData: cleared (empty object)`);
          }
        }
      }

      if (suscripciones) {
        await tx.run('DELETE FROM suscripciones WHERE user_id = ?', userId);
        for (const s of suscripciones) {
          await tx.run('INSERT INTO suscripciones (id, user_id, descripcion, valor, "billingCycle", "diaPago", "mesInicio", "durationYears", "iconType", "iconValue", "iconUrl") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            s.id, userId, s.descripcion, s.valor, s.billingCycle, s.diaPago || null, s.mesInicio, s.durationYears, s.iconType || 'default', s.iconValue || '', s.iconUrl || '');
          if (s.pagos) {
            for (const [mes, pago] of Object.entries(s.pagos)) {
              await tx.run('INSERT INTO pagos_suscripciones ("suscripcion_id", mes, monto, estado) VALUES (?, ?, ?, ?)', s.id, mes, pago.monto || s.valor || 0, pago.estado);
            }
          }
        }
      }

      if (abonos) {
        await tx.run('DELETE FROM abonos WHERE user_id = ?', userId);
        for (const a of abonos) {
          await tx.run('INSERT INTO abonos (id, user_id, descripcion, "diaPago", "facturacionAuto", "iconType", "iconValue", "iconUrl") VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            a.id, userId, a.descripcion, a.diaPago || 1, a.facturacionAuto ? 1 : 0, a.iconType || 'preset', a.iconValue || 'layout', a.iconUrl || '');
          if (a.pagos) {
            for (const [mes, pago] of Object.entries(a.pagos)) {
              await tx.run('INSERT INTO pagos_abonos ("abono_id", mes, monto, estado) VALUES (?, ?, ?, ?)', a.id, mes, pago.monto || 0, pago.estado);
            }
          }
        }
      }
    });


    res.json({ success: true });
  } catch (err) {
    console.error('Error syncing data:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.get('/api/transacciones/auth-url', authenticateToken, (req, res) => {
  try {
    const url = getAuthUrl(req.user.id);
    res.json({ url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;
    if (!code) return res.status(400).send('Código de autorización requerido');
    if (!userId) return res.status(400).send('Falta userId en la autenticación');
    await exchangeCode(code, userId);
    res.send(`
      <html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#f6f6f6;">
        <div style="background:white;padding:40px;border-radius:16px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <h1 style="color:#22c55e;">✅ Autenticación exitosa</h1>
          <p style="color:#64748b;">Ya puedes cerrar esta ventana y volver a la aplicación.</p>
        </div>
      </body></html>
    `);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.get('/api/transacciones/status', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const cacheKey = `status:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);
  const authenticated = await hasValidTokens(userId);
  const result = { authenticated, lastCheck: getLastCheckTime() };
  cache.set(cacheKey, result, 60);
  res.json(result);
});

app.get('/api/transacciones', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mes, categoria, banco, limit, offset, revisado } = req.query;

    const cacheKey = `tx:${userId}:${JSON.stringify({ mes, categoria, banco, limit, offset, revisado })}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE] HIT tx:${userId}`);
      return res.json(cached);
    }

    const conditions = ['user_id = ?'];
    const filterValues = [userId];

    if (mes) { conditions.push("SUBSTR(fecha, 1, 7) = ?"); filterValues.push(mes); }
    if (categoria) { conditions.push("categoria = ?"); filterValues.push(categoria); }
    if (banco) { conditions.push("banco = ?"); filterValues.push(banco); }
    if (revisado !== undefined) { conditions.push(revisado === 'true' ? 'revisado = TRUE' : 'revisado = FALSE'); }

    const whereClause = ' WHERE ' + conditions.join(' AND ');

    const countResult = await db.get('SELECT COUNT(*) as total FROM transacciones_extraidas' + whereClause, ...filterValues);
    const total = countResult.total;

    let sql = 'SELECT * FROM transacciones_extraidas' + whereClause + ' ORDER BY fecha DESC, fecha_extraccion DESC';
    const txParams = [...filterValues];
    if (limit) { sql += ' LIMIT ?'; txParams.push(parseInt(limit)); }
    if (offset) { sql += ' OFFSET ?'; txParams.push(parseInt(offset)); }

    const transactions = await db.all(sql, ...txParams);

    const summarySql = 'SELECT categoria, COUNT(*) as count, SUM(monto) as total FROM transacciones_extraidas' + whereClause + " AND (tipo_transaccion IS NULL OR (tipo_transaccion != 'interno' AND tipo_transaccion != 'no_es_gasto' AND tipo_transaccion != 'no_es_ingreso')) GROUP BY categoria ORDER BY total DESC";
    const summary = await db.all(summarySql, ...filterValues);

    const pendientesResult = await db.get('SELECT COUNT(*) as count FROM transacciones_extraidas WHERE user_id = ? AND (revisado = FALSE OR revisado IS NULL)', userId);
    const pendientes_count = pendientesResult.count;

    const result = { transactions, summary, total, pendientes_count, lastCheck: getLastCheckTime() };
    cache.set(cacheKey, result, 30);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
});

app.get('/api/transacciones/meses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `tx:meses:${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const rows = await db.all(
      "SELECT DISTINCT SUBSTR(fecha, 1, 7) as mes FROM transacciones_extraidas WHERE user_id = ? AND fecha IS NOT NULL AND revisado = TRUE ORDER BY mes DESC",
      userId);
    const result = { months: rows.map(r => r.mes) };
    cache.set(cacheKey, result, 60);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener meses' });
  }
});

app.put('/api/transacciones/:id', authenticateToken, async (req, res) => {
  try {
    const tx = await db.get('SELECT * FROM transacciones_extraidas WHERE id = ?', req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' });
    if (tx.user_id !== req.user.id) return res.status(403).json({ error: 'No autorizado' });

    const { categoria, comercio, tipo_tarjeta, banco, revisado, tipo_gasto, tipo_transaccion, fecha, monto } = req.body;
    const finalComercio = comercio !== undefined ? comercio : tx.comercio;
    if (categoria !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET categoria = ? WHERE id = ?', categoria, req.params.id);
      await db.run(
        "INSERT INTO clasificacion_comercios (user_id, comercio, categoria, updated_at) VALUES (?, ?, ?, NOW()) ON CONFLICT(user_id, comercio) DO UPDATE SET categoria = EXCLUDED.categoria, updated_at = NOW()",
        tx.user_id, finalComercio.toLowerCase(), categoria);
      db.run(
        "UPDATE transacciones_extraidas SET categoria = ? WHERE user_id = ? AND LOWER(comercio) = LOWER(?) AND id != ?",
        categoria, tx.user_id, finalComercio, req.params.id)
        .then(result => console.log(`[BACKGROUND] Bulk categorized ${result.changes} transactions with comercio=${finalComercio}`))
        .catch(err => console.error('[BACKGROUND] Bulk categorize error:', err.message));
    }
    if (comercio !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET comercio = ? WHERE id = ?', comercio, req.params.id);
    }
    if (tipo_tarjeta !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET tipo_tarjeta = ? WHERE id = ?', tipo_tarjeta, req.params.id);
    }
    if (banco !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET banco = ? WHERE id = ?', banco, req.params.id);
    }
    if (revisado !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET revisado = ? WHERE id = ?', revisado, req.params.id);
    }
    if (tipo_gasto !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET tipo_gasto = ? WHERE id = ?', tipo_gasto, req.params.id);
    }
    if (tipo_transaccion !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET tipo_transaccion = ? WHERE id = ?', tipo_transaccion, req.params.id);
    }
    if (fecha !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET fecha = ? WHERE id = ?', fecha, req.params.id);
    }
    if (monto !== undefined) {
      await db.run('UPDATE transacciones_extraidas SET monto = ? WHERE id = ?', monto, req.params.id);
    }

    const updated = await db.get('SELECT * FROM transacciones_extraidas WHERE id = ?', req.params.id);
    cache.delByPattern(`tx:*:${req.user.id}`);
    cache.del(`tx:meses:${req.user.id}`);
    cache.delByPattern(`tx:pendientes:${req.user.id}`);
    res.json({ transaction: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar transacción' });
  }
});

app.post('/api/transacciones/revisar', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const job = await createJob('revisar-correos', async () => {
      const result = await fetchLatestTransactions(userId);
      cache.delByPattern(`tx:*:${userId}`);
      cache.del(`tx:meses:${userId}`);
      cache.delByPattern(`tx:pendientes:${userId}`);
      return result;
    });
    res.json({ jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transacciones/revisar/status/:jobId', authenticateToken, async (req, res) => {
  const job = await getJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job no encontrado' });
  res.json({ status: job.status, result: job.result, error: job.error });
});

// Webhook de Cloudflare Email Worker
app.post('/api/webhook/email', async (req, res) => {
  try {
    const secret = req.headers['x-webhook-secret'];
    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, from, subject, html, messageId } = req.body;
    if (!userId || !html) {
      return res.status(400).json({ error: 'Missing userId or html' });
    }

    const headers = {
      from: from || '',
      subject: subject || '',
      'message-id': messageId || '',
      date: new Date().toISOString(),
      to: '',
    };

    const parsed = await parseHTML(html, headers, userId);
    if (!parsed || !parsed.monto || !parsed.fecha) {
      return res.json({ success: false, reason: 'no_parsed_data' });
    }

    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const emailId = messageId || `wb-${Date.now()}`;
    const subjectSafe = (subject || '').slice(0, 200);

    await db.run(
      `INSERT INTO transacciones_extraidas (id, user_id, banco, tipo_movimiento, tipo_tarjeta, monto, comercio, fecha, categoria, asunto, email_id, fecha_extraccion, revisado, tipo_transaccion, gmail_msg_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), FALSE, $12, $13)
       ON CONFLICT (email_id) DO UPDATE SET
         asunto = EXCLUDED.asunto,
         tipo_tarjeta = EXCLUDED.tipo_tarjeta,
         gmail_msg_id = EXCLUDED.gmail_msg_id,
         fecha_extraccion = NOW(),
         comercio = CASE WHEN transacciones_extraidas.revisado = FALSE AND EXCLUDED.comercio != '' THEN EXCLUDED.comercio ELSE transacciones_extraidas.comercio END,
         tipo_transaccion = CASE WHEN transacciones_extraidas.revisado = FALSE AND EXCLUDED.tipo_transaccion IS NOT NULL THEN EXCLUDED.tipo_transaccion ELSE transacciones_extraidas.tipo_transaccion END`,
      id, userId, parsed.banco, parsed.tipo_movimiento, parsed.tipo_tarjeta || '', parsed.monto, parsed.comercio, parsed.fecha, parsed.categoria, subjectSafe, emailId, parsed.tipo_transaccion_auto || 'gasto', `wb-${Date.now()}`
    );

    cache.delByPattern(`tx:*:${userId}`);
    cache.del(`tx:meses:${userId}`);
    cache.delByPattern(`tx:pendientes:${userId}`);

    res.json({ success: true, transaction: parsed });
  } catch (error) {
    console.error('[Webhook] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transacciones/pendientes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit, offset } = req.query;

    const cacheKey = `tx:pendientes:${userId}:${JSON.stringify({ limit, offset })}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const countResult = await db.get("SELECT COUNT(*) as count FROM transacciones_extraidas WHERE user_id = ? AND (revisado = FALSE OR revisado IS NULL)", userId);
    const count = countResult.count;

    let sql = "SELECT * FROM transacciones_extraidas WHERE user_id = ? AND (revisado = FALSE OR revisado IS NULL) ORDER BY fecha_extraccion DESC";
    const params = [userId];
    if (limit) { sql += ' LIMIT ?'; params.push(parseInt(limit)); }
    if (offset) { sql += ' OFFSET ?'; params.push(parseInt(offset)); }

    const transactions = await db.all(sql, ...params);
    const result = { count, transactions };
    cache.set(cacheKey, result, 15);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pendientes' });
  }
});

app.delete('/api/transacciones/:id', authenticateToken, async (req, res) => {
  try {
    const tx = await db.get('SELECT user_id FROM transacciones_extraidas WHERE id = ?', req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' });
    if (tx.user_id !== req.user.id) return res.status(403).json({ error: 'No autorizado' });
    await db.run('DELETE FROM transacciones_extraidas WHERE id = ?', req.params.id);
    cache.delByPattern(`tx:*:${req.user.id}`);
    cache.del(`tx:meses:${req.user.id}`);
    cache.delByPattern(`tx:pendientes:${req.user.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transacción' });
  }
});

app.get('/api/filtros', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `filtros:${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);
    const filters = await db.all('SELECT * FROM filtros_correo WHERE user_id = ? ORDER BY created_at DESC', userId);
    const result = { filters };
    cache.set(cacheKey, result, 300);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener filtros' });
  }
});

app.post('/api/filtros', authenticateToken, async (req, res) => {
  try {
    const { remitente, asunto } = req.body;
    if (!remitente) return res.status(400).json({ error: 'El remitente es requerido' });
    const id = `filtro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await db.run('INSERT INTO filtros_correo (id, user_id, remitente, asunto) VALUES (?, ?, ?, ?)', id, req.user.id, remitente, asunto || null);
    const filter = await db.get('SELECT * FROM filtros_correo WHERE id = ?', id);
    cache.del(`filtros:${req.user.id}`);
    res.json({ filter });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear filtro' });
  }
});

app.delete('/api/filtros/:id', authenticateToken, async (req, res) => {
  try {
    const filter = await db.get('SELECT user_id FROM filtros_correo WHERE id = ?', req.params.id);
    if (!filter) return res.status(404).json({ error: 'Filtro no encontrado' });
    if (filter.user_id !== req.user.id) return res.status(403).json({ error: 'No autorizado' });
    await db.run('DELETE FROM filtros_correo WHERE id = ?', req.params.id);
    cache.del(`filtros:${req.user.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar filtro' });
  }
});

app.post('/api/filtros/replace', authenticateToken, async (req, res) => {
  try {
    const { remitentes } = req.body;
    if (!remitentes || !Array.isArray(remitentes) || remitentes.length === 0)
      return res.status(400).json({ error: 'Se requiere un arreglo de remitentes' });

    const filtered = remitentes.map(r => r.trim()).filter(r => r.includes('@'));
    if (filtered.length === 0)
      return res.status(400).json({ error: 'Ningún remitente válido' });

    const userId = req.user.id;

    db.run('DELETE FROM filtros_correo WHERE user_id = ?', userId)
      .then(() => {
        const inserts = filtered.map(remitente => {
          const id = `filtro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return db.run('INSERT INTO filtros_correo (id, user_id, remitente, asunto) VALUES (?, ?, ?, NULL)', id, userId, remitente);
        });
        return Promise.all(inserts);
      })
      .then(() => {
        cache.del(`filtros:${userId}`);
        console.log(`[BACKGROUND] Replaced ${filtered.length} filters for user ${userId}`);
      })
      .catch(err => console.error('[BACKGROUND] Filter replace error:', err.message));

    res.json({ success: true, count: filtered.length });
  } catch (error) {
    console.error('[Filtros] Error en replace:', error.message);
    res.status(500).json({ error: 'Error al reemplazar filtros' });
  }
});

app.get('/api/config-extraccion', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `config:${userId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);
    let config = await db.get('SELECT dias_atras FROM config_extraccion WHERE user_id = ?', userId);
    if (!config) {
      await db.run('INSERT INTO config_extraccion (user_id, dias_atras) VALUES (?, 3) ON CONFLICT DO NOTHING', userId);
      config = { dias_atras: 3 };
    }
    const result = { dias_atras: config.dias_atras };
    cache.set(cacheKey, result, 300);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

app.put('/api/config-extraccion', authenticateToken, async (req, res) => {
  try {
    const { dias_atras } = req.body;
    const days = parseInt(dias_atras);
    if (isNaN(days) || days < 1 || days > 999) return res.status(400).json({ error: 'Valor inválido (1-999)' });
    await db.run('INSERT INTO config_extraccion (user_id, dias_atras) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET dias_atras = EXCLUDED.dias_atras', req.user.id, days);
    cache.del(`config:${req.user.id}`);
    res.json({ success: true, dias_atras: days });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

export default app;
