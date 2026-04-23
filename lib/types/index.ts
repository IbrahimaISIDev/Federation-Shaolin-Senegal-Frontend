// ============================================
// Fédération Shaolin Sénégal - Types & Interfaces
// ============================================

// --- User & Authentication ---
export type UserRole = 'MEMBRE' | 'PRESIDENT_CLUB' | 'ADMIN';
export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'SUSPENDED';
export type Gender = 'HOMME' | 'FEMME';
export type MembershipType = 'NOUVEAU' | 'RENOUVELLEMENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  clubId?: string;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// --- License ---
export interface License {
  id: string;
  licenseNumber: string;
  memberId: string;
  memberName: string;
  clubName: string;
  discipline: string;
  grade: string;
  issueDate: string;
  expiryDate: string;
  status: LicenseStatus;
  qrCodeUrl: string;
  photoUrl?: string;
}

// --- Club ---
export interface Club {
  id: string;
  name: string;
  code: string;
  region: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  presidentId: string;
  presidentName: string;
  memberCount: number;
  isActive: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  logo?: string;
  createdAt: string;
}

// --- Region ---
export interface Region {
  id: string;
  name: string;
  code: string;
  clubCount: number;
  memberCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// --- Article/News ---
export type ArticleCategory = 'ACTUALITE' | 'EVENEMENT' | 'COMPETITION' | 'FORMATION';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  coverImage: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
}

// --- Competition ---
export type CompetitionStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface Competition {
  id: string;
  name: string;
  description: string;
  location: string;
  region: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: CompetitionStatus;
  categories: string[];
  maxParticipants: number;
  currentParticipants: number;
  coverImage?: string;
  results?: CompetitionResult[];
}

export interface CompetitionResult {
  position: number;
  memberId: string;
  memberName: string;
  clubName: string;
  category: string;
  medal: 'GOLD' | 'SILVER' | 'BRONZE';
}

// --- Gallery ---
export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  category: string;
  eventName?: string;
  uploadedAt: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  imageCount: number;
  createdAt: string;
}

// --- Affiliation Form ---
export interface AffiliationFormData {
  // Step 1: Personal Info
  membershipType: MembershipType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  
  // Step 2: Contact Info
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  
  // Step 3: Club Selection
  clubId: string;
  discipline: string;
  
  // Step 4: Documents
  photoFile?: File;
  idDocumentFile?: File;
  medicalCertificateFile?: File;
  
  // Step 5: Payment
  paymentMethod: 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'CARD';
  acceptTerms: boolean;
}

// --- Statistics ---
export interface FederationStats {
  totalMembers: number;
  totalClubs: number;
  totalRegions: number;
  totalCompetitions: number;
  activeLicenses: number;
  memberGrowth: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string;
}

// --- Contact Form ---
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
