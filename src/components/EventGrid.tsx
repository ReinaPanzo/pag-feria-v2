import React, { useState, useEffect } from 'react';
import { EventEntity, EventService, CategoryEntity, CategoryService } from '@/src/services/eventService';
import { Calendar, MapPin, Tag, Search, X, Clock, Navigation, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EventGrid: React.FC = () => {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventEntity | null>(null);

  useEffect(() => {
    const unsubscribe = EventService.subscribeToEvents((data) => {
      setEvents(data);
      setIsLoading(false);
    });

    CategoryService.getCategories().then(setCategories);

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter(event => {
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    const location = event.location?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesCategory =
      selectedCategory === 'all' || event.category === selectedCategory;

    const matchesSearch =
      title.includes(search) ||
      description.includes(search) ||
      location.includes(search);

    return matchesCategory && matchesSearch;
  });



  const openGoogleMaps = (event: EventEntity) => {
  if (event.latitude && event.longitude) {
    window.open(
      `https://www.google.com/maps?q=${event.latitude},${event.longitude}`,
      '_blank'
    );
    return;
  }

  if (event.location) {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`,
      '_blank'
    );
  }
};




  const openMap = (event: EventEntity) => {
    if (!event.latitude || !event.longitude) return;

    window.open(
      `https://www.google.com/maps?q=${event.latitude},${event.longitude}`,
      '_blank'
    );
  };

  return (
    <section
      id="eventos"
      className="relative py-24 px-4 bg-gradient-to-b from-amber-50 via-white to-orange-50 overflow-hidden"
    >
      {/* Decoración suave de fondo */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-0" />

      <div className="relative max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-[0.2em] mb-5">
            <Star size={14} />
            Programa de la Feria
          </span>

          <h2 className="text-4xl md:text-6xl font-serif italic text-neutral-900 leading-tight">
            Cartelera de Eventos
          </h2>

          <p className="mt-5 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
            Consulta las actividades de la feria: tradición, música, danza, gastronomía,
            carrera de caballos, voladores y eventos especiales para toda la familia.
          </p>
        </div>

        {/* Buscador y filtros */}
        <div className="bg-white/80 backdrop-blur-xl border border-amber-100 shadow-sm rounded-[32px] p-4 md:p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Buscar carrera, danza, música..."
                className="w-full pl-12 pr-4 py-4 bg-amber-50/70 rounded-2xl border border-amber-100 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all text-neutral-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                    : 'bg-white text-neutral-600 border border-amber-100 hover:border-orange-300'
                }`}
              >
                Todos
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.name
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                      : 'bg-white text-neutral-600 border border-amber-100 hover:border-orange-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-[430px] rounded-[32px] bg-white/70 border border-amber-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.article
                  layout
                  key={event.id}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group bg-white rounded-[34px] overflow-hidden border border-amber-100 shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-amber-100">
                    <img
                      src={
                        event.imageUrl ||
                        'https://images.unsplash.com/photo-1544928147-7972fc648f86?q=80&w=1000'
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-wider text-orange-700 shadow-sm">
                        {event.category}
                      </span>

                      {event.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <Star size={11} fill="currentColor" />
                          Destacado
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl md:text-3xl font-serif italic text-white leading-tight drop-shadow">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 md:p-7 flex flex-col flex-grow">
                    <div className="grid grid-cols-1 gap-3 mb-5">
                      <div className="flex items-center gap-3 text-sm text-neutral-700">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                          <Calendar size={18} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                            Fecha
                          </p>
                          <p className="font-semibold">
                            {event.date.toLocaleDateString('es-MX', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-neutral-700">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <MapPin size={18} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                            Lugar
                          </p>
                          <p className="font-semibold">{event.location}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-500 font-light leading-relaxed flex-grow">
                      {event.description.length > 135
                        ? `${event.description.substring(0, 135)}...`
                        : event.description}
                    </p>

                 <div className="mt-6 flex gap-3">
  <button
    onClick={() => setSelectedEvent(event)}
    className="flex-1 px-4 py-3 rounded-2xl bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-[0.16em] hover:bg-orange-100 transition-colors"
  >
    Detalles
  </button>

  {event.latitude && event.longitude && (
    <button
      onClick={() => openMap(event)}
      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.16em] hover:bg-orange-700 transition-colors"
    >
      <Navigation size={15} />
      Ubicación
    </button>
  )}
</div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Sin resultados */}
        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white/70 rounded-[32px] border border-amber-100 border-dashed">
            <Tag className="mx-auto mb-4 text-orange-300" size={48} />

            <h3 className="text-2xl font-serif italic text-neutral-500">
              No se encontraron eventos
            </h3>

            <p className="text-sm text-neutral-400 mt-2">
              Intenta buscar con otro nombre o selecciona otra categoría.
            </p>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="mt-5 px-5 py-3 rounded-2xl bg-orange-600 text-white text-sm font-bold"
            >
              Borrar filtros
            </button>
          </div>
        )}









<AnimatePresence>
  {selectedEvent && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo oscuro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setSelectedEvent(null)}
      />

      {/* Cuadro de detalles */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[36px] shadow-2xl"
      >
        {/* Imagen */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-[36px] bg-amber-100">
          <img
            src={selectedEvent.imageUrl || '/images/evento-default.jpg'}
            alt=""
            onError={(e) => {
              e.currentTarget.src = '/images/evento-default.jpg';
            }}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 text-neutral-800 flex items-center justify-center hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-white/95 rounded-full text-[10px] font-bold uppercase tracking-wider text-orange-700">
                {selectedEvent.category}
              </span>

              {selectedEvent.isFeatured && (
                <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                  ★ Destacado
                </span>
              )}
            </div>

            <h3 className="text-3xl md:text-5xl font-serif italic text-white drop-shadow-md">
              {selectedEvent.title}
            </h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-orange-50 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-2xl bg-white text-orange-600 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  Fecha
                </p>
                <p className="font-bold text-neutral-800">
                  {selectedEvent.date.toLocaleDateString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  Hora
                </p>
                <p className="font-bold text-neutral-800">
                  {selectedEvent.date.toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-2xl bg-white text-emerald-700 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  Lugar
                </p>
                <p className="font-bold text-neutral-800">
                  {selectedEvent.location}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-2xl font-serif italic text-neutral-900 mb-3">
              Descripción del evento
            </h4>

            <p className="text-neutral-600 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openGoogleMaps(selectedEvent)}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-neutral-900 text-white text-sm font-bold uppercase tracking-[0.16em] hover:bg-orange-700 transition-colors"
            >
              <Navigation size={18} />
              Ver en Google Maps
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              className="px-6 py-4 rounded-2xl bg-orange-50 text-orange-700 text-sm font-bold uppercase tracking-[0.16em] hover:bg-orange-100 transition-colors"
            >
              Cerrar detalles
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>












      </div>
    </section>
  );
};
