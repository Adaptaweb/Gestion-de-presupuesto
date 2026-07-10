import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import CTASection from './CTASection';
import { Sun, Moon } from 'lucide-react';
import LandingFooter from '../components/LandingFooter';

const Landing = ({ onLogin, onRegister }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('kk-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('kk-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem('kk-theme')) {
        setIsDarkMode(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className={`min-h-screen bg-white dark:bg-dark-darker font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-darker/80 backdrop-blur-lg border-b border-slate-100 dark:border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src={isDarkMode ? '/Logo-black.svg' : '/logo.svg'} alt="Kuentas Klaras" className="h-8 w-auto" />
            </div>
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter hover:text-kk-primary dark:hover:text-kk-secondary transition-colors"
                aria-label="Alternar modo oscuro"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={onLogin}
                className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-kk-primary dark:hover:text-kk-secondary transition-colors px-4 py-2"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onRegister}
                className="text-sm font-black bg-kk-primary text-white px-5 py-2.5 rounded-xl hover:bg-kk-dark transition-all shadow-lg shadow-kk-primary/20"
              >
                Crear Cuenta
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <HeroSection onLogin={onLogin} onRegister={onRegister} isDarkMode={isDarkMode} />
        <FeaturesSection />
        <HowItWorksSection isDarkMode={isDarkMode} />
        <CTASection onRegister={onRegister} />
      </main>

      <LandingFooter isDarkMode={isDarkMode} />
    </div>
  );
};

export default Landing;
