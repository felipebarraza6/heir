/**
 * Cliente HTTP contra la API Yggdra (mismo contrato que frig / nxord).
 *
 * - Auth: header `Authorization: Token <key>` (DRF Token)
 * - Sucursal: header `X-Branch-ID` (aislamiento multi-tenant en backend)
 * - Soft-delete: `is_active=True` por defecto
 */

export const API_BASE: string =
  (import.meta.env.VITE_YGGDRA_API_BASE as string | undefined) ??
  'http://localhost:8000/api';

export const TOKEN_KEY = 'heir.token';
export const BRANCH_KEY = 'heir.branch_id';
export const SESSION_KEY = 'heir.session';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getBranchId(): string | null {
  return localStorage.getItem(BRANCH_KEY);
}

export function setBranchId(id: string | null): void {
  if (id) localStorage.setItem(BRANCH_KEY, id);
  else localStorage.removeItem(BRANCH_KEY);
}

export class ApiError extends Error {
  status: number;
  detail?: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

function redirectToLogin(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(BRANCH_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.location.assign(`${window.location.origin}/login`);
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** auto = adjunta token si existe; required = exige token; none = endpoint público */
  auth?: 'auto' | 'required' | 'none';
  branch?: 'auto' | 'none';
  timeoutMs?: number;
};

export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = 'required', branch = 'auto', timeoutMs = 30_000 } = opts;

  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  const token = getToken();
  if (auth === 'required' && !token) {
    redirectToLogin();
    throw new ApiError(401, 'No autenticado');
  }
  if (token && auth !== 'none') finalHeaders['Authorization'] = `Token ${token}`;

  const branchId = getBranchId();
  if (branch === 'auto' && branchId) finalHeaders['X-Branch-ID'] = branchId;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = /^https?:\/\//i.test(path) ? path : `${API_BASE}${path}`;
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (res.status === 401 && auth === 'required') {
      redirectToLogin();
      throw new ApiError(401, 'Sesión expirada');
    }

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        /* respuesta no JSON */
      }
    }

    if (!res.ok) {
      throw new ApiError(res.status, formatErrorDetail(data) || `Error ${res.status}`, data);
    }
    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(408, 'Tiempo de espera agotado al conectar con el servidor');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function formatErrorDetail(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) return formatErrorDetail(detail[0]);
  if (detail && typeof detail === 'object') {
    const record = detail as Record<string, unknown>;
    for (const key of ['detail', 'non_field_errors', 'error']) {
      if (key in record) {
        const v = formatErrorDetail(record[key]);
        if (v) return v;
      }
    }
    const first = Object.values(record)[0];
    if (first !== undefined) return formatErrorDetail(first);
  }
  return '';
}
