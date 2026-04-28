'use client';

import React from 'react';

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
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  UserPlus,
  FileText,
  Calendar,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

// Mock stats data
const stats = [
  {
    title: 'Total Membres',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: Users,
    href: '/admin/membres',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Clubs Affiliés',
    value: '32',
    change: '+3',
    trend: 'up',
    icon: Building2,
    href: '/admin/clubs',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    title: 'Licences Actives',
    value: '1,089',
    change: '+8%',
    trend: 'up',
    icon: CreditCard,
    href: '/admin/membres',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Nouveaux (7j)',
    value: '24',
    change: '+5',
    trend: 'up',
    icon: UserPlus,
    href: '/admin/membres',
    color: 'bg-purple-500/10 text-purple-500',
  },
];

// Mock region data
const regionData = [
  { region: 'Dakar', count: 450 },
  { region: 'Thiès', count: 210 },
  { region: 'Saint-Louis', count: 180 },
  { region: 'Ziguinchor', count: 120 },
  { region: 'Kaolack', count: 95 },
  { region: 'Diourbel', count: 80 },
  { region: 'Louga', count: 65 },
  { region: 'Autres', count: 47 },
];

const chartConfig = {
  count: {
    label: 'Membres',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

// Mock recent members
const recentMembers = [
  {
    id: '1',
    name: 'Amadou Ba',
    club: 'Temple Shaolin Dakar',
    date: '2024-02-15',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Fatou Diop',
    club: 'Dragon de Feu Saint-Louis',
    date: '2024-02-14',
    status: 'active',
  },
  {
    id: '3',
    name: 'Moussa Ndiaye',
    club: 'Wushu Academy Thiès',
    date: '2024-02-13',
    status: 'active',
  },
  {
    id: '4',
    name: 'Aissatou Sall',
    club: 'Temple Shaolin Dakar',
    date: '2024-02-12',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Omar Sy',
    club: 'Shaolin Ziguinchor',
    date: '2024-02-11',
    status: 'active',
  },
];

// ─── Data sources for dynamic actions ─────────────────────────────────────────
const allMembers = [
  { id: '1', status: 'pending', date: '2024-02-15' },
  { id: '2', status: 'active', date: '2024-02-14' },
  { id: '3', status: 'pending', date: '2024-02-13' },
  { id: '4', status: 'pending', date: '2024-02-12' },
  { id: '5', status: 'active', date: '2024-02-11' },
  { id: '6', status: 'expired', date: '2023-06-10' },
  { id: '7', status: 'pending', date: '2024-02-12' },
];

const allArticles = [
  { id: '1', isPublished: true },
  { id: '2', isPublished: true },
  { id: '3', isPublished: false },
  { id: '4', isPublished: false },
  { id: '5', isPublished: false },
];

const allLicenses = [
  { id: 'L001', status: 'expiring' },
  { id: 'L002', status: 'expiring' },
  { id: 'L003', status: 'expired' },
  { id: 'L004', status: 'expired' },
];

interface PendingAction {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  href: string;
  count: number;
  icon: React.ElementType;
}

function computePendingActions(): PendingAction[] {
  const actions: PendingAction[] = [];

  const pendingMembers = allMembers.filter((m) => m.status === 'pending');
  if (pendingMembers.length > 0) {
    actions.push({
      id: 'pending-members',
      title: `${pendingMembers.length} demande${pendingMembers.length > 1 ? 's' : ''} d'affiliation en attente de validation`,
      priority: 'high',
      href: '/admin/membres',
      count: pendingMembers.length,
      icon: Users,
    });
  }

  const urgentLicenses = allLicenses.filter((l) => l.status === 'expiring' || l.status === 'expired');
  if (urgentLicenses.length > 0) {
    const expired = urgentLicenses.filter((l) => l.status === 'expired').length;
    const expiring = urgentLicenses.filter((l) => l.status === 'expiring').length;
    const priority: 'high' | 'medium' = expired > 0 ? 'high' : 'medium';
    const label = expired > 0
      ? `${expired} licence${expired > 1 ? 's' : ''} expirée${expired > 1 ? 's' : ''}, ${expiring} bientôt à renouveler`
      : `${expiring} licence${expiring > 1 ? 's' : ''} expire${expiring > 1 ? 'nt' : ''} bientôt`;
    actions.push({
      id: 'licenses',
      title: label,
      priority,
      href: '/admin/membres',
      count: urgentLicenses.length,
      icon: CreditCard,
    });
  }

  const drafts = allArticles.filter((a) => !a.isPublished);
  if (drafts.length > 0) {
    actions.push({
      id: 'drafts',
      title: `${drafts.length} article${drafts.length > 1 ? 's' : ''} en brouillon à publier`,
      priority: 'low',
      href: '/admin/actualites',
      count: drafts.length,
      icon: FileText,
    });
  }

  return actions;
}

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export default function AdminDashboard() {
  const pendingActions = computePendingActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Aperçu global de l&apos;activité de la Fédération.
          </p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      stat.color
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'flex items-center gap-1 font-medium',
                      stat.trend === 'up'
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-rose-600 bg-rose-50'
                    )}
                  >
                    {stat.change}
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Membres par région</CardTitle>
            <CardDescription>
              Répartition géographique des pratiquants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={regionData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="region"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 8)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pending Actions */}
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
              {pendingActions.length === 0 ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-medium">Aucune action urgente — tout est à jour ✅</p>
                </div>
              ) : (
                pendingActions.map((action: PendingAction) => (
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

          {/* Quick Info */}
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80">
                    Prochain événement
                  </p>
                  <p className="font-bold">National Shaolin Open</p>
                  <p className="text-xs opacity-60">15 Mars 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Members Table */}
        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inscriptions récentes</CardTitle>
              <CardDescription>
                Membres ayant rejoint la fédération récemment
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/membres">Tous les membres</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Membre
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Club Affilié
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                      Statut
                    </th>
                    <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {recentMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-2 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-2 align-middle text-muted-foreground">
                        {member.club}
                      </td>
                      <td className="p-2 align-middle text-muted-foreground">
                        {formatDate(member.date)}
                      </td>
                      <td className="p-2 align-middle">
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-medium border shadow-none',
                            statusColors[member.status]
                          )}
                        >
                          {member.status === 'pending'
                            ? 'En attente'
                            : 'Validé'}
                        </Badge>
                      </td>
                      <td className="p-2 align-middle text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
