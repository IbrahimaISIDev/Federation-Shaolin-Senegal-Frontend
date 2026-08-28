'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { maitreAffiliationSchema, type MaitreAffiliationData } from '@/lib/validations/affiliation';
import { affiliationApi } from '@/lib/api/affiliation';
import { clubsApi } from '@/lib/api/clubs';
import { regionsApi } from '@/lib/api/regions';
import { DISCIPLINES } from '@/lib/constants';

const GRADES_DUAN = [
  '1er Duan', '2ème Duan', '3ème Duan', '4ème Duan',
  '5ème Duan', '6ème Duan', '7ème Duan',
];

export function MaitreAffiliationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const { data: clubsData } = useQuery({
    queryKey: ['clubs-list'],
    queryFn: () => clubsApi.list({ limit: 100 }),
  });

  const { data: regionsData } = useQuery({
    queryKey: ['regions-list'],
    queryFn: () => regionsApi.list(),
  });
  const regions = regionsData?.data ?? [];

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<MaitreAffiliationData>({ resolver: zodResolver(maitreAffiliationSchema) });

  const sexe = watch('sexe');
  const regionId = watch('regionId');
  const clubId = watch('clubId');
  const gradeActuel = watch('gradeActuel');
  const specialite = watch('specialite');

  const onSubmit = async (data: MaitreAffiliationData) => {
    setServerError('');
    try {
      const res = await affiliationApi.submitMaitre(data);
      const demandeId = (res as any)?.data?.id;
      router.push(`/affiliation/paiement?id=${demandeId}`);
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const clubs = (clubsData as any)?.data?.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input id="telephone" type="tel" placeholder="771234567" {...register('telephone')} className={errors.telephone ? 'border-destructive' : ''} />
            {errors.telephone && <p className="text-sm text-destructive">{errors.telephone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input id="dateNaissance" type="date" {...register('dateNaissance')} />
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
          <div className="space-y-2">
            <Label htmlFor="nationalite">Nationalité *</Label>
            <Input id="nationalite" placeholder="Sénégalaise" {...register('nationalite')} className={errors.nationalite ? 'border-destructive' : ''} />
            {errors.nationalite && <p className="text-sm text-destructive">{errors.nationalite.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Région *</Label>
            <Select
              value={regionId ? String(regionId) : ''}
              onValueChange={(v) => setValue('regionId', parseInt(v), { shouldValidate: true })}
            >
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
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="adresse">Adresse *</Label>
            <Input id="adresse" {...register('adresse')} className={errors.adresse ? 'border-destructive' : ''} />
            {errors.adresse && <p className="text-sm text-destructive">{errors.adresse.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ville">Ville *</Label>
            <Input id="ville" {...register('ville')} className={errors.ville ? 'border-destructive' : ''} />
            {errors.ville && <p className="text-sm text-destructive">{errors.ville.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Expertise martiale */}
      <Card>
        <CardHeader><CardTitle>Expertise martiale</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Club d&apos;appartenance (optionnel)</Label>
            <Select
              value={clubId ? String(clubId) : ''}
              onValueChange={(v) => setValue('clubId', parseInt(v))}
            >
              <SelectTrigger><SelectValue placeholder="Aucun / à définir" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Aucun pour l&apos;instant</SelectItem>
                {clubs.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grade actuel (Duan)</Label>
            <Select value={gradeActuel} onValueChange={(v) => setValue('gradeActuel', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {GRADES_DUAN.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Spécialité / Discipline</Label>
            <Select value={specialite} onValueChange={(v) => setValue('specialite', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {DISCIPLINES.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="anneesPratique">Années de pratique</Label>
            <Input
              id="anneesPratique"
              type="number"
              min={0}
              max={60}
              {...register('anneesPratique', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="experience">Expérience & Parcours</Label>
            <Textarea
              id="experience"
              rows={4}
              placeholder="Décrivez votre parcours martial, formations, expériences..."
              {...register('experience')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frais */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">Frais d&apos;affiliation Maître</p>
          <p className="text-sm text-muted-foreground">Payables à la validation de votre dossier</p>
        </div>
        <p className="text-2xl font-bold text-accent">10 000 FCFA</p>
      </div>

      {serverError && (
        <p className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-lg">{serverError}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Soumettre la demande d&apos;affiliation
      </Button>
    </form>
  );
}
