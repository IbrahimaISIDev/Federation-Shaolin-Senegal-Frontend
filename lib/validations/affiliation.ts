import { z } from 'zod';

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string()
    .email('Adresse email invalide'),
  phone: z.string()
    .regex(/^(\+221)?[0-9]{9}$/, 'Numéro de téléphone invalide (ex: 771234567)'),
  birthDate: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 5 && age <= 100;
    }, 'Vous devez avoir entre 5 et 100 ans'),
  gender: z.enum(['M', 'F'], {
    errorMap: () => ({ message: 'Veuillez sélectionner votre Sexe' }),
  }),
  nationality: z.string()
    .min(2, 'Veuillez entrer votre nationalité'),
});

// Step 2: Address
export const addressSchema = z.object({
  address: z.string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  city: z.string()
    .min(2, 'La ville doit contenir au moins 2 caractères'),
  region: z.string()
    .min(1, 'Veuillez sélectionner votre région'),
  postalCode: z.string()
    .optional(),
});

// Step 3: Club Selection & Discipline
export const clubSelectionSchema = z.object({
  clubId: z.string()
    .min(1, 'Veuillez sélectionner un club'),
  discipline: z.enum(['kung_fu', 'tai_chi', 'wushu', 'sanda', 'qi_gong'], {
    errorMap: () => ({ message: 'Veuillez sélectionner une discipline' }),
  }),
  level: z.enum(['debutant', 'intermediaire', 'avance', 'expert'], {
    errorMap: () => ({ message: 'Veuillez sélectionner votre niveau' }),
  }),
  previousExperience: z.string()
    .optional(),
});

// Step 4: Medical & Emergency Contact
export const medicalInfoSchema = z.object({
  emergencyContactName: z.string()
    .min(2, 'Le nom du contact d\'urgence est requis'),
  emergencyContactPhone: z.string()
    .regex(/^(\+221)?[0-9]{9}$/, 'Numéro de téléphone invalide'),
  emergencyContactRelation: z.string()
    .min(2, 'Veuillez préciser votre relation'),
  medicalConditions: z.string()
    .optional(),
  allergies: z.string()
    .optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'], {
    errorMap: () => ({ message: 'Veuillez sélectionner votre groupe sanguin' }),
  }),
  hasMedicalCertificate: z.boolean()
    .refine((val) => val === true, 'Le certificat médical est obligatoire'),
});

// Step 5: Photo & Documents
export const documentsSchema = z.object({
  photoConsent: z.boolean()
    .optional(),
  termsAccepted: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter les conditions générales'),
  rulesAccepted: z.boolean()
    .refine((val) => val === true, 'Vous devez accepter le règlement intérieur'),
});

// Full affiliation form schema
export const affiliationSchema = personalInfoSchema
  .merge(addressSchema)
  .merge(clubSelectionSchema)
  .merge(medicalInfoSchema)
  .merge(documentsSchema);

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type ClubSelectionData = z.infer<typeof clubSelectionSchema>;
export type MedicalInfoData = z.infer<typeof medicalInfoSchema>;
export type DocumentsData = z.infer<typeof documentsSchema>;
export type AffiliationFormData = z.infer<typeof affiliationSchema>;

// Step configuration
export const AFFILIATION_STEPS = [
  { id: 1, title: 'Informations personnelles', description: 'Vos coordonnées' },
  { id: 2, title: 'Adresse', description: 'Votre lieu de résidence' },
  { id: 3, title: 'Club & Discipline', description: 'Choisissez votre club' },
  { id: 4, title: 'Santé & Urgence', description: 'Informations médicales' },
  { id: 5, title: 'Validation', description: 'Finalisation' },
] as const;
