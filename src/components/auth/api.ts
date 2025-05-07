import axios from 'axios';
import { validatePassword } from './auth-utils'
import CryptoJS from 'crypto-js'


export interface AuthResponse {
  success: boolean;
  error?: string;
}

const api = axios.create({
  baseURL: `http://localhost:3001`
});


export async function registerUser(login: string, password: string): Promise<AuthResponse> {
  const passwordError = validatePassword(password);
  if (passwordError) {
    return {success: false, error: passwordError};
  }

  try {
    const firstHash = CryptoJS.SHA256(password).toString();
    const res = await api.post<AuthResponse>('/api/auth/register', { login, firstHash });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, error: 'Network error' };
  }
}

export async function loginUser(login: string, password: string): Promise<AuthResponse> {
  if (!login || !password) {
    return {success: false, error: 'Логин и пароль обязательны'};
  }

  try {
    const firstHash = CryptoJS.SHA256(password).toString();
    const res = await api.post<AuthResponse>('/api/auth/login', { login, firstHash });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, error: 'Network error' };
  }
}