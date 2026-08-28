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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/shared/date-picker';
import { membreAffiliationSchema, type MembreAffiliationData } from '@/lib/validations/affiliation';
import { affiliationApi } from '@/lib/api/affiliation';
import { clubsApi } from '@/lib/api/clubs';
import { regionsApi } from '@/lib/api/regions';
import { DISCIPLINES } from '@/lib/constants';

const GRADES_JI = [
  '1er Ji', '2ème Ji', '3ème Ji', '4ème Ji',
  '5ème Ji', '6ème Ji', '7ème Ji',
];

const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function MembreAffiliationForm() {
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
    useForm<MembreAffiliationData>({
      resolver: zodResolver(membreAffiliationSchema),
      defaultValues: { acceptTerms: false },
    });

  const sexe = watch('sexe');
  const regionId = watch('regionId');
  const clubId = watch('clubId');
  const discipline = watch('discipline');
  const gradeJi = watch('gradeJi');
  const groupeSanguin = watch('groupeSanguin');
  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: MembreAffiliationData) => {
    setServerError('');
    try {
      const res = await affiliationApi.submitMembre(data);
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
            <Label htmlFor="dateNaissance">Date de naissance *</Label>
            <DatePicker
                id="dateNaissance"
                value={watch('dateNaissance')}
                onChange={(v) => setValue('dateNaissance', v, { shouldValidate: true })}
                error={!!errors.dateNaissance}
                maxDate={new Date()}
            />
            {errors.dateNaissance && <p className="text-sm text-destructive">{errors.dateNaissance.message}</p>}
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
            <Label>Groupe sanguin</Label>
            <Select value={groupeSanguin} onValueChange={(v) => setValue('groupeSanguin', v)}>
              <SelectTrigger><SelectValue placeholder="Optionnel" /></SelectTrigger>
              <SelectContent>
                {GROUPES_SANGUINS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </CardContent>
      </Card>

      {/* Club & Discipline */}
      <Card>
        <CardHeader><CardTitle>Club &amp; Discipline</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Club *</Label>
            <Select
              value={clubId ? String(clubId) : ''}
              onValueChange={(v) => setValue('clubId', parseInt(v), { shouldValidate: true })}
            >
              <SelectTrigger className={errors.clubId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Choisissez votre club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clubId && <p className="text-sm text-destructive">{errors.clubId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Discipline *</Label>
            <Select
              value={discipline}
              onValueChange={(v) => setValue('discipline', v, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.discipline ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {DISCIPLINES.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.discipline && <p className="text-sm text-destructive">{errors.discipline.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Grade Ji actuel (si déjà pratiquant)</Label>
            <Select value={gradeJi} onValueChange={(v) => setValue('gradeJi', v)}>
              <SelectTrigger><SelectValue placeholder="Aucun / Débutant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="debutant">Débutant (aucun grade)</SelectItem>
                {GRADES_JI.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card>
        <CardHeader><CardTitle>Contact d&apos;urgence (recommandé)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactUrgenceNom">Nom du contact</Label>
            <Input id="contactUrgenceNom" {...register('contactUrgenceNom')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactUrgencePhone">Téléphone du contact</Label>
            <Input id="contactUrgencePhone" type="tel" {...register('contactUrgencePhone')} />
          </div>
        </CardContent>
      </Card>

      {/* Frais */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">Frais d&apos;affiliation Membre</p>
          <p className="text-sm text-muted-foreground">Réglables à l&apos;étape suivante, avant l&apos;examen de votre dossier</p>
        </div>
        <p className="text-2xl font-bold text-accent whitespace-nowrap sm:text-right">5 300 FCFA</p>
      </div>

      {/* Conditions */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="acceptTerms"
          checked={!!acceptTerms}
          onCheckedChange={(v) => setValue('acceptTerms', !!v, { shouldValidate: true })}
          className={errors.acceptTerms ? 'border-destructive' : ''}
        />
        <div>
          <Label htmlFor="acceptTerms" className="cursor-pointer leading-relaxed">
            J&apos;accepte le règlement intérieur de l&apos;ADSS et les conditions d&apos;affiliation *
          </Label>
          {errors.acceptTerms && <p className="text-sm text-destructive mt-1">{errors.acceptTerms.message}</p>}
        </div>
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
