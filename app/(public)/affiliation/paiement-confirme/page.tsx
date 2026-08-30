'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { paymentApi } from '@/lib/api/payment';

export default function PaiementConfirmePage() {
  return (
    <Suspense fallback={<PaiementConfirmeFallback />}>
      <PaiementConfirmeContent />
    </Suspense>
  );
}

function PaiementConfirmeFallback() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mx-auto" />
    </div>
  );
}

function PaiementConfirmeContent() {
  const searchParams = useSearchParams();
  const demandeId = Number(searchParams.get('id') ?? '0');

  const [info, setInfo] = useState<{
    prenom?: string; nom?: string; type?: string; montant?: number; status?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!demandeId) { setLoading(false); return; }
    paymentApi.checkStatus(demandeId)
      .then((res) => {
        const d = (res as any)?.data;
        setInfo({ prenom: d?.prenom, nom: d?.nom, type: d?.type, montant: d?.montant, status: d?.status });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [demandeId]);

  const typeLabel: Record<string, string> = {
    CLUB: 'Club', MAITRE: 'Maître', MEMBRE: 'Membre/Disciple',
  };

  // Tant qu'un admin n'a pas confirmé la réception du paiement manuel,
  // la demande reste en PENDING_PAYMENT — on l'affiche différemment.
  const awaitingVerification = info?.status === 'PENDING_PAYMENT';

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {loading ? (
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mx-auto" />
        ) : awaitingVerification ? (
          <>
            <Clock className="w-20 h-20 text-amber-500 mx-auto" />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Preuve de paiement envoyée</h1>
              {info?.prenom && (
                <p className="text-muted-foreground">
                  Merci <strong>{info.prenom} {info.nom}</strong> — nous avons bien reçu votre
                  référence de transaction et votre reçu.
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-1 text-left">
              <p className="font-semibold">Prochaine étape :</p>
              <p>
                Notre équipe va vérifier votre paiement, puis examiner votre dossier
                d&apos;affiliation {info?.type ? typeLabel[info.type] ?? '' : ''}.
              </p>
              <p>
                Vous recevrez un email de confirmation dès que votre demande sera validée,
                avec vos identifiants de connexion.
              </p>
            </div>

            <Button asChild className="w-full bg-accent hover:bg-accent/90">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Paiement confirmé !</h1>
              {info?.prenom && (
                <p className="text-muted-foreground">
                  Merci <strong>{info.prenom} {info.nom}</strong> — votre paiement de{' '}
                  <strong>{info.montant?.toLocaleString('fr-FR')} FCFA</strong> a bien été reçu.
                </p>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 space-y-1 text-left">
              <p className="font-semibold">Prochaine étape :</p>
              <p>
                Votre dossier d&apos;affiliation {info?.type ? typeLabel[info.type] ?? '' : ''} est
                maintenant en cours d&apos;examen par notre équipe.
              </p>
              <p>
                Vous recevrez un email de confirmation dès que votre demande sera validée,
                avec vos identifiants de connexion.
              </p>
            </div>

            <Button asChild className="w-full bg-accent hover:bg-accent/90">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
