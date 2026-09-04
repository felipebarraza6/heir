/** Tipos del contrato Yggdra usados por HEIR. */

export interface BranchAssignment {
  branch_id: number | string;
  role_code?: string;
  role_name?: string;
  station_id?: number | string;
  [key: string]: unknown;
}

export interface User {
  id: number | string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  type_user?: string;
  is_superuser?: boolean;
  branch_assignments?: BranchAssignment[];
  [key: string]: unknown;
}

export interface Branch {
  id?: number | string;
  branch_id?: number | string;
  name?: string;
  commune?: string;
  region?: string;
  [key: string]: unknown;
}

export interface LoginCompleteResponse {
  token: string;
  user?: User;
  branches?: Branch[];
  [key: string]: unknown;
}

export interface Paginated<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

/** Normaliza el id de sucursal (la API lo expone como id o branch_id). */
export function branchIdOf(b: Branch): string {
  return String(b.branch_id ?? b.id ?? '');
}

/** Nombre visible del usuario. */
export function userDisplayName(u: User | null): string {
  if (!u) return '';
  return (
    u.full_name ||
    [u.first_name, u.last_name].filter(Boolean).join(' ') ||
    u.email
  );
}
