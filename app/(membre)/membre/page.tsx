'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  Calendar,
  Trophy,
  Bell,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { membersApi, competitionsApi, type Competition } from '@/lib/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: 'Active', color: 'bg-success text-success-foreground', icon: CheckCircle2 },
  pending: { label: 'En attente', color: 'bg-warning text-warning-foreground', icon: Clock },
  suspended: { label: 'Suspendue', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
  rejected: { label: 'Rejetée', color: 'bg-destructive text-destructive-foreground', icon: AlertCircle },
};

export default function MemberDashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['member', 'profile'],
    queryFn: () => membersApi.me(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: compsData } = useQuery({
    queryKey: ['public', 'competitions', 'upcoming'],
    queryFn: () => competitionsApi.list({ status: 'upcoming', limit: 3 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: inscData } = useQuery({
    queryKey: ['member', 'inscriptions'],
    queryFn: () => membersApi.myInscriptions(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const member = data?.data;
  const activeLicense = member?.licenses?.[0];
  const statusKey = activeLicense?.status?.toLowerCase() ?? 'pending';
  const status = statusConfig[statusKey] || statusConfig.pending;
  const upcomingCompetitions: Competition[] = compsData?.data ?? [];
  const myInscriptionIds = new Set((inscData?.data ?? []).map((i: any) => i.competitionId));

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
                <p className="text-lg font-semibold">
                  {activeLicense ? `SHN-${activeLicense.annee}-${String(activeLicense.id).padStart(5,'0')}` : 'N/A'}
                </p>
              </div>
              <div className={`rounded-full p-2 ${status.color}`}>
                <status.icon className="h-5 w-5" />
              </div>
            </div>
            <Badge className={`mt-2 border-none ${status.color}`}>
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
                  {activeLicense?.dateFin
                    ? new Date(activeLicense.dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : `31/12/${activeLicense?.annee ?? new Date().getFullYear()}`}
                </p>
              </div>
              <div className="rounded-full bg-muted p-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Saison {activeLicense?.annee ?? new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        {/* Competitions Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compétitions</p>
                <p className="text-lg font-semibold">{upcomingCompetitions.length} à venir</p>
              </div>
              <div className="rounded-full bg-accent/10 p-2">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {myInscriptionIds.size} inscription{myInscriptionIds.size !== 1 ? 's' : ''} confirmée{myInscriptionIds.size !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Mes inscriptions Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mes inscriptions</p>
                <p className="text-lg font-semibold">{myInscriptionIds.size} compétition{myInscriptionIds.size !== 1 ? 's' : ''}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Saison {activeLicense?.annee ?? new Date().getFullYear()}
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
                        Association Disciples Shaolin Si Sénégal
                      </p>
                      <p className="text-lg font-bold">Licence Membre</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                      <CreditCard className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold tracking-wider">
                      {activeLicense ? `SHN-${activeLicense.annee}-${String(activeLicense.id).padStart(5,'0')}` : 'N/A'}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-primary-foreground/70">Titulaire</p>
                      <p className="font-medium">
                        {member?.prenom || user?.firstName} {member?.nom || user?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground/70">Validité</p>
                      <p className="font-medium">
                        {activeLicense?.dateFin
                          ? new Date(activeLicense.dateFin).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })
                          : `12/${activeLicense?.annee ?? new Date().getFullYear()}`}
                      </p>
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
                <Link href="/competitions">
                  Voir tout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingCompetitions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Aucune compétition à venir pour le moment.
                </p>
              ) : upcomingCompetitions.map((comp: Competition) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{comp.titre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comp.dateDebut).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    {comp.lieu && (
                      <p className="text-sm text-muted-foreground">{comp.lieu}</p>
                    )}
                  </div>
                  {myInscriptionIds.has(comp.id) ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-none">Inscrit</Badge>
                  ) : (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/competitions/${comp.id}/inscription`}>S&apos;inscrire</Link>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
