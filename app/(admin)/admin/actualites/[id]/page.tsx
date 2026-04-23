'use client';

import Link from 'next/link';
import {
    ArrowLeft,
    Pencil,
    Eye,
    Globe,
    EyeOff,
    Calendar,
    User,
    Tag,
    BarChart3,
    Trash2,
    Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Mock data — replace with real API fetch
const mockArticle = {
    id: '1',
    title: 'Championnat National Shaolin 2024 : Résultats complets',
    slug: 'championnat-national-2024',
    excerpt: 'Le championnat national s\'est tenu à Dakar les 8 et 9 février 2024, réunissant plus de 200 pratiquants venus des 14 régions du Sénégal.',
    content: `# Championnat National Shaolin 2024\n\nLe championnat national s'est tenu à Dakar les 8 et 9 février 2024...\n\n## Résultats par catégorie\n\n### Kung Fu Shaolin\n- 1er : Amadou Ba — Temple Shaolin Dakar\n- 2ème : Omar Sy — Shaolin Ziguinchor\n\n### Wushu\n- 1ère : Fatou Diop — Dragon de Feu Saint-Louis`,
    category: 'COMPETITION',
    author: 'Admin FSS',
    publishedAt: '2024-02-10',
    isPublished: true,
    views: 1240,
    tags: ['compétition', 'kung-fu', 'dakar', '2024'],
    coverImage: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800',
};

const categoryConfig: Record<string, { label: string; color: string }> = {
    ACTUALITE: { label: 'Actualité', color: 'bg-blue-100 text-blue-700' },
    EVENEMENT: { label: 'Événement', color: 'bg-purple-100 text-purple-700' },
    COMPETITION: { label: 'Compétition', color: 'bg-orange-100 text-orange-700' },
    FORMATION: { label: 'Formation', color: 'bg-green-100 text-green-700' },
};

function formatDate(d: string) {
    if (!d) return 'Non publié';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
    const article = mockArticle; // TODO: fetch by params.id
    const category = categoryConfig[article.category];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/actualites"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground line-clamp-1">{article.title}</h1>
                        <p className="text-sm text-muted-foreground font-mono">/{article.slug}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" /> Supprimer
                    </Button>
                    <Button className="gap-2 bg-accent hover:bg-accent/90" asChild>
                        <Link href={`/admin/actualites/${article.id}/modifier`}>
                            <Pencil className="w-4 h-4" /> Modifier
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preview Card */}
                    <Card className="overflow-hidden">
                        {article.coverImage && (
                            <div className="relative h-64 w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={article.coverImage} alt={article.title} className="object-cover w-full h-full" />
                                <div className="absolute top-4 left-4">
                                    <Badge className={category.color}>{category.label}</Badge>
                                </div>
                            </div>
                        )}
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                                    <p className="text-muted-foreground italic">{article.excerpt}</p>
                                </div>
                                <Separator />
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {/* In a real app, use a markdown renderer here */}
                                    <div className="whitespace-pre-wrap font-sans text-foreground">
                                        {article.content}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Publication Status */}
                    <Card>
                        <CardHeader><CardTitle>Statut & Visibilité</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">État</span>
                                {article.isPublished ? (
                                    <Badge className="bg-emerald-500 gap-1"><Globe className="w-3 h-3" /> Publié</Badge>
                                ) : (
                                    <Badge variant="secondary" className="gap-1"><EyeOff className="w-3 h-3" /> Brouillon</Badge>
                                )}
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date de publication</p>
                                        <p className="text-sm font-medium">{formatDate(article.publishedAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Auteur</p>
                                        <p className="text-sm font-medium">{article.author}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Vues</p>
                                        <p className="text-sm font-medium">{article.views.toLocaleString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full gap-2" asChild>
                                <Link href={`/actualites/${article.slug}`} target="_blank">
                                    <Eye className="w-4 h-4" /> Voir sur le site
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="w-4 h-4" /> Tags</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="bg-muted/50 font-normal">#{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
