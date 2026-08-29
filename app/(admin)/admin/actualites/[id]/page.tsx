'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Pencil,
    Eye,
    Globe,
    EyeOff,
    Calendar,
    Trash2,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { actualitesApi } from '@/lib/api/actualites';
import { toast } from 'sonner';

function formatDate(d: string | null) {
    if (!d) return 'Non publié';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const articleId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'actualite', articleId],
        queryFn: () => actualitesApi.adminGet(articleId),
        enabled: !!articleId,
    });
    const article = data?.data;

    const deleteMutation = useMutation({
        mutationFn: () => actualitesApi.delete(articleId),
        onSuccess: () => {
            toast.success('Article supprimé');
            queryClient.invalidateQueries({ queryKey: ['admin', 'actualites'] });
            router.push('/admin/actualites');
        },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="space-y-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/actualites"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <p className="text-muted-foreground">Article introuvable.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/actualites"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground line-clamp-1">{article.titre}</h1>
                        <p className="text-sm text-muted-foreground font-mono">/{article.slug}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Supprimer cet article ?')) deleteMutation.mutate();
                        }}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Supprimer
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
                    <Card className="overflow-hidden">
                        {article.imageUrl && (
                            <div className="relative h-64 w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={article.imageUrl} alt={article.titre} className="object-cover w-full h-full" />
                            </div>
                        )}
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">{article.titre}</h2>
                                <Separator />
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap font-sans text-foreground">
                                        {article.contenu}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
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
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Date de publication</p>
                                    <p className="text-sm font-medium">{formatDate(article.publishedAt)}</p>
                                </div>
                            </div>
                            {article.isPublished && (
                                <Button variant="outline" className="w-full gap-2" asChild>
                                    <Link href={`/actualites/${article.slug}`} target="_blank">
                                        <Eye className="w-4 h-4" /> Voir sur le site
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
