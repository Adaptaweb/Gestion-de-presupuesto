import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, LayoutGroup, AnimatePresence } from 'motion/react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import PreguntasSection from './PreguntasSection';
import PantallasSection from './PantallasSection';
import { ProveedorTemaDemo } from './VideoTema';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';

const ENLACES = [
  { href: '#funciones', texto: 'Funciones' },
  { href: '#como-funciona', texto: 'Cómo funciona' },
  { href: '#instalar', texto: 'Instalar app' },
  { href: '#precios', texto: 'Precios' },
  { href: '#preguntas', texto: 'Preguntas' },
];
import LandingFooter from '../components/LandingFooter';
import { applyDarkMode, getInitialDarkMode } from '../lib/theme.js';

// Cada seccion tiene su tono de fondo: una capa fija detras de todo cambia de
// color con una transicion lenta al pasar de una a otra.
const SECCIONES = ['funciones', 'como-funciona', 'precios', 'preguntas', 'pie'];
const TONOS = {
  claro: { funciones: '#F4FBF8', 'como-funciona': '#E3F4EB', precios: '#EDF2FA', preguntas: '#F8F5EE', pie: '#F2F7F4' },
  oscuro: { funciones: '#0F1613', 'como-funciona': '#0A1913', precios: '#0E131B', preguntas: '#15130F', pie: '#0F0F0F' },
};

const Landing = ({ onLogin, onRegister }) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    applyDarkMode(isDarkMode, { persist: true });
  }, [isDarkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Menu de navegacion del movil: se cierra al elegir, con Escape o al tocar fuera.
  const [menuAbierto, setMenuAbierto] = useState(false);
  useEffect(() => {
    if (!menuAbierto) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuAbierto(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuAbierto]);

  const [seccion, setSeccion] = useState('funciones');
  useEffect(() => {
    // La seccion que cruza la mitad de la pantalla decide el color.
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach(e => { if (e.isIntersecting) setSeccion(e.target.id); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    SECCIONES.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  const tono = TONOS[isDarkMode ? 'oscuro' : 'claro'][seccion] || TONOS.claro.funciones;

  const sentinelRef = useRef(null);
  const isSentinelInView = useInView(sentinelRef, { margin: '-64px 0px 0px 0px' });
  const scrolled = !isSentinelInView;

  return (
    <div className={`relative isolate min-h-[100dvh] bg-kk-background dark:bg-dark-darker font-poppins transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none transition-[background-color] duration-1000 ease-in-out" style={{ backgroundColor: tono }} />
      <LayoutGroup>
      {/* Sobre el hero oscuro la barra usa los colores del tema oscuro. */}
      <header style={{ top: 'env(safe-area-inset-top, 0px)' }} className={`fixed left-0 right-0 z-50 backdrop-blur-lg border-b ${scrolled ? '' : 'dark'} ${
        scrolled
          ? 'bg-white/80 dark:bg-dark-darker/80 border-slate-100 dark:border-dark-lighter'
          : 'bg-white/0 dark:bg-dark-darker/0 border-transparent'
      } transition duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              {scrolled && (
                <motion.img
                  layoutId="main-logo"
                  src={isDarkMode ? '/Logo-black.svg' : '/logo.svg'}
                  alt="Kuentas Klaras"
                  className="h-8 w-auto"
                />
              )}
            </div>
            <nav aria-label="Principal" className="hidden md:flex items-center gap-1">
              {ENLACES.map(e => (
                <a
                  key={e.href}
                  href={e.href}
                  className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-kk-primary dark:hover:text-kk-secondary transition-colors px-3 py-2"
                >
                  {e.texto}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter hover:text-kk-primary dark:hover:text-kk-secondary transition-colors"
                aria-label="Alternar modo oscuro"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={onLogin}
                className="hidden md:inline-block text-sm font-black text-slate-600 dark:text-slate-300 hover:text-kk-primary dark:hover:text-kk-secondary transition-colors px-4 py-2"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onRegister}
                className="hidden md:inline-block text-sm font-black bg-kk-primary text-white px-5 py-2.5 rounded-xl hover:bg-kk-dark transition shadow-lg shadow-kk-primary/20"
              >
                Crear Cuenta
              </button>
              <button
                onClick={() => setMenuAbierto(v => !v)}
                aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuAbierto}
                aria-controls="menu-movil"
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 transition active:scale-95"
              >
                {menuAbierto ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuAbierto && (
          <>
            <motion.div
              key="fondo-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-slate-950/40 dark:bg-black/60 backdrop-blur-[2px]"
              onClick={() => setMenuAbierto(false)}
              aria-hidden="true"
            />
            <motion.nav
              key="menu-movil"
              id="menu-movil"
              aria-label="Menú"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ top: 'calc(env(safe-area-inset-top, 0px) + 4.5rem)' }}
              className="md:hidden fixed left-3 right-3 z-50 kk-glass kk-glass-sheet rounded-[28px] p-3 flex flex-col gap-1 font-manrope"
            >
              {ENLACES.map(e => (
                <a
                  key={e.href}
                  href={e.href}
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between min-h-[52px] px-4 rounded-2xl text-base font-extrabold text-slate-800 dark:text-slate-100 active:bg-white/70 dark:active:bg-white/5 transition"
                >
                  {e.texto}
                  <ArrowRight size={18} className="text-slate-400" />
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-slate-200/80 dark:border-white/10">
                <button
                  onClick={() => { setMenuAbierto(false); onLogin(); }}
                  className="min-h-[50px] rounded-2xl bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-extrabold transition active:scale-[0.98]"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { setMenuAbierto(false); onRegister(); }}
                  className="min-h-[50px] rounded-2xl bg-kk-primary text-white text-sm font-extrabold shadow-lg shadow-kk-primary/25 transition active:scale-[0.98]"
                >
                  Crear cuenta
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <ProveedorTemaDemo>
      <main>
        <HeroSection sentinelRef={sentinelRef} scrolled={scrolled} />
        <FeaturesSection />
        <PantallasSection />
        <PricingSection onRegister={onRegister} />
        <PreguntasSection />
      </main>
      </ProveedorTemaDemo>

      <div id="pie">
        <LandingFooter isDarkMode={isDarkMode} transparente />
      </div>
      </LayoutGroup>
    </div>
  );
};

export default Landing;
