import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bell, Smartphone, Eye } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Automático de verdad',
    description:
      'Reenvías los correos de tu banco y la IA clasifica al tiro. Adiós a los registros manuales, adiós al Excel.',
    color: 'from-emerald-400 to-kk-primary',
  },
  {
    icon: Bell,
    title: 'Notificaciones al instante',
    description:
      'Cada vez que tu banco te cobre, una notificación push te avisa. Sabes en tiempo real dónde se va tu plata.',
    color: 'from-sky-400 to-blue-500',
  },
  {
    icon: Smartphone,
    title: 'Web App — no necesitas instalar nada',
    description:
      'Funciona en tu celular, tu compu y tu tablet. Sin ir a ninguna tienda de apps. Sin ocupar espacio.',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: Eye,
    title: 'Todo en un solo lugar',
    description:
      'No solo gastos: también ingresos, deudas, suscripciones y ahorros. Una visión completa de tus finanzas personales.',
    color: 'from-amber-400 to-orange-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const FeaturesSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-white dark:bg-dark-normal overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-kk-primary/5 dark:bg-kk-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-kk-secondary/5 dark:bg-kk-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-kk-primary dark:text-white mb-4">
            Todo lo que necesitas para{' '}
            <span className="text-kk-primary">controlar tu plata</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Sin instalaciones complicadas. Sin conexión a tu banco. Sin compartir claves.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative bg-white dark:bg-dark-lighter border border-slate-100 dark:border-dark-lightest rounded-3xl p-8 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-500"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-5 shadow-lg`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-black text-kk-primary dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-kk-primary/0 group-hover:ring-kk-primary/10 dark:group-hover:ring-kk-primary/20 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
