import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ListChecks, PiggyBank, LayoutDashboard, Check, Sun, Moon, ShieldCheck, Landmark, Forward, Smartphone, ChevronRight } from 'lucide-react';
import IPhone from './IPhone';
import { VideoTema, useFaseDemo } from './VideoTema';

// Una pestaña por pantalla del menu de la app, con su video y lo que se puede hacer.
const PANTALLAS = [
  {
    id: 'transacciones',
    icono: Mail,
    nombre: 'Transacciones',
    titulo: 'Tus movimientos llegan solos',
    texto: 'Cada compra que te avisa el banco por correo aparece aquí, lista para revisar.',
    puntos: [
      'Revisa y clasifica los pendientes con un toque',
      'Cuánto llevas gastado frente a tu presupuesto',
      'En qué se fue tu plata, por categoría y por banco',
      'Agrega gastos o ingresos a mano cuando quieras',
    ],
  },
  {
    id: 'cuotas',
    icono: ListChecks,
    nombre: 'Cuotas',
    titulo: 'Cuotas y suscripciones bajo control',
    texto: 'Todo lo que pagas mes a mes: cuotas, suscripciones, gastos fijos y abonos.',
    puntos: [
      'Marca lo pagado y mira cuánto falta este mes',
      'El avance de cada compra en cuotas',
      'Suscripciones con cobro automático, o cancélalas',
      'Con los logos de tus bancos y servicios',
    ],
  },
  {
    id: 'ahorros',
    icono: PiggyBank,
    nombre: 'Ahorros',
    titulo: 'Ahorra con metas claras',
    texto: 'Tus cuentas de ahorro y cuánto llevas juntado en cada una.',
    puntos: [
      'Una cuenta por meta: vacaciones, emergencias…',
      'Depósitos y retiros de cada mes',
      'Ahorro automático con un monto mensual',
      'Proyección a 3, 6 y 12 meses',
    ],
  },
  {
    id: 'resumen',
    icono: LayoutDashboard,
    nombre: 'Resumen',
    titulo: 'Lo que te queda, de un vistazo',
    texto: 'El disponible del mes con todo lo que entra y lo que sale.',
    puntos: [
      'Cuánto puedes gastar por día hasta fin de mes',
      'Detalle de cuotas, gastos y suscripciones',
      'Tu salud financiera según lo que has usado',
      'Tus ahorros y su proyección',
    ],
  },
];

// Como llegan los movimientos: sin claves del banco, solo reenvio de correo.
const FLUJO = [
  { icono: Landmark, texto: 'Tu banco te avisa cada compra por correo' },
  { icono: Forward, texto: 'Tu Gmail reenvía solo esos avisos' },
  { icono: Smartphone, texto: 'Aparecen en la app, ya ordenados' },
];

const PantallasSection = () => {
  const [activa, setActiva] = useState(PANTALLAS[0].id);
  const fase = useFaseDemo();
  const p = PANTALLAS.find(x => x.id === activa);

  return (
    <section id="como-funciona" className="scroll-mt-16 relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-kk-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-kk-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Cómo <span className="text-kk-primary">funciona</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Así se ve la app de verdad, pantalla por pantalla, en modo claro y oscuro.
          </p>
        </motion.div>

        {/* Lo que mas preocupa: no se piden claves del banco */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12 rounded-[28px] bg-white/85 dark:bg-white/[0.05] border border-kk-primary/25 shadow-xl shadow-kk-primary/10 dark:shadow-black/30 backdrop-blur p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-12 rounded-2xl bg-[#12805D] text-white grid place-items-center flex-shrink-0 shadow-lg shadow-kk-primary/30"><ShieldCheck size={24} /></span>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">Nunca te pedimos las claves de tu banco</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No nos conectamos a tu banco. Solo reenvías desde tu correo los avisos que el banco ya te manda.</p>
            </div>
          </div>
          <ol className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1">
            {FLUJO.map((paso, i) => (
              <React.Fragment key={paso.texto}>
                <li className="flex-1 flex items-center gap-3 rounded-2xl bg-kk-light/70 dark:bg-kk-primary/10 px-3.5 py-3">
                  <span className="w-9 h-9 rounded-xl bg-white dark:bg-white/10 text-kk-dark dark:text-kk-secondary grid place-items-center flex-shrink-0"><paso.icono size={18} /></span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{paso.texto}</span>
                </li>
                {i < FLUJO.length - 1 && <ChevronRight aria-hidden="true" size={18} className="hidden sm:block text-kk-primary flex-shrink-0" />}
              </React.Fragment>
            ))}
          </ol>
        </motion.div>

        {/* Pestañas como el menu de la app */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div role="tablist" aria-label="Pantallas de la app" className="relative flex w-full sm:w-auto gap-1 p-1.5 rounded-[28px] sm:rounded-full bg-white/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur overflow-x-auto no-scrollbar max-w-full">
            {PANTALLAS.map(x => {
              const sel = x.id === activa;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={sel}
                  aria-controls="pantalla-panel"
                  onClick={() => setActiva(x.id)}
                  className={`relative flex-1 sm:flex-none min-w-0 inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 h-14 sm:h-11 px-1 sm:px-4 rounded-[22px] sm:rounded-full text-[10.5px] sm:text-sm tracking-tight sm:tracking-normal font-extrabold transition-colors ${sel ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {sel && (
                    <motion.span
                      layoutId="pantalla-pill"
                      className="absolute inset-0 rounded-[22px] sm:rounded-full bg-kk-primary shadow-lg shadow-kk-primary/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <x.icono size={17} className="relative" />
                  <span className="relative">{x.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div id="pantalla-panel" role="tabpanel" className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative flex justify-center lg:justify-end order-1">
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-kk-primary/25 blur-[90px]" />
            <IPhone ancho={290} className="relative hidden sm:block">
              <VideoTema base={`/landing/videos/${p.id}`} etiqueta={`Pantalla ${p.nombre} de Kuentas Klaras`} />
            </IPhone>
            <IPhone ancho={250} className="relative sm:hidden">
              <VideoTema base={`/landing/videos/${p.id}`} etiqueta={`Pantalla ${p.nombre} de Kuentas Klaras`} />
            </IPhone>
          </div>

          <div className="order-2 max-w-md mx-auto lg:mx-0 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-kk-dark dark:text-kk-secondary mb-3">
                  <span className="w-8 h-8 rounded-xl bg-kk-primary/15 grid place-items-center"><p.icono size={16} /></span>
                  {p.nombre}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">{p.titulo}</h3>
                <p className="text-base font-medium text-slate-600 dark:text-slate-400 mb-6">{p.texto}</p>
                <ul className="flex flex-col gap-3">
                  {p.puntos.map((t, i) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i + 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-kk-primary text-white grid place-items-center flex-shrink-0"><Check size={14} strokeWidth={3} /></span>
                      <span className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">{t}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 px-3.5 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={fase}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid place-items-center"
                >
                  {fase === 'oscuro' ? <Moon size={14} /> : <Sun size={14} />}
                </motion.span>
              </AnimatePresence>
              Mostrando modo {fase} · cambia solo cada 10 s
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PantallasSection;
