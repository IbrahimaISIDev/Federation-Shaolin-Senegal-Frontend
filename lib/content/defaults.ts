// ============================================================
// Contenus éditoriaux : valeurs par défaut.
// Affichées tant que l'admin n'a rien enregistré dans « Contenu du site »
// (et si l'API est momentanément indisponible).
// ============================================================
import { BUREAU_MEMBERS, type BureauMember } from '@/lib/constants';

export interface HomeContent {
  hero: {
    badge: string;
    description: string;
    photoUrl: string;
    photoCaption: string;
    stats: { value: string; label: string }[];
  };
  keyFigures: { value: string; label: string; description: string }[];
}

export type BureauContent = BureauMember[];

export const DEFAULT_HOME: HomeContent = {
  hero: {
    badge: "Reconnue par le Ministère de l'Intérieur · NINEA · 少林寺",
    description:
      "Association nationale dédiée à la promotion du Shaolin authentique, directement transmis par le Temple Shaolin de Chine — active au Sénégal depuis 2022, officiellement reconnue depuis 2024.",
    photoUrl: '/images/president/maitre-ngom.png',
    photoCaption: 'Maître Ousmane Ngom — ADSS',
    stats: [
      { value: '1 000+', label: 'Adhérents' },
      { value: '5', label: 'Médailles internationales' },
      { value: '1981', label: 'Pratique au Sénégal' },
    ],
  },
  keyFigures: [
    { value: '1 000+', label: 'Adhérents', description: 'Membres à travers le pays' },
    { value: '3 000+', label: 'Participants aux stages', description: 'Dans toutes les régions et en Gambie' },
    { value: '5', label: 'Médailles internationales', description: 'Monde 2021 & Afrique 2023' },
    { value: '3e Duan', label: 'Grade Shaolin', description: 'Obtenu au Temple Shaolin en Zambie' },
  ],
};

export const DEFAULT_BUREAU: BureauContent = BUREAU_MEMBERS;

export const CONTENT_DEFAULTS = {
  home: DEFAULT_HOME,
  bureau: DEFAULT_BUREAU,
};

export type ContentKey = keyof typeof CONTENT_DEFAULTS;
export type ContentOf<K extends ContentKey> = (typeof CONTENT_DEFAULTS)[K];
