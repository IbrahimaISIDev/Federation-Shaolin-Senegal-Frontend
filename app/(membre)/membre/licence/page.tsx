'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

// Mock license data
const mockLicense = {
  id: '1',
  licenseNumber: 'FSS-DK-001234',
  memberId: '1',
  memberName: 'Mamadou Diallo',
  clubName: 'Club Shaolin Dakar Centre',
  discipline: 'Kung Fu Shaolin',
  grade: 'Ceinture Bleue',
  issueDate: '2024-01-01',
  expiryDate: '2025-12-31',
  status: 'ACTIVE' as const,
  qrCodeUrl: '',
  photoUrl: '',
};

export default function LicensePage() {
  const { user } = useAuthStore();
  const [showQRCode, setShowQRCode] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
          <Button variant="outline" size="sm">
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
                      {mockLicense.licenseNumber}
                    </p>
                  </div>

                  {/* Member Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-primary-foreground/70">Titulaire</p>
                      <p className="font-semibold">{mockLicense.memberName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Club</p>
                      <p className="font-semibold">{mockLicense.clubName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Discipline</p>
                      <p className="font-semibold">{mockLicense.discipline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/70">Grade</p>
                      <p className="font-semibold">{mockLicense.grade}</p>
                    </div>
                  </div>

                  {/* Validity */}
                  <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/20 pt-4">
                    <div>
                      <p className="text-xs text-primary-foreground/70">Valide du</p>
                      <p className="font-medium">{formatDate(mockLicense.issueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground/70">Au</p>
                      <p className="font-medium">{formatDate(mockLicense.expiryDate)}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute right-6 top-24">
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
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
                      {/* Placeholder QR Code */}
                      <div className="grid h-32 w-32 grid-cols-8 grid-rows-8 gap-0.5">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`${
                              Math.random() > 0.5 ? 'bg-foreground' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
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
              <div className="flex items-center gap-4 rounded-lg bg-success/10 p-4">
                <div className="rounded-full bg-success p-2 text-success-foreground">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-success">Licence Active</p>
                  <p className="text-sm text-muted-foreground">
                    Votre licence est valide jusqu&apos;au {formatDate(mockLicense.expiryDate)}
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
                  <p className="font-medium">{mockLicense.memberName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Club affilié</p>
                  <p className="font-medium">{mockLicense.clubName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discipline & Grade</p>
                  <p className="font-medium">
                    {mockLicense.discipline} - {mockLicense.grade}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Période de validité</p>
                  <p className="font-medium">
                    {formatDate(mockLicense.issueDate)} - {formatDate(mockLicense.expiryDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renewal CTA */}
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="p-6">
              <h3 className="mb-2 font-semibold text-foreground">
                Renouveler ma licence
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Votre licence expire dans 280 jours. Renouvelez-la maintenant pour 
                éviter toute interruption.
              </p>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Renouveler maintenant
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
