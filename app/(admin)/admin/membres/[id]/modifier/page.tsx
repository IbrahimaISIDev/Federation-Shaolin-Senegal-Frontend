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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/shared/date-picker';
import { MediaPicker } from '@/components/shared/media-picker';
import { DISCIPLINES, GRADES } from '@/lib/constants';
import { membersApi } from '@/lib/api/members';
import { clubsApi } from '@/lib/api/clubs';
import { toast } from 'sonner';

const memberSchema = z.object({
    prenom: z.string().min(2, 'Prénom requis'),
    nom: z.string().min(2, 'Nom requis'),
    dateNaissance: z.string().optional(),
    sexe: z.enum(['M', 'F']).optional(),
    clubId: z.string().min(1, 'Club requis'),
    discipline: z.string().optional(),
    grade: z.string().optional(),
    photoUrl: z.string().optional().or(z.literal('')),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function EditMemberPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const { id } = use(paramsPromise);
    const memberId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'member', memberId],
        queryFn: () => membersApi.adminGet(memberId),
        enabled: !!memberId,
    });
    const member = data?.data;

    const { data: clubsData } = useQuery({
        queryKey: ['clubs-list'],
        queryFn: () => clubsApi.list({ limit: 200 }),
    });
    const clubs = (clubsData as any)?.data ?? [];

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
    });

    useEffect(() => {
        if (member) {
            reset({
                prenom: member.prenom,
                nom: member.nom,
                dateNaissance: member.dateNaissance ? member.dateNaissance.slice(0, 10) : '',
                sexe: member.sexe ?? undefined,
                clubId: String(member.clubId),
                discipline: member.discipline ?? '',
                grade: member.grade ?? '',
                photoUrl: member.photoUrl ?? '',
            });
        }
    }, [member, reset]);

    const sexe = watch('sexe');
    const clubId = watch('clubId');
    const discipline = watch('discipline');
    const grade = watch('grade');
    const photoUrl = watch('photoUrl');

    const updateMutation = useMutation({
        mutationFn: (data: MemberFormData) =>
            membersApi.adminUpdate(memberId, {
                prenom: data.prenom,
                nom: data.nom,
                dateNaissance: data.dateNaissance || undefined,
                sexe: data.sexe,
                clubId: parseInt(data.clubId),
                discipline: data.discipline || undefined,
                grade: data.grade || undefined,
                photoUrl: data.photoUrl || undefined,
            }),
        onSuccess: () => {
            toast.success('Membre mis à jour');
            queryClient.invalidateQueries({ queryKey: ['admin', 'member', memberId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'members'] });
            router.push(`/admin/membres/${id}`);
        },
        onError: () => toast.error('Erreur lors de la mise à jour'),
    });

    const onSubmit = (data: MemberFormData) => updateMutation.mutate(data);

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
                    <Link href={`/admin/membres/${id}`}><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Modifier le membre</h1>
                    <p className="text-muted-foreground">
                        {member ? `${member.prenom} ${member.nom}` : `Membre #${id}`}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <MediaPicker
                            label="Photo de profil"
                            value={photoUrl}
                            onChange={(url) => setValue('photoUrl', url)}
                            helperText="Format carré recommandé"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prenom">Prénom *</Label>
                                <Input id="prenom" {...register('prenom')} className={errors.prenom ? 'border-destructive' : ''} />
                                {errors.prenom && <p className="text-sm text-destructive">{errors.prenom.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nom">Nom *</Label>
                                <Input id="nom" {...register('nom')} className={errors.nom ? 'border-destructive' : ''} />
                                {errors.nom && <p className="text-sm text-destructive">{errors.nom.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateNaissance">Date de naissance</Label>
                                <DatePicker
                                    id="dateNaissance"
                                    value={watch('dateNaissance')}
                                    onChange={(v) => setValue('dateNaissance', v)}
                                    maxDate={new Date()}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Sexe</Label>
                                <Select value={sexe} onValueChange={(v) => setValue('sexe', v as 'M' | 'F')}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculin</SelectItem>
                                        <SelectItem value="F">Féminin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            L&apos;email, le téléphone et l&apos;adresse proviennent du dossier d&apos;affiliation d&apos;origine et ne sont pas modifiables ici.
                        </p>
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
                                    {clubs.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.clubId && <p className="text-sm text-destructive">{errors.clubId.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Discipline</Label>
                                <Select value={discipline} onValueChange={(v) => setValue('discipline', v)}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                    <SelectContent>
                                        {DISCIPLINES.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Grade</Label>
                                <Select value={grade} onValueChange={(v) => setValue('grade', v)}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                    <SelectContent>
                                        {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href={`/admin/membres/${id}`}>Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending} className="gap-2 bg-accent hover:bg-accent/90">
                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Sauvegarder les modifications
                    </Button>
                </div>
            </form>
        </div>
    );
}
