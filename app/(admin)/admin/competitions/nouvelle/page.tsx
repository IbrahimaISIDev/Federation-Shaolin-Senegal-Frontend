'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Globe, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/shared/date-picker';
import { MediaPicker } from '@/components/shared/media-picker';
import { competitionsApi } from '@/lib/api/competitions';
import { regionsApi } from '@/lib/api/regions';
import { toast } from 'sonner';

const competitionSchema = z.object({
    titre: z.string().min(3, 'Titre requis (min 3 caractères)'),
    regionId: z.string().min(1, 'Région requise'),
    lieu: z.string().optional(),
    dateDebut: z.string().min(1, 'Date de début requise'),
    dateFin: z.string().optional(),
    description: z.string().optional(),
    categories: z.string().optional(),
    imageUrl: z.string().optional().or(z.literal('')),
    isPublished: z.boolean(),
});

type CompetitionFormData = z.infer<typeof competitionSchema>;

export default function NewCompetitionPage() {
    const router = useRouter();

    const { data: regionsData } = useQuery({
        queryKey: ['regions-list'],
        queryFn: () => regionsApi.list(),
    });
    const regions = regionsData?.data ?? [];

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CompetitionFormData>({
        resolver: zodResolver(competitionSchema),
        defaultValues: { isPublished: false },
    });

    const regionId = watch('regionId');
    const isPublished = watch('isPublished');
    const imageUrl = watch('imageUrl');

    const createMutation = useMutation({
        mutationFn: (data: CompetitionFormData) =>
            competitionsApi.create({
                titre: data.titre,
                regionId: parseInt(data.regionId),
                lieu: data.lieu || undefined,
                dateDebut: data.dateDebut,
                dateFin: data.dateFin || undefined,
                description: data.description || undefined,
                categories: data.categories
                    ? data.categories.split(',').map((c) => c.trim()).filter(Boolean)
                    : undefined,
                imageUrl: data.imageUrl || undefined,
                isPublished: data.isPublished,
            }),
        onSuccess: () => {
            toast.success('Compétition créée');
            router.push('/admin/competitions');
        },
        onError: () => toast.error('Erreur lors de la création'),
    });

    const onSubmit = (data: CompetitionFormData) => createMutation.mutate(data);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/competitions"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Nouvelle compétition</h1>
                        <p className="text-muted-foreground">Créez une compétition ou un tournoi.</p>
                    </div>
                </div>
                <Badge variant={isPublished ? 'default' : 'secondary'} className="gap-1">
                    {isPublished ? <><Globe className="w-3 h-3" /> Publiée</> : <><EyeOff className="w-3 h-3" /> Brouillon</>}
                </Badge>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="titre">Titre *</Label>
                                    <Input id="titre" placeholder="Ex: Championnat National Shaolin 2026" {...register('titre')} className={errors.titre ? 'border-destructive' : ''} />
                                    {errors.titre && <p className="text-sm text-destructive">{errors.titre.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" rows={5} placeholder="Présentation de la compétition..." {...register('description')} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Région *</Label>
                                        <Select value={regionId} onValueChange={(v) => setValue('regionId', v, { shouldValidate: true })}>
                                            <SelectTrigger className={errors.regionId ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.map((r) => <SelectItem key={r.id} value={String(r.id)}>{r.nom}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {errors.regionId && <p className="text-sm text-destructive">{errors.regionId.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lieu">Lieu</Label>
                                        <Input id="lieu" placeholder="Ex: Stade Iba Mar Diop, Dakar" {...register('lieu')} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dateDebut">Date de début *</Label>
                                        <DatePicker
                                            id="dateDebut"
                                            value={watch('dateDebut')}
                                            onChange={(v) => setValue('dateDebut', v, { shouldValidate: true })}
                                            error={!!errors.dateDebut}
                                        />
                                        {errors.dateDebut && <p className="text-sm text-destructive">{errors.dateDebut.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateFin">Date de fin</Label>
                                        <DatePicker
                                            id="dateFin"
                                            value={watch('dateFin')}
                                            onChange={(v) => setValue('dateFin', v)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categories">Catégories</Label>
                                    <Input id="categories" placeholder="Kung Fu, Wushu, Tai Chi..." {...register('categories')} />
                                    <p className="text-xs text-muted-foreground">Séparées par des virgules.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
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
                                        <Link href="/admin/competitions">Annuler</Link>
                                    </Button>
                                    <Button type="submit" disabled={createMutation.isPending} className="gap-2 bg-accent hover:bg-accent/90">
                                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {isPublished ? 'Publier' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Image de couverture</CardTitle></CardHeader>
                            <CardContent>
                                <MediaPicker
                                    label="Image de couverture"
                                    value={imageUrl}
                                    onChange={(url) => setValue('imageUrl', url)}
                                    helperText="Affichée sur la page publique de la compétition"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
