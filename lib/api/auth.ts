// ─── lib/api/auth.ts ───────────────────────────────────────────────────────────
import { api } from './client';

export interface AuthUser {
    userId: number;
    email: string;
    role: 'MEMBER' | 'CLUB_MANAGER' | 'ADMIN';
    isActive: boolean;
    member?: {
        id: number;
        prenom: string;
        nom: string;
        photoUrl: string | null;
        clubId: number;
    };
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
     * Returns { data: AuthUser }
     */
    me: () => api.get<{ data: AuthUser }>('/auth/me'),
};
