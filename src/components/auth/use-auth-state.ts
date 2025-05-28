import { signal } from '@preact/signals';
import { useCallback } from 'preact/hooks';
import { deleteRefreshToken } from './api.ts'

const isAuthenticatedSignal = signal<boolean>(!!localStorage.getItem('accessToken'));
const storedUsername = localStorage.getItem('username');
const usernameSignal = signal<string | null>(
  storedUsername && storedUsername !== 'null' ? storedUsername : null
);

export function setAuthenticated(token: string, username: string) {
  localStorage.setItem('accessToken', token);
  if (username) {
    localStorage.setItem('username', username);
    usernameSignal.value = username;
  } else {
    localStorage.removeItem('username');
    usernameSignal.value = null;
  }
  isAuthenticatedSignal.value = true;
}

export async function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('username')
  isAuthenticatedSignal.value = false
  usernameSignal.value = null
  await deleteRefreshToken()
}

export function useAuthState() {
  const isAuthenticated = isAuthenticatedSignal.value;
  const username = usernameSignal.value;

  const handleLogout = useCallback(async () => {
    await logout()
  }, [])

  return {
    isAuthenticated,
    username,
    logout: handleLogout,
  };
}