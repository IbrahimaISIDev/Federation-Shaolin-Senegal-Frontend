// ─── lib/api/renewals.ts ───────────────────────────────────────────────────────
import { api } from './client';

export interface PendingRenewal {
    id: number;
    licenseId: number;
    montant: string;
    provider: 'WAVE' | 'ORANGE_MONEY' | 'CARD' | 'CASH';
    transactionRef: string | null;
    preuveUrl: string | null;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
    createdAt: string;
    license: {
        id: number;
        annee: number;
        member: {
            id: number;
            prenom: string;
            nom: string;
            user: { email: string };
            club: { nom: string } | null;
        };
    };
}

export const renewalsApi = {
    /**
     * GET /api/admin/renewals
     */
    list: () => api.get<{ data: PendingRenewal[] }>('/admin/renewals'),

    /**
     * PATCH /api/admin/renewals/:paymentId/confirm
     */
    confirm: (paymentId: number) =>
        api.patch<{ data: any; message: string }>(`/admin/renewals/${paymentId}/confirm`),

    /**
     * PATCH /api/admin/renewals/:paymentId/reject
     */
    reject: (paymentId: number) =>
        api.patch<{ data: any; message: string }>(`/admin/renewals/${paymentId}/reject`),
};
