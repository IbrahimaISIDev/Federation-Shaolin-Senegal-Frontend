'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, CreditCard, Clock, AlertTriangle, Trophy, ArrowRight,
  CheckCircle2, Loader2, MapPin, Phone, Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { clubApi } from '@/lib/api/club';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

export default function ClubDashboardPage() {
  const { data: clubData, isLoading: clubLoading } = useQuery({
    queryKey: ['club', 'me'],
    queryFn: () => clubApi.me(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['club', 'stats'],
    queryFn: () => clubApi.stats(),
    staleTime: 2 * 60 * 1000,
  });

  const { data: membersData } = useQuery({
    queryKey: ['club', 'membres', { limit: 5 }],
    queryFn: () => clubApi.members({ limit: 5 }),
    staleTime: 2 * 60 * 1000,
  });

  if (clubLoading || statsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const club  = clubData?.data;
  const stats = statsData?.data;
  const recentMembers: any[] = membersData?.data ?? [];

  const statCards = [
    {
      label: 'Membres total',
      value: stats?.totalMembers ?? 0,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      href: '/club/membres',
    },
    {
      label: 'Licences actives',
      value: stats?.activeLicenses ?? 0,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-600',
      href: '/club/licences?status=ACTIVE',
    },
    {
      label: 'En attente',
      value: stats?.pendingLicenses ?? 0,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
      href: '/club/licences?status=PENDING',
    },
    {
      label: 'Expirent bientôt',
      value: stats?.expiringLicenses ?? 0,
      icon: AlertTriangle,
      color: 'bg-rose-100 text-rose-600',
      href: '/club/licences?status=ACTIVE',
    },
  ];

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={FADE_IN_UP}>
        <h1 className="text-2xl font-bold md:text-3xl">{club?.nom ?? 'Mon Club'}</h1>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {club?.region?.nom && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />{club.ville ? `${club.ville}, ` : ''}{club.region.nom}
            </span>
          )}
          {club?.telephone && (
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{club.telephone}</span>
          )}
          {club?.email && (
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{club.email}</span>
          )}
        </div>
        {club?.nomMaitre && (
          <p className="mt-1 text-sm text-muted-foreground">Maître : <span className="font-medium text-foreground">{club.nomMaitre}</span></p>
        )}
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={FADE_IN_UP} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Derniers membres */}
        <motion.div variants={FADE_IN_UP}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Derniers membres
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/club/membres">Voir tout <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun membre enregistré.</p>
              ) : (
                <div className="space-y-3">
                  {recentMembers.map((m: any) => {
                    const lic    = m.licenses?.[0];
                    const status = lic?.status ?? 'PENDING';
                    const statusCls: Record<string, string> = {
                      ACTIVE:    'bg-emerald-100 text-emerald-700',
                      PENDING:   'bg-amber-100 text-amber-700',
                      EXPIRED:   'bg-rose-100 text-rose-700',
                      SUSPENDED: 'bg-muted text-muted-foreground',
                    };
                    return (
                      <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-sm">{m.prenom} {m.nom}</p>
                          <p className="text-xs text-muted-foreground">{m.user?.email}</p>
                        </div>
                        <Badge className={`border-none text-xs ${statusCls[status] ?? statusCls.PENDING}`}>
                          {status === 'ACTIVE' ? 'Actif' : status === 'PENDING' ? 'En attente' : status === 'EXPIRED' ? 'Expiré' : 'Suspendu'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Résumé licences */}
        <motion.div variants={FADE_IN_UP}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                État des licences
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/club/licences">Gérer <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Actives',        value: stats?.activeLicenses ?? 0,  cls: 'bg-emerald-500' },
                { label: 'En attente',     value: stats?.pendingLicenses ?? 0, cls: 'bg-amber-400' },
                { label: 'Expirées',       value: stats?.expiredLicenses ?? 0, cls: 'bg-rose-400' },
                { label: 'Expirent (30j)', value: stats?.expiringLicenses ?? 0, cls: 'bg-orange-400' },
              ].map((row) => {
                const total   = (stats?.totalMembers || 1);
                const pct     = Math.round((row.value / total) * 100);
                return (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-semibold">{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${row.cls}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}

              {(stats?.upcomingInscriptions ?? 0) > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                  <Trophy className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{stats?.upcomingInscriptions}</span> inscription{stats!.upcomingInscriptions > 1 ? 's' : ''} à venir
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
