// ─── lib/api/stats.ts ─────────────────────────────────────────────────────────
import { api } from './client';

export interface DashboardStats {
    // Membres
    totalMembers: number;
    newMembersThisWeek: number;
    pendingMembers: number;

    // Clubs
    totalClubs: number;
    activeClubs: number;

    // Licences
    totalLicenses: number;
    activeLicenses: number;
    expiringLicenses: number;
    expiredLicenses: number;

    // Contenu
    draftArticles: number;

    // Compétitions
    totalCompetitions: number;
    upcomingCompetitions: number;

    // Graphiques
    membresParRegion: Array<{
        regionNom: string;
        regionCode: string;
        total: number;
    }>;
    membresMoisParMois: Array<{
        mois: string;   // format: "YYYY-MM"
        total: number;
    }>;
    membresParGrade: Array<{ grade: string; total: number }>;
    membresParDiscipline: Array<{ discipline: string; total: number }>;
}

export interface AdminNotifications {
    paymentProofs: number;        // preuves de paiement d'affiliation à vérifier
    affiliationsToReview: number; // affiliations payées à approuver / rejeter
    renewalsToVerify: number;     // renouvellements de licence à confirmer
    total: number;
}

export const statsApi = {
    /**
     * GET /api/admin/notifications — éléments en attente d'action
     */
    notifications: () =>
        api.get<{ data: AdminNotifications }>('/admin/notifications'),

    /**
     * GET /api/admin/stats
     * Retourne tous les KPIs du tableau de bord admin
     */
    dashboard: () =>
        api.get<{ data: DashboardStats }>('/admin/stats'),
};
