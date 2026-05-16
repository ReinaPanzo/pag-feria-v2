import React, { useState, useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { EventEntity, EventService, CategoryService, CategoryEntity } from '@/src/services/eventService';
import { Plus, Trash2, Edit3, X, Image as ImageIcon, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPanel: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [isAddingCategoryMode, setIsAddingCategoryMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [newEvent, setNewEvent] = useState<Omit<EventEntity, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    location: '',
    category: '',
    imageUrl: '',
    isFeatured: false
  });

  const loadCategories = async () => {
    const cats = await CategoryService.getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    const unsubEvents = EventService.subscribeToEvents(setEvents);
    loadCategories();
    return () => { unsub(); unsubEvents(); };
  }, []);

  const isAdmin = 
    user?.email === 'reina_panzo_isc@tehuipango.gob.mx' || 
    user?.email === 'reina_panzo_isc@zongolica.tecnm.mx' ||
    user?.email === 'fctprogramer.2021@gmail.com';

  if (!isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await EventService.addEvent(newEvent);
      setNewEvent({
        title: '',
        description: '',
        date: new Date(),
        location: '',
        category: '',
        imageUrl: '',
        isFeatured: false
      });
      setIsAddingMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSubmitting(true);
    try {
      await CategoryService.addCategory({ name: newCategoryName });
      setNewCategoryName('');
      setIsAddingCategoryMode(false);
      await loadCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      await EventService.deleteEvent(id);
    }
  };

  return (
    <section id="admin" className="py-24 px-4 bg-brand-blue/[0.03]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-blue text-white rounded-2xl">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-serif italic text-neutral-800">Administrar Cartelera</h2>
              <p className="text-sm border-l-2 border-brand-blue pl-3 text-neutral-500">Sesión iniciada como Admin</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddingCategoryMode(true)}
              className="btn-cultural btn-outline"
            >
              <Plus size={18} />
              Nueva Categoría
            </button>
            <button 
              onClick={() => setIsAddingMode(true)}
              className="btn-cultural btn-primary"
            >
              <Plus size={18} />
              Nuevo Evento
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-neutral-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-400">Evento</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-400">Fecha</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-400">Categoría</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={event.imageUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-neutral-800">{event.title}</span>
                      {event.isFeatured && <span className="text-[9px] bg-brand-blue text-white px-1.5 py-0.5 rounded uppercase font-bold">Featured</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {event.date.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {event.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(event.id!)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-neutral-400 italic">No hay eventos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Event Modal */}
        <AnimatePresence>
          {isAddingMode && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                onClick={() => setIsAddingMode(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
              >
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-serif italic text-neutral-800">Publicar Evento</h3>
                      <p className="text-sm text-neutral-500">Completa la información para la cartelera 2026</p>
                    </div>
                    <button onClick={() => setIsAddingMode(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Título del Evento</label>
                        <input 
                          required
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                          value={newEvent.title}
                          onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Categoría</label>
                        <select 
                          required
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                          value={newEvent.category}
                          onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                        >
                          <option value="">Seleccionar...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Descripción</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        value={newEvent.description}
                        onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Fecha y Hora</label>
                        <input 
                          required
                          type="datetime-local"
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                          onChange={e => setNewEvent({...newEvent, date: new Date(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Lugar</label>
                        <input 
                          required
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                          value={newEvent.location}
                          onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">URL de Imagen</label>
                      <div className="flex gap-2">
                        <input 
                          type="url"
                          placeholder="https://..."
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                          value={newEvent.imageUrl}
                          onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})}
                        />
                        <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400">
                          <ImageIcon size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="featured" 
                        className="w-5 h-5 accent-brand-blue"
                        checked={newEvent.isFeatured}
                        onChange={e => setNewEvent({...newEvent, isFeatured: e.target.checked})}
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-neutral-600">Marcar como evento destacado</label>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-grow btn-cultural btn-primary disabled:opacity-50"
                      >
                        {isSubmitting ? 'Publicando...' : 'Publicar Evento'}
                        <Save size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAddingMode(false)}
                        className="btn-cultural btn-outline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Category Modal */}
        <AnimatePresence>
          {isAddingCategoryMode && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                onClick={() => setIsAddingCategoryMode(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative z-10"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif italic text-neutral-800">Nueva Categoría</h3>
                      <p className="text-sm text-neutral-500">Agrega una clasificación para los eventos</p>
                    </div>
                    <button onClick={() => setIsAddingCategoryMode(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleAddCategory} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Nombre de la Categoría</label>
                      <input 
                        required
                        autoFocus
                        placeholder="Ej. Conciertos, Talleres..."
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-grow btn-cultural btn-primary disabled:opacity-50"
                      >
                        {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
                        <Save size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAddingCategoryMode(false)}
                        className="btn-cultural btn-outline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
