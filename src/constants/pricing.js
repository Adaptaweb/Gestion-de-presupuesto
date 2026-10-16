// Una sola fuente para precios y prueba gratuita: la usan la landing y el
// tutorial. Precios en CLP, IVA incluido.
export const TRIAL_DAYS = 40;
// Las pruebas que partieron antes de bajar a 40 dias conservan los 60 prometidos.
export const TRIAL_DAYS_ANTERIOR = 60;
export const TRIAL_CAMBIO_EN = Date.parse('2026-10-17T00:00:00-03:00');
export const diasDePrueba = (inicio) => {
  const t = new Date(inicio).getTime();
  return Number.isFinite(t) && t < TRIAL_CAMBIO_EN ? TRIAL_DAYS_ANTERIOR : TRIAL_DAYS;
};
export const TRIAL_REMINDER_DAYS = 7;
export const READ_ONLY_DAYS = 30;

export const PLANS = {
  mensual: { id: 'mensual', name: 'Mensual', price: 4990, period: 'mes', frequency: 1, disponible: true, note: 'Cancelas cuando quieras.' },
  anual: { id: 'anual', name: 'Anual', price: 44990, period: 'año', frequency: 12, disponible: true, strike: 59880, perMonth: 3749, badge: 'Más elegido · 3 meses gratis' },
  // Los hogares compartidos aun no existen en la app: no se vende hasta que si.
  familia: { id: 'familia', name: 'Pareja o familia', price: 7990, period: 'mes', frequency: 1, disponible: false, chip: 'Hasta 4 personas', note: 'Un solo hogar, cuentas compartidas.' },
};

export const INCLUDED = [
  'Movimientos automáticos desde tu correo',
  'Categorías que aprenden de ti',
  'Cuotas, suscripciones y gastos fijos',
  'Ahorros, presupuestos y resumen mensual',
  'Consejos del analista IA',
  'Notificaciones y app instalable (PWA)',
];

export const formatCLP = (n) => `$${Math.round(n).toLocaleString('es-CL')}`;

export const trialEndDate = (startedAt) => {
  const d = startedAt ? new Date(startedAt) : new Date();
  const base = isNaN(d.getTime()) ? new Date() : d;
  const end = new Date(base.getTime());
  end.setDate(end.getDate() + diasDePrueba(base));
  return end;
};

export const formatLongDate = (d) =>
  d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
