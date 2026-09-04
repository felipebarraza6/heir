import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  LayoutDashboard, Wallet, TrendingDown, LogOut, Loader2, CalendarDays, Users, Plus, Check, X,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useSession } from '@/lib/session';
import { userDisplayName, branchIdOf } from '@/lib/api/types';
import {
  fetchFinancialSummary, fetchRevenues, fetchRevenueSummary, fetchExpenses,
  fetchRevenuesByDateRange, createRevenue, markRevenueAsReceived, cancelRevenue,
  createExpense, getCurrentMonthRange, parseAmount, revenueAmount, revenueStatus,
  type Revenue, type Expense, type FinancialMetricsSummary, type RevenueSummary,
} from '@/lib/api/finance';
import { formatCLP } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

type Tab = 'resumen' | 'ingresos' | 'gastos';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  received: 'Recibido',
  cancelled: 'Anulado',
  refunded: 'Reembolsado',
};

export default function Dashboard() {
  const { user, branches, currentBranchId, selectBranch, logout } = useSession();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('resumen');

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="paper-grain min-h-screen bg-[#17140f] text-[#ece7e0]">
      <header className="sticky top-0 z-40 border-b border-[rgba(236,231,224,0.08)] bg-[rgba(23,20,15,0.9)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <span className="text-lg font-bold tracking-[0.3em] text-[#ece7e0]">HEIR</span>
          <span className="rounded-full border border-[#d4694a]/40 bg-[#d4694a]/10 px-3 py-0.5 text-xs text-[#d4694a]">
            Panel profesional
          </span>
          <div className="ml-auto flex items-center gap-3">
            {branches.length > 1 && (
              <Select value={currentBranchId ?? undefined} onValueChange={selectBranch}>
                <SelectTrigger className="w-44 border-[rgba(236,231,224,0.15)] bg-[#1f1a13] text-xs">
                  <SelectValue placeholder="Sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={branchIdOf(b)} value={branchIdOf(b)}>
                      {b.name ?? `Sucursal ${branchIdOf(b)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <span className="hidden text-sm text-[#a79e91] sm:block">{userDisplayName(user)}</span>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión" className="text-[#a79e91] hover:text-[#ece7e0]">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="mb-6 border border-[rgba(236,231,224,0.1)] bg-[#1f1a13]">
            <TabsTrigger value="resumen"><LayoutDashboard className="mr-2 h-4 w-4" />Resumen</TabsTrigger>
            <TabsTrigger value="ingresos"><Wallet className="mr-2 h-4 w-4" />Ingresos</TabsTrigger>
            <TabsTrigger value="gastos"><TrendingDown className="mr-2 h-4 w-4" />Gastos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen"><SummaryTab /></TabsContent>
          <TabsContent value="ingresos"><RevenuesTab /></TabsContent>
          <TabsContent value="gastos"><ExpensesTab /></TabsContent>
        </Tabs>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            to="/demo/pro"
            className="flex items-center gap-3 rounded-xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-4 transition-colors hover:border-[#d4694a]/50"
          >
            <CalendarDays className="h-5 w-5 text-[#d4694a]" />
            <div>
              <p className="text-sm font-medium">Agenda semanal</p>
              <p className="text-xs text-[#a79e91]">Vista demo — se cablea al módulo scheduling de Yggdra</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 rounded-xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-4 opacity-70">
            <Users className="h-5 w-5 text-[#a3c98a]" />
            <div>
              <p className="text-sm font-medium">Pacientes</p>
              <p className="text-xs text-[#a79e91]">Próximo: módulo customers/CRM de Yggdra</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------ Resumen ------------------------------ */

function SummaryTab() {
  const [metrics, setMetrics] = useState<FinancialMetricsSummary | null>(null);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [chart, setChart] = useState<{ date: string; total: number }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { start, end } = getCurrentMonthRange();
    Promise.allSettled([
      fetchFinancialSummary(),
      fetchRevenueSummary({ startDate: start, endDate: end }),
      fetchRevenuesByDateRange(start, end),
    ]).then(([m, s, c]) => {
      if (cancelled) return;
      if (m.status === 'fulfilled') setMetrics(m.value);
      if (s.status === 'fulfilled') setSummary(s.value);
      if (c.status === 'fulfilled') {
        setChart(
          c.value.map((d) => ({ date: String(d.date ?? '').slice(5), total: parseAmount(d.total) })),
        );
      }
      if (m.status === 'rejected' && s.status === 'rejected') {
        setError('No se pudieron cargar las métricas. ¿Está activa la API y la sucursal correcta?');
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <CenteredLoader />;

  const cards = [
    { label: 'Ingresos del mes', value: parseAmount(metrics?.current_month_revenue ?? metrics?.total_revenue), accent: '#d4694a' },
    { label: 'Gastos del mes', value: parseAmount(metrics?.current_month_expenses ?? metrics?.total_expenses), accent: '#e0b04a' },
    { label: 'Utilidad neta', value: parseAmount(metrics?.current_month_profit ?? metrics?.net_profit), accent: '#a3c98a' },
    { label: 'Por cobrar', value: parseAmount(summary?.pending_amount ?? summary?.pending), accent: '#a79e91' },
  ];

  return (
    <div className="space-y-6">
      {error && <ErrorBox message={error} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-5">
            <p className="text-xs uppercase tracking-wider text-[#a79e91]">{c.label}</p>
            <p className="mt-2 text-2xl font-bold" style={{ color: c.accent }}>
              {formatCLP(c.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-5">
        <p className="mb-4 text-sm font-medium">Ingresos por día (mes actual)</p>
        {chart.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#a79e91]">Sin datos de ingresos este mes.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="terra" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4694a" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#d4694a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(236,231,224,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#a79e91', fontSize: 11 }} />
                <YAxis tick={{ fill: '#a79e91', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#27211a', border: '1px solid rgba(236,231,224,0.15)', borderRadius: 8 }}
                  formatter={(v) => [formatCLP(Number(v)), 'Ingresos']}
                />
                <Area type="monotone" dataKey="total" stroke="#d4694a" fill="url(#terra)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Ingresos ------------------------------ */

function RevenuesTab() {
  const [rows, setRows] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  async function load(status?: string) {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRevenues({ status: status && status !== 'all' ? status : undefined, page_size: 50 });
      setRows(data.results ?? []);
    } catch {
      setError('No se pudieron cargar los ingresos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter]);

  async function onMarkReceived(id: string) {
    await markRevenueAsReceived(id);
    load(statusFilter);
  }

  async function onCancel(id: string) {
    await cancelRevenue(id);
    load(statusFilter);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 border-[rgba(236,231,224,0.15)] bg-[#1f1a13] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="received">Recibidos</SelectItem>
            <SelectItem value="cancelled">Anulados</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowCreate(true)} className="ml-auto bg-[#d4694a] text-white hover:bg-[#e07a5a]">
          <Plus className="mr-1 h-4 w-4" /> Registrar pago
        </Button>
      </div>

      {error && <ErrorBox message={error} />}
      {loading ? (
        <CenteredLoader />
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#a79e91]">No hay ingresos con este filtro.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[rgba(236,231,224,0.1)]">
          <table className="w-full text-sm">
            <thead className="bg-[#27211a] text-left text-xs uppercase tracking-wider text-[#a79e91]">
              <tr>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(236,231,224,0.06)] bg-[#1f1a13]">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.description || r.category_name || 'Ingreso'}</td>
                  <td className="px-4 py-3 text-[#a79e91]">{String(r.date ?? r.created ?? '').slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={revenueStatus(r)} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCLP(revenueAmount(r))}</td>
                  <td className="px-4 py-3 text-right">
                    {revenueStatus(r) === 'pending' && (
                      <span className="inline-flex gap-1">
                        <Button size="icon" variant="ghost" title="Marcar recibido" onClick={() => onMarkReceived(r.id)} className="h-7 w-7 text-[#a3c98a]">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Anular" onClick={() => onCancel(r.id)} className="h-7 w-7 text-red-400">
                          <X className="h-4 w-4" />
                        </Button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateMovementDialog
        kind="revenue"
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => load(statusFilter)}
      />
    </div>
  );
}

/* ------------------------------- Gastos ------------------------------- */

function ExpensesTab() {
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchExpenses({ page_size: 50 });
      setRows(data.results ?? []);
    } catch {
      setError('No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex">
        <Button size="sm" onClick={() => setShowCreate(true)} className="ml-auto bg-[#d4694a] text-white hover:bg-[#e07a5a]">
          <Plus className="mr-1 h-4 w-4" /> Registrar gasto
        </Button>
      </div>

      {error && <ErrorBox message={error} />}
      {loading ? (
        <CenteredLoader />
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#a79e91]">Sin gastos registrados.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[rgba(236,231,224,0.1)]">
          <table className="w-full text-sm">
            <thead className="bg-[#27211a] text-left text-xs uppercase tracking-wider text-[#a79e91]">
              <tr>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(236,231,224,0.06)] bg-[#1f1a13]">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.description || r.category_name || 'Gasto'}</td>
                  <td className="px-4 py-3 text-[#a79e91]">{String(r.date ?? r.created ?? '').slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCLP(revenueAmount(r))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateMovementDialog
        kind="expense"
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={load}
      />
    </div>
  );
}

/* ------------------------------ Compartidos ------------------------------ */

function CreateMovementDialog({
  kind, open, onClose, onCreated,
}: {
  kind: 'revenue' | 'expense';
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function onSave() {
    setError('');
    const value = parseInt(amount.replace(/\D/g, ''), 10);
    if (!description.trim() || !value) {
      setError('Completa descripción y monto.');
      return;
    }
    setSaving(true);
    try {
      const payload = { description: description.trim(), amount: value };
      if (kind === 'revenue') await createRevenue(payload);
      else await createExpense(payload);
      setDescription('');
      setAmount('');
      onClose();
      onCreated();
    } catch {
      setError('No se pudo guardar. Revisa los campos requeridos por el backend.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[rgba(236,231,224,0.15)] bg-[#1f1a13] text-[#ece7e0]">
        <DialogHeader>
          <DialogTitle>{kind === 'revenue' ? 'Registrar pago recibido' : 'Registrar gasto'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Descripción (ej: Sesión kinesiología — Ricardo F.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-[rgba(236,231,224,0.15)] bg-[#17140f]"
          />
          <Input
            placeholder="Monto CLP (ej: 38000)"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-[rgba(236,231,224,0.15)] bg-[#17140f]"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={onSave} disabled={saving} className="bg-[#d4694a] text-white hover:bg-[#e07a5a]">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'border-[#e0b04a]/40 bg-[#e0b04a]/10 text-[#e0b04a]',
    received: 'border-[#a3c98a]/40 bg-[#a3c98a]/10 text-[#a3c98a]',
    cancelled: 'border-red-400/40 bg-red-400/10 text-red-400',
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${styles[status] ?? 'border-[rgba(236,231,224,0.2)] text-[#a79e91]'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function CenteredLoader() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-[#d4694a]" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  );
}
