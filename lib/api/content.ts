// ─── lib/api/content.ts — contenus éditoriaux (accueil, bureau) ──────────────
import { api } from './client';
import type { ContentKey } from '@/lib/content/defaults';

export interface ContentResponse<T> {
  data: T | null;          // null : contenu par défaut
  updatedAt: string | null;
}

export const contentApi = {
  /** GET /api/content/:key — public */
  get: <T>(key: ContentKey) => api.get<ContentResponse<T>>(`/content/${key}`),

  /** PUT /api/admin/content/:key */
  save: <T>(key: ContentKey, data: T) =>
    api.put<ContentResponse<T> & { message: string }>(`/admin/content/${key}`, { data }),

  /** DELETE /api/admin/content/:key — revenir au contenu par défaut */
  reset: (key: ContentKey) => api.delete<{ message: string }>(`/admin/content/${key}`),
};
