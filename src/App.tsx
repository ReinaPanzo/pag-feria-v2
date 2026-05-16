/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventGrid } from './components/EventGrid';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { motion, useScroll, useSpring } from 'motion/react';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      {/* Scroll indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-blue z-[100] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Decorative divider */}
        <div className="max-w-7xl mx-auto px-4 h-px bg-neutral-200" />
        
        <EventGrid />
        
        <div className="max-w-7xl mx-auto px-4 h-px bg-neutral-200" />
        
        <AdminPanel />
        
        {/* Culture section (Placeholder for context) */}
        <section id="nosotros" className="py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-blue bg-brand-blue/5 px-3 py-1 rounded-full">Nuestra Raíz</span>
                <h2 className="text-5xl md:text-6xl font-serif italic text-neutral-900 leading-tight">
                  Tehuipango: Donde el <br />
                  <span className="not-italic font-black text-brand-blue">Nahualt</span> late fuerte
                </h2>
                <p className="text-lg text-neutral-600 font-light leading-relaxed">
                  Tehuipango es cuna de tradiciones que se remontan a siglos atrás. Nuestra feria no es solo un evento, es la manifestación de nuestra unidad y progreso como pueblo serrano. Celebramos con orgullo nuestra identidad y cultura.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-serif italic text-brand-blue">100%</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Orgullo Serrano</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-serif italic text-brand-deep">2026</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Tehuipango Vive</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1619551734325-81aaf323686c?q=80&w=1000" 
                    alt="Cultura Zongolica" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 aspect-square w-48 rounded-full overflow-hidden border-4 border-white shadow-xl -rotate-12">
                  <img 
                   src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000" 
                   alt="Gastronomía"
                   className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
