'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  CreditCard,
  ArrowUpRight,
  UserPlus,
  FileText,
  Calendar,
  AlertCircle,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { statsApi, DashboardStats } from '@/lib/api';

const chartConfig = {
  total: {
    label: 'Membres',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  expired: 'bg-rose-100 text-rose-700 border-rose-200',
};

const priorityColors: Record<string, string> = {
  high: 'border-rose-200 bg-rose-50 text-rose-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-slate-200 bg-slate-50 text-slate-600',
};

interface PendingAction {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  href: string;
  count: number;
  icon: React.ElementType;
}

function computePendingActions(data: DashboardStats): PendingAction[] {
  const actions: PendingAction[] = [];

  if (data.pendingMembers > 0) {
    actions.push({
      id: 'pending-members',
      title: `${data.pendingMembers} demande${data.pendingMembers > 1 ? 's' : ''} d'affiliation en attente`,
      priority: 'high',
      href: '/admin/membres',
      count: data.pendingMembers,
      icon: Users,
    });
  }

  if (data.expiredLicenses > 0 || data.expiringLicenses > 0) {
    const priority: 'high' | 'medium' = data.expiredLicenses > 0 ? 'high' : 'medium';
    const label =
      data.expiredLicenses > 0
        ? `${data.expiredLicenses} licence${data.expiredLicenses > 1 ? 's' : ''} expirée${data.expiredLicenses > 1 ? 's' : ''}, ${data.expiringLicenses} bientôt à renouveler`
        : `${data.expiringLicenses} licence${data.expiringLicenses > 1 ? 's' : ''} expire${data.expiringLicenses > 1 ? 'nt' : ''} bientôt`;
    actions.push({
      id: 'licenses',
      title: label,
      priority,
      href: '/admin/membres',
      count: data.expiredLicenses + data.expiringLicenses,
      icon: CreditCard,
    });
  }

  if (data.draftArticles > 0) {
    actions.push({
      id: 'drafts',
      title: `${data.draftArticles} article${data.draftArticles > 1 ? 's' : ''} en brouillon à publier`,
      priority: 'low',
      href: '/admin/actualites',
      count: data.draftArticles,
      icon: FileText,
    });
  }

  return actions;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-16 h-6 rounded-full bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-24 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: statsResponse, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => statsApi.dashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // rafraîchit toutes les 5 min
  });

  const data = statsResponse?.data;

  const kpiCards = data
    ? [
      {
        title: 'Total Membres',
        value: data.totalMembers.toLocaleString('fr-FR'),
        change: `+${data.newMembersThisWeek} cette semaine`,
        icon: Users,
        href: '/admin/membres',
        color: 'bg-blue-500/10 text-blue-500',
      },
      {
        title: 'Clubs Affiliés',
        value: data.totalClubs.toLocaleString('fr-FR'),
        change: `${data.activeClubs} actifs`,
        icon: Building2,
        href: '/admin/clubs',
        color: 'bg-orange-500/10 text-orange-500',
      },
      {
        title: 'Licences Actives',
        value: data.activeLicenses.toLocaleString('fr-FR'),
        change: `${data.expiringLicenses} expirent bientôt`,
        icon: CreditCard,
        href: '/admin/membres',
        color: 'bg-green-500/10 text-green-500',
      },
      {
        title: 'Nouveaux (7j)',
        value: data.newMembersThisWeek.toLocaleString('fr-FR'),
        change: `${data.pendingMembers} en attente`,
        icon: UserPlus,
        href: '/admin/membres',
        color: 'bg-purple-500/10 text-purple-500',
      },
    ]
    : [];

  const pendingActions = data ? computePendingActions(data) : [];

  const regionChartData = data?.membresParRegion?.map((r) => ({
    region: r.regionNom,
    total: Number(r.total),
  })) ?? [];

  const recentCompetition = data?.upcomingCompetitions
    ? `${data.upcomingCompetitions} compétition${data.upcomingCompetitions > 1 ? 's' : ''} à venir`
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">Aperçu global de l&apos;activité de l&apos;Association.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/rapports">
              <FileText className="w-4 h-4 mr-2" />
              Rapports
            </Link>
          </Button>
          <Button className="bg-accent hover:bg-accent/90" asChild>
            <Link href="/admin/membres/nouveau">
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau membre
            </Link>
          </Button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Impossible de charger les statistiques. Vérifiez que l&apos;API est démarrée.
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart — Membres par région */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Membres par région</CardTitle>
            <CardDescription>Répartition géographique des pratiquants</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : regionChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={regionChartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="region"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 8)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                Aucune donnée régionale disponible.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Actions + Quick Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Actions urgentes</CardTitle>
                {pendingActions.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingActions.length}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : pendingActions.length === 0 ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-medium">Aucune action urgente — tout est à jour ✅</p>
                </div>
              ) : (
                pendingActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.href}
                    className={cn(
                      'p-3 rounded-xl border flex items-center gap-3 transition-colors hover:brightness-95 cursor-pointer',
                      priorityColors[action.priority]
                    )}
                  >
                    <action.icon className="w-4 h-4 shrink-0" />
                    <p className="text-sm font-medium leading-snug flex-1">{action.title}</p>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Info — Compétitions */}
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80">Compétitions</p>
                  <p className="font-bold">
                    {isLoading ? '...' : recentCompetition ?? 'Aucune à venir'}
                  </p>
                  <Link href="/admin/competitions" className="text-xs opacity-60 hover:opacity-100 underline">
                    Voir les compétitions
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Members — depuis membresParRegion ou liste vide */}
        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Résumé membres</CardTitle>
              <CardDescription>Vue d&apos;ensemble des inscriptions par statut</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/membres">Voir tous les membres</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : data ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total membres', value: data.totalMembers, color: 'text-blue-600' },
                  { label: 'En attente', value: data.pendingMembers, color: 'text-amber-600' },
                  { label: 'Licences actives', value: data.activeLicenses, color: 'text-green-600' },
                  { label: 'Licences expirées', value: data.expiredLicenses, color: 'text-rose-600' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl bg-muted/50 flex flex-col gap-1"
                  >
                    <p className={cn('text-2xl font-bold', item.color)}>
                      {item.value.toLocaleString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Répartition par grade / discipline */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Répartition par grade</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownList
              isLoading={isLoading}
              items={(data?.membresParGrade ?? []).map((g) => ({ label: g.grade, total: Number(g.total) }))}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Répartition par discipline</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownList
              isLoading={isLoading}
              items={(data?.membresParDiscipline ?? []).map((d) => ({ label: d.discipline, total: Number(d.total) }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BreakdownList({
  isLoading,
  items,
}: {
  isLoading: boolean;
  items: Array<{ label: string; total: number }>;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 rounded bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>;
  }

  const max = Math.max(...items.map((i) => i.total), 1);

  return (
    <div className="space-y-3">
      {items.slice(0, 8).map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">{item.label}</span>
            <span className="text-muted-foreground font-medium">{item.total}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.total / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
