// ─── lib/api/members.ts ───────────────────────────────────────────────────────
import { api } from './client';
import apiClient from './client';
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
    adresse?: string | null;
    nationalite?: string | null;
    groupeSanguin?: string | null;
    contactUrgenceNom?: string | null;
    contactUrgencePhone?: string | null;
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

export interface GradeHistoryEntry {
    id: number;
    memberId: number;
    ancienGrade: string | null;
    nouveauGrade: string;
    notes: string | null;
    createdAt: string;
    changedBy?: { email: string } | null;
}

export interface MemberListParams {
    search?: string;
    club?: number;
    status?: string;
    annee?: number;
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
     * POST /api/members/me/license/renew
     */
    renewLicense: (provider: 'WAVE' | 'ORANGE_MONEY') =>
        api.post<{ data: { license: any; payment: any }; message: string }>('/members/me/license/renew', { provider }),

    /**
     * PATCH /api/members/me/license/:licenseId/payment-proof
     */
    submitRenewalProof: (licenseId: number, data: { transactionRef: string; preuveUrl: string }) =>
        api.patch<{ data: any; message: string }>(`/members/me/license/${licenseId}/payment-proof`, data),

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

    /**
     * GET /api/admin/members/:id/grade-history
     */
    gradeHistory: (id: number) =>
        api.get<{ data: GradeHistoryEntry[] }>(`/admin/members/${id}/grade-history`),

    /**
     * GET /api/admin/members/export/pdf?search=&club=&status=&annee=
     */
    exportPdf: (params?: MemberListParams) =>
        apiClient
            .get('/admin/members/export/pdf', { params, responseType: 'blob' })
            .then((res) => res.data as Blob),
};
