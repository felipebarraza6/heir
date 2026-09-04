import { apiFetch } from './client';
import type { Branch, Paginated } from './types';

/** GET /api/branches/branches/ — sucursales visibles para el usuario (superadmin ve todas). */
export async function fetchBranches(): Promise<Branch[]> {
  const data = await apiFetch<Paginated<Branch> | Branch[]>('/branches/branches/?page_size=100');
  return Array.isArray(data) ? data : (data.results ?? []);
}
