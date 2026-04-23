'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

// Mock data for featured clubs
const featuredClubs = [
  {
    id: '1',
    name: 'Club Shaolin Dakar Centre',
    region: 'Dakar',
    address: 'Plateau, Dakar',
    memberCount: 120,
    disciplines: ['Kung Fu', 'Wushu', 'Tai Chi'],
    isHiring: true,
  },
  {
    id: '2',
    name: 'Dragon Rouge Thiès',
    region: 'Thiès',
    address: 'Centre-ville, Thiès',
    memberCount: 85,
    disciplines: ['Kung Fu', 'Sanda'],
    isHiring: false,
  },
  {
    id: '3',
    name: 'Temple Shaolin Saint-Louis',
    region: 'Saint-Louis',
    address: 'Île de Saint-Louis',
    memberCount: 65,
    disciplines: ['Kung Fu', 'Qi Gong'],
    isHiring: true,
  },
  {
    id: '4',
    name: 'Académie Wu Shu Kaolack',
    region: 'Kaolack',
    address: 'Médina Baye, Kaolack',
    memberCount: 45,
    disciplines: ['Wushu', 'Wing Chun'],
    isHiring: false,
  },
];

export function FeaturedClubsSection() {
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
            <span className="text-balance">Clubs affiliés à la Fédération</span>
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
          {featuredClubs.map((club) => (
            <motion.div key={club.id} variants={FADE_IN_UP}>
              <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                {/* Club Header with gradient */}
                <div className="relative h-24 bg-gradient-to-br from-primary to-primary/80 p-4">
                  {club.isHiring && (
                    <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">
                      Recrute
                    </Badge>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-semibold text-primary-foreground line-clamp-2">
                      {club.name}
                    </h3>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{club.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{club.memberCount} membres</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {club.disciplines.slice(0, 2).map((discipline) => (
                      <Badge key={discipline} variant="secondary" className="text-xs">
                        {discipline}
                      </Badge>
                    ))}
                    {club.disciplines.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{club.disciplines.length - 2}
                      </Badge>
                    )}
                  </div>
                  
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
