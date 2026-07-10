import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap } from 'lucide-react';

const CTASection = ({ onRegister }) => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-kk-dark via-kk-primary/90 to-kk-primary" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-black/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Empieza a tener{' '}
          <span className="text-kk-light">cuentas claras</span> hoy.
        </h2>

        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Sin conectar tu banco. Sin compartir claves. Sin riesgo.
          Solo tú y tus finanzas, claras y bajo control.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <button
            onClick={onRegister}
            className="group inline-flex items-center gap-2 bg-white text-kk-primary px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Crear tu Cuenta Gratis
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/60 text-sm font-medium"
        >
          Sin tarjeta de crédito. Sin compromiso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
            <Shield size={16} className="text-white/50" />
            No nos conectamos a tu banco
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
            <Zap size={16} className="text-white/50" />
            Configuración en 5 minutos
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
