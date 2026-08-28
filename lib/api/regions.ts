// ─── lib/api/regions.ts ────────────────────────────────────────────────────────
import { api } from './client';

export interface Region {
    id: number;
    nom: string;
    code: string;
    latitude: number | null;
    longitude: number | null;
    _count?: { clubs: number };
}

export const regionsApi = {
    /**
     * GET /api/regions
     */
    list: () => api.get<{ data: Region[] }>('/regions'),
};
