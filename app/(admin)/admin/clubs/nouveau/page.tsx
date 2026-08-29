'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MediaPicker } from '@/components/shared/media-picker';
import { clubsApi } from '@/lib/api/clubs';
import { regionsApi } from '@/lib/api/regions';
import { toast } from 'sonner';

const clubSchema = z.object({
    nom: z.string().min(3, 'Nom requis (min 3 caractères)'),
    regionId: z.string().min(1, 'Région requise'),
    ville: z.string().optional(),
    telephone: z.string().optional(),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    nomMaitre: z.string().optional(),
    description: z.string().optional(),
    logoUrl: z.string().optional().or(z.literal('')),
});

type ClubFormData = z.infer<typeof clubSchema>;

export default function NewClubPage() {
    const router = useRouter();

    const { data: regionsData } = useQuery({
        queryKey: ['regions-list'],
        queryFn: () => regionsApi.list(),
    });
    const regions = regionsData?.data ?? [];

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClubFormData>({
        resolver: zodResolver(clubSchema),
    });

    const regionId = watch('regionId');
    const logoUrl = watch('logoUrl');

    const createMutation = useMutation({
        mutationFn: (data: ClubFormData) =>
            clubsApi.create({
                nom: data.nom,
                regionId: parseInt(data.regionId),
                ville: data.ville || undefined,
                telephone: data.telephone || undefined,
                email: data.email || undefined,
                nomMaitre: data.nomMaitre || undefined,
                description: data.description || undefined,
                logoUrl: data.logoUrl || undefined,
            } as any),
        onSuccess: () => {
            toast.success('Club créé');
            router.push('/admin/clubs');
        },
        onError: () => toast.error('Erreur lors de la création'),
    });

    const onSubmit = (data: ClubFormData) => createMutation.mutate(data);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/clubs"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Nouveau club</h1>
                    <p className="text-muted-foreground">Affiliez un nouveau club à l&apos;association.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Club Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du club</CardTitle>
                        <CardDescription>Identité et coordonnées officielles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom du club *</Label>
                            <Input id="nom" placeholder="Ex: Temple Shaolin Dakar" {...register('nom')} className={errors.nom ? 'border-destructive' : ''} />
                            {errors.nom && <p className="text-sm text-destructive">{errors.nom.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Région *</Label>
                                <Select value={regionId} onValueChange={(v) => setValue('regionId', v, { shouldValidate: true })}>
                                    <SelectTrigger className={errors.regionId ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>{r.nom}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.regionId && <p className="text-sm text-destructive">{errors.regionId.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ville">Ville</Label>
                                <Input id="ville" placeholder="Ex: Dakar" {...register('ville')} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input id="telephone" type="tel" placeholder="771234567" {...register('telephone')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="club@email.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <MediaPicker
                                label="Logo du club"
                                value={logoUrl}
                                onChange={(url) => setValue('logoUrl', url)}
                                helperText="Sélectionnez un logo pour le club"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optionnel)</Label>
                                <Textarea id="description" placeholder="Présentation du club, historique..." rows={3} {...register('description')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Master */}
                <Card>
                    <CardHeader>
                        <CardTitle>Maître du club</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nomMaitre">Nom complet</Label>
                            <Input id="nomMaitre" placeholder="Prénom Nom" {...register('nomMaitre')} />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/clubs">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} className="gap-2 bg-accent hover:bg-accent/90">
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer le club
                    </Button>
                </div>
            </form>
        </div>
    );
}
