// ─── lib/api/media.ts ──────────────────────────────────────────────────────────
import apiClient, { api } from './client';
import type { PaginatedResponse } from './clubs';

export interface MediaItem {
    id: number;
    url: string;
    publicId: string;
    title: string | null;
    mimeType: string | null;
    size: number | null;
    width: number | null;
    height: number | null;
    createdAt: string;
    uploadedBy?: { email: string } | null;
}

export const mediaApi = {
    /**
     * GET /api/admin/media?search=&page=&limit=
     */
    list: (params?: { search?: string; page?: number; limit?: number }) =>
        api.get<PaginatedResponse<MediaItem>>('/admin/media', { params }),

    /**
     * POST /api/admin/media  (multipart, champ "file")
     */
    upload: async (file: File, title?: string): Promise<MediaItem> => {
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        const { data } = await apiClient.post<{ data: MediaItem }>('/admin/media', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.data;
    },

    /**
     * DELETE /api/admin/media/:id
     */
    delete: (id: number) =>
        api.delete<{ message: string }>(`/admin/media/${id}`),
};
