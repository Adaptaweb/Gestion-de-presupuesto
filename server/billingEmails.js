// Correos de la prueba y del cobro. Una plantilla comun con el estilo de los
// correos de bienvenida y verificacion; cada aviso solo aporta su texto.

const APP_URL = () => (process.env.APP_URL || 'https://gastos.adaptaweb.cl').replace(/\/$/, '');

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function layout({ titulo, parrafos, cta, nota }) {
  const cuerpo = parrafos
    .map((p) => `<tr><td style="padding-bottom:14px"><p style="margin:0;font-size:15px;color:#475569;line-height:1.6">${p}</p></td></tr>`)
    .join('');
  const boton = cta
    ? `<tr><td align="center" style="padding:10px 0 22px"><a href="${esc(cta.url)}" style="display:inline-block;background:#059669;color:#ffffff;padding:14px 34px;border-radius:12px;text-decoration:none;font-weight:800;font-size:15px">${esc(cta.texto)}</a></td></tr>`
    : '';
  const pie = nota
    ? `<tr><td style="padding-bottom:6px"><p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5">${nota}</p></td></tr>`
    : '';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fffc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:36px 32px;max-width:480px;box-shadow:0 4px 20px rgba(0,0,0,0.05)">
      <tr><td align="center" style="padding-bottom:22px"><img src="https://gastos.adaptaweb.cl/logo.svg" alt="Kuentas Klaras" height="40" style="display:block;margin:0 auto"></td></tr>
      <tr><td style="padding-bottom:14px"><h1 style="margin:0;font-size:22px;font-weight:900;color:#1e293b">${titulo}</h1></td></tr>
      ${cuerpo}
      ${boton}
      ${pie}
      <tr><td align="center" style="padding-top:18px;border-top:1px solid #e2e8f0"><p style="margin:0;font-size:12px;color:#cbd5e1">Kuentas Klaras — Tus finanzas claras, bajo control</p></td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

const fecha = (d) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Santiago' });
const clp = (n) => `$${Math.round(n).toLocaleString('es-CL')}`;
const planesUrl = () => `${APP_URL()}/app?planes=1`;
const SOPORTE = 'Si tienes dudas, responde este correo o escríbenos a soporte@kuentasklaras.cl.';

// Cada plantilla devuelve { subject, html }. `d` trae los datos del aviso.
export const PLANTILLAS = {
  trial_inicio: (d) => ({
    subject: 'Tu prueba gratis de 60 días ya empezó',
    html: layout({
      titulo: `Hola ${esc(d.nombre)}, tu prueba empezó`,
      parrafos: [
        `Dejaste listo el reenvío de tu correo, así que desde hoy tienes <strong>60 días gratis</strong> con todo incluido, hasta el <strong>${fecha(d.venceEl)}</strong>.`,
        'No pedimos tarjeta. Te avisaremos antes de que termine para que decidas con calma.',
      ],
      cta: { texto: 'Abrir Kuentas Klaras', url: APP_URL() },
    }),
  }),
  trial_7d: (d) => ({
    subject: 'Te quedan 7 días de prueba gratis',
    html: layout({
      titulo: 'Tu prueba termina pronto',
      parrafos: [
        `Hola ${esc(d.nombre)}, tu prueba gratis termina el <strong>${fecha(d.venceEl)}</strong>.`,
        `Para seguir usando todo, elige un plan: desde <strong>${clp(3749)} al mes</strong> con el plan anual. Si no eliges, tu cuenta queda en solo lectura por 30 días y no pierdes nada.`,
      ],
      cta: { texto: 'Elegir mi plan', url: planesUrl() },
      nota: SOPORTE,
    }),
  }),
  trial_1d: (d) => ({
    subject: 'Mañana termina tu prueba gratis',
    html: layout({
      titulo: 'Último día de prueba',
      parrafos: [
        `Hola ${esc(d.nombre)}, tu prueba gratis termina el <strong>${fecha(d.venceEl)}</strong>.`,
        'Elige un plan hoy para no interrumpir el registro automático de tus movimientos.',
      ],
      cta: { texto: 'Elegir mi plan', url: planesUrl() },
      nota: SOPORTE,
    }),
  }),
  periodo_fin: (d) => ({
    subject: 'Tu cuenta quedó en solo lectura',
    html: layout({
      titulo: 'Terminó tu período',
      parrafos: [
        `Hola ${esc(d.nombre)}, tu acceso completo terminó. Tu cuenta está en <strong>solo lectura</strong>: puedes ver y exportar todo tu historial, pero no registrar cambios nuevos.`,
        `Tienes hasta el <strong>${fecha(d.suspendeEl)}</strong> para elegir un plan y retomar donde lo dejaste. No se borra nada.`,
      ],
      cta: { texto: 'Elegir mi plan', url: planesUrl() },
      nota: SOPORTE,
    }),
  }),
  suspension_5d: (d) => ({
    subject: 'En 5 días tu cuenta se suspende',
    html: layout({
      titulo: 'Tu cuenta se suspenderá pronto',
      parrafos: [
        `Hola ${esc(d.nombre)}, el <strong>${fecha(d.suspendeEl)}</strong> termina el plazo de solo lectura.`,
        'Tus datos siguen guardados. Elige un plan para reactivar tu cuenta cuando quieras.',
      ],
      cta: { texto: 'Elegir mi plan', url: planesUrl() },
      nota: SOPORTE,
    }),
  }),
  pago_ok: (d) => ({
    subject: 'Recibimos tu pago, gracias',
    html: layout({
      titulo: 'Pago recibido',
      parrafos: [
        `Hola ${esc(d.nombre)}, recibimos tu pago del plan <strong>${esc(d.plan)}</strong> (${clp(d.monto)}, IVA incluido).`,
        `Tu suscripción está activa${d.periodoHasta ? ` hasta el <strong>${fecha(d.periodoHasta)}</strong>` : ''} y se renueva sola. Puedes cancelarla cuando quieras desde Mi plan.`,
      ],
      cta: { texto: 'Abrir Kuentas Klaras', url: APP_URL() },
      nota: SOPORTE,
    }),
  }),
  pago_fallido: (d) => ({
    subject: 'No pudimos cobrar tu suscripción',
    html: layout({
      titulo: 'Falló el cobro',
      parrafos: [
        `Hola ${esc(d.nombre)}, no pudimos cobrar tu plan <strong>${esc(d.plan)}</strong>. Suele pasar por saldo insuficiente o una tarjeta vencida.`,
        'Mercado Pago reintentará el cobro. Si el problema es la tarjeta, actualízala en tu cuenta de Mercado Pago o vuelve a suscribirte desde la app.',
      ],
      cta: { texto: 'Revisar mi plan', url: planesUrl() },
      nota: SOPORTE,
    }),
  }),
  cancelada: (d) => ({
    subject: 'Cancelaste tu suscripción',
    html: layout({
      titulo: 'Suscripción cancelada',
      parrafos: [
        `Hola ${esc(d.nombre)}, cancelamos tu plan <strong>${esc(d.plan)}</strong>. No habrá más cobros.`,
        d.periodoHasta
          ? `Sigues con acceso completo hasta el <strong>${fecha(d.periodoHasta)}</strong>. Después tu cuenta queda en solo lectura por 30 días y no se borra nada.`
          : 'Tu cuenta queda en solo lectura por 30 días y no se borra nada.',
      ],
      cta: { texto: 'Volver a suscribirme', url: planesUrl() },
      nota: SOPORTE,
    }),
  }),
};

export async function enviarCorreo(resend, para, tipo, datos) {
  if (!resend) return false;
  const plantilla = PLANTILLAS[tipo];
  if (!plantilla || !para) return false;
  const { subject, html } = plantilla(datos);
  await resend.emails.send({ from: 'Kuentas Klaras <noreply@adaptaweb.cl>', to: para, subject, html });
  return true;
}
