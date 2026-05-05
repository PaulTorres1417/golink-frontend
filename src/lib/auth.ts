import { TokenStore } from '../store/auth/tokenStore';
import { useAuthStore } from '../store/auth/useAuthStore';

export async function silentRefresh(): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:4000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      useAuthStore.getState().logout();
      return null;
    }

    const { accessToken } = await res.json();
    TokenStore.set(accessToken);
    console.log('✅ Token refresheado exitosamente');
    return accessToken;
  } catch {
    useAuthStore.getState().logout();
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch('http://localhost:4000/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  TokenStore.clear();
  useAuthStore.getState().logout();
  window.location.href = '/';
}