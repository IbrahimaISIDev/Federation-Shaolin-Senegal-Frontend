'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaiementEchecPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const demandeId = searchParams.get('id') ?? '';

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <XCircle className="w-20 h-20 text-destructive mx-auto" />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Paiement non abouti</h1>
          <p className="text-muted-foreground">
            Le paiement n&apos;a pas été complété. Votre demande d&apos;affiliation
            est sauvegardée — vous pouvez réessayer.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left space-y-1">
          <p className="font-semibold">Causes possibles :</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Solde insuffisant</li>
            <li>Session expirée (délai dépassé)</li>
            <li>Paiement annulé</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {demandeId && (
            <Button
              className="w-full gap-2"
              onClick={() => router.push(`/affiliation/paiement?id=${demandeId}`)}
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer le paiement
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => router.push('/affiliation')}
          >
            <ArrowLeft className="w-4 h-4" />
            Revenir au formulaire
          </Button>
        </div>
      </div>
    </div>
  );
}
