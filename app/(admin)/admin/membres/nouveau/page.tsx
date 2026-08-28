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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { REGIONS, DISCIPLINES, GRADES } from '@/lib/constants';
import { MediaPicker } from '@/components/shared/media-picker';

const memberSchema = z.object({
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().min(2, 'Nom requis'),
    email: z.string().email('Email invalide'),
    phone: z.string().regex(/^(\+221)?[0-9]{9}$/, 'Téléphone invalide'),
    birthDate: z.string().min(1, 'Date de naissance requise'),
    gender: z.enum(['M', 'F']),
    nationality: z.string().min(2, 'Nationalité requise'),
    address: z.string().min(5, 'Adresse requise'),
    city: z.string().min(2, 'Ville requise'),
    region: z.string().min(1, 'Région requise'),
    clubId: z.string().min(1, 'Club requis'),
    discipline: z.string().min(1, 'Discipline requise'),
    grade: z.string().min(1, 'Grade requis'),
    photo: z.string().optional().or(z.literal('')),
    notes: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

const MOCK_CLUBS = [
    { id: 'club-1', name: 'Temple Shaolin Dakar' },
    { id: 'club-2', name: 'Dragon de Feu Saint-Louis' },
    { id: 'club-3', name: 'Wushu Academy Thiès' },
];

export default function NewMemberPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            nationality: 'Sénégalaise',
            region: '',
            clubId: '',
            discipline: '',
            grade: '',
            photo: '',
        },
    });

    const gender = watch('gender');
    const region = watch('region');
    const clubId = watch('clubId');
    const discipline = watch('discipline');
    const grade = watch('grade');

    const onSubmit = async (data: MemberFormData) => {
        setIsSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            console.log('New member:', data);
            router.push('/admin/membres');
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
                    <Link href="/admin/membres"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Nouveau membre</h1>
                    <p className="text-muted-foreground">Enregistrez un nouveau membre dans l&apos;association.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>Identité et coordonnées du membre.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <MediaPicker
                            label="Photo de profil"
                            value={watch('photo')}
                            onChange={(url) => setValue('photo', url)}
                            helperText="Format carré recommandé"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom *</Label>
                                <Input id="firstName" {...register('firstName')} className={errors.firstName ? 'border-destructive' : ''} />
                                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom *</Label>
                                <Input id="lastName" {...register('lastName')} className={errors.lastName ? 'border-destructive' : ''} />
                                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone *</Label>
                                <Input id="phone" type="tel" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthDate">Date de naissance *</Label>
                                <Input id="birthDate" type="date" {...register('birthDate')} className={errors.birthDate ? 'border-destructive' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>Sexe *</Label>
                                <Select value={gender} onValueChange={(v) => setValue('gender', v as 'M' | 'F', { shouldValidate: true })}>
                                    <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculin</SelectItem>
                                        <SelectItem value="F">Féminin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Adresse</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse complète *</Label>
                            <Input id="address" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville *</Label>
                                <Input id="city" {...register('city')} className={errors.city ? 'border-destructive' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>Région *</Label>
                                <Select value={region} onValueChange={(v) => setValue('region', v, { shouldValidate: true })}>
                                    <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONS.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Club & Discipline</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Club *</Label>
                            <Select value={clubId} onValueChange={(v) => setValue('clubId', v, { shouldValidate: true })}>
                                <SelectTrigger className={errors.clubId ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Sélectionner un club" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_CLUBS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Discipline *</Label>
                                <Select value={discipline} onValueChange={(v) => setValue('discipline', v, { shouldValidate: true })}>
                                    <SelectTrigger className={errors.discipline ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DISCIPLINES.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Grade *</Label>
                                <Select value={grade} onValueChange={(v) => setValue('grade', v, { shouldValidate: true })}>
                                    <SelectTrigger className={errors.grade ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes internes</Label>
                            <Textarea id="notes" rows={3} {...register('notes')} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/membres">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer le membre
                    </Button>
                </div>
            </form>
        </div>
    );
}
