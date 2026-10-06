// ─── lib/api/messages.ts — messages du formulaire de contact (admin) ──────────
import { api } from './client';

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface MessagesResponse {
    data: ContactMessage[];
    total: number;
    unread: number;
    page: number;
    limit: number;
}

export const messagesApi = {
    /** GET /api/admin/messages?status=unread|read&search=&page=&limit= */
    list: (params?: { status?: 'unread' | 'read'; search?: string; page?: number; limit?: number }) =>
        api.get<MessagesResponse>('/admin/messages', { params }),

    /** PATCH /api/admin/messages/:id */
    setRead: (id: number, isRead: boolean) =>
        api.patch<{ data: ContactMessage }>(`/admin/messages/${id}`, { isRead }),

    /** DELETE /api/admin/messages/:id */
    delete: (id: number) => api.delete<{ message: string }>(`/admin/messages/${id}`),
};
