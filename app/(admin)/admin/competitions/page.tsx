'use client';

import { Trophy, Plus, Search, Calendar, MapPin, Users, MoreHorizontal, Eye, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExportButton } from '@/components/shared/export-button';
import { competitionsApi, type Competition } from '@/lib/api';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

function getCompetitionStatus(c: Competition) {
    const now = new Date();
    const debut = new Date(c.dateDebut);
    const fin = c.dateFin ? new Date(c.dateFin) : debut;
    fin.setHours(23, 59, 59, 999);

    if (now < debut) return 'upcoming';
    if (now >= debut && now <= fin) return 'open';
    return 'completed';
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    upcoming: { label: 'À venir', variant: 'secondary' },
    open: { label: 'En cours', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function AdminCompetitionsPage() {
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState('');
    const [search] = useDebounce(searchInput, 400);
    const [page, setPage] = useState(1);

    // ── Data ────────────────────────────────────────────────────────────────────
    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'competitions', { search, page }],
        queryFn: () =>
            competitionsApi.adminList({
                search: search || undefined,
                page,
                limit: PAGE_SIZE,
            }),
        staleTime: 60 * 1000,
    });

    const competitions: Competition[] = data?.data ?? [];
    const total = data?.total ?? 0;

    // ── Mutations ────────────────────────────────────────────────────────────────
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'competitions'] });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => competitionsApi.delete(id),
        onSuccess: () => { toast.success('Compétition supprimée'); invalidate(); },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    // ── Stats ────────────────────────────────────────────────────────────────────
    const upcomingCount = competitions.filter(c => getCompetitionStatus(c) === 'upcoming').length;
    const openCount = competitions.filter(c => getCompetitionStatus(c) === 'open').length;
    const completedCount = competitions.filter(c => getCompetitionStatus(c) === 'completed').length;

    // ── Export ───────────────────────────────────────────────────────────────────
    const getCompetitionsForExport = useCallback(() =>
        competitions.map((c) => ({
            title: c.titre,
            dateStart: c.dateDebut,
            dateEnd: c.dateFin ?? '',
            location: c.lieu ?? '',
            status: statusConfig[getCompetitionStatus(c)].label,
            participants: c._count?.inscriptions ?? 0,
            createdAt: c.createdAt,
        })),
        [competitions]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Compétitions</h1>
                    <p className="text-muted-foreground">Gérez les compétitions et tournois.</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton entity="competitions" getData={getCompetitionsForExport} />
                    <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                        <Link href="/admin/competitions/nouvelle">
                            <Plus className="w-4 h-4" /> Nouvelle compétition
                        </Link>
                    </Button>
                </div>
            </div>

            {isError && (
                <div className="flex items-center gap-2 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Impossible de charger les compétitions.
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: total, icon: Trophy, color: 'text-primary' },
                    { label: 'À venir', value: upcomingCount, icon: Calendar, color: 'text-blue-500' },
                    { label: 'En cours', value: openCount, icon: Users, color: 'text-green-500' },
                    { label: 'Terminées', value: completedCount, icon: Trophy, color: 'text-muted-foreground' },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            <div>
                                <p className="text-2xl font-bold">
                                    {isLoading ? <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded" /> : stat.value}
                                </p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher une compétition..."
                    className="pl-10"
                    value={searchInput}
                    onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <Card key={i} className="border-none shadow-sm"><CardContent className="p-8"><div className="h-4 bg-muted animate-pulse rounded w-1/2" /></CardContent></Card>
                    ))
                ) : competitions.length === 0 ? (
                    <div className="text-center py-16 bg-muted/20 rounded-lg border-2 border-dashed">
                        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Aucune compétition trouvée.</p>
                    </div>
                ) : (
                    competitions.map((competition) => {
                        const status = getCompetitionStatus(competition);
                        const statusInfo = statusConfig[status];
                        return (
                            <Card key={competition.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Trophy className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{competition.titre}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(competition.dateDebut)}</span>
                                                {competition.lieu && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {competition.lieu}</span>}
                                                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {competition._count?.inscriptions ?? 0} participants</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge variant={statusInfo.variant} className="hidden sm:flex">{statusInfo.label}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild><Link href={`/admin/competitions/${competition.id}`}><Eye className="w-4 h-4 mr-2" /> Voir</Link></DropdownMenuItem>
                                                <DropdownMenuItem asChild><Link href={`/admin/competitions/${competition.id}/modifier`}><Pencil className="w-4 h-4 mr-2" /> Modifier</Link></DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => { if (confirm(`Supprimer ${competition.titre} ?`)) deleteMutation.mutate(competition.id); }}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
