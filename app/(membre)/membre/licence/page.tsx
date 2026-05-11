'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { membersApi, licensesApi } from '@/lib/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  ACTIVE:    { label: 'Active',      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  PENDING:   { label: 'En attente',  color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',         icon: Clock },
  EXPIRED:   { label: 'Expirée',     color: 'bg-muted text-muted-foreground',                                               icon: AlertCircle },
  SUSPENDED: { label: 'Suspendue',   color: 'bg-destructive/10 text-destructive',                                           icon: AlertCircle },
};

export default function LicensePage() {
  const [showQRCode, setShowQRCode] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['member', 'profile'],
    queryFn: () => membersApi.me(),
    staleTime: 5 * 60 * 1000,
  });

  const member = data?.data;
  // Utilise la licence la plus récente
  const activeLicense = member?.licenses?.[0];
  const statusKey = activeLicense?.status ?? 'PENDING';
  const statusInfo = statusConfig[statusKey] ?? statusConfig['PENDING'];

  const { data: qrData, isLoading: isQrLoading } = useQuery({
    queryKey: ['license', 'qrcode', activeLicense?.id],
    queryFn: () => licensesApi.getQrCode(activeLicense!.id),
    enabled: showQRCode && !!activeLicense?.id && activeLicense.status === 'ACTIVE',
    staleTime: 10 * 60 * 1000,
  });

  const handleDownloadPDF = () => {
    if (!activeLicense?.id) return;
    const url = licensesApi.getPdfUrl(activeLicense.id);
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaysUntilExpiry = () => {
    // Assuming valid until end of current year generally for mock logic if not specified
    const expiry = new Date(new Date().getFullYear(), 11, 31);
    const diff = expiry.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={FADE_IN_UP} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Ma Licence
          </h1>
          <p className="text-muted-foreground">
            Gérez et consultez votre licence numérique
          </p>
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
        {/* Digital License Card */}
        <motion.div variants={FADE_IN_UP}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* License Card Front */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 p-6 text-primary-foreground">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                <div className="relative">
                  {/* Header */}
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                        Fédération Shaolin Sénégal
                      </p>
                      <p className="text-xl font-bold">Licence Officielle</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-8 w-8 text-accent-foreground"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 2L3 7h18L12 2z" fill="currentColor" />
                        <path d="M5 7v3h14V7" />
                        <path d="M12 7L4 11h16L12 7z" fill="currentColor" />
                        <path d="M6 11v3h12v-3" />
                        <path d="M12 11L5 15h14L12 11z" fill="currentColor" />
                        <path d="M7 15v7h10v-7" />
                      </svg>
                    </div>
                  </div>

                  {/* License Number */}
                  <div className="mb-6">
                    <p className="text-xs text-primary-foreground/70">Numéro de licence</p>
                    <p className="text-3xl font-bold tracking-wider">
                      {activeLicense
                        ? `SHN-${activeLicense.annee}-${String(activeLicense.id).padStart(5, '0')}`
                        : 'N/A'}
                    </p>
                  </div>

                  {/* Member Info */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <p className="text-xs text-primary-foreground/70">Titulaire</p>
                      <p className="font-semibold">{member?.prenom} {member?.nom}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Club</p>
                      <p className="font-semibold">{member?.club?.nom || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Discipline</p>
                      <p className="font-semibold">{member?.disciplines || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Grade</p>
                      <p className="font-semibold">{member?.grade || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Validity */}
                  <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/20 pt-4">
                    <div>
                      <p className="text-xs text-primary-foreground/70">Saison</p>
                      <p className="font-medium">{activeLicense?.annee ?? new Date().getFullYear()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground/70">Expire le</p>
                      <p className="font-medium">
                        {activeLicense?.dateFin
                          ? new Date(activeLicense.dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          : `31/12/${activeLicense?.annee ?? new Date().getFullYear()}`}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute right-6 top-24">
                    <Badge className={`border-none ${statusInfo.color}`}>
                      <statusInfo.icon className="mr-1 h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              {activeLicense?.status === 'ACTIVE' && (
                <div className="border-t border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Code QR de vérification</p>
                      <p className="text-sm text-muted-foreground">
                        Scannez pour vérifier l&apos;authenticité
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQRCode(!showQRCode)}
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      {showQRCode ? 'Masquer' : 'Afficher'}
                    </Button>
                  </div>

                  {showQRCode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex justify-center"
                    >
                      <div className="rounded-xl bg-white p-4">
                        {isQrLoading ? (
                          <div className="w-32 h-32 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          </div>
                        ) : qrData?.qrDataURL ? (
                          <img src={qrData.qrDataURL} alt="QR Code licence" className="w-32 h-32" />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center text-xs text-muted-foreground">
                            QR indisponible
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* License Details */}
        <motion.div variants={FADE_IN_UP} className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut de la licence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-lg p-4 bg-muted">
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

          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations détaillées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{member?.prenom} {member?.nom}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Club affilié</p>
                  <p className="font-medium">{member?.club?.nom || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discipline & Grade</p>
                  <p className="font-medium">
                    {member?.discipline || 'N/A'} — {member?.grade || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adhésion</p>
                  <p className="font-medium">
                    Depuis le {formatDate(member?.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renewal CTA */}
          {activeLicense?.status === 'ACTIVE' && (
            <Card className="border-accent/50 bg-accent/5">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">
                  Renouveler ma licence
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Votre licence expire dans {getDaysUntilExpiry()} jours. Renouvelez-la maintenant pour
                  éviter toute interruption.
                </p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled>
                  Renouvellement non ouvert
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
