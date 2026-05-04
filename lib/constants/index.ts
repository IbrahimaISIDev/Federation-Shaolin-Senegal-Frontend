// ============================================
// Fédération Shaolin Sénégal - Constants
// ============================================

import type { NavItem, Region } from '@/lib/types';

// --- Site Info ---
export const SITE_NAME = 'Association Disciples Shaolin Si Sénégal';
export const SITE_SHORT_NAME = 'ADSS';
export const SITE_DESCRIPTION =
  "L'Association Disciples Shaolin Si Sénégal (ADSS) — association nationale officielle reconnue par le Ministère de l'Intérieur, dédiée à la promotion et au développement des arts martiaux Shaolin au Sénégal.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shaolin-senegal.sn';

// --- API ---
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// --- Navigation ---
export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'L\'Association', href: '/federation' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Compétitions', href: '/competitions' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Carte des Clubs', href: '/carte' },
  { label: 'Contact', href: '/contact' },
];

export const MEMBER_NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/membre' },
  { label: 'Ma Licence', href: '/membre/licence' },
  { label: 'Mon Profil', href: '/membre/profil' },
  { label: 'Compétitions', href: '/membre/competitions' },
];

export const CLUB_NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/club' },
  { label: 'Membres', href: '/club/membres' },
  { label: 'Licences', href: '/club/licences' },
  { label: 'Statistiques', href: '/club/statistiques' },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Membres', href: '/admin/membres' },
  { label: 'Clubs', href: '/admin/clubs' },
  { label: 'Licences', href: '/admin/licences' },
  { label: 'Actualités', href: '/admin/actualites' },
  { label: 'Compétitions', href: '/admin/competitions' },
  { label: 'Paramètres', href: '/admin/parametres' },
];

// --- Regions of Senegal ---
export const SENEGAL_REGIONS: Region[] = [
  { id: 'dakar', name: 'Dakar', code: 'DK', clubCount: 0, memberCount: 0, coordinates: { lat: 14.7167, lng: -17.4677 } },
  { id: 'thies', name: 'Thiès', code: 'TH', clubCount: 0, memberCount: 0, coordinates: { lat: 14.7886, lng: -16.9260 } },
  { id: 'saint-louis', name: 'Saint-Louis', code: 'SL', clubCount: 0, memberCount: 0, coordinates: { lat: 16.0326, lng: -16.4818 } },
  { id: 'diourbel', name: 'Diourbel', code: 'DL', clubCount: 0, memberCount: 0, coordinates: { lat: 14.6546, lng: -16.2314 } },
  { id: 'louga', name: 'Louga', code: 'LG', clubCount: 0, memberCount: 0, coordinates: { lat: 15.6144, lng: -16.2281 } },
  { id: 'fatick', name: 'Fatick', code: 'FK', clubCount: 0, memberCount: 0, coordinates: { lat: 14.3390, lng: -16.4041 } },
  { id: 'kaolack', name: 'Kaolack', code: 'KL', clubCount: 0, memberCount: 0, coordinates: { lat: 14.1652, lng: -16.0726 } },
  { id: 'kaffrine', name: 'Kaffrine', code: 'KF', clubCount: 0, memberCount: 0, coordinates: { lat: 14.1059, lng: -15.5508 } },
  { id: 'tambacounda', name: 'Tambacounda', code: 'TC', clubCount: 0, memberCount: 0, coordinates: { lat: 13.7707, lng: -13.6673 } },
  { id: 'kedougou', name: 'Kédougou', code: 'KD', clubCount: 0, memberCount: 0, coordinates: { lat: 12.5605, lng: -12.1747 } },
  { id: 'kolda', name: 'Kolda', code: 'KA', clubCount: 0, memberCount: 0, coordinates: { lat: 12.8983, lng: -14.9500 } },
  { id: 'sedhiou', name: 'Sédhiou', code: 'SE', clubCount: 0, memberCount: 0, coordinates: { lat: 12.7081, lng: -15.5569 } },
  { id: 'ziguinchor', name: 'Ziguinchor', code: 'ZG', clubCount: 0, memberCount: 0, coordinates: { lat: 12.5681, lng: -16.2719 } },
  { id: 'matam', name: 'Matam', code: 'MT', clubCount: 0, memberCount: 0, coordinates: { lat: 15.6559, lng: -13.2555 } },
];

export const REGIONS = SENEGAL_REGIONS;

// --- Disciplines ---
export const DISCIPLINES = [
  { id: 'kung_fu', name: 'Kung Fu Shaolin' },
  { id: 'wushu', name: 'Wushu' },
  { id: 'tai_chi', name: 'Tai Chi Chuan' },
  { id: 'qi_gong', name: 'Qi Gong' },
  { id: 'sanda', name: 'Sanda (Boxe Chinoise)' },
] as const;

export const LEVELS = [
  { id: 'debutant', name: 'Débutant' },
  { id: 'intermediaire', name: 'Intermédiaire' },
  { id: 'avance', name: 'Avancé' },
  { id: 'expert', name: 'Expert' },
] as const;

// --- Grades/Belts ---
export const GRADES = [
  'Ceinture Blanche',
  'Ceinture Jaune',
  'Ceinture Orange',
  'Ceinture Verte',
  'Ceinture Bleue',
  'Ceinture Marron',
  'Ceinture Noire 1er Dan',
  'Ceinture Noire 2ème Dan',
  'Ceinture Noire 3ème Dan',
  'Ceinture Noire 4ème Dan',
  'Ceinture Noire 5ème Dan',
] as const;

