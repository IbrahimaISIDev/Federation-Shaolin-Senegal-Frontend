'use client';

import { useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
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
import { MediaPicker } from '@/components/shared/media-picker';
import { clubsApi } from '@/lib/api/clubs';
import { regionsApi } from '@/lib/api/regions';
import { toast } from 'sonner';

const clubSchema = z.object({
    nom: z.string().min(3, 'Nom requis'),
    regionId: z.string().min(1, 'Région requise'),
    ville: z.string().optional(),
    telephone: z.string().optional(),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    nomMaitre: z.string().optional(),
    description: z.string().optional(),
    logoUrl: z.string().optional().or(z.literal('')),
    isActive: z.boolean(),
});

type ClubFormData = z.infer<typeof clubSchema>;

export default function EditClubPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const { id } = use(paramsPromise);
    const clubId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'club', clubId],
        queryFn: () => clubsApi.get(clubId),
        enabled: !!clubId,
    });
    const club = data?.data as any;

    const { data: regionsData } = useQuery({
        queryKey: ['regions-list'],
        queryFn: () => regionsApi.list(),
    });
    const regions = regionsData?.data ?? [];

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ClubFormData>({
        resolver: zodResolver(clubSchema),
        defaultValues: { isActive: true },
    });

    useEffect(() => {
        if (club) {
            reset({
                nom: club.nom,
                regionId: String(club.regionId),
                ville: club.ville ?? '',
                telephone: club.telephone ?? '',
                email: club.email ?? '',
                nomMaitre: club.nomMaitre ?? '',
                description: club.description ?? '',
                logoUrl: club.logoUrl ?? '',
                isActive: club.isActive,
            });
        }
    }, [club, reset]);

    const regionId = watch('regionId');
    const isActive = watch('isActive');
    const logoUrl = watch('logoUrl');

    const updateMutation = useMutation({
        mutationFn: (data: ClubFormData) =>
            clubsApi.update(clubId, {
                nom: data.nom,
                regionId: parseInt(data.regionId),
                ville: data.ville || undefined,
                telephone: data.telephone || undefined,
                email: data.email || undefined,
                nomMaitre: data.nomMaitre || undefined,
                description: data.description || undefined,
                logoUrl: data.logoUrl || undefined,
                isActive: data.isActive,
            } as any),
        onSuccess: () => {
            toast.success('Club mis à jour');
            queryClient.invalidateQueries({ queryKey: ['admin', 'club', clubId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'clubs'] });
            router.push(`/admin/clubs/${id}`);
        },
        onError: () => toast.error('Erreur lors de la mise à jour'),
    });

    const onSubmit = (data: ClubFormData) => updateMutation.mutate(data);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/clubs/${id}`}><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Modifier le club</h1>
                    <p className="text-muted-foreground">{club ? club.nom : `Club #${id}`}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Informations du club</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom *</Label>
                            <Input id="nom" {...register('nom')} className={errors.nom ? 'border-destructive' : ''} />
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
                                        {regions.map((r) => <SelectItem key={r.id} value={String(r.id)}>{r.nom}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.regionId && <p className="text-sm text-destructive">{errors.regionId.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ville">Ville</Label>
                                <Input id="ville" {...register('ville')} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input id="telephone" type="tel" {...register('telephone')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <MediaPicker
                                label="Logo du club"
                                value={logoUrl}
                                onChange={(url) => setValue('logoUrl', url)}
                                helperText="Changer le logo du club"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" rows={3} {...register('description')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Maître du club</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nomMaitre">Nom complet</Label>
                            <Input id="nomMaitre" {...register('nomMaitre')} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium">Statut du club</p>
                            <p className="text-sm text-muted-foreground">Un club actif peut accueillir de nouveaux membres.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{isActive ? 'Actif' : 'Inactif'}</span>
                            <Switch checked={isActive} onCheckedChange={(v) => setValue('isActive', v)} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href={`/admin/clubs/${id}`}>Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending} className="gap-2 bg-accent hover:bg-accent/90">
                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Sauvegarder
                    </Button>
                </div>
            </form>
        </div>
    );
}
