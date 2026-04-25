'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Globe, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MediaPicker } from '@/components/shared/media-picker';

const articleSchema = z.object({
    title: z.string().min(5, 'Titre requis (min 5 caractères)'),
    slug: z.string().min(3, 'Slug requis').regex(/^[a-z0-9-]+$/, 'Slug invalide (lettres minuscules, chiffres, tirets)'),
    excerpt: z.string().min(20, 'Résumé requis (min 20 caractères)').max(300, 'Résumé trop long (max 300 caract.)'),
    content: z.string().min(50, 'Contenu requis (min 50 caractères)'),
    category: z.enum(['ACTUALITE', 'EVENEMENT', 'COMPETITION', 'FORMATION'], { errorMap: () => ({ message: 'Catégorie requise' }) }),
    coverImage: z.string().url('URL de l\'image invalide').optional().or(z.literal('')),
    tags: z.string().optional(),
    isPublished: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function NewArticlePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            category: '' as any,
            isPublished: false,
        },
    });

    const category = watch('category');
    const isPublished = watch('isPublished');
    const title = watch('title');

    // Auto-generate slug from title
    const generateSlug = (t: string) => {
        return t
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue('slug', generateSlug(val), { shouldValidate: false });
    };

    const onSubmit = async (data: ArticleFormData) => {
        setIsSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            console.log('New article:', data);
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
                                    <Label htmlFor="title">Titre *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Titre de l'article..."
                                        {...register('title')}
                                        onChange={(e) => { register('title').onChange(e); handleTitleChange(e); }}
                                        className={`text-lg font-medium ${errors.title ? 'border-destructive' : ''}`}
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL) *</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">/actualites/</span>
                                        <Input id="slug" placeholder="mon-article" {...register('slug')} className={`font-mono text-sm ${errors.slug ? 'border-destructive' : ''}`} />
                                    </div>
                                    {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Résumé *</Label>
                                    <Textarea
                                        id="excerpt"
                                        placeholder="Résumé court de l'article (affiché sur la liste)..."
                                        rows={2}
                                        {...register('excerpt')}
                                        className={errors.excerpt ? 'border-destructive' : ''}
                                    />
                                    {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Contenu *</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Rédigez votre article ici... (Markdown supporté)"
                                        rows={14}
                                        {...register('content')}
                                        className={`font-mono text-sm ${errors.content ? 'border-destructive' : ''}`}
                                    />
                                    {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                                    <p className="text-xs text-muted-foreground">Markdown est supporté pour la mise en forme.</p>
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
                                    <Button type="submit" disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {isPublished ? 'Publier' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader><CardTitle>Métadonnées</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Catégorie *</Label>
                                    <Select value={category} onValueChange={(v) => setValue('category', v as any, { shouldValidate: true })}>
                                        <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Sélectionner" />
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
                                    <MediaPicker
                                        label="Image de couverture"
                                        value={watch('coverImage')}
                                        onChange={(url) => setValue('coverImage', url)}
                                        helperText="URL de l'image ou sélection depuis la bibliothèque"
                                    />
                                    {errors.coverImage && <p className="text-sm text-destructive">{errors.coverImage.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (optionnel)</Label>
                                    <Input id="tags" placeholder="kung-fu, compétition, dakar" {...register('tags')} />
                                    <p className="text-xs text-muted-foreground">Séparés par des virgules</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
