import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carte des Clubs',
  description: 'Découvrez tous les clubs de l\'Association Disciples Shaolin Si Sénégal répartis dans les 14 régions du pays.',
};

import SenegalMap from '@/components/map/senegal-map';

export default function CartePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="border-b bg-primary px-4 py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-balance font-serif text-4xl font-bold md:text-5xl">
            Carte des Clubs
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Explorez notre réseau de clubs à travers les 14 régions du Sénégal.
            Cliquez sur un marqueur pour découvrir les détails de chaque région.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <SenegalMap showLegend={true} />
        </div>
      </section>

      {/* Regions Grid */}
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-serif text-3xl font-bold">
            Toutes les régions
          </h2>
          <RegionsGrid />
        </div>
      </section>
    </main>
  );
}

import { SENEGAL_REGIONS } from '@/lib/data/senegal-regions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users } from 'lucide-react';

function RegionsGrid() {
  // Sort regions by member count (descending)
  const sortedRegions = [...SENEGAL_REGIONS].sort((a, b) => b.memberCount - a.memberCount);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedRegions.map((region, index) => (
        <Card
          key={region.id}
          className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-accent/30"
        >
          {index < 3 && (
            <div className="absolute right-3 top-3">
              <Badge variant="default" className="bg-accent text-accent-foreground">
                Top {index + 1}
              </Badge>
            </div>
          )}
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {region.code}
              </Badge>
              <h3 className="font-semibold">{region.name}</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{region.clubCount}</strong> clubs
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{region.memberCount}</strong> membres
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
