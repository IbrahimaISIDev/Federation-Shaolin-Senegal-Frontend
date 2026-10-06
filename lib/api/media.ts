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
    inGallery: boolean;     // visible dans la galerie publique
    album: string | null;
    createdAt: string;
    uploadedBy?: { email: string } | null;
}

export interface GalleryPhoto {
    id: number;
    url: string;
    title: string | null;
    album: string | null;
    width: number | null;
    height: number | null;
    createdAt: string;
}

export interface PublicGalleryResponse {
    data: GalleryPhoto[];
    albums: { album: string; count: number }[];
    total: number;
}

export const mediaApi = {
    /**
     * GET /api/admin/media?search=&page=&limit=
     */
    list: (params?: { search?: string; page?: number; limit?: number; inGallery?: boolean }) =>
        api.get<PaginatedResponse<MediaItem>>('/admin/media', { params }),

    /**
     * POST /api/admin/media  (multipart, champ "file")
     */
    upload: async (
        file: File,
        options: { title?: string; album?: string; inGallery?: boolean } = {}
    ): Promise<MediaItem> => {
        const formData = new FormData();
        formData.append('file', file);
        if (options.title) formData.append('title', options.title);
        if (options.album) formData.append('album', options.album);
        if (options.inGallery) formData.append('inGallery', 'true');
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

    /**
     * PATCH /api/admin/media/:id — titre, album, visibilité dans la galerie publique
     */
    update: (id: number, data: { title?: string; album?: string | null; inGallery?: boolean }) =>
        api.patch<{ data: MediaItem; message: string }>(`/admin/media/${id}`, data),

    /**
     * GET /api/gallery — galerie publique (médias publiés depuis l'admin)
     */
    publicGallery: (params?: { album?: string; limit?: number }) =>
        api.get<PublicGalleryResponse>('/gallery', { params }),
};
