'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

// Mock data for latest news
const latestNews = [
  {
    id: '1',
    title: 'Championnat National de Kung Fu 2024 - Résultats',
    excerpt: 'Le championnat national s\'est tenu ce weekend à Dakar avec plus de 200 participants venus de toutes les régions.',
    category: 'COMPETITION',
    coverImage: '/images/news/championship.jpg',
    publishedAt: '2024-03-15',
    readTime: '5 min',
  },
  {
    id: '2',
    title: 'Stage de perfectionnement avec Maître Chen Wei',
    excerpt: 'Un stage exceptionnel de 3 jours animé par le grand Maître Chen Wei, directement venu du Temple Shaolin.',
    category: 'EVENEMENT',
    coverImage: '/images/news/master-class.jpg',
    publishedAt: '2024-03-10',
    readTime: '3 min',
  },
  {
    id: '3',
    title: 'Ouverture du nouveau club à Ziguinchor',
    excerpt: 'La Fédération est heureuse d\'annoncer l\'ouverture d\'un nouveau club affilié dans la région de Ziguinchor.',
    category: 'ACTUALITE',
    coverImage: '/images/news/new-club.jpg',
    publishedAt: '2024-03-05',
    readTime: '2 min',
  },
];

const categoryColors: Record<string, string> = {
  COMPETITION: 'bg-accent text-accent-foreground',
  EVENEMENT: 'bg-primary text-primary-foreground',
  ACTUALITE: 'bg-secondary text-secondary-foreground border border-border',
  FORMATION: 'bg-success text-success-foreground',
};

const categoryLabels: Record<string, string> = {
  COMPETITION: 'Compétition',
  EVENEMENT: 'Événement',
  ACTUALITE: 'Actualité',
  FORMATION: 'Formation',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function LatestNewsSection() {
  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
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

        {/* News Grid */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {latestNews.map((article, index) => (
            <motion.div key={article.id} variants={FADE_IN_UP}>
              <Link href={`/actualites/${article.id}`}>
                <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <span className="font-serif text-4xl text-primary/30">少林</span>
                    </div>
                    <Badge
                      className={`absolute left-4 top-4 ${categoryColors[article.category] || 'bg-secondary'}`}
                    >
                      {categoryLabels[article.category] || article.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="mb-2 font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
