'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Filter,
    FilePlus,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Globe,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    Newspaper,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type ArticleCategory = 'ACTUALITE' | 'EVENEMENT' | 'COMPETITION' | 'FORMATION';

const mockArticles = [
    { id: '1', title: 'Championnat National Shaolin 2024 : Résultats complets', slug: 'championnat-national-2024', category: 'COMPETITION' as ArticleCategory, author: 'Admin FSS', publishedAt: '2024-02-10', isPublished: true, views: 1240 },
    { id: '2', title: 'Stage de formation des encadrants — Dakar', slug: 'stage-formation-encadrants', category: 'FORMATION' as ArticleCategory, author: 'Secrétariat', publishedAt: '2024-02-05', isPublished: true, views: 340 },
    { id: '3', title: 'Nouveau club affilié à Tambacounda', slug: 'nouveau-club-tambacounda', category: 'ACTUALITE' as ArticleCategory, author: 'Admin FSS', publishedAt: '2024-01-25', isPublished: false, views: 0 },
    { id: '4', title: 'Journée portes ouvertes — Temple Shaolin Dakar', slug: 'journee-portes-ouvertes-dakar', category: 'EVENEMENT' as ArticleCategory, author: 'Admin FSS', publishedAt: '2024-01-20', isPublished: true, views: 890 },
    { id: '5', title: 'Résultats Compétition Inter-Clubs Thiès', slug: 'competition-inter-clubs-thies', category: 'COMPETITION' as ArticleCategory, author: 'Secrétariat', publishedAt: '2024-01-15', isPublished: true, views: 562 },
    { id: '6', title: 'Convocation Assemblée Générale 2024', slug: 'ag-2024', category: 'ACTUALITE' as ArticleCategory, author: 'Président', publishedAt: '', isPublished: false, views: 0 },
];

const categoryConfig: Record<ArticleCategory, { label: string; color: string }> = {
    ACTUALITE: { label: 'Actualité', color: 'bg-blue-100 text-blue-700' },
    EVENEMENT: { label: 'Événement', color: 'bg-purple-100 text-purple-700' },
    COMPETITION: { label: 'Compétition', color: 'bg-orange-100 text-orange-700' },
    FORMATION: { label: 'Formation', color: 'bg-green-100 text-green-700' },
};

function formatDate(dateString: string): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminActualitesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filtered = mockArticles.filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? a.isPublished : !a.isPublished);
        const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const publishedCount = mockArticles.filter((a) => a.isPublished).length;
    const draftCount = mockArticles.filter((a) => !a.isPublished).length;
    const totalViews = mockArticles.reduce((acc, a) => acc + a.views, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Actualités</h1>
                    <p className="text-muted-foreground">Gérez les articles et annonces de la fédération.</p>
                </div>
                <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                    <Link href="/admin/actualites/nouvelle">
                        <FilePlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nouvel article</span>
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold">{mockArticles.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Publiés</p>
                            <p className="text-2xl font-bold text-emerald-600">{publishedCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Brouillons</p>
                            <p className="text-2xl font-bold text-amber-600">{draftCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Vues totales</p>
                            <p className="text-2xl font-bold">{totalViews.toLocaleString('fr-FR')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Rechercher par titre, auteur..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                <SelectItem value="ACTUALITE">Actualité</SelectItem>
                                <SelectItem value="EVENEMENT">Événement</SelectItem>
                                <SelectItem value="COMPETITION">Compétition</SelectItem>
                                <SelectItem value="FORMATION">Formation</SelectItem>
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
                                    <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                                    <TableHead className="hidden md:table-cell">Auteur</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="hidden lg:table-cell">Vues</TableHead>
                                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun article trouvé.</TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>
                                                <p className="font-medium text-foreground line-clamp-1">{article.title}</p>
                                                <p className="text-xs text-muted-foreground font-mono">/{article.slug}</p>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryConfig[article.category].color}`}>
                                                    {categoryConfig[article.category].label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">{article.author}</TableCell>
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
                                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                                                {article.views > 0 ? article.views.toLocaleString('fr-FR') : '—'}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                                {formatDate(article.publishedAt)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/actualites/${article.slug}`} target="_blank">
                                                                <Eye className="w-4 h-4 mr-2" /> Prévisualiser
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/actualites/${article.id}/modifier`}>
                                                                <Pencil className="w-4 h-4 mr-2" /> Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            {article.isPublished ? (
                                                                <><EyeOff className="w-4 h-4 mr-2" /> Dépublier</>
                                                            ) : (
                                                                <><Globe className="w-4 h-4 mr-2" /> Publier</>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
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
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <p className="text-sm text-muted-foreground">{filtered.length} résultat(s)</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4" /></Button>
                            <span className="text-sm text-muted-foreground">Page 1 / 1</span>
                            <Button variant="outline" size="sm" disabled><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
