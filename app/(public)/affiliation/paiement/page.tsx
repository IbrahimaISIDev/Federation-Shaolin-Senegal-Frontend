'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Smartphone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PaymentProofForm } from '@/components/shared/payment-proof-form';
import { paymentApi } from '@/lib/api/payment';
import { affiliationApi } from '@/lib/api/affiliation';
import { settingsApi } from '@/lib/api/settings';
import { toast } from 'sonner';

export default function PaiementPage() {
  return (
    <Suspense fallback={<PaiementFallback />}>
      <PaiementContent />
    </Suspense>
  );
}

function PaiementFallback() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
    </div>
  );
}

const typeLabel: Record<string, string> = {
  CLUB: 'Club', MAITRE: 'Maître', MEMBRE: 'Membre/Disciple',
};

function PaiementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const demandeId = Number(searchParams.get('id') ?? '0');

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<{ prenom?: string; nom?: string; type?: string; montant?: number; status?: string } | null>(null);
  const [numbers, setNumbers] = useState<{ wave?: string | null; om?: string | null }>({});

  useEffect(() => {
    if (!demandeId) { setLoading(false); return; }
    Promise.all([
      paymentApi.checkStatus(demandeId).then((res) => (res as any)?.data),
      settingsApi.get().then((res) => res.data),
    ])
      .then(([status, settings]) => {
        setInfo(status);
        setNumbers({ wave: settings.paymentWaveNumber, om: settings.paymentOMNumber });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [demandeId]);

  const handleSubmit = async (data: { reference: string; preuveUrl: string }) => {
    try {
      await affiliationApi.submitPaymentProof(demandeId, {
        referenceManuelle: data.reference,
        preuvePaiementUrl: data.preuveUrl,
      });
      router.push(`/affiliation/paiement-confirme?id=${demandeId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur lors de l'envoi. Réessayez.");
    }
  };

  // Déjà traité (preuve déjà confirmée par un admin) — on redirige vers la confirmation.
  useEffect(() => {
    if (!loading && info?.status && info.status !== 'PENDING_PAYMENT') {
      router.replace(`/affiliation/paiement-confirme?id=${demandeId}`);
    }
  }, [loading, info?.status, demandeId, router]);

  if (!demandeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Lien de paiement invalide.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl">Paiement de l&apos;affiliation</CardTitle>
          <CardDescription>
            {info?.type ? `Affiliation ${typeLabel[info.type] ?? ''}` : 'Réglez les frais pour finaliser votre demande'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {info?.montant != null && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Montant à régler</p>
                  <p className="text-3xl font-bold text-accent">{info.montant.toLocaleString('fr-FR')} FCFA</p>
                </div>
              )}

              <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm">
                <div className="flex items-start gap-2 font-medium text-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Comment payer
                </div>
                <ol className="ml-6 list-decimal space-y-1 text-muted-foreground">
                  {numbers.wave && (
                    <li>
                      Envoyez le montant via <strong className="text-foreground">Wave</strong> au{' '}
                      <strong className="text-foreground">{numbers.wave}</strong>
                    </li>
                  )}
                  {numbers.om && (
                    <li>
                      Ou via <strong className="text-foreground">Orange Money</strong> au{' '}
                      <strong className="text-foreground">{numbers.om}</strong>
                    </li>
                  )}
                  <li>Conservez la référence de la transaction et une capture d&apos;écran/photo du reçu</li>
                  <li>Renseignez-les ci-dessous</li>
                </ol>
                {!numbers.wave && !numbers.om && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    Contactez l&apos;association pour connaître les numéros de paiement.
                  </p>
                )}
              </div>

              <PaymentProofForm onSubmit={handleSubmit} />
            </>
          )}

          <div className="border-t pt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1"
              onClick={() => router.push('/affiliation')}
            >
              <ArrowLeft className="w-4 h-4" />
              Revenir au formulaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
