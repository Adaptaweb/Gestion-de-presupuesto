import React from 'react';
import { Clock, Lock, AlertTriangle } from 'lucide-react';
import { formatLongDate } from '../constants/pricing.js';

// Aviso fijo sobre el tablero. Solo aparece cuando hay algo que decidir:
// prueba por terminar, pago fallido, cancelada o cuenta en solo lectura.
function contenido(b) {
  if (!b) return null;
  switch (b.estado) {
    case 'prueba':
      if (b.diasRestantes > 7) return null;
      return { icono: Clock, tono: 'amber', texto: `Te quedan ${b.diasRestantes} día${b.diasRestantes === 1 ? '' : 's'} de prueba gratis`, boton: 'Elegir plan' };
    case 'pago_fallido':
      return { icono: AlertTriangle, tono: 'amber', texto: 'No pudimos cobrar tu plan', boton: 'Revisar' };
    case 'cancelada_vigente':
      return { icono: Clock, tono: 'slate', texto: `Suscripción cancelada · acceso hasta el ${formatLongDate(new Date(b.venceEl))}`, boton: 'Volver a suscribirme' };
    case 'solo_lectura':
      return { icono: Lock, tono: 'rose', texto: 'Tu cuenta está en solo lectura', boton: 'Elegir plan' };
    case 'suspendida':
      return { icono: Lock, tono: 'rose', texto: 'Tu cuenta está suspendida', boton: 'Reactivar' };
    default:
      return null;
  }
}

const TONOS = {
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
  slate: 'bg-slate-50 dark:bg-dark-lighter border-slate-200 dark:border-dark-lightest text-slate-700 dark:text-slate-200',
};

const BOTONES = {
  amber: 'bg-amber-600 text-white',
  rose: 'bg-rose-600 text-white',
  slate: 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900',
};

const BillingBanner = ({ billing, onOpen }) => {
  const c = contenido(billing);
  if (!c) return null;
  return (
    <div className={`mb-4 md:mb-6 flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 animate-slide-down ${TONOS[c.tono]}`} role="status">
      <c.icono size={18} className="flex-shrink-0" />
      <p className="flex-1 min-w-0 text-xs sm:text-sm font-bold leading-snug">{c.texto}</p>
      <button onClick={onOpen} className={`flex-shrink-0 min-h-[36px] px-3.5 rounded-full text-xs font-black transition active:scale-95 ${BOTONES[c.tono]}`}>
        {c.boton}
      </button>
    </div>
  );
};

export default BillingBanner;
