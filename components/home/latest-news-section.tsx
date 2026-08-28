'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Clock, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const latestNews = [
  {
    id: '2',
    title: 'Stage de perfectionnement avec les moines Shaolin',
    excerpt: 'Un stage exceptionnel de 3 jours animé par les grands Maîtres directement venus du Temple Shaolin de Chine.',
    category: 'EVENEMENT',
    publishedAt: '2026-04-10',
    readTime: '3 min',
  },
  {
    id: '3',
    title: 'Médailles au Championnat d\'Afrique 2023',
    excerpt: 'L\'ADSS décroche 5 médailles au Championnat d\'Afrique, confirmant sa place parmi les meilleures délégations du continent.',
    category: 'COMPETITION',
    publishedAt: '2023-11-20',
    readTime: '5 min',
  },
  {
    id: '4',
    title: 'Ouverture d\'un nouveau club à Ziguinchor',
    excerpt: 'L\'ADSS annonce l\'ouverture d\'un nouveau club affilié dans la région de Ziguinchor, renforçant sa présence au Sénégal.',
    category: 'ACTUALITE',
    publishedAt: '2026-03-05',
    readTime: '2 min',
  },
];

const categoryColors: Record<string, string> = {
  COMPETITION:  'bg-accent text-accent-foreground',
  EVENEMENT:    'bg-primary text-primary-foreground',
  ACTUALITE:    'bg-secondary text-secondary-foreground border border-border',
  INAUGURATION: 'bg-accent text-accent-foreground',
};

const categoryLabels: Record<string, string> = {
  COMPETITION:  'Compétition',
  EVENEMENT:    'Événement',
  ACTUALITE:    'Actualité',
  INAUGURATION: 'Inauguration',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─── Featured video card ──────────────────────────────────────────────────────

function FeaturedVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <motion.div variants={FADE_IN_UP} className="mb-10">
      <div className="overflow-hidden rounded-2xl border border-accent/20 bg-card shadow-navy">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary/50" />

        <div className="grid lg:grid-cols-[1fr_420px]">
          {/* Video player */}
          <div
            className="group relative aspect-video cursor-pointer overflow-hidden bg-primary lg:aspect-auto lg:min-h-[300px]"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src="/videos/inauguration-siege-adss.mp4"
              className="h-full w-full object-cover"
              muted
              playsInline
              onEnded={() => setPlaying(false)}
            />

            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-primary/40 transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

            {/* Play / Pause button */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/60 bg-white/10 backdrop-blur-sm transition-all hover:scale-110 hover:border-accent hover:bg-accent/20">
                <Play className={`h-7 w-7 text-white ${playing ? 'ml-0' : 'ml-1'}`} fill="white" />
              </div>
            </div>

            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* LIVE badge */}
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-gold">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-foreground" />
                INAUGURATION
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between p-8">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate('2026-04-26')}</span>
              </div>

              <h3 className="mb-4 font-serif text-2xl font-bold leading-snug text-foreground">
                L&apos;ADSS dispose d&apos;un siège entièrement équipé
              </h3>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Moment historique pour l&apos;Association Disciples Shaolin Si Sénégal —
                inauguration officielle du nouveau siège, entièrement équipé grâce au soutien
                de <strong className="text-foreground">Mangane Holding</strong> (10 millions FCFA).
                Une nouvelle ère pour le Shaolin au Sénégal.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {['Inauguration', 'Siège ADSS', 'Mangane Holding'].map((tag) => (
                  <span key={tag} className="rounded-full border border-accent/25 bg-accent/8 px-3 py-0.5 text-xs font-medium text-accent">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-border/60 pt-6">
              <button
                onClick={togglePlay}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                {playing ? 'Mettre en pause' : 'Regarder la vidéo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function LatestNewsSection() {
  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div>
            <motion.span
              variants={FADE_IN_UP}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-4 py-1.5 text-sm font-medium text-accent"
            >
              <span className="font-serif text-base">新</span>
              Actualités
            </motion.span>
            <motion.h2
              variants={FADE_IN_UP}
              className="font-serif text-3xl font-bold text-foreground md:text-4xl"
            >
              Dernières nouvelles
            </motion.h2>
          </div>
          <motion.div variants={FADE_IN_UP}>
            <Button asChild variant="outline">
              <Link href="/actualites">
                Toutes les actualités
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Featured video */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeaturedVideoCard />

          {/* News cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((article) => (
              <motion.div key={article.id} variants={FADE_IN_UP}>
                <Link href={`/actualites/${article.id}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10">
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-5xl text-primary/20">少林</span>
                      </div>
                      <Badge className={`absolute left-4 top-4 ${categoryColors[article.category] ?? 'bg-secondary'}`}>
                        {categoryLabels[article.category] ?? article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
