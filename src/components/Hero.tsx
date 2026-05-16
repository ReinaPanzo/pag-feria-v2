import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-4 pt-20">
      {/* Background elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-sky/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      
      <div className="max-w-4xl text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6">
            Tradición y Progreso
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-neutral-900 leading-[0.9] italic">
            Feria de <br />
            <span className="text-brand-blue not-italic font-black flex flex-col md:flex-row items-center justify-center gap-4">
              Tehuipango
              <span className="text-4xl md:text-6xl text-brand-deep font-serif italic font-light">2026</span>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Únete a la celebración más grande de nuestra sierra. Música, danza, gastronomía y el calor de nuestra gente en un solo lugar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-white/50 backdrop-blur shadow-sm rounded-2xl border border-white/50">
            <Calendar className="text-brand-blue" size={20} />
            <span className="text-sm font-medium">Agosto 2026</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-white/50 backdrop-blur shadow-sm rounded-2xl border border-white/50">
            <MapPin className="text-brand-deep" size={20} />
            <span className="text-sm font-medium">Centro Municipal, Tehuipango</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="pt-12 text-neutral-400"
        >
          <a href="#eventos" className="flex flex-col items-center gap-2 hover:text-brand-clay transition-colors group">
            <span className="text-[10px] uppercase tracking-widest font-bold">Ver Calendario</span>
            <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Decorative vertical mask patterns */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
        <div className="writing-vertical-rl text-[10px] uppercase tracking-[1em] text-neutral-300 font-bold opacity-50">
          SIERRA DE TEHUIPANGO • VERACRUZ • MÉXICO • 2026
        </div>
      </div>
    </section>
  );
};
