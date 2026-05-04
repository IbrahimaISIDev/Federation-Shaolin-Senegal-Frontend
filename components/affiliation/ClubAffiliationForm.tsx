'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clubAffiliationSchema, type ClubAffiliationData } from '@/lib/validations/affiliation';
import { affiliationApi } from '@/lib/api/affiliation';
import { REGIONS } from '@/lib/constants';

export function ClubAffiliationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<ClubAffiliationData>({ resolver: zodResolver(clubAffiliationSchema) });

  const sexe = watch('sexe');
  const regionId = watch('regionId');

  const onSubmit = async (data: ClubAffiliationData) => {
    setServerError('');
    try {
      await affiliationApi.submitClub(data);
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Demande envoyée !</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Votre demande d&apos;affiliation de club a bien été reçue. Notre équipe vous contactera sous 48h après examen de votre dossier.
        </p>
        <p className="text-sm text-muted-foreground">Un email de confirmation vous a été envoyé.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Responsable du club */}
      <Card>
        <CardHeader><CardTitle>Responsable du club</CardTitle></CardHeader>
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
            <Label htmlFor="nationalite">Nationalité</Label>
            <Input id="nationalite" placeholder="Sénégalaise" {...register('nationalite')} />
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
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="adresse">Adresse personnelle</Label>
            <Input id="adresse" {...register('adresse')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" {...register('ville')} />
          </div>
          <div className="space-y-2">
            <Label>Région</Label>
            <Select
              value={regionId ? String(regionId) : ''}
              onValueChange={(v) => setValue('regionId', parseInt(v))}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informations du club */}
      <Card>
        <CardHeader><CardTitle>Informations du club</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nomClub">Nom du club *</Label>
            <Input id="nomClub" {...register('nomClub')} className={errors.nomClub ? 'border-destructive' : ''} />
            {errors.nomClub && <p className="text-sm text-destructive">{errors.nomClub.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="villeClub">Ville du club</Label>
            <Input id="villeClub" {...register('villeClub')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephoneClub">Téléphone du club</Label>
            <Input id="telephoneClub" type="tel" {...register('telephoneClub')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="emailClub">Email du club</Label>
            <Input id="emailClub" type="email" {...register('emailClub')} className={errors.emailClub ? 'border-destructive' : ''} />
            {errors.emailClub && <p className="text-sm text-destructive">{errors.emailClub.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description / Présentation</Label>
            <Textarea id="description" rows={4} placeholder="Décrivez votre club, son histoire, ses disciplines..." {...register('description')} />
          </div>
        </CardContent>
      </Card>

      {/* Frais */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">Frais d&apos;affiliation club</p>
          <p className="text-sm text-muted-foreground">Payables à la validation de votre dossier</p>
        </div>
        <p className="text-2xl font-bold text-accent">5 000 FCFA</p>
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
