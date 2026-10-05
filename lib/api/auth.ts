// ─── lib/api/auth.ts ───────────────────────────────────────────────────────────
import { api } from './client';
import { useAuthStore } from '@/lib/store/auth-store';

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

export const authApi = {
    /**
     * POST /api/auth/login
     * Returns { data: { accessToken, user } }
     */
    login: (payload: LoginPayload) =>
        api.post<{ data: { accessToken: string; user: AuthUser } }>('/auth/login', payload),

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

/**
 * Déconnexion complète : révoque le refresh token côté serveur (cookie
 * httpOnly), vide l'état local puis recharge la page pour purger tout cache
 * de données (important sur un poste partagé).
 */
export async function signOut(redirectTo = '/') {
    try {
        await authApi.logout();
    } catch {
        // Session déjà expirée côté serveur : on poursuit la déconnexion locale
    }
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') window.location.href = redirectTo;
}
