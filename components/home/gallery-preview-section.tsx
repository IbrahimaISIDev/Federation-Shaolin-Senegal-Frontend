'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Images } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';
import { mediaApi } from '@/lib/api/media';

export function GalleryPreviewSection() {
  // 5 dernières photos publiées depuis l'admin (la 1re en grand format)
  const { data } = useQuery({
    queryKey: ['gallery', 'public', 'preview'],
    queryFn: () => mediaApi.publicGallery({ limit: 5 }),
  });
  const photos = (data?.data ?? []).map((p, i) => ({
    id: p.id,
    src: p.url,
    alt: p.title ?? 'Photo ADSS',
    label: p.title ?? '',
    span: i === 0 ? 'col-span-2 row-span-2' : '',
  }));

  if (data && photos.length === 0) return null; // galerie vide : section masquée

  return (
    <section className="py-16 lg:py-20">
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="container mx-auto px-4"
      >
        {/* Header */}
        <motion.div variants={FADE_IN_UP} className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-4 py-1.5 text-sm font-medium text-accent">
            <Images className="h-3.5 w-3.5" />
            Galerie photos
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Nos moments forts
          </h2>
          <div className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Stages avec les moines Shaolin, délégations officielles, compétitions et cérémonies — les moments qui font notre histoire.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={FADE_IN_UP}
          className="grid grid-cols-2 grid-rows-2 gap-3 md:grid-cols-3 md:grid-rows-2"
          style={{ height: 'clamp(340px, 50vw, 560px)' }}
        >
          {photos.length === 0 && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`animate-pulse rounded-xl bg-muted ${i === 0 ? 'col-span-2 row-span-2' : ''}`} />
          ))}
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-xl ${photo.span}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 translate-y-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {photo.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={FADE_IN_UP} className="mt-8 flex justify-center">
          <Link
            href="/galerie"
            className="group inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-6 py-2.5 text-sm font-semibold text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
          >
            Voir toute la galerie
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