// --- Payment Methods ---
export const PAYMENT_METHODS = [
  { id: 'WAVE', name: 'Wave', icon: '/images/payments/wave.png' },
  { id: 'ORANGE_MONEY', name: 'Orange Money', icon: '/images/payments/orange-money.png' },
  { id: 'FREE_MONEY', name: 'Free Money', icon: '/images/payments/free-money.png' },
  { id: 'CARD', name: 'Carte Bancaire', icon: '/images/payments/card.png' },
] as const;

// --- License Fees ---
export const LICENSE_FEES = {
  NEW: 15000, // XOF
  RENEWAL: 10000, // XOF
} as const;

// --- Social Links ---
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/shaolinsn',
  instagram: 'https://instagram.com/shaolinsn',
  twitter: 'https://twitter.com/shaolinsn',
  youtube: 'https://youtube.com/@shaolinsn',
  whatsapp: '+221771234567',
} as const;

// --- Contact Info ---
export const CONTACT_INFO = {
  address: 'Siège ADSS, Dakar, Sénégal',
  phone: '+221 77 123 45 67',
  email: 'contact@shaolin-senegal.sn',
  hours: 'Lundi - Vendredi: 9h00 - 18h00',
} as const;

// --- Histoire / Timeline ADSS ---
export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
  medals?: string;
}

export const ADSS_HISTORY: HistoryEvent[] = [
  {
    year: '1981',
    title: 'Naissance du Wushu au Sénégal',
    description:
      'Introduction du Wushu traditionnel au Sénégal — les premières graines des arts martiaux chinois sont plantées sur le sol sénégalais.',
  },
  {
    year: '2014 – 2015',
    title: 'Mission au Temple Shaolin',
    description:
      "La fédération envoie 8 personnes au Temple Shaolin de Chine. Parmi eux : Shifu Abdoulaye Diarra, Shifu Abdoulaye Badji et Shifu El Hadji Yaya Sène. Cette expérience forge une expertise authentique et directement transmise par le temple.",
    highlight: true,
  },
  {
    year: '2020',
    title: 'Un nouveau tournant',
    description:
      "Maître Ousmane Ngom quitte ses fonctions de Directeur Technique National pour se consacrer entièrement à l'enseignement et à la promotion du Shaolin au Sénégal.",
  },
  {
    year: '2021',
    title: 'Championnat du Monde Virtuel de Shaolin',
    description:
      'Abdoulaye Diarra et El Hadji Yaya Sène représentent le Sénégal au Championnat du Monde Virtuel organisé par le Temple Shaolin.',
    medals: '3 médailles d\'or · 1 médaille de bronze',
    highlight: true,
  },
  {
    year: '2023',
    title: 'Championnats d\'Afrique en Zambie',
    description:
      "La délégation sénégalaise participe aux Championnats d'Afrique de Shaolin en Zambie. À l'issue des passages de grades organisés par le Temple, tous les maîtres de la délégation obtiennent le grade de 3e Duan Shaolin.",
    medals: '2 médailles d\'or · Grade 3e Duan Shaolin',
    highlight: true,
  },
  {
    year: '2023 – 2024',
    title: 'Stages nationaux & régionaux',
    description:
      'Organisation de stages nationaux dans toutes les régions du Sénégal — Dakar, Thiès, Mbour, Tivaouane, Koungheul — et en Gambie. Plus de 3 000 participants ont bénéficié de ces formations.',
    medals: '3 000+ participants',
  },
  {
    year: 'Mars 2024',
    title: "Création officielle de l'ADSS",
    description:
      "Fondation de l'« Association Disciples Shaolin Si Sénégal » (ADSS). Association nationale avec plus de 1 000 adhérents, dotée d'un compte bancaire et d'un NINEA, officiellement reconnue par le Ministère de l'Intérieur du Sénégal. L'ADSS dispose d'un siège entièrement équipé, financé à hauteur de 10 millions FCFA par la société Mangane Holding.",
    highlight: true,
  },
];

// --- Form Validation ---
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^(\+221)?[0-9]{9}$/,
  LICENSE_NUMBER_REGEX: /^FSS-[A-Z]{2}-\d{6}$/,
} as const;

// --- Bureau de la Fédération ---
export interface BureauMember {
  id: string;
  name: string;
  role: string;
  commission?: string;
  tier: 'presidency' | 'executive' | 'commission';
}

export const BUREAU_MEMBERS: BureauMember[] = [
  // Présidence & Direction
  {
    id: 'president',
    name: 'Ousmane Ngom',
    role: 'Président',
    tier: 'presidency',
  },
  {
    id: 'vice-president',
    name: 'Abdoulaye Badji',
    role: 'Vice-président',
    tier: 'presidency',
  },
  {
    id: 'tresorier',
    name: 'Mamadou Mambi Sow',
    role: 'Trésorier général',
    tier: 'executive',
  },
  {
    id: 'secretaire',
    name: 'Valere Senghor',
    role: 'Secrétaire général',
    tier: 'executive',
  },
  {
    id: 'dtn',
    name: 'Abdoulaye Diarra',
    role: 'Directeur Technique National',
    tier: 'executive',
  },
  // Commission Organisation
  {
    id: 'org-president',
    name: 'Fallou Tine',
    role: 'Président',
    commission: 'Commission Organisation',
    tier: 'commission',
  },
  {
    id: 'org-vice-president',
    name: 'Coumba Danfakha',
    role: 'Vice-président',
    commission: 'Commission Organisation',
    tier: 'commission',
  },
  // Commission Communication
  {
    id: 'comm-president',
    name: 'Djiby Mangane',
    role: 'Président',
    commission: 'Commission Communication · Sponsoring · Marketing',
    tier: 'commission',
  },
  {
    id: 'comm-vice-president',
    name: 'Ismaila Basse',
    role: 'Vice-président',
    commission: 'Commission Communication · Sponsoring · Marketing',
    tier: 'commission',
  },
];

// --- Animation Variants (Framer Motion) ---
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
} as const;

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
} as const;
