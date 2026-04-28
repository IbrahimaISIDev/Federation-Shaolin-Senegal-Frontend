// ─── lib/api/actualites.ts ────────────────────────────────────────────────────
import { api } from './client';
import type { PaginatedResponse } from './clubs';

export interface Actualite {
    id: number;
    titre: string;
    slug: string;
    contenu: string;
    imageUrl: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ActualiteListParams {
    search?: string;
    published?: boolean;
    page?: number;
    limit?: number;
}

export interface CreateActualitePayload {
    titre: string;
    contenu: string;
    imageUrl?: string;
    isPublished?: boolean;
}

export const actualitesApi = {
    // ── Public ──────────────────────────────────────────────────────────────────
    /**
     * GET /api/actualites?page=&limit=
     */
    list: (params?: { page?: number; limit?: number }) =>
        api.get<PaginatedResponse<Actualite>>('/actualites', { params }),

    /**
     * GET /api/actualites/:slug
     */
    getBySlug: (slug: string) =>
        api.get<{ data: Actualite }>(`/actualites/${slug}`),

    // ── Admin ────────────────────────────────────────────────────────────────────
    /**
     * GET /api/admin/actualites?search=&published=&page=&limit=
     */
    adminList: (params?: ActualiteListParams) =>
        api.get<PaginatedResponse<Actualite>>('/admin/actualites', { params }),

    /**
     * GET /api/admin/actualites/:id
     */
    adminGet: (id: number) =>
        api.get<{ data: Actualite }>(`/admin/actualites/${id}`),

    /**
     * POST /api/admin/actualites
     */
    create: (data: CreateActualitePayload) =>
        api.post<{ data: Actualite; message: string }>('/admin/actualites', data),

    /**
     * PUT /api/admin/actualites/:id
     */
    update: (id: number, data: Partial<CreateActualitePayload>) =>
        api.put<{ data: Actualite; message: string }>(`/admin/actualites/${id}`, data),

    /**
     * PATCH /api/admin/actualites/:id/publish
     */
    publish: (id: number) =>
        api.patch<{ data: Actualite; message: string }>(`/admin/actualites/${id}/publish`),

    /**
     * PATCH /api/admin/actualites/:id/unpublish
     */
    unpublish: (id: number) =>
        api.patch<{ data: Actualite; message: string }>(`/admin/actualites/${id}/unpublish`),

    /**
     * DELETE /api/admin/actualites/:id
     */
    delete: (id: number) =>
        api.delete<{ message: string }>(`/admin/actualites/${id}`),
};
