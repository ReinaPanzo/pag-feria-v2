import React, { useState, useEffect } from 'react';
import { EventEntity, EventService, CategoryEntity, CategoryService } from '@/src/services/eventService';
import { Calendar, MapPin, Tag, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EventGrid: React.FC = () => {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to events for real-time updates
    const unsubscribe = EventService.subscribeToEvents((data) => {
      setEvents(data);
      setIsLoading(false);
    });

    // Load categories
    CategoryService.getCategories().then(setCategories);

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="eventos" className="py-24 px-4 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-serif italic text-neutral-900">Calendario de Eventos</h2>
            <p className="text-neutral-500 max-w-lg font-light">
              Descubre todas las actividades que tenemos preparadas para ti. Filtra por categoría para encontrar lo que más te apasiona.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar evento..." 
                className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-clay/20 focus:border-brand-clay transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === 'all' 
                    ? 'bg-brand-blue text-white shadow-lg' 
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-brand-blue'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.name 
                      ? 'bg-brand-blue text-white shadow-lg' 
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-brand-blue'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 cultural-card animate-pulse bg-neutral-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  layout
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="cultural-card flex flex-col group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1544928147-7972fc648f86?q=80&w=1000'} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-blue shadow-sm">
                        {event.category}
                      </span>
                      {event.isFeatured && (
                        <span className="px-3 py-1 bg-brand-blue text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-brand-blue" />
                        {event.date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-brand-deep" />
                        {event.location}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-serif italic group-hover:text-brand-blue transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-neutral-500 font-light flex-grow">
                      {event.description.length > 120 
                        ? `${event.description.substring(0, 120)}...` 
                        : event.description}
                    </p>

                    <button className="pt-4 mt-auto text-xs font-bold uppercase tracking-[0.2em] text-brand-blue flex items-center gap-2 group-hover:gap-3 transition-all">
                      Detalles del Evento
                      <div className="h-1 w-0 group-hover:w-8 bg-brand-blue transition-all rounded-full" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white/20 rounded-[32px] border border-neutral-100 border-dashed">
            <Tag className="mx-auto mb-4 text-neutral-300" size={48} />
            <h3 className="text-xl font-serif text-neutral-400">No se encontraron eventos</h3>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
              className="mt-4 text-sm text-brand-clay underline"
            >
              Borrar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
