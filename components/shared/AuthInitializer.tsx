'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { authApi } from '@/lib/api/auth';

export function AuthInitializer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // After page refresh: user is marked authenticated but token is gone (not persisted).
    // Proactively refresh before any API call hits a 401.
    if (isAuthenticated && !accessToken) {
      authApi.refresh()
        .then((res) => {
          const token = (res as any)?.data?.accessToken;
          if (token) setAccessToken(token);
          else logout();
        })
        .catch(() => logout());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
