// ─── lib/api/clubs.ts ─────────────────────────────────────────────────────────
import { api } from './client';

export interface Club {
    id: number;
    nom: string;
    regionId: number;
    ville: string | null;
    latitude: number | null;
    longitude: number | null;
    nomMaitre: string | null;
    telephone: string | null;
    email: string | null;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    region: { nom: string; code: string };
    _count?: { members: number };
}

export interface ClubListParams {
    search?: string;
    region?: string;
    active?: boolean;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export const clubsApi = {
    // ── Public ──────────────────────────────────────────────────────────────────
    /**
     * GET /api/clubs?search=&region=DK&page=1&limit=20
     */
    list: (params?: ClubListParams) =>
        api.get<PaginatedResponse<Club>>('/clubs', { params }),

    /**
     * GET /api/clubs/:id
     */
    get: (id: number) =>
        api.get<{ data: Club }>(`/clubs/${id}`),

    /**
     * GET /api/clubs/map?region=DK&limit=100
     */
    map: (params?: { region?: string; limit?: number }) =>
        api.get<Club[]>('/clubs/map', { params }),

    /**
     * GET /api/clubs/search?q=dakar
     */
    search: (q: string) =>
        api.get<Club[]>('/clubs/search', { params: { q } }),

    // ── Admin ────────────────────────────────────────────────────────────────────
    /**
     * GET /api/admin/clubs?search=&region=&active=&page=&limit=
     */
    adminList: (params?: ClubListParams) =>
        api.get<PaginatedResponse<Club>>('/admin/clubs', { params }),

    /**
     * POST /api/admin/clubs
     */
    create: (data: Partial<Club>) =>
        api.post<{ data: Club; message: string }>('/admin/clubs', data),

    /**
     * PUT /api/admin/clubs/:id
     */
    update: (id: number, data: Partial<Club>) =>
        api.put<{ data: Club; message: string }>(`/admin/clubs/${id}`, data),

    /**
     * PATCH /api/admin/clubs/:id/activate
     */
    activate: (id: number) =>
        api.patch<{ data: Club; message: string }>(`/admin/clubs/${id}/activate`),

    /**
     * PATCH /api/admin/clubs/:id/deactivate
     */
    deactivate: (id: number) =>
        api.patch<{ data: Club; message: string }>(`/admin/clubs/${id}/deactivate`),

    /**
     * DELETE /api/admin/clubs/:id
     */
    delete: (id: number) =>
        api.delete<{ message: string }>(`/admin/clubs/${id}`),
};
