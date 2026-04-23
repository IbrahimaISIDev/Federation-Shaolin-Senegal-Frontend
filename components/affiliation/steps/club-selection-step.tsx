'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DISCIPLINES, LEVELS } from '@/lib/constants';
import type { AffiliationFormData } from '@/lib/validations/affiliation';

// Mock clubs data - in real app, this would come from API
const MOCK_CLUBS = [
  { id: 'club-1', name: 'Temple Shaolin Dakar', region: 'dakar' },
  { id: 'club-2', name: 'Dragon de Feu Saint-Louis', region: 'saint-louis' },
  { id: 'club-3', name: 'Wushu Academy Thiès', region: 'thies' },
  { id: 'club-4', name: 'Shaolin Ziguinchor', region: 'ziguinchor' },
  { id: 'club-5', name: 'Kung Fu Diourbel', region: 'diourbel' },
];

export function ClubSelectionStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AffiliationFormData>();

  const clubId = watch('clubId');
  const discipline = watch('discipline');
  const level = watch('level');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clubId">Club *</Label>
        <Select
          value={clubId}
          onValueChange={(value) => setValue('clubId', value, { shouldValidate: true })}
        >
          <SelectTrigger className={errors.clubId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Sélectionner un club" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_CLUBS.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.clubId && (
          <p className="text-sm text-destructive">{errors.clubId.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Consultez notre <a href="/carte" className="text-accent hover:underline">carte interactive</a> pour trouver un club près de chez vous.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discipline">Discipline *</Label>
          <Select
            value={discipline}
            onValueChange={(value) => setValue('discipline', value as AffiliationFormData['discipline'], { shouldValidate: true })}
          >
            <SelectTrigger className={errors.discipline ? 'border-destructive' : ''}>
              <SelectValue placeholder="Sélectionner une discipline" />
            </SelectTrigger>
            <SelectContent>
              {DISCIPLINES.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.discipline && (
            <p className="text-sm text-destructive">{errors.discipline.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Niveau *</Label>
          <Select
            value={level}
            onValueChange={(value) => setValue('level', value as AffiliationFormData['level'], { shouldValidate: true })}
          >
            <SelectTrigger className={errors.level ? 'border-destructive' : ''}>
              <SelectValue placeholder="Sélectionner votre niveau" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-sm text-destructive">{errors.level.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousExperience">Expérience précédente (optionnel)</Label>
        <Textarea
          id="previousExperience"
          placeholder="Décrivez votre parcours dans les arts martiaux..."
          rows={4}
          {...register('previousExperience')}
        />
        <p className="text-xs text-muted-foreground">
          Indiquez vos grades, compétitions, ou autres expériences pertinentes.
        </p>
      </div>
    </div>
  );
}
