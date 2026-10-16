import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import InstalarApp from './InstalarApp';
import IPhone from './IPhone';
import { VideoTema } from './VideoTema';

const TITULO = ['Tus', 'finanzas', 'claras,', 'bajo', 'control.'];

const HeroSection = ({ onRegister, isDarkMode, sentinelRef, scrolled }) => {
  const quieto = useReducedMotion();
  // Inclinacion 3D del telefono siguiendo el puntero (solo con mouse).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 18 });
  const mover = (e) => {
    if (quieto || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const soltar = () => { px.set(0); py.set(0); };

  return (
    <section
      onPointerMove={mover}
      onPointerLeave={soltar}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-kk-background dark:bg-dark-darker"
    >
      {/* Fondo: auroras en movimiento y una grilla que se desvanece hacia los bordes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-kk-primary/25 dark:bg-kk-primary/20 blur-[110px]"
          animate={quieto ? undefined : { x: [0, 80, -20, 0], y: [0, 40, 90, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-kk-secondary/30 dark:bg-kk-secondary/15 blur-[120px]"
          animate={quieto ? undefined : { x: [0, -70, 10, 0], y: [0, -50, 40, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] rounded-full bg-sky-300/20 dark:bg-sky-500/10 blur-[120px]"
          animate={quieto ? undefined : { x: [0, 60, -40, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(14,107,87,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,107,87,0.12) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:py-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 w-full text-center lg:text-left">
            {!scrolled && (
              <motion.img
                layoutId="main-logo"
                src={isDarkMode ? '/Logo-black.svg' : '/logo.svg'}
                alt="Kuentas Klaras"
                className="h-11 sm:h-12 w-auto mb-6 mx-auto lg:mx-0"
              />
            )}
            <div ref={sentinelRef} />

            <motion.a
              href="#instalar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative inline-flex items-center gap-2 mb-5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.06] border border-kk-primary/20 text-sm font-bold text-kk-dark dark:text-kk-secondary overflow-hidden backdrop-blur"
            >
              <span className="w-6 h-6 rounded-full bg-kk-primary text-white grid place-items-center"><Download size={13} /></span>
              Instálala gratis en tu celular
              {!quieto && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 dark:via-white/20 to-transparent"
                  initial={{ x: '-6rem' }}
                  animate={{ x: '22rem' }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                />
              )}
            </motion.a>

            <h1 className="text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem] font-black tracking-tight text-slate-900 dark:text-white mb-7">
              {TITULO.map((palabra, i) => (
                <motion.span
                  key={palabra}
                  className={`inline-block mr-[0.22em] ${palabra === 'claras,' ? 'bg-gradient-to-r from-kk-primary via-emerald-400 to-kk-dark dark:to-kk-secondary bg-clip-text text-transparent' : ''}`}
                  initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {palabra}
                </motion.span>
              ))}
            </h1>

            {/* Lo primero tras el titulo: instalarla como app. */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 text-left"
            >
              <InstalarApp />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              <button
                onClick={onRegister}
                className="group relative inline-flex items-center gap-2 bg-kk-primary text-white px-7 py-4 rounded-2xl font-black text-lg shadow-lg shadow-kk-primary/30 hover:bg-kk-dark hover:shadow-xl hover:shadow-kk-primary/40 transition duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
                Comenzar Gratis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Telefono con la app en video */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center [perspective:1400px]"
          >
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full bg-kk-primary/30 dark:bg-kk-primary/25 blur-[90px]" />
            <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="relative">
              <motion.div
                animate={quieto ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <IPhone ancho={300} className="hidden sm:block">
                  <VideoTema base="/landing/videos/transacciones" etiqueta="Kuentas Klaras: transacciones del mes" />
                </IPhone>
                <IPhone ancho={250} className="sm:hidden">
                  <VideoTema base="/landing/videos/transacciones" etiqueta="Kuentas Klaras: transacciones del mes" />
                </IPhone>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
