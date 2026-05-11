// ─── lib/api/upload.ts ────────────────────────────────────────────────────────
import apiClient from './client';

export interface UploadResult {
    url: string;
    publicId?: string;
}

export const uploadApi = {
    /**
     * PUT /api/upload/photo  — membre connecté
     * Uploader la photo de profil du membre connecté
     */
    uploadMemberPhoto: async (file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('photo', file);
        const { data } = await apiClient.put<{ data: UploadResult }>('/upload/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.data;
    },

    /**
     * PUT /api/upload/clubs/:id/logo  — admin
     * Uploader le logo d'un club
     */
    uploadClubLogo: async (clubId: number, file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('logo', file);
        const { data } = await apiClient.put<{ data: UploadResult }>(
            `/upload/clubs/${clubId}/logo`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data.data;
    },

    /**
     * POST /api/upload/articles/image  — admin
     * Uploader l'image de couverture d'un article
     */
    uploadArticleImage: async (file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await apiClient.post<{ data: UploadResult }>(
            '/upload/articles/image',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data.data;
    },
};
