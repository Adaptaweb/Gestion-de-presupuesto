import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { TRIAL_DAYS, TRIAL_REMINDER_DAYS, READ_ONLY_DAYS } from '../constants/pricing.js';

const EASE = [0.22, 1, 0.36, 1];

const PREGUNTAS = [
  ['¿Necesito dar la clave de mi banco?', 'No. No nos conectamos a tu banco: solo recibimos los correos de aviso de compra que tu banco ya te envía.'],
  ['¿Pueden leer todos mis correos?', 'No. En Gmail creas un filtro que reenvía solo los avisos de tu banco a tu dirección de Kuentas Klaras. El resto de tu correo nunca nos llega.'],
  ['¿Qué bancos funcionan?', 'Banco de Chile, BancoEstado, BCI, Santander, Itaú, Falabella, Mach y Mercado Pago. Además puedes agregar gastos e ingresos a mano.'],
  ['¿Necesito Gmail?', 'La configuración guiada es para Gmail, que es donde se crea el filtro que reenvía los avisos del banco.'],
  ['¿Tengo que descargarla de una tienda de apps?', 'No. Se instala desde el navegador en iPhone, Android o computador, queda en tu pantalla de inicio y se actualiza sola.'],
  ['¿Puedo usarla en varios dispositivos?', 'Sí. Entras con tu cuenta y ves lo mismo en el celular y en el computador.'],
  ['¿Necesito tarjeta para probar?', `No. No pedimos ningún dato de pago durante los ${TRIAL_DAYS} días.`],
  [`¿Cuándo parten los ${TRIAL_DAYS} días?`, 'Cuando terminas de configurar el reenvío del correo, no al crear la cuenta.'],
  [`¿Qué pasa cuando terminan los ${TRIAL_DAYS} días?`, `Te avisamos ${TRIAL_REMINDER_DAYS} días antes. Si no eliges plan, tu cuenta queda en solo lectura por ${READ_ONLY_DAYS} días y no pierdes nada.`],
  ['¿Puedo cancelar cuando quiera?', 'Sí. Al cancelar sigues usando la app hasta que termina el período que ya pagaste.'],
];

const Pregunta = ({ pregunta, respuesta, abierta, alternar, id }) => (
  <div className="border-b border-slate-200 dark:border-dark-lightest">
    <h3>
      <button
        type="button"
        onClick={alternar}
        aria-expanded={abierta}
        aria-controls={id}
        className="w-full flex items-center justify-between gap-4 py-5 text-left text-base sm:text-lg font-extrabold text-slate-900 dark:text-white"
      >
        {pregunta}
        <span className={`w-9 h-9 rounded-full grid place-items-center flex-shrink-0 transition duration-300 ${abierta ? 'bg-kk-primary text-white rotate-45' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
          <Plus size={18} />
        </span>
      </button>
    </h3>
    <AnimatePresence initial={false}>
      {abierta && (
        <motion.div
          id={id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden"
        >
          <p className="pb-5 pr-12 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{respuesta}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const PreguntasSection = () => {
  const [abierta, setAbierta] = useState(0);

  return (
    <section id="preguntas" className="scroll-mt-16 relative py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Preguntas <span className="text-kk-primary">frecuentes</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Lo que más nos preguntan antes de empezar.
          </p>
        </motion.div>

        <div className="border-t border-slate-200 dark:border-dark-lightest">
          {PREGUNTAS.map(([pregunta, respuesta], i) => (
            <Pregunta
              key={pregunta}
              id={`respuesta-${i}`}
              pregunta={pregunta}
              respuesta={respuesta}
              abierta={abierta === i}
              alternar={() => setAbierta(abierta === i ? -1 : i)}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          ¿Otra duda? Escríbenos a{' '}
          <a href="mailto:soporte@kuentasklaras.cl" className="font-bold text-kk-dark dark:text-kk-secondary hover:underline">soporte@kuentasklaras.cl</a>
        </p>
      </div>
    </section>
  );
};

export default PreguntasSection;
