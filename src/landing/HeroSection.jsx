import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import InstalarApp from './InstalarApp';
import IPhone from './IPhone';
import { VideoTema } from './VideoTema';

const TITULO = ['Instálala', 'en', 'tu', 'celular.', 'Tus', 'gastos', 'llegan', 'solos.'];
const RESALTADAS = new Set(['llegan', 'solos.']);

// Halo de luz: copia el cuadro actual del video del telefono a un canvas diminuto
// que, agrandado y muy difuminado, ilumina el fondo con los colores de la app.
// Es un solo video decodificado; el canvas se refresca a ~8 cuadros por segundo.
const HaloVideo = ({ fuenteRef, quieto }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;
    let visible = true;
    let ultimo = 0;
    let id = 0;
    const pintar = () => {
      const media = [...(fuenteRef.current?.querySelectorAll('video, img') || [])].find(el => el.offsetParent);
      if (!media) return;
      const listo = media.tagName === 'VIDEO' ? media.readyState >= 2 : media.complete && media.naturalWidth;
      if (!listo) return;
      try { ctx.drawImage(media, 0, 0, canvas.width, canvas.height); } catch { /* cuadro no disponible */ }
    };
    const ciclo = (t) => {
      id = requestAnimationFrame(ciclo);
      if (!visible || t - ultimo < 120) return;
      ultimo = t;
      pintar();
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (quieto) {
      const t = setInterval(pintar, 1000);
      return () => { clearInterval(t); io.disconnect(); };
    }
    id = requestAnimationFrame(ciclo);
    return () => { cancelAnimationFrame(id); io.disconnect(); };
  }, [fuenteRef, quieto]);

  return (
    <motion.canvas
      ref={canvasRef}
      width={36}
      height={78}
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 w-[22rem] h-[36rem] sm:w-[28rem] sm:h-[44rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        filter: 'blur(56px) saturate(2.2) brightness(0.85)',
        maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={quieto ? { opacity: 0.6 } : { opacity: [0.5, 0.75, 0.5], scale: [1, 1.08, 1] }}
      transition={quieto ? { duration: 1 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

const HeroSection = ({ sentinelRef, scrolled }) => {
  const quieto = useReducedMotion();
  const telefonoRef = useRef(null);
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
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-[#07110E]"
    >
      {/* El hero siempre es oscuro: asi el halo del video luce en ambos temas. */}
      <div className="dark relative flex-1 flex items-center">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-kk-primary/15 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-emerald-900/40 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 lg:py-28">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-14 lg:gap-12 items-center">
            {/* Telefono con el halo (en movil va despues de la instalacion) */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1 flex justify-center [perspective:1400px]"
            >
              <HaloVideo fuenteRef={telefonoRef} quieto={quieto} />
              <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="relative">
                <motion.div
                  ref={telefonoRef}
                  animate={quieto ? undefined : { y: [0, -14, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <IPhone ancho={310} className="hidden sm:block">
                    <VideoTema base="/landing/videos/transacciones" etiqueta="Kuentas Klaras: transacciones del mes" />
                  </IPhone>
                  <IPhone ancho={250} className="sm:hidden">
                    <VideoTema base="/landing/videos/transacciones" etiqueta="Kuentas Klaras: transacciones del mes" />
                  </IPhone>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 max-w-xl mx-auto lg:mx-0 w-full text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center lg:items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-7">
                {!scrolled && (
                  <motion.img
                    layoutId="main-logo"
                    src="/Logo-black.svg"
                    alt="Kuentas Klaras"
                    className="h-10 sm:h-11 w-auto"
                  />
                )}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[13px] font-bold text-kk-secondary/90 sm:pl-4 sm:border-l sm:border-white/15"
                >
                  Tus finanzas claras, bajo control
                </motion.span>
              </div>
              <div ref={sentinelRef} />

              <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-[3.6rem] font-black tracking-tight text-white mb-5">
                {TITULO.map((palabra, i) => (
                  <motion.span
                    key={palabra}
                    className={`inline-block mr-[0.22em] ${RESALTADAS.has(palabra) ? 'bg-gradient-to-r from-kk-secondary via-emerald-300 to-kk-primary bg-clip-text text-transparent' : ''}`}
                    initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {palabra}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-base sm:text-lg font-medium text-slate-300 leading-relaxed mb-7"
              >
                Sin tienda de apps y sin claves del banco: solo reenvías los avisos de compra desde tu correo.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 text-left"
              >
                <InstalarApp />
              </motion.div>

              <motion.a
                href="#precios"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="group inline-flex items-center gap-2 text-base font-extrabold text-kk-secondary hover:text-white transition-colors"
              >
                Ver planes y precios
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Paso suave del hero oscuro a la seccion siguiente */}
      <div aria-hidden="true" className="h-40 -mt-px bg-[linear-gradient(to_bottom,#07110E,#0E2A22_30%,#2C7A60_62%,#ffffff)] dark:bg-[linear-gradient(to_bottom,#07110E,#12201b_45%,#1A1A1A)]" />
    </section>
  );
};

export default HeroSection;
