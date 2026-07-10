import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Bell, Smartphone, Eye } from 'lucide-react';

const HeroSection = ({ onLogin, onRegister, isDarkMode }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-kk-background dark:from-dark-darker via-white dark:via-dark-normal to-kk-light/30 dark:to-dark-darker">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kk-primary/5 dark:bg-kk-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-kk-secondary/10 dark:bg-kk-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <img src={isDarkMode ? '/KKiso.svg' : '/logo.svg'} alt="Kuentas Klaras" className="h-12 w-auto" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-kk-primary dark:text-white mb-6"
            >
              Tus finanzas{' '}
              <span className="text-kk-primary">claras</span>
              , bajo control.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-medium"
            >
              Olvídate del Excel. Reenvía los correos de tu banco y la IA clasifica cada gasto al instante. 
              Una web app que centraliza todo: gastos, ingresos, deudas y ahorros en un solo lugar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <div className="flex items-center gap-2 bg-kk-light/80 dark:bg-dark-lighter/80 border border-kk-primary/10 dark:border-kk-primary/20 rounded-full px-4 py-2 text-sm font-bold text-kk-primary dark:text-slate-200">
                <Sparkles size={16} className="text-kk-primary" />
                Se cargan solos con tu correo
              </div>
              <div className="flex items-center gap-2 bg-kk-light/80 dark:bg-dark-lighter/80 border border-kk-primary/10 dark:border-kk-primary/20 rounded-full px-4 py-2 text-sm font-bold text-kk-primary dark:text-slate-200">
                <Bell size={16} className="text-kk-primary" />
                Notificaciones al instante
              </div>
              <div className="flex items-center gap-2 bg-kk-light/80 dark:bg-dark-lighter/80 border border-kk-primary/10 dark:border-kk-primary/20 rounded-full px-4 py-2 text-sm font-bold text-kk-primary dark:text-slate-200">
                <Smartphone size={16} className="text-kk-primary" />
                Web App — no instalas nada
              </div>
              <div className="flex items-center gap-2 bg-kk-light/80 dark:bg-dark-lighter/80 border border-kk-primary/10 dark:border-kk-primary/20 rounded-full px-4 py-2 text-sm font-bold text-kk-primary dark:text-slate-200">
                <Eye size={16} className="text-kk-primary" />
                Todo en un solo lugar
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onRegister}
                className="group inline-flex items-center gap-2 bg-kk-primary text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-kk-primary/25 hover:bg-kk-dark hover:shadow-xl hover:shadow-kk-primary/30 transition-all duration-300"
              >
                Comenzar Gratis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-2 border-2 border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 px-8 py-4 rounded-2xl font-black text-lg hover:border-kk-primary hover:text-kk-primary transition-all duration-300"
              >
                Iniciar Sesión
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mx-auto"
              >
                <div className="w-[341px] h-[728px] bg-gradient-to-b from-slate-900 to-slate-800 dark:from-dark-normal dark:to-dark-lighter rounded-[3rem] border-4 border-slate-700 dark:border-dark-lightest shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 dark:bg-dark-darker rounded-b-2xl z-10" />
                  <img
                    src={isDarkMode ? '/landing/hero-dashboard-dark.webp' : '/landing/hero-dashboard-white.webp'}
                    alt="Dashboard Kuentas Klaras"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-700 dark:bg-dark-lightest rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
