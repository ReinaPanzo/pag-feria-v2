import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';



///Diseño en esta parte

const fireworks = [
  { top: '17%', left: '13%', size: 95, color: '#f97316', delay: 0 },
  { top: '20%', right: '14%', size: 110, color: '#0284c7', delay: 1.2 },
  { top: '42%', left: '7%', size: 75, color: '#facc15', delay: 2.1 },
  { top: '47%', right: '8%', size: 85, color: '#fb923c', delay: 0.8 },
  { bottom: '20%', left: '18%', size: 65, color: '#0ea5e9', delay: 1.7 },
  { bottom: '18%', right: '18%', size: 70, color: '#ef4444', delay: 2.8 },
];

type FireworkProps = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  color: string;
  delay: number;
};

const Firework = ({ top, bottom, left, right, size, color, delay }: FireworkProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none hidden sm:block"
      style={{
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
      animate={{
        opacity: [0, 0.75, 0],
        scale: [0.25, 1, 1.25],
        rotate: [0, 15, 35],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        repeatDelay: 1.5,
        delay,
        ease: 'easeOut',
      }}
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className="absolute left-1/2 top-1/2 h-[2px] rounded-full origin-left"
          style={{
            width: size * 0.32,
            backgroundColor: color,
            transform: `rotate(${index * 30}deg) translateX(${size * 0.12}px)`,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      ))}

      <span
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 18px ${color}`,
        }}
      />
    </motion.div>
  );
};






















export const Hero: React.FC = () => {
  return (





    
<section id="inicio" className="relative isolate min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-4 pt-20">
      {/* Background elements */}





{/* Imagen de fondo */}
<div className="absolute inset-0 -z-20">
  <img
    src="/images/tehuipango-fondo.jpg"
    alt="Vista de Tehuipango"
    className="w-full h-full object-cover"
  />
</div>






{/* Capa clara para que el texto se lea */}<div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/35 to-white/70 -z-10" />

{/* Fuegos artificiales decorativos */}
<div className="absolute inset-0 z-10 pointer-events-none">
  {fireworks.map((firework, index) => (
    <Firework key={index} {...firework} />
  ))}
</div>







{/* Capa clara para que el texto se lea */}
{/* Capa clara para que el texto se lea */}
<div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/90 -z-10" />

{/*div className="relative z-20 max-w-4xl text-center space-y-8 bg-white/40 backdrop-blur-[3px] rounded-[40px] px-6 py-10 md:px-12 md:py-12 border border-white/60 shadow-xl" */} 
<div className="relative z-20 max-w-4xl text-center space-y-8 px-6 py-10 md:px-12 md:py-12">


  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 3, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <span className="inline-block px-4 py-1.5 bg-brand-blue/15 text-brand-blue text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6 shadow-sm">
      Tradición y Progreso
    </span>

    <h1 className="text-6xl md:text-8xl font-serif text-neutral-950 leading-[0.9] italic drop-shadow-sm">
      Feria de <br />
      <span className="text-brand-blue not-italic font-black flex flex-col md:flex-row items-center justify-center gap-4 drop-shadow-sm">
        Tehuipango
        <span className="text-4xl md:text-6xl text-brand-deep font-serif italic font-light">
          2026
        </span>
      </span>
    </h1>
  </motion.div>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 1 }}
    className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto font-medium leading-relaxed"
  >
    Únete a la celebración más grande de nuestra sierra. Música, danza,
    gastronomía y el calor de nuestra gente en un solo lugar.
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
