'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Globe, EyeOff } from 'lucide-react';
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
    contenu: z.string().min(20, 'Contenu requis (min 20 caractères)'),
    imageUrl: z.string().url('URL de l\'image invalide').optional().or(z.literal('')),
    isPublished: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function NewArticlePage() {
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: { isPublished: false },
    });

    const isPublished = watch('isPublished');
    const imageUrl = watch('imageUrl');

    const createMutation = useMutation({
        mutationFn: (data: ArticleFormData) =>
            actualitesApi.create({
                titre: data.titre,
                contenu: data.contenu,
                imageUrl: data.imageUrl || undefined,
                isPublished: data.isPublished,
            }),
        onSuccess: () => {
            toast.success('Article créé');
            router.push('/admin/actualites');
        },
        onError: () => toast.error('Erreur lors de la création'),
    });

    const onSubmit = (data: ArticleFormData) => createMutation.mutate(data);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/actualites"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Nouvel article</h1>
                        <p className="text-muted-foreground">Rédigez et publiez un article.</p>
                    </div>
                </div>
                <Badge variant={isPublished ? 'default' : 'secondary'} className="gap-1">
                    {isPublished ? <><Globe className="w-3 h-3" /> Publié</> : <><EyeOff className="w-3 h-3" /> Brouillon</>}
                </Badge>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenu de l&apos;article</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titre">Titre *</Label>
                                    <Input
                                        id="titre"
                                        placeholder="Titre de l'article..."
                                        {...register('titre')}
                                        className={`text-lg font-medium ${errors.titre ? 'border-destructive' : ''}`}
                                    />
                                    {errors.titre && <p className="text-sm text-destructive">{errors.titre.message}</p>}
                                    <p className="text-xs text-muted-foreground">L&apos;URL de l&apos;article sera générée automatiquement à partir du titre.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contenu">Contenu *</Label>
                                    <Textarea
                                        id="contenu"
                                        placeholder="Rédigez votre article ici..."
                                        rows={14}
                                        {...register('contenu')}
                                        className={errors.contenu ? 'border-destructive' : ''}
                                    />
                                    {errors.contenu && <p className="text-sm text-destructive">{errors.contenu.message}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publication */}
                        <Card>
                            <CardHeader><CardTitle>Publication</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">Publier maintenant</p>
                                        <p className="text-xs text-muted-foreground">Rendre visible au public</p>
                                    </div>
                                    <Switch checked={isPublished} onCheckedChange={(v) => setValue('isPublished', v)} />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/admin/actualites">Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={createMutation.isPending} className="gap-2 bg-accent hover:bg-accent/90">
                                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {isPublished ? 'Publier' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cover image */}
                        <Card>
                            <CardHeader><CardTitle>Image de couverture</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <MediaPicker
                                    label="Image de couverture"
                                    value={imageUrl}
                                    onChange={(url) => setValue('imageUrl', url)}
                                    helperText="URL de l'image ou sélection depuis la bibliothèque"
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
