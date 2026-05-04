'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart3,
    Users,
    Building2,
    TrendingUp,
    Calendar,
    Loader2,
    Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MultiExportButton } from '@/components/shared/export-button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
} from 'recharts';
import { statsApi, membersApi, clubsApi, competitionsApi, actualitesApi } from '@/lib/api';
import type { Member, Club, Competition, Actualite } from '@/lib/api';

const MONTH_LABELS: Record<string, string> = {
    '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Jun',
    '07': 'Jul', '08': 'Aoû', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
};

const chartConfig = {
    membres: { label: 'Membres', color: 'hsl(var(--primary))' },
};

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2].map(String);

export default function AdminRapportsPage() {
    const [period, setPeriod] = useState(String(currentYear));

    const { data: statsData, isLoading } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => statsApi.dashboard(),
        staleTime: 5 * 60 * 1000,
    });

    const stats = statsData?.data;

    const membersByMonth = (stats?.membresMoisParMois ?? []).map(({ mois, total }) => ({
        month: MONTH_LABELS[mois.split('-')[1]] ?? mois,
        membres: Number(total),
    }));

    const membersByRegion = (stats?.membresParRegion ?? []).map(({ regionNom, total }) => ({
        region: regionNom,
        membres: Number(total),
    }));

    const kpis = [
        { label: 'Total membres',    value: stats?.totalMembers   ?? '—', change: `+${stats?.newMembersThisWeek ?? 0} cette sem.`, icon: Users },
        { label: 'Clubs actifs',     value: stats?.activeClubs    ?? '—', change: `/ ${stats?.totalClubs ?? 0} clubs`,             icon: Building2 },
        { label: 'Licences actives', value: stats?.activeLicenses ?? '—', change: `${stats?.expiringLicenses ?? 0} expirent`,      icon: Award },
        { label: 'En validation',    value: stats?.pendingMembers ?? '—', change: 'membres en attente',                            icon: TrendingUp },
    ];

    // ── Export getData callbacks ──────────────────────────────────────────────────

    async function getMembresExport(): Promise<Record<string, unknown>[]> {
        const res = await membersApi.adminList({ limit: 1000 });
        return (res.data ?? []).map((m: Member) => ({
            firstName:     m.prenom,
            lastName:      m.nom,
            email:         m.user?.email ?? '',
            phone:         m.user?.phone ?? '',
            gender:        m.sexe ?? '',
            birthDate:     m.dateNaissance ? new Date(m.dateNaissance).toLocaleDateString('fr-FR') : '',
            nationality:   '',
            city:          m.ville ?? '',
            region:        m.club?.region?.nom ?? '',
            clubName:      m.club?.nom ?? '',
            discipline:    m.discipline ?? '',
            grade:         m.grade ?? '',
            status:        m.user?.isActive ? 'Actif' : 'Inactif',
            licenseNumber: m.licenses?.[0]
                ? `SHN-${m.licenses[0].annee}-${String(m.licenses[0].id).padStart(5, '0')}`
                : '',
            registeredAt:  new Date(m.createdAt).toLocaleDateString('fr-FR'),
        }));
    }

    async function getClubsExport(): Promise<Record<string, unknown>[]> {
        const res = await clubsApi.adminList({ limit: 1000 });
        return (res.data ?? []).map((c: Club) => ({
            code:          `${c.region?.code ?? ''}-${c.id}`,
            name:          c.nom,
            region:        c.region?.nom ?? '',
            city:          c.ville ?? '',
            phone:         c.telephone ?? '',
            email:         c.email ?? '',
            presidentName: c.nomMaitre ?? '',
            membersCount:  c._count?.members ?? 0,
            status:        c.isActive ? 'Actif' : 'Inactif',
            createdAt:     new Date(c.createdAt).toLocaleDateString('fr-FR'),
        }));
    }

    async function getCompetitionsExport(): Promise<Record<string, unknown>[]> {
        const res = await competitionsApi.adminList({ limit: 1000 });
        return (res.data ?? []).map((c: Competition) => ({
            title:           c.titre,
            discipline:      '',
            date:            new Date(c.dateDebut).toLocaleDateString('fr-FR'),
            location:        c.lieu ?? '',
            status:          c.isPublished ? 'Publié' : 'Brouillon',
            participants:    c._count?.inscriptions ?? 0,
            maxParticipants: '',
        }));
    }

    async function getActualitesExport(): Promise<Record<string, unknown>[]> {
        const res = await actualitesApi.adminList({ limit: 1000 });
        return (res.data ?? []).map((a: Actualite) => ({
            title:       a.titre,
            slug:        a.slug,
            category:    '',
            status:      a.isPublished ? 'Publié' : 'Brouillon',
            author:      'Secrétariat ADSS',
            publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('fr-FR') : '',
        }));
    }

    async function getLicencesExport(): Promise<Record<string, unknown>[]> {
        const res = await membersApi.adminList({ limit: 1000 });
        const rows: Record<string, unknown>[] = [];
        for (const m of (res.data ?? [])) {
            for (const lic of (m.licenses ?? [])) {
                rows.push({
                    licenseNumber: `SHN-${lic.annee}-${String(lic.id).padStart(5, '0')}`,
                    memberName:    `${m.prenom} ${m.nom}`,
                    clubName:      m.club?.nom ?? '',
                    discipline:    m.discipline ?? '',
                    grade:         m.grade ?? '',
                    issueDate:     '',
                    expiryDate:    lic.dateFin ? new Date(lic.dateFin).toLocaleDateString('fr-FR') : `31/12/${lic.annee}`,
                    status:        lic.status,
                });
            }
        }
        return rows;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Rapports & Statistiques</h1>
                    <p className="text-muted-foreground">Vue d&apos;ensemble analytique de la fédération.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[120px]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map((y) => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <MultiExportButton
                        exports={[
                            { label: 'Membres (Excel)',      entity: 'membres',      getData: getMembresExport },
                            { label: 'Clubs (Excel)',         entity: 'clubs',        getData: getClubsExport },
                            { label: 'Compétitions (Excel)',  entity: 'competitions', getData: getCompetitionsExport },
                            { label: 'Actualités (Excel)',    entity: 'actualites',   getData: getActualitesExport },
                            { label: 'Licences (Excel)',      entity: 'licences',     getData: getLicencesExport },
                        ]}
                    />
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.label}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <kpi.icon className="w-5 h-5 text-primary" />
                                <Badge variant="secondary" className="text-green-600 bg-green-100 text-xs">
                                    {kpi.change}
                                </Badge>
                            </div>
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground my-1" />
                            ) : (
                                <p className="text-2xl font-bold">{kpi.value}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart: inscriptions par mois */}
            <Card>
                <CardHeader>
                    <CardTitle>Inscriptions — 12 derniers mois</CardTitle>
                    <CardDescription>Nouveaux membres enregistrés chaque mois.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-[260px] flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig} className="h-[260px] w-full">
                            <LineChart data={membersByMonth}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="membres"
                                    stroke="var(--color-membres)"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart: membres par région */}
                <Card>
                    <CardHeader>
                        <CardTitle>Membres par région</CardTitle>
                        <CardDescription>Répartition géographique des adhérents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-[260px] flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <ChartContainer config={chartConfig} className="h-[260px] w-full">
                                <BarChart data={membersByRegion} layout="vertical">
                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                    <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis type="category" dataKey="region" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="membres" fill="var(--color-membres)" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Licences summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>État des licences</CardTitle>
                        <CardDescription>Répartition par statut de licence.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-[260px] flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="space-y-4 mt-2">
                                {[
                                    { label: 'Actives',               value: stats?.activeLicenses  ?? 0, total: stats?.totalLicenses ?? 1, color: 'bg-emerald-500' },
                                    { label: 'Expirent dans 30 jours', value: stats?.expiringLicenses ?? 0, total: stats?.totalLicenses ?? 1, color: 'bg-amber-500' },
                                    { label: 'Expirées',               value: stats?.expiredLicenses  ?? 0, total: stats?.totalLicenses ?? 1, color: 'bg-muted-foreground' },
                                ].map((item) => {
                                    const pct = stats?.totalLicenses ? Math.round((item.value / stats.totalLicenses) * 100) : 0;
                                    return (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">{item.label}</span>
                                                <span className="text-muted-foreground">{item.value} ({pct}%)</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                <p className="text-xs text-muted-foreground pt-2">
                                    Total licences : {stats?.totalLicenses ?? '—'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
