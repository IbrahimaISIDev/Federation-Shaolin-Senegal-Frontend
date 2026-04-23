'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react';

// Mock gallery data
const mockGallery = {
  categories: ['Tous', 'Compétitions', 'Stages', 'Entraînements', 'Événements'],
  items: [
    { id: '1', type: 'image', category: 'Compétitions', title: 'Championnat National 2023', year: '2023' },
    { id: '2', type: 'image', category: 'Stages', title: 'Stage Maître Chen', year: '2023' },
    { id: '3', type: 'video', category: 'Entraînements', title: 'Démonstration Tai Chi', year: '2024' },
    { id: '4', type: 'image', category: 'Compétitions', title: 'Tournoi Inter-Clubs', year: '2023' },
    { id: '5', type: 'image', category: 'Événements', title: 'Journée Portes Ouvertes', year: '2024' },
    { id: '6', type: 'image', category: 'Entraînements', title: 'Cours de Kung Fu', year: '2024' },
    { id: '7', type: 'image', category: 'Compétitions', title: 'Finale Sanda', year: '2023' },
    { id: '8', type: 'video', category: 'Stages', title: 'Stage Wushu International', year: '2023' },
    { id: '9', type: 'image', category: 'Événements', title: 'Cérémonie de Remise des Grades', year: '2024' },
    { id: '10', type: 'image', category: 'Entraînements', title: 'Séance Qi Gong', year: '2024' },
    { id: '11', type: 'image', category: 'Compétitions', title: 'Podium Taolu', year: '2023' },
    { id: '12', type: 'image', category: 'Stages', title: 'Formation Arbitres', year: '2024' },
  ],
};

// Placeholder colors for demo
const placeholderColors = [
  'from-primary/30 to-accent/30',
  'from-accent/30 to-primary/30',
  'from-primary/20 to-primary/40',
  'from-accent/20 to-accent/40',
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedItem, setSelectedItem] = useState<typeof mockGallery.items[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = activeCategory === 'Tous'
    ? mockGallery.items
    : mockGallery.items.filter((item) => item.category === activeCategory);

  const openLightbox = (item: typeof mockGallery.items[0]) => {
    setSelectedItem(item);
    setCurrentIndex(filteredItems.findIndex((i) => i.id === item.id));
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
      : (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Galerie
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Revivez les moments forts de nos événements, compétitions et entraînements.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {mockGallery.categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? 'bg-primary' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openLightbox(item)}
                >
                  {/* Placeholder */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${placeholderColors[index % placeholderColors.length]} flex items-center justify-center`}
                  >
                    {item.type === 'video' ? (
                      <Play className="w-12 h-12 text-foreground/30" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-foreground/30" />
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Badge variant="secondary" className="mb-2">
                        {item.category}
                      </Badge>
                      <h3 className="text-white font-medium text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-xs mt-1">{item.year}</p>
                    </div>
                  </div>

                  {/* Video indicator */}
                  {item.type === 'video' && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun élément dans cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content */}
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[80vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Placeholder for image/video */}
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/30 rounded-lg flex items-center justify-center">
                {selectedItem.type === 'video' ? (
                  <div className="text-center">
                    <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70">Vidéo: {selectedItem.title}</p>
                  </div>
                ) : (
                  <ImageIcon className="w-16 h-16 text-white/50" />
                )}
              </div>

              {/* Info */}
              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-medium">{selectedItem.title}</h3>
                <p className="text-white/60 mt-1">
                  {selectedItem.category} • {selectedItem.year}
                </p>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentIndex + 1} / {filteredItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
