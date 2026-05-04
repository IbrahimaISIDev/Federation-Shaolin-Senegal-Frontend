// ─── lib/api/auth.ts ───────────────────────────────────────────────────────────
import { api } from './client';

// Correspond exactement à ce que retourne loginService / refreshService backend
export interface AuthUser {
    id: number;
    email: string;
    role: 'MEMBER' | 'CLUB_MANAGER' | 'ADMIN';
    memberId?: number;
    prenom?: string;
    nom?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    prenom: string;
    nom: string;
    phone?: string;
    clubId: number;
    grade?: string;
    discipline?: string;
}

export const authApi = {
    /**
     * POST /api/auth/login
     * Returns { data: { accessToken, user } }
     */
    login: (payload: LoginPayload) =>
        api.post<{ data: { accessToken: string; user: AuthUser } }>('/auth/login', payload),

    /**
     * POST /api/auth/register
     * Returns { data: user }
     */
    register: (payload: RegisterPayload) =>
        api.post<{ data: AuthUser }>('/auth/register', payload),

    /**
     * POST /api/auth/logout
     */
    logout: () => api.post('/auth/logout'),

    /**
     * POST /api/auth/refresh  — called automatically by axios interceptor
     * Returns { data: { accessToken } }
     */
    refresh: () =>
        api.post<{ data: { accessToken: string } }>('/auth/refresh'),

    /**
     * GET /api/auth/me  — requires Bearer token
     * Returns { data: JwtPayload } (userId, role, memberId)
     */
    me: () => api.get<{ data: { userId: number; role: string; memberId?: number } }>('/auth/me'),

    /**
     * POST /api/auth/change-password  — requires Bearer token
     * Révoque tous les refresh tokens après succès
     */
    changePassword: (payload: { currentPassword: string; newPassword: string }) =>
        api.post<{ message: string }>('/auth/change-password', payload),

    forgotPassword: (payload: { email: string }) =>
        api.post<{ message: string }>('/auth/forgot-password', payload),

    resetPassword: (payload: { token: string; password: string }) =>
        api.post<{ message: string }>('/auth/reset-password', payload),
};
