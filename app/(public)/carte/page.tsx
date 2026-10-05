import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carte des Clubs',
  description: 'Découvrez tous les clubs de l\'Association Disciples Shaolin Si Sénégal répartis dans les 14 régions du pays.',
};

import SenegalMap from '@/components/map/senegal-map';
import { RegionsGrid } from '@/components/map/regions-grid';

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
