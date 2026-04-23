'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Globe, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const articleSchema = z.object({
    title: z.string().min(5, 'Titre requis (min 5 caractères)'),
    slug: z.string().min(3, 'Slug requis').regex(/^[a-z0-9-]+$/, 'Slug invalide'),
    excerpt: z.string().min(20, 'Résumé requis').max(300, 'Résumé trop long'),
    content: z.string().min(50, 'Contenu requis'),
    category: z.enum(['ACTUALITE', 'EVENEMENT', 'COMPETITION', 'FORMATION']),
    coverImage: z.string().url('URL invalide').optional().or(z.literal('')),
    tags: z.string().optional(),
    isPublished: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

// Mock data — replace with real API fetch
const mockArticle: ArticleFormData = {
    title: 'Championnat National Shaolin 2024 : Résultats complets',
    slug: 'championnat-national-2024',
    excerpt: 'Le championnat national s\'est tenu à Dakar les 8 et 9 février 2024, réunissant plus de 200 pratiquants venus des 14 régions du Sénégal.',
    content: `# Championnat National Shaolin 2024\n\nLe championnat national s'est tenu à Dakar les 8 et 9 février 2024...\n\n## Résultats par catégorie\n\n### Kung Fu Shaolin\n- 1er : Amadou Ba — Temple Shaolin Dakar\n- 2ème : Omar Sy — Shaolin Ziguinchor\n\n### Wushu\n- 1ère : Fatou Diop — Dragon de Feu Saint-Louis`,
    category: 'COMPETITION',
    coverImage: '',
    tags: 'compétition, kung-fu, dakar, 2024',
    isPublished: true,
};

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: mockArticle,
    });

    const category = watch('category');
    const isPublished = watch('isPublished');

    const onSubmit = async (data: ArticleFormData) => {
        setIsSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            console.log('Updated article:', data);
            router.push('/admin/actualites');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <p className="text-muted-foreground text-sm">ID #{params.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={isPublished ? 'default' : 'secondary'} className="gap-1">
                        {isPublished ? <><Globe className="w-3 h-3" /> Publié</> : <><EyeOff className="w-3 h-3" /> Brouillon</>}
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" /> Supprimer
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
                                    <Label htmlFor="title">Titre *</Label>
                                    <Input id="title" {...register('title')} className={`text-lg font-medium ${errors.title ? 'border-destructive' : ''}`} />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL) *</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">/actualites/</span>
                                        <Input id="slug" {...register('slug')} className={`font-mono text-sm ${errors.slug ? 'border-destructive' : ''}`} />
                                    </div>
                                    {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Résumé *</Label>
                                    <Textarea id="excerpt" rows={2} {...register('excerpt')} className={errors.excerpt ? 'border-destructive' : ''} />
                                    {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Contenu *</Label>
                                    <Textarea id="content" rows={16} {...register('content')} className={`font-mono text-sm ${errors.content ? 'border-destructive' : ''}`} />
                                    {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                                    <p className="text-xs text-muted-foreground">Markdown supporté pour la mise en forme.</p>
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
                                    <Button type="submit" disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Sauvegarder
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Métadonnées</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Catégorie *</Label>
                                    <Select value={category} onValueChange={(v) => setValue('category', v as any, { shouldValidate: true })}>
                                        <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTUALITE">Actualité</SelectItem>
                                            <SelectItem value="EVENEMENT">Événement</SelectItem>
                                            <SelectItem value="COMPETITION">Compétition</SelectItem>
                                            <SelectItem value="FORMATION">Formation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coverImage">Image de couverture</Label>
                                    <Input id="coverImage" type="url" placeholder="https://..." {...register('coverImage')} className={errors.coverImage ? 'border-destructive' : ''} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input id="tags" placeholder="kung-fu, dakar..." {...register('tags')} />
                                    <p className="text-xs text-muted-foreground">Séparés par des virgules.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
