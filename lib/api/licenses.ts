// ─── lib/api/licenses.ts ──────────────────────────────────────────────────────
import { api } from './client';

export interface License {
    id: number;
    memberId: number;
    uuid: string;
    qrToken: string;
    status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
    dateDebut: string | null;
    dateFin: string | null;
    pdfUrl: string | null;
    annee: number;
    createdAt: string;
    updatedAt: string;
    member?: {
        prenom: string;
        nom: string;
        photoUrl: string | null;
        club: { nom: string; region: { nom: string } };
    };
}

export interface VerifyResult {
    valid: boolean;
    reason?: string;
    member?: {
        nom: string;
        prenom: string;
        photoUrl: string | null;
        grade: string | null;
        discipline: string | null;
        club: string;
        region: string;
    };
    license?: {
        uuid?: string;
        annee: number;
        status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
        dateDebut?: string | null;
        dateFin: string | null;
    };
}

export const licensesApi = {
    /**
     * GET /api/licenses/verify?token=xxx  — PUBLIC
     * Vérifie un QR code lors d'un événement
     */
    verify: (token: string) =>
        api.get<{ data: VerifyResult }>('/licenses/verify', { params: { token } }),

    /**
     * GET /api/licenses/:id/qrcode  — membre connecté
     * Retourne { qrDataURL: string }
     */
    getQrCode: (id: number) =>
        api.get<{ qrDataURL: string }>(`/licenses/${id}/qrcode`),

    /**
     * GET /api/upload/licenses/:id/pdf  — redirige vers le PDF Cloudinary
     */
    getPdfUrl: (id: number) =>
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/upload/licenses/${id}/pdf`,

    /**
     * POST /api/licenses  — admin uniquement
     * Crée une nouvelle licence pour un membre
     */
    create: (data: { memberId: number; annee: number; dateDebut?: string; dateFin?: string }) =>
        api.post<{ data: License; message: string }>('/licenses', data),
};
