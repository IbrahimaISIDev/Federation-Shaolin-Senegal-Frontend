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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { REGIONS } from '@/lib/constants';

const clubSchema = z.object({
    name: z.string().min(3, 'Nom requis'),
    code: z.string().min(3, 'Code requis').max(10, 'Code trop long'),
    region: z.string().min(1, 'Région requise'),
    city: z.string().min(2, 'Ville requise'),
    address: z.string().min(5, 'Adresse requise'),
    phone: z.string().regex(/^(\+221)?[0-9]{9}$/, 'Téléphone invalide'),
    email: z.string().email('Email invalide'),
    presidentName: z.string().min(3, 'Nom du président requis'),
    presidentPhone: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean(),
});

type ClubFormData = z.infer<typeof clubSchema>;

// Mock loaded data — replace with real API fetch
const mockClub: ClubFormData = {
    name: 'Temple Shaolin Dakar', code: 'TSK-001', region: 'dakar', city: 'Dakar',
    address: 'Avenue Cheikh Anta Diop, Point-E', phone: '771234567', email: 'tsdk@email.com',
    presidentName: 'Cheikh Diallo', presidentPhone: '771234567', isActive: true,
    description: 'Le Temple Shaolin Dakar est l\'un des clubs pionniers de la fédération.',
};

export default function EditClubPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClubFormData>({
        resolver: zodResolver(clubSchema),
        defaultValues: mockClub,
    });

    const region = watch('region');
    const isActive = watch('isActive');

    const onSubmit = async (data: ClubFormData) => {
        setIsSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            console.log('Updated club:', data);
            router.push(`/admin/clubs/${params.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/clubs/${params.id}`}><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Modifier le club</h1>
                    <p className="text-muted-foreground">Mettez à jour les informations du club.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Informations du club</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="name">Nom *</Label>
                                <Input id="name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Code *</Label>
                                <Input id="code" {...register('code')} className={errors.code ? 'border-destructive' : ''} />
                                {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Région *</Label>
                                <Select value={region} onValueChange={(v) => setValue('region', v, { shouldValidate: true })}>
                                    <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONS.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville *</Label>
                                <Input id="city" {...register('city')} className={errors.city ? 'border-destructive' : ''} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse *</Label>
                            <Input id="address" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone *</Label>
                                <Input id="phone" type="tel" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" rows={3} {...register('description')} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Président du club</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="presidentName">Nom complet *</Label>
                                <Input id="presidentName" {...register('presidentName')} className={errors.presidentName ? 'border-destructive' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="presidentPhone">Téléphone</Label>
                                <Input id="presidentPhone" type="tel" {...register('presidentPhone')} />
                            </div>
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
                        <Link href={`/admin/clubs/${params.id}`}>Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Sauvegarder
                    </Button>
                </div>
            </form>
        </div>
    );
}
