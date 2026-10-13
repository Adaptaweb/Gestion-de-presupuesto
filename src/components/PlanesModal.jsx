import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, Clock, Lock } from 'lucide-react';
import { PLANS, INCLUDED, TRIAL_DAYS, formatCLP, formatLongDate } from '../constants/pricing.js';
import { iniciarCheckout, cancelarSuscripcion } from '../lib/billing.js';
import { notifyError, notifyOk } from '../lib/notify.js';

const fechaCorta = (iso) => (iso ? formatLongDate(new Date(iso)) : '');

// Resumen del estado actual: una frase y un tono.
function resumen(b) {
  switch (b?.estado) {
    case 'prueba':
      return { icono: Clock, tono: 'text-amber-600 dark:text-amber-400', titulo: `Prueba gratis: te quedan ${b.diasRestantes} día${b.diasRestantes === 1 ? '' : 's'}`, detalle: `Termina el ${fechaCorta(b.venceEl)}. Sin tarjeta.` };
    case 'sin_iniciar':
      return { icono: Clock, tono: 'text-slate-500', titulo: `${TRIAL_DAYS} días gratis`, detalle: 'Tu prueba parte al terminar de configurar el reenvío de tu correo.' };
    case 'activa':
      return { icono: CheckCircle2, tono: 'text-emerald-600 dark:text-emerald-400', titulo: `Plan ${PLANS[b.plan]?.name || ''} activo`, detalle: b.periodoHasta ? `Se renueva el ${fechaCorta(b.periodoHasta)}.` : 'Se renueva automáticamente.' };
    case 'pago_fallido':
      return { icono: Lock, tono: 'text-amber-600 dark:text-amber-400', titulo: 'No pudimos cobrar tu plan', detalle: 'Mercado Pago reintentará el cobro. Revisa tu tarjeta o vuelve a suscribirte.' };
    case 'cancelada_vigente':
      return { icono: Clock, tono: 'text-slate-500', titulo: 'Suscripción cancelada', detalle: `Sigues con acceso completo hasta el ${fechaCorta(b.venceEl)}.` };
    case 'solo_lectura':
      return { icono: Lock, tono: 'text-rose-600 dark:text-rose-400', titulo: 'Cuenta en solo lectura', detalle: `Puedes ver y exportar todo, pero no registrar cambios. Tienes hasta el ${fechaCorta(b.suspendeEl)} para elegir un plan.` };
    case 'suspendida':
      return { icono: Lock, tono: 'text-rose-600 dark:text-rose-400', titulo: 'Cuenta suspendida', detalle: 'Tus datos siguen guardados. Elige un plan para reactivarla.' };
    default:
      return null;
  }
}

const PlanesModal = ({ open, onClose, token, theme, billing, onChanged }) => {
  const [cargando, setCargando] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  if (!open) return null;

  const r = resumen(billing);
  const activa = billing?.estado === 'activa' || billing?.estado === 'pago_fallido';
  const pagosListos = billing?.mpDisponible !== false;

  const elegir = async (id) => {
    setCargando(id);
    try {
      const url = await iniciarCheckout(token, id);
      window.location.href = url;
    } catch (err) {
      notifyError('No pudimos iniciar el pago', err.message);
      setCargando(null);
    }
  };

  const cancelar = async () => {
    if (!window.confirm('¿Cancelar tu suscripción? No habrá más cobros y mantienes el acceso hasta el fin del período pagado.')) return;
    setCancelando(true);
    try {
      await cancelarSuscripcion(token);
      notifyOk('Suscripción cancelada', 'Te enviamos la confirmación por correo.');
      onChanged?.();
    } catch (err) {
      notifyError('No se pudo cancelar', err.message);
    }
    setCancelando(false);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mi plan"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-normal w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl p-5 sm:p-7 animate-slide-in-from-bottom"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Mi plan</h3>
          <button onClick={onClose} aria-label="Cerrar" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 flex items-center justify-center transition active:scale-90">
            <X size={16} />
          </button>
        </div>

        {r && (
          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-dark-lighter p-4 mb-5">
            <r.icono size={20} className={`${r.tono} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm font-black ${r.tono}`}>{r.titulo}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{r.detalle}</p>
            </div>
          </div>
        )}

        {activa ? (
          <button
            onClick={cancelar}
            disabled={cancelando}
            className="w-full min-h-[48px] rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-black transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cancelando && <Loader2 size={16} className="animate-spin" />}
            Cancelar suscripción
          </button>
        ) : (
          <>
            <div className="space-y-3">
              {Object.values(PLANS).map((p) => {
                const destacado = p.id === 'anual';
                const bloqueado = !p.disponible || !pagosListos;
                return (
                  <div key={p.id} className={`rounded-2xl p-4 border-2 ${destacado ? 'border-kk-primary bg-kk-light/30 dark:bg-kk-dark/15' : 'border-slate-200 dark:border-dark-lightest'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{p.name}</p>
                        <p className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{formatCLP(p.price)}</span>
                          <span className="text-xs font-bold text-slate-500">/ {p.period}</span>
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {p.perMonth ? `Equivale a ${formatCLP(p.perMonth)} al mes · ` : ''}IVA incluido
                        </p>
                      </div>
                      {!p.disponible && <span className="text-[11px] font-black bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap">Próximamente</span>}
                      {p.disponible && p.badge && <span className="text-[11px] font-black bg-kk-primary text-[#06281d] px-2.5 py-1 rounded-full whitespace-nowrap">3 meses gratis</span>}
                    </div>
                    <button
                      onClick={() => elegir(p.id)}
                      disabled={bloqueado || cargando !== null}
                      className={`mt-3 w-full min-h-[46px] rounded-xl text-sm font-black transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${destacado ? `${theme?.btnPrimary || 'bg-kk-primary hover:bg-kk-dark text-white'} text-white` : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white'}`}
                    >
                      {cargando === p.id && <Loader2 size={16} className="animate-spin" />}
                      {!p.disponible ? 'Próximamente' : 'Elegir plan'}
                    </button>
                  </div>
                );
              })}
            </div>
            {!pagosListos && (
              <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">Los pagos se habilitarán muy pronto. Tu prueba sigue corriendo.</p>
            )}
          </>
        )}

        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-2">Todo incluido en todos los planes</p>
          <ul className="space-y-1.5">
            {INCLUDED.map((i) => (
              <li key={i} className="flex gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />{i}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
            El pago lo procesa Mercado Pago: no guardamos los datos de tu tarjeta. Puedes cancelar cuando quieras desde aquí.
            Más detalles en los <a href="/terminos" className="underline">Términos y Condiciones</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanesModal;
