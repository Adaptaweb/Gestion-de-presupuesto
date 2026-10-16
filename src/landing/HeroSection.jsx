import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import InstalarApp from './InstalarApp';
import IPhone from './IPhone';
import { VideoTema } from './VideoTema';

const TITULO = ['Instálala', 'en', 'tu', 'celular.', 'Tus', 'gastos', 'llegan', 'solos.'];
const RESALTADAS = new Set(['llegan', 'solos.']);

// Halo de luz: copia el cuadro actual del video del telefono a un canvas diminuto
// que cubre todo el fondo del hero; agrandado y muy difuminado, lo ilumina con
// los colores de la app. Es un solo video decodificado; el canvas se refresca a
// ~8 cuadros por segundo y solo mientras el hero se ve.
const ANCHO_HALO = 64;
const ALTO_HALO = 40;

const HaloVideo = ({ fuenteRef, quieto }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;
    let visible = true;
    let ultimo = 0;
    let id = 0;
    // Mientras el video no carga (en movil queda bajo la instalacion), la portada
    // pinta el halo para que el fondo no parta apagado.
    const portada = new Image();
    portada.src = '/landing/videos/transacciones-claro.webp';
    const pintar = () => {
      let media = [...(fuenteRef.current?.querySelectorAll('video, img') || [])].find(el => el.offsetParent);
      if (media?.tagName === 'VIDEO' && media.readyState < 2) media = null;
      if (!media && portada.complete) media = portada;
      if (!media) return;
      const w = media.videoWidth || media.naturalWidth;
      const h = media.videoHeight || media.naturalHeight;
      const listo = media.tagName === 'VIDEO' || media.complete;
      if (!listo || !w || !h) return;
      // Recorte "cover": la franja central del video llena el fondo apaisado.
      const altoFuente = Math.min(h, w * ALTO_HALO / ANCHO_HALO);
      try {
        ctx.drawImage(media, 0, (h - altoFuente) / 2, w, altoFuente, 0, 0, ANCHO_HALO, ALTO_HALO);
      } catch { /* cuadro no disponible */ }
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
      width={ANCHO_HALO}
      height={ALTO_HALO}
      aria-hidden="true"
      // Mas grande que el hero: el desenfoque aclara los bordes del canvas.
      className="absolute -inset-[15%] w-[130%] h-[130%] pointer-events-none"
      style={{ filter: 'blur(80px) saturate(2.6) brightness(0.8)' }}
      initial={{ opacity: 0 }}
      animate={quieto ? { opacity: 0.8 } : { opacity: [0.7, 0.95, 0.7], scale: [1, 1.06, 1] }}
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
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
    >
      {/* El hero siempre es oscuro: asi el halo del video luce en ambos temas. */}
      {/* El hero (con su halo) se desvanece hacia el tono de la seccion siguiente:
          la mascara evita la franja que dejaba un degradé aparte. */}
      <div
        className="dark relative flex-1 flex items-center bg-[#07110E]"
        style={{
          maskImage: 'linear-gradient(to bottom, black calc(100% - 12rem), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 12rem), transparent)',
        }}
      >
        {/* Fondo: el halo del video cubre todo el hero, con un velo oscuro encima
            para que los textos se lean aunque el video este en modo claro. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <HaloVideo fuenteRef={telefonoRef} quieto={quieto} />
          {/* Tinte verde de la marca: cuando el video esta en modo claro el halo
              seria gris; asi el fondo siempre se siente Kuentas Klaras. */}
          <div className="absolute inset-0 bg-[#06231b]/60" />
          <div className="absolute inset-0 bg-kk-primary/30 mix-blend-color" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,17,14,0.75)_100%)]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-44 lg:pt-28 lg:pb-48">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-14 lg:gap-12 items-center">
            {/* Telefono (en movil va despues de la instalacion) */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1 flex justify-center [perspective:1400px]"
            >
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

    </section>
  );
};

export default HeroSection;
