'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Smartphone, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { paymentApi } from '@/lib/api/payment';

type Provider = 'WAVE' | 'ORANGE_MONEY' | null;

const POLL_INTERVAL = 3000;
const MAX_POLLS = 40;

export default function PaiementPage() {
  return (
    <Suspense fallback={null}>
      <PaiementContent />
    </Suspense>
  );
}

function PaiementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const demandeId = Number(searchParams.get('id') ?? '0');

  const [provider, setProvider] = useState<Provider>(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);
  const [polling, setPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling — starts once a provider URL is opened
  useEffect(() => {
    if (!polling || !demandeId) return;

    pollRef.current = setInterval(async () => {
      setPollCount((n) => {
        if (n >= MAX_POLLS) {
          clearInterval(pollRef.current!);
          setPolling(false);
        }
        return n + 1;
      });

      try {
        const res = await paymentApi.checkStatus(demandeId);
        const data = (res as any)?.data;
        if (data?.paid) {
          clearInterval(pollRef.current!);
          router.push(`/affiliation/paiement-confirme?id=${demandeId}`);
        }
      } catch {
        // silent — keep polling
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollRef.current!);
  }, [polling, demandeId, router]);

  const initiate = async (p: Provider) => {
    if (!p || !demandeId) return;
    setError('');
    setLoading(true);
    try {
      if (p === 'WAVE') {
        const res = await paymentApi.initiateWave(demandeId);
        const url = (res as any)?.data?.checkoutUrl;
        setPaymentUrl(url);
        setProvider('WAVE');
      } else {
        const res = await paymentApi.initiateOm(demandeId);
        const url = (res as any)?.data?.paymentUrl;
        setPaymentUrl(url);
        setProvider('ORANGE_MONEY');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Impossible d\'initialiser le paiement. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const openPayment = () => {
    window.open(paymentUrl, '_blank');
    setOpened(true);
    setPolling(true);
  };

  const reset = () => {
    setProvider(null);
    setPaymentUrl('');
    setOpened(false);
    setPolling(false);
    setPollCount(0);
    setError('');
    if (pollRef.current) clearInterval(pollRef.current);
  };

  if (!demandeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Lien de paiement invalide.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl">Paiement de l&apos;affiliation</CardTitle>
          <CardDescription>
            Choisissez votre méthode de paiement pour finaliser votre demande.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Step 1 — provider selection */}
          {!provider && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-center text-muted-foreground">
                Sélectionnez un mode de paiement
              </p>

              <Button
                className="w-full h-14 bg-[#1BB5FF] hover:bg-[#1BB5FF]/90 text-white font-semibold text-base gap-3"
                disabled={loading}
                onClick={() => initiate('WAVE')}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
                Payer avec Wave
              </Button>

              <Button
                className="w-full h-14 bg-[#FF6600] hover:bg-[#FF6600]/90 text-white font-semibold text-base gap-3"
                disabled={loading}
                onClick={() => initiate('ORANGE_MONEY')}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
                Payer avec Orange Money
              </Button>

              {error && (
                <p className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-lg">{error}</p>
              )}
            </div>
          )}

          {/* Step 2 — open payment URL */}
          {provider && paymentUrl && (
            <div className="space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${
                provider === 'WAVE' ? 'bg-[#1BB5FF]/10' : 'bg-[#FF6600]/10'
              }`}>
                <Smartphone className={`w-8 h-8 ${provider === 'WAVE' ? 'text-[#1BB5FF]' : 'text-[#FF6600]'}`} />
              </div>

              <p className="text-sm text-center text-muted-foreground">
                {provider === 'WAVE'
                  ? 'Cliquez ci-dessous pour ouvrir Wave et confirmer le paiement.'
                  : 'Cliquez ci-dessous pour accéder à la page de paiement Orange Money.'}
              </p>

              <ol className="space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
                <li>Appuyez sur le bouton de paiement</li>
                <li>Confirmez le montant et validez</li>
                <li>Revenez sur cette page — la confirmation est automatique</li>
              </ol>

              <Button
                className={`w-full font-semibold h-12 text-base text-white ${
                  provider === 'WAVE'
                    ? 'bg-[#1BB5FF] hover:bg-[#1BB5FF]/90'
                    : 'bg-[#FF6600] hover:bg-[#FF6600]/90'
                }`}
                onClick={openPayment}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                {provider === 'WAVE' ? 'Ouvrir Wave' : 'Ouvrir Orange Money'}
              </Button>

              {opened && (
                <div className="text-center">
                  {polling ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      En attente de confirmation…
                    </div>
                  ) : pollCount >= MAX_POLLS ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Délai dépassé. Si vous avez payé, vérifiez votre statut.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => { setPollCount(0); setPolling(true); }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Vérifier à nouveau
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}

              <Button variant="ghost" size="sm" className="w-full text-muted-foreground gap-1" onClick={reset}>
                ← Changer de méthode de paiement
              </Button>
            </div>
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
