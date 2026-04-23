'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  affiliationSchema,
  type AffiliationFormData,
  AFFILIATION_STEPS,
  personalInfoSchema,
  addressSchema,
  clubSelectionSchema,
  medicalInfoSchema,
  documentsSchema,
} from '@/lib/validations/affiliation';
import { PersonalInfoStep } from './steps/personal-info-step';
import { AddressStep } from './steps/address-step';
import { ClubSelectionStep } from './steps/club-selection-step';
import { MedicalInfoStep } from './steps/medical-info-step';
import { DocumentsStep } from './steps/documents-step';

const stepSchemas = [
  personalInfoSchema,
  addressSchema,
  clubSelectionSchema,
  medicalInfoSchema,
  documentsSchema,
];

export function AffiliationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const methods = useForm<AffiliationFormData>({
    resolver: zodResolver(affiliationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '' as any,
      nationality: 'Sénégalaise',
      address: '',
      city: '',
      region: '',
      postalCode: '',
      clubId: '',
      discipline: '' as any,
      level: '' as any,
      previousExperience: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      medicalConditions: '',
      allergies: '',
      bloodType: '' as any,
      hasMedicalCertificate: false,
      photoConsent: false,
      termsAccepted: false,
      rulesAccepted: false,
    },
  });

  const { trigger, handleSubmit, formState } = methods;

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep];
    const fields = Object.keys(currentSchema.shape) as (keyof AffiliationFormData)[];
    const isValid = await trigger(fields);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < AFFILIATION_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: AffiliationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Affiliation data:', data);
      setIsComplete(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Demande envoyée avec succès !
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Votre demande d&apos;affiliation a été enregistrée. Vous recevrez un email de confirmation
          avec les instructions pour finaliser votre inscription.
        </p>
        <Button asChild>
          <a href="/">Retour à l&apos;accueil</a>
        </Button>
      </motion.div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <nav aria-label="Progression" className="mb-8">
          <ol className="flex items-center justify-between">
            {AFFILIATION_STEPS.map((step, index) => (
              <li key={step.id} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors z-10',
                      index < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStep
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium text-center hidden sm:block',
                      index <= currentStep
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < AFFILIATION_STEPS.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2',
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Current Step Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-foreground">
            {AFFILIATION_STEPS[currentStep].title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {AFFILIATION_STEPS[currentStep].description}
          </p>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-lg border p-6 shadow-sm"
            >
              {currentStep === 0 && <PersonalInfoStep />}
              {currentStep === 1 && <AddressStep />}
              {currentStep === 2 && <ClubSelectionStep />}
              {currentStep === 3 && <MedicalInfoStep />}
              {currentStep === 4 && <DocumentsStep />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {isMounted && (
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>

              {currentStep < AFFILIATION_STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2 bg-accent hover:bg-accent/90"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !formState.isValid}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Soumettre ma demande'
                  )}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </FormProvider>
  );
}
