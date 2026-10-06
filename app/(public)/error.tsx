'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Erreur inattendue sur une page publique : message clair et moyen de réessayer
// (l'en-tête et le pied de page du site restent affichés).
export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold text-foreground">Un problème est survenu</h1>
        <p className="mt-3 text-muted-foreground">
          Cette page n&apos;a pas pu s&apos;afficher. Vérifiez votre connexion internet puis réessayez.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="gap-2"><RefreshCw className="h-4 w-4" /> Réessayer</Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/"><Home className="h-4 w-4" /> Accueil</Link>
          </Button>
        </div>
        {error.digest && <p className="mt-6 text-xs text-muted-foreground">Référence : {error.digest}</p>}
      </div>
    </div>
  );
}
