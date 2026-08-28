'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import {
    Search, Filter, PlusCircle, MoreHorizontal, Eye, Pencil, Trash2,
    Building2, Users, MapPin, ChevronLeft, ChevronRight, Loader2, AlertCircle,
    ToggleLeft, ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ExportButton } from '@/components/shared/export-button';
import { clubsApi, type Club } from '@/lib/api';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function AdminClubsPage() {
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState('');
    const [search] = useDebounce(searchInput, 400);
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    // ── Data ────────────────────────────────────────────────────────────────────
    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'clubs', { search, status: statusFilter, page }],
        queryFn: () =>
            clubsApi.adminList({
                search: search || undefined,
                active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
                page,
                limit: PAGE_SIZE,
            }),
        staleTime: 60 * 1000,
    });

    const clubs: Club[] = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    // ── Mutations ────────────────────────────────────────────────────────────────
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'clubs'] });

    const activateMutation = useMutation({
        mutationFn: (id: number) => clubsApi.activate(id),
        onSuccess: () => { toast.success('Club activé'); invalidate(); },
        onError: () => toast.error('Erreur lors de l\'activation'),
    });

    const deactivateMutation = useMutation({
        mutationFn: (id: number) => clubsApi.deactivate(id),
        onSuccess: () => { toast.success('Club désactivé'); invalidate(); },
        onError: () => toast.error('Erreur lors de la désactivation'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => clubsApi.delete(id),
        onSuccess: () => { toast.success('Club supprimé'); invalidate(); },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? 'Erreur lors de la suppression'),
    });

    // ── Export ───────────────────────────────────────────────────────────────────
    const getClubsForExport = useCallback(() =>
        clubs.map((c) => ({
            name: c.nom,
            region: c.region?.nom ?? '',
            city: c.ville ?? '',
            phone: c.telephone ?? '',
            email: c.email ?? '',
            presidentName: c.nomMaitre ?? '',
            membersCount: c._count?.members ?? 0,
            status: c.isActive ? 'Actif' : 'Inactif',
            createdAt: c.createdAt,
        })),
        [clubs]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clubs</h1>
                    <p className="text-muted-foreground">Gérez les clubs affiliés à l&apos;association.</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton entity="clubs" getData={getClubsForExport} />
                    <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                        <Link href="/admin/clubs/nouveau">
                            <PlusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Nouveau club</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div className="flex items-center gap-2 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Impossible de charger les clubs. Vérifiez que l&apos;API est démarrée.
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: 'Total clubs', value: total, icon: Building2, color: 'text-foreground' },
                    { label: 'Actifs', value: clubs.filter(c => c.isActive).length, icon: ToggleRight, color: 'text-emerald-600' },
                    { label: 'Total membres', value: clubs.reduce((s, c) => s + (c._count?.members ?? 0), 0), icon: Users, color: 'text-blue-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <Icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className={`text-xl font-bold ${color}`}>
                                    {isLoading
                                        ? <span className="inline-block w-10 h-5 bg-muted animate-pulse rounded" />
                                        : value.toLocaleString('fr-FR')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="club-search"
                                placeholder="Rechercher par nom, ville, maître..."
                                className="pl-10"
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-[160px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="active">Actifs</SelectItem>
                                <SelectItem value="inactive">Inactifs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Club</TableHead>
                                    <TableHead className="hidden md:table-cell">Région / Ville</TableHead>
                                    <TableHead className="hidden lg:table-cell">Maître</TableHead>
                                    <TableHead className="hidden sm:table-cell">Membres</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="hidden md:table-cell">Depuis</TableHead>
                                    <TableHead className="w-12" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            {[...Array(7)].map((__, j) => (
                                                <TableCell key={j}>
                                                    <div className="h-5 rounded bg-muted animate-pulse" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : clubs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                            Aucun club trouvé.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clubs.map((club) => (
                                        <TableRow key={club.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {club.logoUrl ? (
                                                        <img src={club.logoUrl} alt={club.nom} className="w-8 h-8 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-foreground">{club.nom}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{club.region?.nom ?? '—'}{club.ville ? `, ${club.ville}` : ''}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                                                {club.nomMaitre ?? '—'}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="w-3 h-3" />
                                                    <span>{club._count?.members ?? 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={club.isActive
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-slate-50 text-slate-500 border-slate-200'}
                                                >
                                                    {club.isActive ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                                {formatDate(club.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/clubs/${club.id}`}>
                                                                <Eye className="w-4 h-4 mr-2" /> Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/clubs/${club.id}/modifier`}>
                                                                <Pencil className="w-4 h-4 mr-2" /> Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {club.isActive ? (
                                                            <DropdownMenuItem
                                                                onClick={() => deactivateMutation.mutate(club.id)}
                                                                className="text-amber-600"
                                                            >
                                                                <ToggleLeft className="w-4 h-4 mr-2" /> Désactiver
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() => activateMutation.mutate(club.id)}
                                                                className="text-emerald-600"
                                                            >
                                                                <ToggleRight className="w-4 h-4 mr-2" /> Activer
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                if (confirm(`Supprimer le club "${club.nom}" ?`)) deleteMutation.mutate(club.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <p className="text-sm text-muted-foreground">{total.toLocaleString('fr-FR')} club(s)</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1 || isLoading}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
                            <Button variant="outline" size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || isLoading}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
