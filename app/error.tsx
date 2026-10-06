'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Filet de sécurité pour les espaces membre, club et admin
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold text-foreground">Un problème est survenu</h1>
        <p className="mt-3 text-muted-foreground">
          L&apos;affichage a échoué. Réessayez ; si le problème persiste, contactez l&apos;administrateur.
        </p>
        <Button onClick={reset} className="mt-8 gap-2"><RefreshCw className="h-4 w-4" /> Réessayer</Button>
        {error.digest && <p className="mt-6 text-xs text-muted-foreground">Référence : {error.digest}</p>}
      </div>
    </div>
  );
}
