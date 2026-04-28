'use client';

import { useState } from 'react';
import {
    BarChart3,
    Users,
    Building2,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    ResponsiveContainer,
} from 'recharts';

// Mock data
const membersByMonth = [
    { month: 'Jan', membres: 12 },
    { month: 'Fév', membres: 19 },
    { month: 'Mar', membres: 8 },
    { month: 'Avr', membres: 25 },
    { month: 'Mai', membres: 31 },
    { month: 'Jun', membres: 18 },
    { month: 'Juil', membres: 22 },
    { month: 'Aoû', membres: 14 },
    { month: 'Sep', membres: 29 },
    { month: 'Oct', membres: 35 },
    { month: 'Nov', membres: 27 },
    { month: 'Déc', membres: 16 },
];

const membersByRegion = [
    { region: 'Dakar', membres: 312 },
    { region: 'Thiès', membres: 98 },
    { region: 'Kaolack', membres: 74 },
    { region: 'Saint-Louis', membres: 61 },
    { region: 'Ziguinchor', membres: 45 },
    { region: 'Diourbel', membres: 38 },
    { region: 'Louga', membres: 22 },
];

const membersByDiscipline = [
    { name: 'Wushu', value: 287 },
    { name: 'Sanda', value: 195 },
    { name: 'Taolu', value: 143 },
    { name: 'Kung Fu', value: 98 },
    { name: 'Qi Gong', value: 47 },
];

const chartConfig = {
    membres: { label: 'Membres', color: 'hsl(var(--primary))' },
};

const kpis = [
    { label: 'Total membres', value: '856', change: '+12%', trend: 'up', icon: Users },
    { label: 'Clubs actifs', value: '34', change: '+2', trend: 'up', icon: Building2 },
    { label: 'Inscriptions ce mois', value: '29', change: '+18%', trend: 'up', icon: TrendingUp },
    { label: 'Taux de renouvellement', value: '87%', change: '+3%', trend: 'up', icon: BarChart3 },
];

export default function AdminRapportsPage() {
    const [period, setPeriod] = useState('2024');

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
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                    </Select>
                    <MultiExportButton
                        exports={[
                            { label: 'Membres (Excel)', entity: 'membres', getData: () => [] },
                            { label: 'Clubs (Excel)', entity: 'clubs', getData: () => [] },
                            { label: 'Compétitions (Excel)', entity: 'competitions', getData: () => [] },
                            { label: 'Actualités (Excel)', entity: 'actualites', getData: () => [] },
                            { label: 'Licences (Excel)', entity: 'licences', getData: () => [] },
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
                            <p className="text-2xl font-bold">{kpi.value}</p>
                            <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart: inscriptions par mois */}
            <Card>
                <CardHeader>
                    <CardTitle>Inscriptions par mois — {period}</CardTitle>
                    <CardDescription>Nouveaux membres enregistrés chaque mois.</CardDescription>
                </CardHeader>
                <CardContent>
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
                        <ChartContainer config={chartConfig} className="h-[260px] w-full">
                            <BarChart data={membersByRegion} layout="vertical">
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis type="category" dataKey="region" tickLine={false} axisLine={false} tickMargin={8} width={70} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="membres" fill="var(--color-membres)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Disciplines breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Répartition par discipline</CardTitle>
                        <CardDescription>Nombre de membres par discipline pratiquée.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mt-2">
                            {membersByDiscipline.map((d) => {
                                const total = membersByDiscipline.reduce((s, x) => s + x.value, 0);
                                const pct = Math.round((d.value / total) * 100);
                                return (
                                    <div key={d.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{d.name}</span>
                                            <span className="text-muted-foreground">{d.value} ({pct}%)</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
