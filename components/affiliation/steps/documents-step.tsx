'use client';

import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Shield, Camera } from 'lucide-react';
import type { AffiliationFormData } from '@/lib/validations/affiliation';

export function DocumentsStep() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AffiliationFormData>();

  const photoConsent = watch('photoConsent');
  const termsAccepted = watch('termsAccepted');
  const rulesAccepted = watch('rulesAccepted');

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2">Récapitulatif de votre demande</h3>
        <p className="text-sm text-muted-foreground">
          Veuillez vérifier les informations saisies et accepter les conditions ci-dessous pour finaliser votre demande d&apos;affiliation.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <Checkbox
            id="termsAccepted"
            checked={termsAccepted}
            onCheckedChange={(checked) =>
              setValue('termsAccepted', checked === true, { shouldValidate: true })
            }
            className={errors.termsAccepted ? 'border-destructive' : ''}
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <Label
                htmlFor="termsAccepted"
                className="cursor-pointer font-medium"
              >
                Conditions générales *
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              J&apos;accepte les{' '}
              <a href="/conditions" className="text-accent hover:underline">
                conditions générales d&apos;utilisation
              </a>{' '}
              et la{' '}
              <a href="/confidentialite" className="text-accent hover:underline">
                politique de confidentialité
              </a>{' '}
              de la Fédération Shaolin Sénégal.
            </p>
            {errors.termsAccepted && (
              <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <Checkbox
            id="rulesAccepted"
            checked={rulesAccepted}
            onCheckedChange={(checked) =>
              setValue('rulesAccepted', checked === true, { shouldValidate: true })
            }
            className={errors.rulesAccepted ? 'border-destructive' : ''}
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <Label
                htmlFor="rulesAccepted"
                className="cursor-pointer font-medium"
              >
                Règlement intérieur *
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              J&apos;ai lu et j&apos;accepte le{' '}
              <a href="/reglement" className="text-accent hover:underline">
                règlement intérieur
              </a>{' '}
              de la Fédération et m&apos;engage à le respecter.
            </p>
            {errors.rulesAccepted && (
              <p className="text-sm text-destructive">{errors.rulesAccepted.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <Checkbox
            id="photoConsent"
            checked={photoConsent}
            onCheckedChange={(checked) =>
              setValue('photoConsent', checked === true, { shouldValidate: true })
            }
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <Label
                htmlFor="photoConsent"
                className="cursor-pointer font-medium"
              >
                Droit à l&apos;image (optionnel)
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              J&apos;autorise la Fédération Shaolin Sénégal à utiliser mon image (photos, vidéos) 
              à des fins de communication et de promotion de ses activités.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-foreground mb-2">Prochaines étapes</h4>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Votre demande sera examinée par la Fédération</li>
          <li>Vous recevrez un email de confirmation sous 48h</li>
          <li>Après validation, vous pourrez procéder au paiement de votre licence</li>
          <li>Votre licence numérique sera générée et accessible dans votre espace membre</li>
        </ol>
      </div>
    </div>
  );
}
