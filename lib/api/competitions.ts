// ─── lib/api/competitions.ts ──────────────────────────────────────────────────
import { api } from './client';
import type { PaginatedResponse } from './clubs';

export interface Competition {
    id: number;
    titre: string;
    description: string | null;
    regionId: number;
    lieu: string | null;
    dateDebut: string;
    dateFin: string | null;
    categories: any | null;
    imageUrl: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    region?: { nom: string; code: string };
    _count?: { inscriptions: number };
}

export interface CompetitionListParams {
    search?: string;
    region?: string;
    status?: 'upcoming' | 'open' | 'completed';
    page?: number;
    limit?: number;
}

export interface CreateCompetitionPayload {
    titre: string;
    description?: string;
    regionId: number;
    lieu?: string;
    dateDebut: string;
    dateFin?: string;
    categories?: any;
    imageUrl?: string;
    isPublished?: boolean;
}

// ── Résultats ─────────────────────────────────────────────────────────────────

export type Medaille = 'OR' | 'ARGENT' | 'BRONZE' | null;

export interface ResultsAdminData {
    id: number;
    titre: string;
    dateDebut: string;
    categories: string[] | null;
    resultatsPublies: boolean;
    inscriptions: Array<{
        categorie: string | null;
        member: { id: number; prenom: string; nom: string; club: { nom: string } };
    }>;
    resultats: Array<{
        id: number;
        memberId: number;
        categorie: string;
        classement: number;
        points: number | null;
        medaille: Medaille;
    }>;
}

export interface ResultRowPayload {
    memberId: number;
    categorie?: string;
    classement: number;
    points?: number | null;
}

export const competitionsApi = {
    // ── Public ──────────────────────────────────────────────────────────────────
    /**
     * GET /api/competitions?search=&region=&status=upcoming&page=&limit=
     */
    list: (params?: CompetitionListParams) =>
        api.get<PaginatedResponse<Competition>>('/competitions', { params }),

    /**
     * GET /api/competitions/:id
     */
    get: (id: number) =>
        api.get<{ data: Competition }>(`/competitions/${id}`),

    /**
     * POST /api/competitions/:id/inscriptions  — membre connecté
     */
    inscrire: (id: number, categorie?: string) =>
        api.post<{ data: any; message: string }>(`/competitions/${id}/inscriptions`, { categorie }),

    // ── Admin ────────────────────────────────────────────────────────────────────
    /**
     * GET /api/admin/competitions?search=&page=&limit=
     */
    adminList: (params?: { search?: string; page?: number; limit?: number }) =>
        api.get<PaginatedResponse<Competition>>('/admin/competitions', { params }),

    /**
     * GET /api/admin/competitions/:id
     */
    adminGet: (id: number) =>
        api.get<{ data: Competition }>(`/admin/competitions/${id}`),

    /**
     * POST /api/admin/competitions
     */
    create: (data: CreateCompetitionPayload) =>
        api.post<{ data: Competition; message: string }>('/admin/competitions', data),

    /**
     * PUT /api/admin/competitions/:id
     */
    update: (id: number, data: Partial<CreateCompetitionPayload>) =>
        api.put<{ data: Competition; message: string }>(`/admin/competitions/${id}`, data),

    /**
     * DELETE /api/admin/competitions/:id
     */
    delete: (id: number) =>
        api.delete<{ message: string }>(`/admin/competitions/${id}`),

    /** GET /api/admin/competitions/:id/resultats — inscrits + résultats saisis */
    adminResults: (id: number) =>
        api.get<{ data: ResultsAdminData }>(`/admin/competitions/${id}/resultats`),

    /** PUT /api/admin/competitions/:id/resultats — remplace le classement complet */
    saveResults: (id: number, resultats: ResultRowPayload[]) =>
        api.put<{ data: ResultsAdminData; message: string }>(`/admin/competitions/${id}/resultats`, { resultats }),

    /** PATCH /api/admin/competitions/:id/resultats/publication */
    publishResults: (id: number, publie: boolean) =>
        api.patch<{ data: { id: number; resultatsPublies: boolean }; message: string }>(
            `/admin/competitions/${id}/resultats/publication`, { publie }
        ),
};
