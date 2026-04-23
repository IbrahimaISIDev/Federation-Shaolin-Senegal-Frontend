'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
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
import { REGIONS } from '@/lib/constants';
import { MediaPicker } from '@/components/shared/media-picker';

const clubSchema = z.object({
    name: z.string().min(3, 'Nom requis (min 3 caractères)'),
    code: z.string().min(3, 'Code requis').max(10, 'Code trop long'),
    region: z.string().min(1, 'Région requise'),
    city: z.string().min(2, 'Ville requise'),
    address: z.string().min(5, 'Adresse requise'),
    phone: z.string().regex(/^(\+221)?[0-9]{9}$/, 'Téléphone invalide'),
    email: z.string().email('Email invalide'),
    presidentName: z.string().min(3, 'Nom du président requis'),
    presidentPhone: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional().or(z.literal('')),
    isActive: z.boolean(),
});

type ClubFormData = z.infer<typeof clubSchema>;

export default function NewClubPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ClubFormData>({
        resolver: zodResolver(clubSchema),
        defaultValues: {
            region: '',
            isActive: true,
        },
    });

    const region = watch('region');
    const isActive = watch('isActive');

    const onSubmit = async (data: ClubFormData) => {
        setIsSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            console.log('New club:', data);
            router.push('/admin/clubs');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/clubs"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Nouveau club</h1>
                    <p className="text-muted-foreground">Affiliez un nouveau club à la fédération.</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="name">Nom du club *</Label>
                                <Input id="name" placeholder="Ex: Temple Shaolin Dakar" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Code *</Label>
                                <Input id="code" placeholder="Ex: TSK-001" {...register('code')} className={errors.code ? 'border-destructive' : ''} />
                                {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Région *</Label>
                                <Select value={region} onValueChange={(v) => setValue('region', v, { shouldValidate: true })}>
                                    <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONS.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville *</Label>
                                <Input id="city" placeholder="Ex: Dakar" {...register('city')} className={errors.city ? 'border-destructive' : ''} />
                                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse *</Label>
                            <Input id="address" placeholder="Rue, quartier, ville..." {...register('address')} className={errors.address ? 'border-destructive' : ''} />
                            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone *</Label>
                                <Input id="phone" type="tel" placeholder="771234567" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" placeholder="club@email.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <MediaPicker
                                label="Logo du club"
                                value={watch('logo')}
                                onChange={(url) => setValue('logo', url)}
                                helperText="Sélectionnez un logo pour le club"
                            />
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optionnel)</Label>
                                <Textarea id="description" placeholder="Présentation du club, historique..." rows={3} {...register('description')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* President */}
                <Card>
                    <CardHeader>
                        <CardTitle>Président du club</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="presidentName">Nom complet *</Label>
                                <Input id="presidentName" placeholder="Prénom Nom" {...register('presidentName')} className={errors.presidentName ? 'border-destructive' : ''} />
                                {errors.presidentName && <p className="text-sm text-destructive">{errors.presidentName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="presidentPhone">Téléphone du président</Label>
                                <Input id="presidentPhone" type="tel" placeholder="771234567" {...register('presidentPhone')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
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

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/clubs">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer le club
                    </Button>
                </div>
            </form>
        </div>
    );
}
