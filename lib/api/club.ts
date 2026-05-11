import { api } from './client';

export const clubApi = {
    me: () =>
        api.get<{ data: any }>('/club/me'),

    stats: () =>
        api.get<{ data: {
            totalMembers: number;
            activeLicenses: number;
            pendingLicenses: number;
            expiredLicenses: number;
            expiringLicenses: number;
            upcomingInscriptions: number;
        } }>('/club/stats'),

    members: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
        api.get<{ data: any[]; total: number; page: number; limit: number }>('/club/membres', { params }),

    licenses: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get<{ data: any[]; total: number; page: number; limit: number }>('/club/licences', { params }),
};
