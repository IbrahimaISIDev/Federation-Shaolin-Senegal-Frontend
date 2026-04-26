'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Album = { id: string; label: string; count: number };

type Photo = {
  src: string;
  alt: string;
  album: string;
  title: string;
};

const albums: Album[] = [
  { id: 'tous', label: 'Tous', count: 0 },
  { id: 'stages', label: 'Stages & Duanwei', count: 8 },
  { id: 'delegation', label: 'Délégation Temple', count: 9 },
  { id: 'ceremonies', label: 'Cérémonies', count: 5 },
];

const photos: Photo[] = [
  // Stages & Duanwei
  { src: '/images/stages/remise-diplomes-groupe.jpeg', alt: 'Remise des diplômes — groupe', title: 'Remise de diplômes', album: 'stages' },
  { src: '/images/stages/pratiquants-certificats.jpeg', alt: 'Pratiquants avec leurs certificats', title: 'Certificats Duanwei', album: 'stages' },
  { src: '/images/stages/groupe-combat-duanwei.jpeg', alt: 'Groupe — combat et Duanwei', title: 'Combat & Duanwei', album: 'stages' },
  { src: '/images/stages/cloture-salut-maitres.jpeg', alt: 'Clôture du stage — salut aux maîtres', title: 'Clôture de stage', album: 'stages' },
  { src: '/images/stages/moine-pratiquants-exterieur.jpeg', alt: 'Moine et pratiquants à l\'extérieur', title: 'Stage extérieur', album: 'stages' },
  { src: '/images/stages/moine-pratiquants-salle.jpeg', alt: 'Moine et pratiquants en salle', title: 'Stage en salle', album: 'stages' },
  { src: '/images/stages/pratiquants-tenue-grise.jpeg', alt: 'Pratiquants en tenue grise', title: 'Pratiquants', album: 'stages' },
  { src: '/images/stages/moine-pratiquants-stade.jpeg', alt: 'Moine et pratiquants au stade', title: 'Stage au stade', album: 'stages' },
  // Délégation Temple Shaolin
  { src: '/images/delegation/delegation-banniere-temple.jpeg', alt: 'Délégation ADSS devant le Temple Shaolin', title: 'Temple Shaolin', album: 'delegation' },
  { src: '/images/delegation/aeroport-drapeaux-chine-senegal.jpeg', alt: 'Accueil à l\'aéroport — drapeaux Chine & Sénégal', title: 'Accueil officiel', album: 'delegation' },
  { src: '/images/delegation/aeroport-moines-banniere.jpeg', alt: 'Moines à l\'aéroport — bannière', title: 'Moines à l\'aéroport', album: 'delegation' },
  { src: '/images/delegation/aeroport-moines-noir-banniere.jpeg', alt: 'Moines à l\'aéroport — tenue noire', title: 'Moines — tenue noire', album: 'delegation' },
  { src: '/images/delegation/aeroport-moines-gros-plan.jpeg', alt: 'Moines à l\'aéroport — gros plan', title: 'Moines — gros plan', album: 'delegation' },
  { src: '/images/delegation/arrivee-aeroport-moines.jpeg', alt: 'Arrivée des moines à l\'aéroport', title: 'Arrivée des moines', album: 'delegation' },
  { src: '/images/delegation/maitre-ngom-aeroport.jpeg', alt: 'Maître Ngom à l\'aéroport', title: 'Maître Ngom', album: 'delegation' },
  { src: '/images/delegation/delegation-drapeaux.jpeg', alt: 'Délégation avec les drapeaux', title: 'Délégation officielle', album: 'delegation' },
  { src: '/images/delegation/moines-interieur.jpeg', alt: 'Moines à l\'intérieur', title: 'Moines — intérieur', album: 'delegation' },
  // Cérémonies & Officiel
  { src: '/images/ceremonies/maitre-ngom-decoration-trio.jpeg', alt: 'Maître Ngom — décoration officielle (trio)', title: 'Décoration officielle', album: 'ceremonies' },
  { src: '/images/ceremonies/foule-pratiquants.jpeg', alt: 'Foule de pratiquants', title: 'Rassemblement', album: 'ceremonies' },
  { src: '/images/ceremonies/partenariat-tecno-cheque.jpeg', alt: 'Remise du chèque — partenariat Tecno', title: 'Partenariat Tecno', album: 'ceremonies' },
  { src: '/images/ceremonies/remise-trophee.jpeg', alt: 'Remise d\'un trophée', title: 'Remise de trophée', album: 'ceremonies' },
  { src: '/images/ceremonies/maitre-ngom-decoration-duo.jpeg', alt: 'Maître Ngom — décoration officielle (duo)', title: 'Cérémonie officielle', album: 'ceremonies' },
  { src: '/images/ceremonies/maitre-ngom-moine-shaolin.jpeg', alt: 'Maître Ngom aux côtés d\'un moine Shaolin', title: 'Maître Ngom & Moine Shaolin', album: 'ceremonies' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState('tous');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeAlbum === 'tous' ? photos : photos.filter((p) => p.album === activeAlbum);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + filtered.length) % filtered.length));
  const next = () => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % filtered.length));

  const albumsWithCount = albums.map((a) =>
    a.id === 'tous' ? { ...a, count: photos.length } : a
  );

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
        <Image
          src="/images/ceremonies/foule-pratiquants.jpeg"
          alt="Pratiquants ADSS"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-primary/85" />
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="container relative mx-auto px-4 text-center"
        >
          <motion.span variants={FADE_IN_UP}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          >
            <Images className="h-3.5 w-3.5" />
            {photos.length} photos
          </motion.span>
          <motion.h1 variants={FADE_IN_UP} className="font-serif text-4xl font-bold text-white md:text-5xl">
            Galerie
          </motion.h1>
          <motion.div variants={FADE_IN_UP} className="my-4 flex justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          </motion.div>
          <motion.p variants={FADE_IN_UP} className="mx-auto max-w-xl text-base text-white/65">
            Stages avec les moines Shaolin, délégations au Temple, compétitions et cérémonies officielles.
          </motion.p>
        </motion.div>
      </section>

      {/* Album filter */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
          {albumsWithCount.map((album) => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(album.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeAlbum === album.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {album.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeAlbum === album.id ? 'bg-white/20' : 'bg-muted'}`}>
                {album.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="container mx-auto px-4 py-10">
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 translate-y-1 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.title}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
          >
            <button
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative mx-16 flex max-h-[85vh] max-w-5xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ maxHeight: '75vh' }}>
                <Image
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].alt}
                  width={1200}
                  height={800}
                  className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
                  priority
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold text-white">{filtered[lightboxIndex].title}</p>
                <p className="mt-1 text-sm text-white/50">{lightboxIndex + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
