'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REGIONS } from '@/lib/constants';
import type { AffiliationFormData } from '@/lib/validations/affiliation';

export function AddressStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AffiliationFormData>();

  const region = watch('region');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address">Adresse complète *</Label>
        <Input
          id="address"
          placeholder="Rue, quartier, numéro..."
          {...register('address')}
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            placeholder="Votre ville"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Région *</Label>
          <Select
            value={region}
            onValueChange={(value) => setValue('region', value, { shouldValidate: true })}
          >
            <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
              <SelectValue placeholder="Sélectionner une région" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && (
            <p className="text-sm text-destructive">{errors.region.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Code postal (optionnel)</Label>
        <Input
          id="postalCode"
          placeholder="Ex: 10000"
          {...register('postalCode')}
          className={errors.postalCode ? 'border-destructive' : ''}
        />
        {errors.postalCode && (
          <p className="text-sm text-destructive">{errors.postalCode.message}</p>
        )}
      </div>
    </div>
  );
}
