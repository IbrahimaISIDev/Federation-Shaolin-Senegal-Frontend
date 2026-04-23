'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AffiliationFormData } from '@/lib/validations/affiliation';

const BLOOD_TYPES = [
  { id: 'A+', name: 'A+' },
  { id: 'A-', name: 'A-' },
  { id: 'B+', name: 'B+' },
  { id: 'B-', name: 'B-' },
  { id: 'AB+', name: 'AB+' },
  { id: 'AB-', name: 'AB-' },
  { id: 'O+', name: 'O+' },
  { id: 'O-', name: 'O-' },
  { id: 'unknown', name: 'Je ne sais pas' },
];

export function MedicalInfoStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AffiliationFormData>();

  const bloodType = watch('bloodType');
  const hasMedicalCertificate = watch('hasMedicalCertificate');

  return (
    <div className="space-y-6">
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2">Contact d&apos;urgence</h3>
        <p className="text-sm text-muted-foreground">
          Personne à contacter en cas d&apos;urgence pendant les entraînements ou compétitions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Nom du contact *</Label>
          <Input
            id="emergencyContactName"
            placeholder="Nom complet"
            {...register('emergencyContactName')}
            className={errors.emergencyContactName ? 'border-destructive' : ''}
          />
          {errors.emergencyContactName && (
            <p className="text-sm text-destructive">{errors.emergencyContactName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">Téléphone *</Label>
          <Input
            id="emergencyContactPhone"
            type="tel"
            placeholder="771234567"
            {...register('emergencyContactPhone')}
            className={errors.emergencyContactPhone ? 'border-destructive' : ''}
          />
          {errors.emergencyContactPhone && (
            <p className="text-sm text-destructive">{errors.emergencyContactPhone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContactRelation">Relation *</Label>
        <Input
          id="emergencyContactRelation"
          placeholder="Ex: Parent, Conjoint, Ami..."
          {...register('emergencyContactRelation')}
          className={errors.emergencyContactRelation ? 'border-destructive' : ''}
        />
        {errors.emergencyContactRelation && (
          <p className="text-sm text-destructive">{errors.emergencyContactRelation.message}</p>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-foreground mb-4">Informations médicales</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Groupe sanguin *</Label>
            <Select
              value={bloodType}
              onValueChange={(value) => setValue('bloodType', value as AffiliationFormData['bloodType'], { shouldValidate: true })}
            >
              <SelectTrigger className={errors.bloodType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPES.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bloodType && (
              <p className="text-sm text-destructive">{errors.bloodType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Conditions médicales (optionnel)</Label>
            <Textarea
              id="medicalConditions"
              placeholder="Maladies chroniques, blessures, etc."
              rows={3}
              {...register('medicalConditions')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies (optionnel)</Label>
            <Input
              id="allergies"
              placeholder="Ex: Pénicilline, arachides..."
              {...register('allergies')}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="hasMedicalCertificate"
            checked={hasMedicalCertificate}
            onCheckedChange={(checked) =>
              setValue('hasMedicalCertificate', checked === true, { shouldValidate: true })
            }
            className={errors.hasMedicalCertificate ? 'border-destructive' : ''}
          />
          <div className="space-y-1">
            <Label
              htmlFor="hasMedicalCertificate"
              className="cursor-pointer font-normal"
            >
              Je certifie posséder un certificat médical de non contre-indication à la pratique des arts martiaux datant de moins de 3 mois *
            </Label>
            {errors.hasMedicalCertificate && (
              <p className="text-sm text-destructive">{errors.hasMedicalCertificate.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
