import { api } from './client';

export const affiliationApi = {
  submitClub: (data: Record<string, any>) =>
    api.post('/affiliations/club', data),

  submitMaitre: (data: Record<string, any>) =>
    api.post('/affiliations/maitre', data),

  submitMembre: (data: Record<string, any>) =>
    api.post('/affiliations/membre', data),

  // Admin
  list: (params?: Record<string, any>) =>
    api.get('/affiliations', { params }),

  get: (id: number) =>
    api.get(`/affiliations/${id}`),

  approve: (id: number, adminNote?: string) =>
    api.patch(`/affiliations/${id}/approve`, { adminNote }),

  reject: (id: number, motifRejet: string) =>
    api.patch(`/affiliations/${id}/reject`, { motifRejet }),
};
