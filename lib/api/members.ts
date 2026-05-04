// ─── lib/api/members.ts ───────────────────────────────────────────────────────
import { api } from './client';
import type { PaginatedResponse } from './clubs';

export interface Member {
    id: number;
    userId: number;
    clubId: number;
    prenom: string;
    nom: string;
    dateNaissance: string | null;
    sexe: 'M' | 'F' | null;
    grade: string | null;
    discipline: string | null;
    photoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    status?: string | null;
    licenseNumber?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    ville?: string | null;
    region?: string | null;
    bio?: string | null;
    disciplines?: string | null;
    user?: {
        email: string;
        phone: string | null;
        role: string;
        isActive: boolean;
        firstName?: string;
        lastName?: string;
    };
    club?: {
        id: number;
        nom: string;
        region: { nom: string; code: string };
    };
    licenses?: Array<{
        id: number;
        status: string;
        dateFin: string | null;
        annee: number;
    }>;
}

export interface MemberListParams {
    search?: string;
    club?: number;
    status?: string;
    page?: number;
    limit?: number;
}

export interface UpdateMemberPayload {
    prenom?: string;
    nom?: string;
    grade?: string;
    discipline?: string;
    photoUrl?: string;
    clubId?: number;
    dateNaissance?: string;
    sexe?: 'M' | 'F';
    telephone?: string;
    adresse?: string;
    ville?: string;
    region?: string;
    bio?: string;
}

export const membersApi = {
    // ── Membre connecté ──────────────────────────────────────────────────────────
    /**
     * GET /api/members/me
     */
    me: () => api.get<{ data: Member }>('/members/me'),

    /**
     * PUT /api/members/me
     */
    updateMe: (data: UpdateMemberPayload) =>
        api.put<{ data: Member; message: string }>('/members/me', data),

    /**
     * GET /api/members/me/license
     */
    myLicense: () => api.get<{ data: any }>('/members/me/license'),

    /**
     * GET /api/members/me/payments
     */
    myPayments: () => api.get<{ data: any[] }>('/members/me/payments'),

    /**
     * GET /api/members/me/inscriptions
     */
    myInscriptions: () => api.get<{ data: any[] }>('/members/me/inscriptions'),

    // ── Admin ────────────────────────────────────────────────────────────────────
    /**
     * GET /api/admin/members?search=&club=&status=&page=&limit=
     */
    adminList: (params?: MemberListParams) =>
        api.get<PaginatedResponse<Member>>('/admin/members', { params }),

    /**
     * GET /api/admin/members/:id
     */
    adminGet: (id: number) =>
        api.get<{ data: Member }>(`/admin/members/${id}`),

    /**
     * PUT /api/admin/members/:id
     */
    adminUpdate: (id: number, data: UpdateMemberPayload) =>
        api.put<{ data: Member; message: string }>(`/admin/members/${id}`, data),

    /**
     * DELETE /api/admin/members/:id
     */
    adminDelete: (id: number) =>
        api.delete<{ message: string }>(`/admin/members/${id}`),

    /**
     * PATCH /api/admin/members/:id/validate
     */
    validate: (id: number) =>
        api.patch<{ message: string }>(`/admin/members/${id}/validate`),

    /**
     * PATCH /api/admin/members/:id/suspend
     */
    suspend: (id: number) =>
        api.patch<{ message: string }>(`/admin/members/${id}/suspend`),
};
