import React from 'react';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white text-neutral-900 rounded-full flex items-center justify-center font-serif text-2xl italic">
              Z
            </div>
            <div>
              <h2 className="text-2xl font-serif italic tracking-tight">Feria Tehuipango</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-blue font-bold">Ayuntamiento de Tehuipango, Ver.</p>
            </div>
          </div>
          <p className="text-neutral-400 max-w-sm font-light leading-relaxed">
            Preservando nuestra identidad cultural a través de la fiesta más importante de la región. Te esperamos en el 2026.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">Enlaces Rápidos</h3>
          <ul className="space-y-4">
            <li><a href="#inicio" className="text-neutral-400 hover:text-white transition-colors font-light">Inicio</a></li>
            <li><a href="#eventos" className="text-neutral-400 hover:text-white transition-colors font-light">Calendario</a></li>
            <li><a href="#nosotros" className="text-neutral-400 hover:text-white transition-colors font-light">Nuestra Cultura</a></li>
            <li><a href="#" className="text-neutral-400 hover:text-white transition-colors font-light">Mapa de la Feria</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">Contacto</h3>
          <ul className="space-y-4 text-neutral-400 font-light">
            <li>Palacio Municipal S/N, Centro</li>
            <li>Tehuipango, Veracruz, México</li>
            <li>CP 95015</li>
            <li>contacto@tehuipango.gob.mx</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <p>© 2026 H. Ayuntamiento de Tehuipango. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1">
          Hecho con <Heart size={12} className="text-red-500 fill-red-500" /> para la Sierra
        </p>
      </div>
    </footer>
  );
};
