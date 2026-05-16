import React, { useState, useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LogIn, LogOut, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => signOut(auth);

  const isAdmin = 
    user?.email === 'reina_panzo_isc@zongolica.tecnm.mx' || 
    user?.email === 'reina_panzo_isc@tehuipango.gob.mx' ||
    user?.email === 'fctprogramer.2021@gmail.com';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-serif text-xl italic">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 leading-none">
                Feria Tehuipango
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-blue font-bold">
                Edición 2026
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="text-sm font-medium text-neutral-600 hover:text-brand-clay transition-colors">Inicio</a>
            <a href="#eventos" className="text-sm font-medium text-neutral-600 hover:text-brand-clay transition-colors">Eventos</a>
            <a href="#nosotros" className="text-sm font-medium text-neutral-600 hover:text-brand-clay transition-colors">Cultura</a>
            
            {isAdmin && (
              <a href="#admin" className="flex items-center gap-1.5 text-sm font-semibold text-brand-deep bg-brand-blue/10 px-3 py-1 rounded-full">
                <Shield size={14} />
                Panel Admin
              </a>
            )}

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-neutral-200" />
                <button onClick={logout} className="text-neutral-500 hover:text-red-600 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="btn-cultural btn-primary"
              >
                <LogIn size={18} />
                Acceso Admin
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-neutral-600 p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-neutral-200 absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#inicio" className="block px-3 py-4 text-base font-medium text-neutral-700 border-b border-neutral-50 border-dotted" onClick={() => setIsMenuOpen(false)}>Inicio</a>
              <a href="#eventos" className="block px-3 py-4 text-base font-medium text-neutral-700 border-b border-neutral-50 border-dotted" onClick={() => setIsMenuOpen(false)}>Eventos</a>
              <a href="#nosotros" className="block px-3 py-4 text-base font-medium text-neutral-700 border-b border-neutral-50 border-dotted" onClick={() => setIsMenuOpen(false)}>Cultura</a>
              <div className="pt-4 flex flex-col gap-4">
                {user ? (
                  <button onClick={logout} className="btn-cultural border border-red-200 text-red-600">Cerrar Sesión</button>
                ) : (
                  <button onClick={login} className="btn-cultural btn-primary">Iniciar Sesión</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
