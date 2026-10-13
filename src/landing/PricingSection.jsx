import React from 'react';
import { motion } from 'motion/react';
import { Gift, Check, Users } from 'lucide-react';
import { TRIAL_DAYS, TRIAL_REMINDER_DAYS, READ_ONLY_DAYS, PLANS, INCLUDED, formatCLP } from '../constants/pricing.js';

const EASE = [0.22, 1, 0.36, 1];

const STEPS = [
  { n: 1, text: 'Creas tu cuenta', active: false },
  { n: 2, text: `Configuras el correo y parten tus ${TRIAL_DAYS} días`, active: true },
  { n: 3, text: 'Decides si sigues', active: false },
];

const FAQ = [
  ['¿Necesito tarjeta para probar?', 'No. No pedimos ningún dato de pago durante los 60 días.'],
  ['¿Qué pasa cuando terminan los 60 días?', `Te avisamos ${TRIAL_REMINDER_DAYS} días antes. Si no eliges plan, tu cuenta queda en solo lectura por ${READ_ONLY_DAYS} días y no pierdes nada.`],
  ['¿Cuándo parten los 60 días?', 'Cuando terminas de configurar el reenvío del correo, no al crear la cuenta.'],
];

const PlanButton = ({ onRegister, featured }) => (
  <button
    onClick={onRegister}
    className={`w-full min-h-[52px] rounded-2xl text-[15px] transition active:scale-[0.98] ${
      featured
        ? 'bg-kk-primary text-[#06281d] font-extrabold hover:brightness-110 shadow-lg shadow-kk-primary/25'
        : 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/15'
    }`}
  >
    Empezar {TRIAL_DAYS} días gratis
  </button>
);

const PricingSection = ({ onRegister }) => {
  const { mensual, anual, familia } = PLANS;

  return (
    <section id="precios" className="relative py-20 lg:py-28 bg-white dark:bg-dark-darker scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-kk-light/60 dark:bg-kk-dark/25 text-[#0b6b4c] dark:text-kk-secondary text-xs sm:text-[13px] font-bold px-4 py-2 rounded-full">
            <Gift size={14} /> {TRIAL_DAYS} días gratis · sin tarjeta
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Precios simples. Dos meses para probar todo.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Tu prueba parte cuando conectas tu correo, o sea cuando la app ya trae tus gastos. Una app completa, tres formas de pagar.
          </p>
        </motion.div>

        <ol className="mt-10 flex items-start justify-between gap-2 max-w-xl mx-auto">
          {STEPS.map(({ n, text, active }) => (
            <li key={n} className="flex-1 flex flex-col items-center text-center gap-2">
              <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${active ? 'bg-[#12805D] text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>{n}</span>
              <span className={`text-xs sm:text-[13px] leading-snug ${active ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>{text}</span>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {/* En movil el anual va primero: es el plan que se recomienda. */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="relative order-1 lg:order-2 flex flex-col gap-4 rounded-[32px] p-7 sm:p-8 bg-slate-900 dark:bg-dark-lighter text-white border-2 border-kk-primary"
          >
            <span className="absolute -top-3.5 left-7 bg-kk-primary text-[#06281d] text-xs font-extrabold px-3.5 py-1.5 rounded-full">{anual.badge}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold">{anual.name}</span>
              <span className="text-sm text-slate-400 line-through">{formatCLP(anual.strike)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">{formatCLP(anual.price)}</span>
              <span className="text-[15px] text-slate-300 whitespace-nowrap">/ {anual.period}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">Equivale a {formatCLP(anual.perMonth)} al mes. IVA incluido.</p>
            <div className="flex-1" />
            <PlanButton onRegister={onRegister} featured />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            className="order-2 lg:order-1 flex flex-col gap-4 rounded-[32px] p-7 sm:p-8 bg-white dark:bg-dark-normal border-[1.5px] border-slate-200 dark:border-dark-lightest"
          >
            <span className="text-lg font-bold text-slate-900 dark:text-white">{mensual.name}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">{formatCLP(mensual.price)}</span>
              <span className="text-[15px] text-slate-500 dark:text-slate-400">/ {mensual.period}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{mensual.note} IVA incluido.</p>
            <div className="flex-1" />
            <PlanButton onRegister={onRegister} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.19 }}
            className="order-3 flex flex-col gap-4 rounded-[32px] p-7 sm:p-8 bg-white dark:bg-dark-normal border-[1.5px] border-slate-200 dark:border-dark-lightest"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{familia.name}</span>
              <span className="text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap">{familia.chip}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">{formatCLP(familia.price)}</span>
              <span className="text-[15px] text-slate-500 dark:text-slate-400">/ {familia.period}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{familia.note} IVA incluido.</p>
            <div className="flex-1" />
            <PlanButton onRegister={onRegister} />
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          <div className="rounded-[28px] bg-slate-50 dark:bg-dark-normal p-6 sm:p-7">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">Todo incluido en todos los planes</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-snug">
                  <Check size={16} strokeWidth={3} className="text-[#12805D] dark:text-kk-secondary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4 rounded-[28px] bg-kk-light/50 dark:bg-kk-dark/20 p-6 sm:p-7">
            <span className="w-12 h-12 rounded-full bg-[#12805D] text-white grid place-items-center flex-shrink-0"><Users size={22} /></span>
            <p className="text-[15px] leading-relaxed text-[#0b4a35] dark:text-slate-200"><b>Invita y gana.</b> Por cada amigo que se suscribe, te regalamos 1 mes.</p>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto border-t border-slate-200 dark:border-dark-lightest">
          {FAQ.map(([q, a]) => (
            <div key={q} className="py-4 border-b border-slate-200 dark:border-dark-lightest">
              <div className="text-sm font-bold text-slate-900 dark:text-white">{q}</div>
              <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
