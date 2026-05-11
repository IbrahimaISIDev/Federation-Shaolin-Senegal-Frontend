import { z } from 'zod';

// ─── Shared personal info ─────────────────────────────────────────────────────
const personalBase = z.object({
  prenom:       z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  nom:          z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email:        z.string().email('Email invalide'),
  telephone:    z.string().regex(/^(\+221)?[0-9]{9}$/, 'Téléphone invalide (ex: 771234567)'),
  dateNaissance: z.string().optional(),
  sexe:         z.enum(['M', 'F']).optional(),
  adresse:      z.string().optional(),
  ville:        z.string().optional(),
  regionId:     z.number().optional(),
  nationalite:  z.string().optional(),
  photoUrl:     z.string().optional(),
});

// ─── Club affiliation ─────────────────────────────────────────────────────────
export const clubAffiliationSchema = personalBase.extend({
  nomClub:       z.string().min(3, 'Nom du club requis'),
  villeClub:     z.string().optional(),
  telephoneClub: z.string().optional(),
  emailClub:     z.string().email('Email club invalide').optional().or(z.literal('')),
  logoUrl:       z.string().optional(),
  description:   z.string().optional(),
});

export type ClubAffiliationData = z.infer<typeof clubAffiliationSchema>;

// ─── Maître affiliation ───────────────────────────────────────────────────────
export const maitreAffiliationSchema = personalBase.extend({
  prenom:      z.string().min(2, 'Prénom requis'),
  nom:         z.string().min(2, 'Nom requis'),
  email:       z.string().email('Email invalide'),
  telephone:   z.string().regex(/^(\+221)?[0-9]{9}$/, 'Téléphone invalide'),
  nationalite: z.string().min(2, 'Nationalité requise'),
  adresse:     z.string().min(5, 'Adresse requise'),
  ville:       z.string().min(2, 'Ville requise'),
  regionId:    z.number({ required_error: 'Région requise' }),
  // Maître-specific — optional
  clubId:           z.number().optional(),
  gradeActuel:      z.string().optional(),
  specialite:       z.string().optional(),
  anneesPratique:   z.number().optional(),
  experience:       z.string().optional(),
  certificationsUrl: z.string().optional(),
});

export type MaitreAffiliationData = z.infer<typeof maitreAffiliationSchema>;

// ─── Membre/Disciple affiliation ──────────────────────────────────────────────
export const membreAffiliationSchema = personalBase.extend({
  prenom:      z.string().min(2, 'Prénom requis'),
  nom:         z.string().min(2, 'Nom requis'),
  email:       z.string().email('Email invalide'),
  telephone:   z.string().regex(/^(\+221)?[0-9]{9}$/, 'Téléphone invalide'),
  dateNaissance: z.string().min(1, 'Date de naissance requise'),
  nationalite: z.string().min(2, 'Nationalité requise'),
  adresse:     z.string().min(5, 'Adresse requise'),
  ville:       z.string().min(2, 'Ville requise'),
  regionId:    z.number({ required_error: 'Région requise' }),
  // Membre-specific
  clubId:               z.number({ required_error: 'Club requis' }),
  discipline:           z.string().min(1, 'Discipline requise'),
  gradeJi:              z.string().optional(),
  groupeSanguin:        z.string().optional(),
  contactUrgenceNom:    z.string().optional(),
  contactUrgencePhone:  z.string().optional(),
  certificatMedicalUrl: z.string().optional(),
  acceptTerms:          z.boolean().refine((v) => v === true, 'Vous devez accepter les conditions'),
});

export type MembreAffiliationData = z.infer<typeof membreAffiliationSchema>;

// ─── Legacy 5-step form exports (kept for backward compatibility) ──────────────
export const personalInfoSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^(\+221)?[0-9]{9}$/),
  birthDate: z.string(),
  gender: z.enum(['M', 'F']),
  nationality: z.string().min(2),
});
export const addressSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  region: z.string().min(1),
  postalCode: z.string().optional(),
});
export const clubSelectionSchema = z.object({
  clubId: z.string().min(1),
  discipline: z.enum(['kung_fu', 'tai_chi', 'wushu', 'sanda', 'qi_gong']),
  level: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
  previousExperience: z.string().optional(),
});
export const medicalInfoSchema = z.object({
  emergencyContactName: z.string().min(2),
  emergencyContactPhone: z.string().regex(/^(\+221)?[0-9]{9}$/),
  emergencyContactRelation: z.string().min(2),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']),
  hasMedicalCertificate: z.boolean().refine((v) => v === true),
});
export const documentsSchema = z.object({
  photoConsent: z.boolean().optional(),
  termsAccepted: z.boolean().refine((v) => v === true),
  rulesAccepted: z.boolean().refine((v) => v === true),
});
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

export const AFFILIATION_STEPS = [
  { id: 1, title: 'Informations personnelles', description: 'Vos coordonnées' },
  { id: 2, title: 'Adresse', description: 'Votre lieu de résidence' },
  { id: 3, title: 'Club & Discipline', description: 'Choisissez votre club' },
  { id: 4, title: 'Santé & Urgence', description: 'Informations médicales' },
  { id: 5, title: 'Validation', description: 'Finalisation' },
] as const;
