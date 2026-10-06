import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, Newspaper, Trophy, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
};

const shortcuts = [
  { href: '/actualites', label: 'Actualités', icon: Newspaper },
  { href: '/competitions', label: 'Compétitions', icon: Trophy },
  { href: '/carte', label: 'Carte des clubs', icon: MapPin },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-serif text-7xl font-bold text-accent/80">404</p>
          <p className="mt-2 font-serif text-2xl text-primary/30">迷路</p>
          <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">Cette page est introuvable</h1>
          <p className="mt-3 text-muted-foreground">
            Le lien est peut-être erroné, ou la page a été déplacée ou retirée du site.
          </p>
          <Button asChild className="mt-8 gap-2">
            <Link href="/"><Home className="h-4 w-4" /> Retour à l&apos;accueil</Link>
          </Button>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {shortcuts.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-accent" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
