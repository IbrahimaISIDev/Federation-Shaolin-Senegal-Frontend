'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import {
    Search, Filter, FilePlus, MoreHorizontal, Eye, Pencil, Trash2,
    Globe, EyeOff, ChevronLeft, ChevronRight, Loader2, Newspaper, BookOpen, AlertCircle,
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
import { actualitesApi, type Actualite } from '@/lib/api';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

function formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function AdminActualitesPage() {
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState('');
    const [search] = useDebounce(searchInput, 400);
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    // ── Data ────────────────────────────────────────────────────────────────────
    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'actualites', { search, status: statusFilter, page }],
        queryFn: () =>
            actualitesApi.adminList({
                search: search || undefined,
                published: statusFilter === 'published' ? true : statusFilter === 'draft' ? false : undefined,
                page,
                limit: PAGE_SIZE,
            }),
        staleTime: 60 * 1000,
    });

    const articles: Actualite[] = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const publishedCount = articles.filter((a) => a.isPublished).length;
    const draftCount = articles.filter((a) => !a.isPublished).length;

    // ── Mutations ────────────────────────────────────────────────────────────────
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'actualites'] });

    const publishMutation = useMutation({
        mutationFn: (id: number) => actualitesApi.publish(id),
        onSuccess: () => { toast.success('Article publié'); invalidate(); },
        onError: () => toast.error('Erreur lors de la publication'),
    });

    const unpublishMutation = useMutation({
        mutationFn: (id: number) => actualitesApi.unpublish(id),
        onSuccess: () => { toast.success('Article dépublié'); invalidate(); },
        onError: () => toast.error('Erreur lors de la dépublication'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => actualitesApi.delete(id),
        onSuccess: () => { toast.success('Article supprimé'); invalidate(); },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    // ── Export ───────────────────────────────────────────────────────────────────
    const getArticlesForExport = useCallback(() =>
        articles.map((a) => ({
            title: a.titre,
            slug: a.slug,
            status: a.isPublished ? 'Publié' : 'Brouillon',
            publishedAt: a.publishedAt ?? '',
            createdAt: a.createdAt,
        })),
        [articles]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Actualités</h1>
                    <p className="text-muted-foreground">Gérez les articles et annonces de la fédération.</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton entity="actualites" getData={getArticlesForExport} />
                    <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                        <Link href="/admin/actualites/nouvelle">
                            <FilePlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nouvel article</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div className="flex items-center gap-2 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Impossible de charger les articles. Vérifiez que l&apos;API est démarrée.
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: 'Total', value: total, icon: Newspaper, color: 'text-foreground', iconBg: 'bg-primary/10 text-primary' },
                    { label: 'Publiés', value: publishedCount, icon: Globe, color: 'text-emerald-600', iconBg: 'bg-emerald-500/10 text-emerald-500' },
                    { label: 'Brouillons', value: draftCount, icon: BookOpen, color: 'text-amber-600', iconBg: 'bg-amber-500/10 text-amber-500' },
                ].map(({ label, value, icon: Icon, color, iconBg }) => (
                    <Card key={label}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>
                                    {isLoading
                                        ? <span className="inline-block w-10 h-6 bg-muted animate-pulse rounded" />
                                        : value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="article-search"
                                placeholder="Rechercher par titre..."
                                className="pl-10"
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="published">Publiés</SelectItem>
                                <SelectItem value="draft">Brouillons</SelectItem>
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
                                    <TableHead>Article</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="hidden md:table-cell">Créé le</TableHead>
                                    <TableHead className="hidden lg:table-cell">Publié le</TableHead>
                                    <TableHead className="w-12" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            {[...Array(5)].map((__, j) => (
                                                <TableCell key={j}><div className="h-5 rounded bg-muted animate-pulse" /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : articles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            Aucun article trouvé.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    articles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>
                                                <p className="font-medium text-foreground line-clamp-1">{article.titre}</p>
                                                <p className="text-xs text-muted-foreground font-mono">/{article.slug}</p>
                                            </TableCell>
                                            <TableCell>
                                                {article.isPublished ? (
                                                    <Badge variant="default" className="gap-1 bg-emerald-600">
                                                        <Globe className="w-3 h-3" /> Publié
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <EyeOff className="w-3 h-3" /> Brouillon
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                                {formatDate(article.createdAt)}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                                {formatDate(article.publishedAt)}
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
                                                        {article.isPublished && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/actualites/${article.slug}`} target="_blank">
                                                                    <Eye className="w-4 h-4 mr-2" /> Voir en ligne
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/actualites/${article.id}`}>
                                                                <Pencil className="w-4 h-4 mr-2" /> Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {article.isPublished ? (
                                                            <DropdownMenuItem
                                                                onClick={() => unpublishMutation.mutate(article.id)}
                                                                className="text-amber-600"
                                                            >
                                                                <EyeOff className="w-4 h-4 mr-2" /> Dépublier
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() => publishMutation.mutate(article.id)}
                                                                className="text-emerald-600"
                                                            >
                                                                <Globe className="w-4 h-4 mr-2" /> Publier
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                if (confirm(`Supprimer "${article.titre}" ?`)) deleteMutation.mutate(article.id);
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
                        <p className="text-sm text-muted-foreground">{total.toLocaleString('fr-FR')} article(s)</p>
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
