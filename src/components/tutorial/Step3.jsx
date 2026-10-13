import { useState } from 'react';
import { ArrowLeft, CheckCircle, Loader2, X, Gift } from 'lucide-react';
import { TUTORIAL_CONFIG } from './tutorialConfig';
import { TRIAL_DAYS, TRIAL_REMINDER_DAYS, READ_ONLY_DAYS, PLANS, formatCLP, trialEndDate, formatLongDate } from '../../constants/pricing.js';

const Step3 = ({ onNext, onBack, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { MESSAGES } = TUTORIAL_CONFIG;
  // La prueba parte al finalizar; mientras tanto se muestra la fecha que tendria hoy.
  const finPrueba = formatLongDate(trialEndDate());

  const handleComplete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/tutorial/complete', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (e) {
      // proceed anyway
    }
    setLoading(false);
    onNext();
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 border-b border-[#f1f5f9]">
        <div className="h-14 flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
                <ArrowLeft className="text-[#006c4d]" size={24} />
              </button>
            )}
            <img src="/kuentasklaras-logo.svg" alt="Kuentas Klaras" className="w-6 h-6" />
            <span className="font-bold text-[#0a192f]">Kuentas Klaras</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#515f78]">3/3</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95">
            <X className="text-[#515f78]" size={24} />
          </button>
        </div>
        <div className="w-full bg-[#e6e8ea] h-1">
          <div className="h-full rounded-full bg-[#2dbc8b] transition duration-500" style={{ width: '100%' }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-[1200px] mx-auto w-full flex flex-col items-center gap-4">
        <div className="w-full bg-[#6de0b3]/10 border border-[#2dbc8b]/20 rounded-xl p-4 flex items-center justify-center gap-3 border-l-4">
          <CheckCircle className="text-[#006c4d] flex-shrink-0" size={24} />
          <span className="text-sm font-semibold text-[#006c4d] text-center">{MESSAGES.step3.successTitle}</span>
        </div>

        <div className="w-full max-w-md bg-[#0f172a] text-white rounded-[28px] px-5 pt-6 pb-5 flex flex-col items-center gap-4 text-center animate-scale-in">
          <span className="inline-flex items-center gap-1.5 bg-[#2dbc8b] text-[#06281d] text-[11px] font-extrabold px-3 py-1 rounded-full">
            <Gift size={12} /> Regalo de bienvenida
          </span>
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90" aria-hidden="true">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="2.6" stroke="rgba(255,255,255,0.13)" />
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="2.6" strokeLinecap="round" stroke="#2dbc8b" strokeDasharray="97.389" strokeDashoffset="0" style={{ animation: 'kkTrialRing 1.1s cubic-bezier(0.22, 1, 0.36, 1) 150ms backwards' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[44px] font-extrabold leading-none tracking-tight">{TRIAL_DAYS}</span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">días gratis</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Tu prueba empieza al finalizar</h2>
            <p className="text-[13.5px] leading-relaxed text-slate-300 mt-1.5">
              Usa todo sin límites hasta el <b className="text-white">{finPrueba}</b>. Sin tarjeta.
            </p>
          </div>
          <div className="w-full grid grid-cols-3 gap-2">
            {[
              ['Hoy', 'Empieza'],
              [`Día ${TRIAL_DAYS - TRIAL_REMINDER_DAYS}`, 'Te avisamos'],
              [`Día ${TRIAL_DAYS}`, 'Tú decides'],
            ].map(([t, d]) => (
              <div key={t} className="bg-white/[0.07] rounded-2xl py-2.5 px-1">
                <div className="text-xs font-extrabold">{t}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{d}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes kkTrialRing { from { stroke-dashoffset: 97.389; } to { stroke-dashoffset: 0; } } @media (prefers-reduced-motion: reduce) { circle { animation: none !important; } }`}</style>

        <div className="w-full max-w-md bg-white p-4 rounded-2xl border border-[#bccac0]/30 shadow-sm">
          <p className="text-[13px] text-[#515f78] leading-relaxed">
            Después, desde <b className="text-[#0a192f]">{formatCLP(PLANS.anual.perMonth)} al mes</b> con el plan anual. Si no eliges plan, tu cuenta queda en solo lectura por {READ_ONLY_DAYS} días y no pierdes nada.
          </p>
        </div>

        <div className="w-full max-w-md bg-[#d2e0fe] text-[#55637d] p-4 rounded-2xl border border-[#2dbc8b]/10 flex items-start gap-3">
          <CheckCircle className="text-[#006c4d] flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-[#0a192f]">{MESSAGES.step3.infoTitle}</h3>
            <p className="text-xs opacity-90 leading-relaxed mt-1">{MESSAGES.step3.infoDescription}</p>
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 flex justify-center px-4 py-3 border-t border-[#f1f5f9]">
        <button
          onClick={handleComplete}
          disabled={loading}
          className="flex items-center gap-2 bg-[#2dbc8b] text-white px-8 py-3 rounded-xl shadow hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
          <span className="text-sm font-semibold">{loading ? 'Finalizando...' : 'Empezar a usar la app'}</span>
        </button>
      </footer>
    </div>
  );
};

export default Step3;
