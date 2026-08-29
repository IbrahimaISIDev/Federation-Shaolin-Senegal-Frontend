// ─── lib/api/settings.ts ───────────────────────────────────────────────────────
import { api } from './client';

export interface Settings {
    id: number;
    orgName: string;
    contactEmail: string | null;
    contactPhone: string | null;
    website: string | null;
    notifyNewMember: boolean;
    notifyNewAffiliation: boolean;
    notifyCompetitions: boolean;
    notifyNewsletter: boolean;
    updatedAt: string;
}

export interface UpdateSettingsPayload {
    orgName?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    notifyNewMember?: boolean;
    notifyNewAffiliation?: boolean;
    notifyCompetitions?: boolean;
    notifyNewsletter?: boolean;
}

export const settingsApi = {
    /**
     * GET /api/settings — public
     */
    get: () => api.get<{ data: Settings }>('/settings'),

    /**
     * PUT /api/settings — admin
     */
    update: (data: UpdateSettingsPayload) =>
        api.put<{ data: Settings; message: string }>('/settings', data),
};
