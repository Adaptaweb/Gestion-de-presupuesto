import db from './db.js';
import { BANK_SENDERS } from './bankMapping.js';

export const SEED_TEMPLATES = [
  {
    banco: 'Banco Chile',
    tipo_correo: 'transferencia_entrante',
    from_pattern: '%bancochile.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'nuestro\\s*\\(?\\s*a\\s*\\)?\\s*cliente\\s+([A-ZÁÉÍÓÚÑ\\s]+?)\\s*,?\\s*ha', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'ha efectuado una transferencia a tu cuenta', value: 'ingreso' }, { match: 'ha instruido una transferencia', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Banco Chile',
    tipo_correo: 'transferencia_saliente',
    from_pattern: '%bancochile.cl',
    prioridad: 90,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'destinatario[:\\s]+([^\\n]+)', group: 1 },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'a tu cuenta', value: 'gasto' }], default: 'gasto' },
    },
  },
  {
    banco: 'Falabella',
    tipo_correo: 'transferencia_entrante',
    from_pattern: '%bancofalabella.com',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto transferencia\\$([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})-(\\d{2})-(\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'nuestro\\s*\\(?\\s*a\\s*\\)?\\s*cliente\\s+([A-ZÁÉÍÓÚÑ\\s]+?)\\s+ha', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'a tu cuenta', value: 'ingreso' }, { match: 'ha instruido', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Falabella',
    tipo_correo: 'transferencia_entrante',
    from_pattern: '%cmr.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'cliente\\s+([A-ZÁÉÍÓÚÑ\\s]+?)\\s+ha', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'a tu cuenta', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'BCI',
    tipo_correo: 'transferencia_entrante',
    from_pattern: '%bci.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto(?:\\s+recibido)?[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'Has recibido una transferencia de fondos de\\s+([A-ZÁÉÍÓÚÑ\\s]+?)\\s+hacia', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'has recibido', value: 'ingreso' }, { match: 'monto recibido', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'BCI',
    tipo_correo: 'compra',
    from_pattern: '%bci.cl',
    prioridad: 90,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'establecimiento[:\\s]+([^\\n]+)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'static', value: 'gasto' },
    },
  },
  {
    banco: 'Itau',
    tipo_correo: 'transferencia_entrante',
    from_pattern: '%itau.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'nuestro\\s*\\(?\\s*a\\s*\\)?\\s*cliente\\s+([A-ZÁÉÍÓÚÑ\\s]+?)\\s*,?\\s*ha', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'a su cuenta', value: 'ingreso' }, { match: 'ha instruido', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Santander',
    tipo_correo: 'transferencia',
    from_pattern: '%santander.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: '(?:de|desde)\\s+([A-ZÁÉÍÓÚÑ\\s]+?)\\s*,|beneficiario[:\\s]+([^\\n]+)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibida', value: 'ingreso' }, { match: 'abono', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Santander',
    tipo_correo: 'compra',
    from_pattern: '%santander.cl',
    prioridad: 90,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'establecimiento[:\\s]+([^\\n]+)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'static', value: 'gasto' },
    },
  },
  {
    banco: 'Scotiabank',
    tipo_correo: 'transferencia',
    from_pattern: '%scotiabank.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: '(?:de|remitente)[:\\s]+([A-ZÁÉÍÓÚÑ\\s]+?)(?:\\s*,|\\s+ha)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibida', value: 'ingreso' }, { match: 'abono', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Banco Estado',
    tipo_correo: 'transferencia',
    from_pattern: '%bancoestado.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'cliente[:\\s]+([A-ZÁÉÍÓÚÑ\\s]+?)(?:\\s*,|\\s+ha)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibida', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'MercadoPago',
    tipo_correo: 'transferencia',
    from_pattern: '%mercadopago.com',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: '\\$([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'de[:\\s]+([A-ZÁÉÍÓÚÑ\\s]+?)\\s+(?:a|hacia)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibiste', value: 'ingreso' }, { match: 'recibió', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Tenpo',
    tipo_correo: 'transferencia',
    from_pattern: '%tenpo.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: '\\$([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'de[:\\s]+([A-ZÁÉÍÓÚÑ\\s]+?)\\s+(?:a|hacia)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibiste', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'Mach',
    tipo_correo: 'transferencia',
    from_pattern: '%machbank.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: '\\$([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'de[:\\s]+([A-ZÁÉÍÓÚÑ\\s]+?)\\s+(?:a|hacia)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibiste', value: 'ingreso' }], default: 'gasto' },
    },
  },
  {
    banco: 'BICE',
    tipo_correo: 'transferencia',
    from_pattern: '%bancobice.cl',
    prioridad: 100,
    extraccion_json: {
      monto: { type: 'regex', pattern: 'Monto[\\s:]*\\$?([0-9.]+)', group: 1 },
      fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
      comercio: { type: 'regex', pattern: 'cliente[:\\s]+([A-ZÁÉÍÓÚÑ\\s]+?)(?:\\s*,|\\s+ha)', group: 1, postprocess: 'simplifyComercio' },
      tipo_transaccion: { type: 'conditional', patterns: [{ match: 'recibida', value: 'ingreso' }], default: 'gasto' },
    },
  },
];

export async function seedTemplates() {
  for (const template of SEED_TEMPLATES) {
    try {
      const exists = await db.get(
        'SELECT id FROM plantillas_email WHERE banco = $1 AND tipo_correo = $2 AND from_pattern = $3',
        template.banco, template.tipo_correo, template.from_pattern
      );

      if (!exists) {
        await db.run(
          `INSERT INTO plantillas_email (banco, tipo_correo, from_pattern, extraccion_json, prioridad, count_uso, count_exitoso, activo)
           VALUES ($1, $2, $3, $4, $5, 0, 0, TRUE)`,
          template.banco, template.tipo_correo, template.from_pattern,
          JSON.stringify(template.extraccion_json), template.prioridad
        );
        console.log(`[TEMPLATE] Seeded: ${template.banco} - ${template.tipo_correo}`);
      }
    } catch (e) {
      console.warn(`[TEMPLATE] Error seeding ${template.banco}/${template.tipo_correo}: ${e.message}`);
    }
  }
}

export async function getTemplatesForBank(bank) {
  return db.all(
    'SELECT * FROM plantillas_email WHERE banco = $1 AND activo = TRUE ORDER BY prioridad DESC, count_exitoso DESC',
    bank
  );
}

export async function getAllActiveTemplates() {
  return db.all('SELECT * FROM plantillas_email WHERE activo = TRUE ORDER BY banco, prioridad DESC');
}
