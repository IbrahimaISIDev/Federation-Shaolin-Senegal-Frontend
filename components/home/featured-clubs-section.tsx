'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';
import { clubsApi, type Club } from '@/lib/api/clubs';

export function FeaturedClubsSection() {
  // Clubs actifs réels, les plus fournis en membres d'abord
  const { data, isLoading } = useQuery({
    queryKey: ['clubs', 'featured'],
    queryFn: () => clubsApi.list({ limit: 100 }),
  });
  const featuredClubs = [...(((data as { data?: Club[] } | undefined)?.data) ?? [])]
    .sort((a, b) => (b._count?.members ?? 0) - (a._count?.members ?? 0))
    .slice(0, 4);

  if (!isLoading && featuredClubs.length === 0) return null; // aucun club : section masquée

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.span
            variants={FADE_IN_UP}
            className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          >
            Notre réseau
          </motion.span>
          <motion.h2
            variants={FADE_IN_UP}
            className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl"
          >
            <span className="text-balance">Clubs affiliés à l&apos;Association</span>
          </motion.h2>
          <motion.p
            variants={FADE_IN_UP}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Trouvez un club près de chez vous et commencez votre parcours dans les arts martiaux Shaolin.
          </motion.p>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-muted" />
          ))}
          {featuredClubs.map((club) => (
            <motion.div key={club.id} variants={FADE_IN_UP}>
              <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                {/* Club Header with gradient */}
                <div className="relative h-24 bg-gradient-to-br from-primary to-primary/80 p-4">
                  <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">
                    {club.region.nom}
                  </Badge>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-semibold text-primary-foreground line-clamp-2">
                      {club.nom}
                    </h3>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{club.ville ?? club.region.nom}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{club._count?.members ?? 0} membre{(club._count?.members ?? 0) > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  {club.nomMaitre && (
                    <p className="mb-4 truncate text-sm text-muted-foreground">Maître {club.nomMaitre}</p>
                  )}

                  <Link
                    href={`/clubs/${club.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-accent"
                  >
                    Voir le club
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline">
            <Link href="/carte">
              Voir tous les clubs sur la carte
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
