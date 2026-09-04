/**
 * Sesión HEIR — resolución de roles y sucursal activa contra Yggdra.
 *
 * Roles de producto:
 * - superadmin:   is_superuser o type_user === 'ADM' → /admin (dueño del servidor, vista multi-sucursal)
 * - profesional:  tiene branch_assignments          → /panel (agenda + finanzas de su sucursal)
 * - paciente:     usuario sin asignaciones           → /paciente (cliente final)
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loginComplete, logoutRemote } from './api/auth';
import { TOKEN_KEY, SESSION_KEY, setBranchId } from './api/client';
import type { Branch, User } from './api/types';
import { branchIdOf } from './api/types';

export type AppRole = 'superadmin' | 'profesional' | 'paciente';

export function resolveRole(user: User | null): AppRole {
  if (!user) return 'paciente';
  if (user.is_superuser || String(user.type_user ?? '').toUpperCase() === 'ADM') return 'superadmin';
  if ((user.branch_assignments?.length ?? 0) > 0) return 'profesional';
  return 'paciente';
}

export function roleHome(role: AppRole): string {
  switch (role) {
    case 'superadmin':
      return '/admin';
    case 'profesional':
      return '/panel';
    default:
      return '/paciente';
  }
}

interface PersistedSession {
  user: User;
  branches: Branch[];
  currentBranchId: string | null;
}

interface SessionContextValue {
  user: User | null;
  branches: Branch[];
  currentBranchId: string | null;
  role: AppRole | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<AppRole>;
  logout: () => Promise<void>;
  selectBranch: (branchId: string) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function readPersisted(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw || !localStorage.getItem(TOKEN_KEY)) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = readPersisted();
    if (persisted) {
      setState(persisted);
      if (persisted.currentBranchId) setBranchId(persisted.currentBranchId);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((s: PersistedSession | null) => {
    setState(s);
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AppRole> => {
      const res = await loginComplete(email.trim().toLowerCase(), password);
      if (!res.token) throw new Error('El servidor no devolvió un token de sesión.');
      localStorage.setItem(TOKEN_KEY, res.token);

      const user = res.user ?? ({ email } as User);
      const branches = res.branches ?? user.branch_assignments?.map((a) => ({ branch_id: a.branch_id })) ?? [];
      const role = resolveRole(user);

      // Sucursal inicial: primera asignación (profesional) o primera sucursal (superadmin).
      const assigned = user.branch_assignments?.[0]?.branch_id;
      const firstBranch = assigned ?? (branches[0] ? branchIdOf(branches[0]) : null);
      const currentBranchId = firstBranch ? String(firstBranch) : null;
      if (currentBranchId) setBranchId(currentBranchId);

      persist({ user, branches, currentBranchId });
      return role;
    },
    [persist],
  );

  const logout = useCallback(async () => {
    await logoutRemote();
    localStorage.removeItem(TOKEN_KEY);
    setBranchId(null);
    persist(null);
  }, [persist]);

  const selectBranch = useCallback(
    (branchId: string) => {
      if (!state) return;
      setBranchId(branchId);
      persist({ ...state, currentBranchId: branchId });
    },
    [state, persist],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      user: state?.user ?? null,
      branches: state?.branches ?? [],
      currentBranchId: state?.currentBranchId ?? null,
      role: resolveRole(state?.user ?? null),
      isAuthenticated: Boolean(state && localStorage.getItem(TOKEN_KEY)),
      hydrated,
      login,
      logout,
      selectBranch,
    }),
    [state, hydrated, login, logout, selectBranch],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return ctx;
}
