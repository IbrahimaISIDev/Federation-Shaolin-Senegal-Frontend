// ============================================
// Association Disciples Shaolin Si Sénégal (ADSS) - Constants
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
  RENEWAL: 10300, // XOF
} as const;

// --- Social Links ---
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/shaolinsn',
  instagram: 'https://instagram.com/shaolinsn',
  twitter: 'https://twitter.com/shaolinsn',
  youtube: 'https://youtube.com/@shaolinsn',
  whatsapp: '+221772657426',
} as const;

// --- Contact Info ---
export const CONTACT_INFO = {
  address: 'Siège ADSS, Dakar, Sénégal',
  phone: '+221 77 265 74 26',
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
    title: 'Le Kung Fu s\'implante au Sénégal',
    description:
      'Le Kung Fu est introduit officiellement au Sénégal par Maître Ivan Fam Loi, franco-vietnamien, qui enseigne le style traditionnel Hung Chia Paï — les premières graines des arts martiaux chinois sont plantées sur le sol sénégalais.',
  },
  {
    year: '2010',
    title: 'Les bases du Wushu moderne',
    description:
      "Après une formation de 45 jours à l'Université de sport de Shandong, en Chine, le Directeur Technique National Maître Ousmane Ngom pose les bases du Wushu moderne et propulse le Kung Fu sénégalais sur la scène africaine et mondiale.",
  },
  {
    year: '2014',
    title: 'Première génération de maîtres formés au Temple Shaolin',
    description:
      "Grâce à une bourse de formation de trois ans, quatre maîtres partent se former directement au Temple Shaolin de Chine : Moussa Diallo, Abdoulaye Badji, Mamadou Fall et Cheikhna Thiam.",
    highlight: true,
  },
  {
    year: '2015',
    title: 'Deuxième génération de maîtres formés au Temple Shaolin',
    description:
      "Quatre autres maîtres suivent la même formation au Temple Shaolin : Abdoulaye Diarra, El Hadji Yaya Sène, Made Gueye et Birane Kane — portant à huit le nombre de maîtres formés directement en Chine.",
    highlight: true,
  },
  {
    year: '2020',
    title: 'Un nouveau tournant',
    description:
      "Maître Ousmane Ngom quitte ses fonctions de Directeur Technique National pour se consacrer entièrement à l'enseignement et à la promotion du Shaolin au Sénégal.",
  },
  {
    year: 'Janvier 2022',
    title: 'Championnat du Monde Virtuel de Shaolin',
    description:
      "Sous le thème « Paix-amitié, santé-bonheur, héritage-partage », plus de 100 pays et 10 000 participants prennent part au championnat organisé par le Temple Shaolin. Le Sénégal y est représenté par Abdoulaye Diarra et El Hadji Yaya Sène, coachés par Maître Ousmane Ngom.",
    medals: '3 médailles d\'or · 1 médaille de bronze',
    highlight: true,
  },
  {
    year: 'Juin 2023',
    title: "Création de la Fédération Africaine de Shaolin et 1ers championnats d'Afrique",
    description:
      "Réuni à Lusaka (Zambie) du 22 au 25 juin, un congrès présidé par l'abbé Shi Yong Xin et réunissant 23 pays africains fonde la Fédération Africaine de Shaolin. Six athlètes sénégalais, issus des promotions 2014 et 2015, y disputent les premiers championnats d'Afrique de Shaolin sous la conduite de Maître Ousmane Ngom.",
    medals: '5 médailles (2 or, 3 argent) · Grade 3e Duan Shaolin pour toute la délégation',
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
      "Fondation de l'« Association Disciples Shaolin Si Sénégal » (ADSS), association nationale reconnue par le Ministère de l'Intérieur du Sénégal, dotée d'un siège entièrement équipé et financé à hauteur de 10 millions FCFA par la société Mangane Holding. Maître Abdoulaye Diarra est nommé Directeur Technique de l'ADSS.",
    highlight: true,
  },
  {
    year: 'Juillet 2024',
    title: 'Shaolin World Games',
    description:
      "Le Temple organise les Shaolin World Games, réunissant 101 pays des six continents. Le Sénégal y est représenté par Ousmane Ngom, Abdoulaye Diarra, Mamadou Fall et Made Gueye, qui décrochent tous le grade de 6e Duan Shaolin. Maître Ngom est officiellement nommé représentant du Temple Shaolin au Sénégal.",
    highlight: true,
  },
  {
    year: 'Juillet 2025',
    title: 'Shaolin Duan Wei — le Temple accueilli au Sénégal',
    description:
      "À l'initiative de l'ADSS, six moines du Temple Shaolin séjournent au Sénégal du 20 au 24 juillet pour un stage suivi d'un passage de grade. 103 ceintures noires sont décernées, en présence de l'ambassade de Chine, qui reconnaît officiellement l'ADSS et son président comme représentants du Temple Shaolin au Sénégal.",
    medals: '103 ceintures noires décernées',
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

// --- Bureau de l'Association ---
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
    id: 'vice-president-1',
    name: 'Abdoulaye Badji',
    role: '1er Vice-président',
    tier: 'presidency',
  },
  {
    id: 'vice-president-2',
    name: 'Abdoulaye Sogué',
    role: '2e Vice-président',
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
    name: 'Valère Senghor',
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
