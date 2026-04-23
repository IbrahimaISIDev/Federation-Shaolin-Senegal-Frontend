'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  Trophy,
  Bell,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

// Mock data
const mockLicenseStatus = {
  status: 'ACTIVE' as const,
  expiryDate: '2025-12-31',
  daysUntilExpiry: 280,
};

const upcomingCompetitions = [
  {
    id: '1',
    name: 'Championnat Régional Dakar',
    date: '2024-05-15',
    location: 'Stade Léopold Sédar Senghor',
    isRegistered: true,
  },
  {
    id: '2',
    name: 'Open National de Wushu',
    date: '2024-06-20',
    location: 'Palais des Sports',
    isRegistered: false,
  },
];

const notifications = [
  {
    id: '1',
    title: 'Licence renouvelée',
    message: 'Votre licence a été renouvelée avec succès.',
    type: 'success',
    date: '2024-03-10',
  },
  {
    id: '2',
    title: 'Nouvelle compétition',
    message: 'Le Championnat Régional de Dakar est ouvert aux inscriptions.',
    type: 'info',
    date: '2024-03-08',
  },
];

const statusConfig = {
  ACTIVE: { label: 'Active', color: 'bg-success text-success-foreground', icon: CheckCircle2 },
  PENDING: { label: 'En attente', color: 'bg-warning text-warning-foreground', icon: Clock },
  EXPIRED: { label: 'Expirée', color: 'bg-destructive text-destructive-foreground', icon: AlertCircle },
  SUSPENDED: { label: 'Suspendue', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
};

export default function MemberDashboardPage() {
  const { user } = useAuthStore();
  const status = statusConfig[mockLicenseStatus.status];

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={FADE_IN_UP}>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Bienvenue, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre espace membre
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={FADE_IN_UP}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* License Card */}
        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ma Licence</p>
                <p className="text-lg font-semibold">{user?.licenseNumber || 'N/A'}</p>
              </div>
              <div className={`rounded-full p-2 ${status.color}`}>
                <status.icon className="h-5 w-5" />
              </div>
            </div>
            <Badge className={`mt-2 ${status.color}`}>
              {status.label}
            </Badge>
          </CardContent>
        </Card>

        {/* Expiry Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiration</p>
                <p className="text-lg font-semibold">
                  {new Date(mockLicenseStatus.expiryDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="rounded-full bg-muted p-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Dans {mockLicenseStatus.daysUntilExpiry} jours
            </p>
          </CardContent>
        </Card>

        {/* Competitions Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compétitions</p>
                <p className="text-lg font-semibold">2 à venir</p>
              </div>
              <div className="rounded-full bg-accent/10 p-2">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              1 inscription confirmée
            </p>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-lg font-semibold">2 nouvelles</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Dernière: il y a 2 jours
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Digital License Preview */}
        <motion.div variants={FADE_IN_UP}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Ma Licence Numérique</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/membre/licence">
                  Voir détails
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
                {/* Card Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
                        Fédération Shaolin Sénégal
                      </p>
                      <p className="text-lg font-bold">Licence Membre</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                      <CreditCard className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold tracking-wider">
                      {user?.licenseNumber || 'FSS-XX-XXXXXX'}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-primary-foreground/70">Titulaire</p>
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground/70">Validité</p>
                      <p className="font-medium">12/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Competitions */}
        <motion.div variants={FADE_IN_UP}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Compétitions à venir</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/membre/competitions">
                  Voir tout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingCompetitions.map((competition) => (
                <div
                  key={competition.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <h4 className="font-medium text-foreground">
                      {competition.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(competition.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {competition.location}
                    </p>
                  </div>
                  {competition.isRegistered ? (
                    <Badge className="bg-success text-success-foreground">
                      Inscrit
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      S&apos;inscrire
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Notifications */}
      <motion.div variants={FADE_IN_UP}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 rounded-lg border border-border p-4"
              >
                <div
                  className={`mt-0.5 rounded-full p-2 ${
                    notification.type === 'success'
                      ? 'bg-success/10 text-success'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
