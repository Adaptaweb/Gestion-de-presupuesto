import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Mail, Brain, Eye } from 'lucide-react';
import IPhone from './IPhone';
import { VideoTema } from './VideoTema';

const steps = [
  {
    number: '01',
    icon: Mail,
    title: 'Reenvías tus correos',
    description:
      'Configuras una regla de reenvío desde tu correo del banco a tu casilla Kuentas Klaras. Te ayudamos paso a paso y no toma más de 5 minutos.',
    image: '/landing/how-it-works-1.webp',
    imageDark: '/landing/how-it-works-1-dark.webp',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    number: '02',
    icon: Brain,
    title: 'La IA clasifica automáticamente',
    description:
      'Nuestra inteligencia artificial reconoce cada transacción y la clasifica en la categoría correcta. Mientras más la usas, más precisa se vuelve.',
    video: '/landing/videos/transacciones',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    number: '03',
    icon: Eye,
    title: 'Tus cuentas claras, siempre',
    description:
      'Dashboards inteligentes para entender tu plata de un vistazo. Gastos, ingresos, deudas y ahorros organizados y bajo control.',
    video: '/landing/videos/resumen',
    gradient: 'from-amber-400 to-orange-500',
  },
];

const StepContent = ({ step, index, isDarkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-12 lg:py-16 ${
        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
      }`}
    >
      <div className="flex-1 max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl font-black text-kk-primary/20 dark:text-kk-primary/10">
            {step.number}
          </span>
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} text-white shadow-lg`}>
            <step.icon size={20} />
          </div>
        </div>
        <h3
          className="text-2xl sm:text-3xl font-black text-kk-primary dark:text-white mb-4"
        >
          {step.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg">
          {step.description}
        </p>
      </div>

      <div className="flex-shrink-0 relative">
        <div aria-hidden="true" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br ${step.gradient} opacity-25 blur-[80px]`} />
        <IPhone ancho={260} sinBarra={!step.video} className="relative">
          {step.video ? (
            <VideoTema base={step.video} etiqueta={step.title} />
          ) : (
            <img
              src={isDarkMode ? step.imageDark : step.image}
              alt={step.title}
              className="block w-full object-cover object-bottom"
              style={{ aspectRatio: '1080 / 2338' }}
            />
          )}
        </IPhone>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = ({ isDarkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="como-funciona" className="scroll-mt-16 relative py-24 lg:py-32 bg-gradient-to-b from-kk-light/30 dark:from-dark-darker to-white dark:to-dark-normal overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-kk-primary/5 dark:bg-kk-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-kk-secondary/5 dark:bg-kk-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-kk-primary dark:text-white mb-4">
            Cómo funciona
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Tres pasos simples para tener el control total de tus finanzas.
          </p>
        </motion.div>

        {steps.map((step, index) => (
          <StepContent key={step.number} step={step} index={index} isDarkMode={isDarkMode} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
