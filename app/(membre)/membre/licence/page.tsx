'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  Award,
  AlertCircle,
  Clock,
  Loader2,
  MapPin,
  Smartphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PaymentProofForm } from '@/components/shared/payment-proof-form';
import { membersApi, licensesApi } from '@/lib/api';
import { settingsApi } from '@/lib/api/settings';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  ACTIVE:    { label: 'Active',      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  PENDING:   { label: 'En attente',  color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',         icon: Clock },
  EXPIRED:   { label: 'Expirée',     color: 'bg-muted text-muted-foreground',                                               icon: AlertCircle },
  SUSPENDED: { label: 'Suspendue',   color: 'bg-destructive/10 text-destructive',                                           icon: AlertCircle },
};

export default function LicensePage() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [renewProvider, setRenewProvider] = useState<'WAVE' | 'ORANGE_MONEY' | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['member', 'profile'],
    queryFn: () => membersApi.me(),
    staleTime: 5 * 60 * 1000,
  });

  const member = (data as any)?.data;
  const licenses: any[] = member?.licenses ?? [];
  // La licence en vigueur (ACTIVE/EXPIRED) est distincte d'un éventuel
  // renouvellement en cours (nouvelle licence PENDING avec un paiement associé).
  const activeLicense = licenses.find((l) => l.status !== 'PENDING') ?? licenses[0];
  const pendingRenewal = licenses.find((l) => l.status === 'PENDING' && l.payments?.[0]);
  const renewalPayment = pendingRenewal?.payments?.[0];

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
    staleTime: 5 * 60 * 1000,
  });
  const paymentNumbers = settingsData?.data;

  const renewMutation = useMutation({
    mutationFn: (provider: 'WAVE' | 'ORANGE_MONEY') => membersApi.renewLicense(provider),
    onSuccess: (_res, provider) => {
      setRenewProvider(provider);
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Erreur lors du renouvellement'),
  });

  const submitProofMutation = useMutation({
    mutationFn: (data: { reference: string; preuveUrl: string }) =>
      membersApi.submitRenewalProof(pendingRenewal!.id, { transactionRef: data.reference, preuveUrl: data.preuveUrl }),
    onSuccess: () => {
      toast.success('Preuve envoyée — en attente de vérification par l\'association');
      queryClient.invalidateQueries({ queryKey: ['member', 'profile'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur lors de l'envoi de la preuve"),
  });

  const statusKey = activeLicense?.status ?? 'PENDING';
  const statusInfo = statusConfig[statusKey] ?? statusConfig['PENDING'];
  const numeroLicence = activeLicense
    ? `SHN-${activeLicense.annee}-${String(activeLicense.id).padStart(5, '0')}`
    : null;

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ['license', 'qrcode', activeLicense?.id],
    queryFn: () => licensesApi.getQrCode(activeLicense!.id),
    enabled: showQRCode && !!activeLicense?.id && activeLicense.status === 'ACTIVE',
    staleTime: 10 * 60 * 1000,
  });

  const qrDataUrl = (qrData as any)?.data?.qrDataUrl;

  const handleDownloadPDF = () => {
    if (!activeLicense?.id) return;
    window.open(licensesApi.getPdfUrl(activeLicense.id), '_blank');
  };

  const formatDate = (d: string | Date | undefined | null) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDaysUntilExpiry = () => {
    const expiry = activeLicense?.dateFin
      ? new Date(activeLicense.dateFin)
      : new Date(new Date().getFullYear(), 11, 31);
    return Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / (1000 * 3600 * 24)));
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">

      {/* Header */}
      <motion.div variants={FADE_IN_UP} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Ma Licence</h1>
          <p className="text-muted-foreground">Consultez et téléchargez votre licence numérique</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={!activeLicense || activeLicense.status !== 'ACTIVE'}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Carte numérique */}
        <motion.div variants={FADE_IN_UP}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Face principale */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 p-6 text-primary-foreground">
                {/* Motif décoratif */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>

                <div className="relative">
                  {/* En-tête */}
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                        Association Disciples Shaolin Si Sénégal
                      </p>
                      <p className="text-xl font-bold">Licence Officielle</p>
                    </div>
                    <Badge className={`border-none ${statusInfo.color}`}>
                      <statusInfo.icon className="mr-1 h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Numéro de licence */}
                  {numeroLicence && (
                    <div className="mb-5">
                      <p className="text-xs text-primary-foreground/60">Numéro de licence</p>
                      <p className="text-2xl font-bold tracking-widest">{numeroLicence}</p>
                    </div>
                  )}

                  {/* Photo + infos */}
                  <div className="flex gap-4">
                    {/* Photo */}
                    <div className="shrink-0">
                      <Avatar className="h-20 w-20 rounded-xl border-2 border-accent/60">
                        <AvatarImage src={member?.photoUrl ?? undefined} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-primary-foreground/10 text-xl font-bold text-primary-foreground">
                          {member?.prenom?.[0]}{member?.nom?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Infos */}
                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-lg font-bold truncate">
                        {member?.prenom?.toUpperCase()} {member?.nom?.toUpperCase()}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <p className="text-xs text-primary-foreground/60">Club</p>
                          <p className="font-medium truncate">{member?.club?.nom ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-foreground/60">Région</p>
                          <p className="font-medium truncate">{member?.club?.region?.nom ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-foreground/60">Discipline</p>
                          <p className="font-medium truncate">{member?.discipline ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-foreground/60">Grade</p>
                          <p className="font-medium truncate">{member?.grade ?? 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validité */}
                  <div className="mt-5 flex items-center justify-between border-t border-primary-foreground/20 pt-4">
                    <div>
                      <p className="text-xs text-primary-foreground/60">Saison</p>
                      <p className="font-medium">{activeLicense?.annee ?? new Date().getFullYear()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground/60">Expire le</p>
                      <p className="font-medium">
                        {activeLicense?.dateFin
                          ? new Date(activeLicense.dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          : `31/12/${activeLicense?.annee ?? new Date().getFullYear()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section QR Code */}
              {activeLicense?.status === 'ACTIVE' && (
                <div className="border-t border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Code QR de vérification</p>
                      <p className="text-sm text-muted-foreground">Scannez pour vérifier l&apos;authenticité</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowQRCode(!showQRCode)}>
                      <QrCode className="mr-2 h-4 w-4" />
                      {showQRCode ? 'Masquer' : 'Afficher'}
                    </Button>
                  </div>

                  {showQRCode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 flex flex-col items-center gap-2"
                    >
                      <div className="rounded-xl bg-white p-4">
                        {isQrLoading ? (
                          <div className="flex h-32 w-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : qrDataUrl ? (
                          <img src={qrDataUrl} alt="QR Code licence" className="h-32 w-32" />
                        ) : (
                          <div className="flex h-32 w-32 items-center justify-center text-xs text-muted-foreground">
                            QR indisponible
                          </div>
                        )}
                      </div>
                      {numeroLicence && (
                        <p className="text-xs text-muted-foreground font-mono">{numeroLicence}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Détails */}
        <motion.div variants={FADE_IN_UP} className="space-y-6">

          {/* Statut */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut de la licence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                <div className={`rounded-full p-2 ${statusInfo.color}`}>
                  <statusInfo.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Licence {statusInfo.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeLicense?.status === 'ACTIVE'
                      ? `Valide jusqu'au ${activeLicense.dateFin
                          ? new Date(activeLicense.dateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : `31 décembre ${activeLicense.annee}`}`
                      : activeLicense
                        ? 'Votre licence est en cours de traitement'
                        : 'Aucune licence trouvée — contactez votre club'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations détaillées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: User,      label: 'Nom complet',    value: `${member?.prenom ?? ''} ${member?.nom ?? ''}`.trim() || 'N/A' },
                { icon: Building2, label: 'Club affilié',   value: member?.club?.nom ?? 'N/A' },
                { icon: MapPin,    label: 'Région',         value: member?.club?.region?.nom ?? 'N/A' },
                { icon: Award,     label: 'Discipline & Grade', value: [member?.discipline, member?.grade].filter(Boolean).join(' — ') || 'N/A' },
                { icon: Calendar,  label: 'Membre depuis',  value: formatDate(member?.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Renouvellement */}
          {(activeLicense?.status === 'ACTIVE' || activeLicense?.status === 'EXPIRED') && (
            <Card className="border-accent/50 bg-accent/5">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Renouveler ma licence</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeLicense.status === 'ACTIVE'
                      ? <>Votre licence expire dans <strong>{getDaysUntilExpiry()} jours</strong>. Renouvelez-la avant la fin d&apos;année pour éviter toute interruption.</>
                      : <>Votre licence a expiré. Renouvelez-la pour continuer à participer aux activités de l&apos;association.</>}
                  </p>
                </div>

                {renewalPayment ? (
                  renewalPayment.transactionRef ? (
                    <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                      <Clock className="h-5 w-5 shrink-0" />
                      Preuve envoyée — en attente de vérification par l&apos;association.
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg border border-accent/30 bg-background p-3 text-sm text-muted-foreground">
                        Envoyez <strong className="text-foreground">{Number(renewalPayment.montant ?? 0).toLocaleString('fr-FR')} FCFA</strong> via{' '}
                        <strong className="text-foreground">{renewalPayment.provider === 'WAVE' ? 'Wave' : 'Orange Money'}</strong> au{' '}
                        <strong className="text-foreground">
                          {renewalPayment.provider === 'WAVE' ? paymentNumbers?.paymentWaveNumber : paymentNumbers?.paymentOMNumber}
                        </strong>, puis renseignez la référence et une preuve ci-dessous.
                      </div>
                      <PaymentProofForm
                        onSubmit={async (d) => { await submitProofMutation.mutateAsync(d); }}
                        submitLabel="Envoyer ma preuve de paiement"
                      />
                    </>
                  )
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full h-12 bg-[#1BB5FF] hover:bg-[#1BB5FF]/90 text-white font-semibold gap-2"
                      disabled={renewMutation.isPending}
                      onClick={() => renewMutation.mutate('WAVE')}
                    >
                      {renewMutation.isPending && renewProvider === 'WAVE' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
                      Renouveler avec Wave
                    </Button>
                    <Button
                      className="w-full h-12 bg-[#FF6600] hover:bg-[#FF6600]/90 text-white font-semibold gap-2"
                      disabled={renewMutation.isPending}
                      onClick={() => renewMutation.mutate('ORANGE_MONEY')}
                    >
                      {renewMutation.isPending && renewProvider === 'ORANGE_MONEY' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
                      Renouveler avec Orange Money
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
