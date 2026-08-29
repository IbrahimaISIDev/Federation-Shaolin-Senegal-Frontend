'use client';

import { useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Globe, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MediaPicker } from '@/components/shared/media-picker';
import { actualitesApi } from '@/lib/api/actualites';
import { toast } from 'sonner';

const articleSchema = z.object({
    titre: z.string().min(5, 'Titre requis (min 5 caractères)'),
    contenu: z.string().min(20, 'Contenu requis'),
    imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
    isPublished: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditArticlePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const { id } = use(paramsPromise);
    const articleId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'actualite', articleId],
        queryFn: () => actualitesApi.adminGet(articleId),
        enabled: !!articleId,
    });
    const article = data?.data;

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: { isPublished: false },
    });

    useEffect(() => {
        if (article) {
            reset({
                titre: article.titre,
                contenu: article.contenu,
                imageUrl: article.imageUrl ?? '',
                isPublished: article.isPublished,
            });
        }
    }, [article, reset]);

    const isPublished = watch('isPublished');
    const imageUrl = watch('imageUrl');

    const updateMutation = useMutation({
        mutationFn: (data: ArticleFormData) =>
            actualitesApi.update(articleId, {
                titre: data.titre,
                contenu: data.contenu,
                imageUrl: data.imageUrl || undefined,
                isPublished: data.isPublished,
            }),
        onSuccess: () => {
            toast.success('Article mis à jour');
            queryClient.invalidateQueries({ queryKey: ['admin', 'actualite', articleId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'actualites'] });
            router.push('/admin/actualites');
        },
        onError: () => toast.error('Erreur lors de la mise à jour'),
    });

    const deleteMutation = useMutation({
        mutationFn: () => actualitesApi.delete(articleId),
        onSuccess: () => {
            toast.success('Article supprimé');
            queryClient.invalidateQueries({ queryKey: ['admin', 'actualites'] });
            router.push('/admin/actualites');
        },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    const onSubmit = (data: ArticleFormData) => updateMutation.mutate(data);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/actualites"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Modifier l&apos;article</h1>
                        {article && <p className="text-muted-foreground text-sm font-mono">/{article.slug}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={isPublished ? 'default' : 'secondary'} className="gap-1">
                        {isPublished ? <><Globe className="w-3 h-3" /> Publié</> : <><EyeOff className="w-3 h-3" /> Brouillon</>}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Supprimer cet article ?')) deleteMutation.mutate();
                        }}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Supprimer
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Contenu de l&apos;article</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titre">Titre *</Label>
                                    <Input id="titre" {...register('titre')} className={`text-lg font-medium ${errors.titre ? 'border-destructive' : ''}`} />
                                    {errors.titre && <p className="text-sm text-destructive">{errors.titre.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contenu">Contenu *</Label>
                                    <Textarea id="contenu" rows={16} {...register('contenu')} className={errors.contenu ? 'border-destructive' : ''} />
                                    {errors.contenu && <p className="text-sm text-destructive">{errors.contenu.message}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Publication</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">Publié</p>
                                        <p className="text-xs text-muted-foreground">Visible au grand public</p>
                                    </div>
                                    <Switch checked={isPublished} onCheckedChange={(v) => setValue('isPublished', v)} />
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/admin/actualites">Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={updateMutation.isPending} className="gap-2 bg-accent hover:bg-accent/90">
                                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Sauvegarder
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Image de couverture</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <MediaPicker
                                    label="Image de couverture"
                                    value={imageUrl}
                                    onChange={(url) => setValue('imageUrl', url)}
                                    helperText="Sélectionnez une image pour l'article"
                                />
                                {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
