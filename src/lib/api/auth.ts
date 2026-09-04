import { apiFetch } from './client';
import type { LoginCompleteResponse } from './types';

/** POST /api/accounts/users/login_complete/ — devuelve token + user + branches. */
export async function loginComplete(email: string, password: string): Promise<LoginCompleteResponse> {
  return apiFetch<LoginCompleteResponse>('/accounts/users/login_complete/', {
    method: 'POST',
    body: { email, password },
    auth: 'none',
    branch: 'none',
  });
}

/** POST /api/accounts/users/logout/ — invalida el token en el backend. */
export async function logoutRemote(): Promise<void> {
  try {
    await apiFetch('/accounts/users/logout/', { method: 'POST', branch: 'none' });
  } catch {
    /* si falla el logout remoto, la sesión local se limpia igual */
  }
}

/** POST /api/accounts/users/forgot_password/ — endpoint público (anti-enumeración). */
export async function forgotPassword(email: string, branchId?: string): Promise<{ message?: string }> {
  return apiFetch('/accounts/users/forgot_password/', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), ...(branchId ? { branch_id: branchId } : {}) },
    auth: 'none',
    branch: 'none',
  });
}
