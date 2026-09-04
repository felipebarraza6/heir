import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { useSession } from '@/lib/session';
import { fetchBranches } from '@/lib/api/branches';
import { fetchFinancialSummary, parseAmount, type FinancialMetricsSummary } from '@/lib/api/finance';
import { setBranchId } from '@/lib/api/client';
import { userDisplayName, branchIdOf, type Branch } from '@/lib/api/types';
import { formatCLP } from '@/data/demo';
import { Button } from '@/components/ui/button';

interface BranchRow {
  branch: Branch;
  metrics: FinancialMetricsSummary | null;
  error?: boolean;
}

/**
 * Vista del superadmin (dueño del servidor Yggdra):
 * todas las sucursales con su resumen financiero, cambiando X-Branch-ID por fila.
 */
export default function Admin() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const [rows, setRows] = useState<BranchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const branches = await fetchBranches();
        const results: BranchRow[] = [];
        for (const b of branches) {
          const id = branchIdOf(b);
          try {
            setBranchId(id);
            const metrics = await fetchFinancialSummary();
            results.push({ branch: b, metrics });
          } catch {
            results.push({ branch: b, metrics: null, error: true });
          }
        }
        if (!cancelled) setRows(results);
      } catch {
        if (!cancelled) setError('No se pudieron cargar las sucursales.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  const totals = rows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + parseAmount(r.metrics?.current_month_revenue ?? r.metrics?.total_revenue),
      expenses: acc.expenses + parseAmount(r.metrics?.current_month_expenses ?? r.metrics?.total_expenses),
      profit: acc.profit + parseAmount(r.metrics?.current_month_profit ?? r.metrics?.net_profit),
    }),
    { revenue: 0, expenses: 0, profit: 0 },
  );

  return (
    <div className="paper-grain min-h-screen bg-[#17140f] text-[#ece7e0]">
      <header className="sticky top-0 z-40 border-b border-[rgba(236,231,224,0.08)] bg-[rgba(23,20,15,0.9)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <span className="text-lg font-bold tracking-[0.3em]">HEIR</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#a3c98a]/40 bg-[#a3c98a]/10 px-3 py-0.5 text-xs text-[#a3c98a]">
            <ShieldCheck className="h-3 w-3" /> Superadmin
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-[#a79e91] sm:block">{userDisplayName(user)}</span>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión" className="text-[#a79e91] hover:text-[#ece7e0]">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-1 text-2xl font-bold">Administración del servidor</h1>
        <p className="mb-6 text-sm text-[#a79e91]">
          Vista consolidada de todas las sucursales Yggdra (aislamiento por X-Branch-ID).
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Ingresos consolidados (mes)', value: totals.revenue, color: '#d4694a' },
            { label: 'Gastos consolidados (mes)', value: totals.expenses, color: '#e0b04a' },
            { label: 'Utilidad consolidada (mes)', value: totals.profit, color: '#a3c98a' },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-5">
              <p className="text-xs uppercase tracking-wider text-[#a79e91]">{c.label}</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: c.color }}>{formatCLP(c.value)}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#d4694a]" /></div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[rgba(236,231,224,0.1)]">
            <table className="w-full text-sm">
              <thead className="bg-[#27211a] text-left text-xs uppercase tracking-wider text-[#a79e91]">
                <tr>
                  <th className="px-4 py-3">Sucursal</th>
                  <th className="px-4 py-3">Ubicación</th>
                  <th className="px-4 py-3 text-right">Ingresos mes</th>
                  <th className="px-4 py-3 text-right">Gastos mes</th>
                  <th className="px-4 py-3 text-right">Utilidad mes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(236,231,224,0.06)] bg-[#1f1a13]">
                {rows.map(({ branch: b, metrics, error: rowError }) => (
                  <tr key={branchIdOf(b)}>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <Building2 className="h-4 w-4 text-[#d4694a]" />
                        {b.name ?? `Sucursal ${branchIdOf(b)}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#a79e91]">
                      {[b.commune, b.region].filter(Boolean).join(', ') || '—'}
                    </td>
                    {rowError ? (
                      <td colSpan={3} className="px-4 py-3 text-right text-xs text-[#a79e91]">
                        Sin acceso financiero en esta sucursal
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-right">{formatCLP(parseAmount(metrics?.current_month_revenue ?? metrics?.total_revenue))}</td>
                        <td className="px-4 py-3 text-right">{formatCLP(parseAmount(metrics?.current_month_expenses ?? metrics?.total_expenses))}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCLP(parseAmount(metrics?.current_month_profit ?? metrics?.net_profit))}</td>
                      </>
                    )}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#a79e91]">
                      No hay sucursales visibles para este usuario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
