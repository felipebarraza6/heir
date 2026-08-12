import { motion } from 'framer-motion';
import { PATIENTS, AGENT_ACTIVITY, MONTHLY_INCOME, formatCLP, procedureOf } from '@/data/demo';
import { Avatar, PayBadge, StatusDot } from '../ui';

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
});

const actIcon: Record<string, { bg: string; icon: React.ReactNode }> = {
  booking: {
    bg: 'bg-[#3a241a]',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f2a98d" strokeWidth="2.2">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      </svg>
    ),
  },
  question: {
    bg: 'bg-[#27211a]',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a79e91" strokeWidth="2.2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  reminder: {
    bg: 'bg-[#22301a]',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.2">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  payment: {
    bg: 'bg-[#22301a]',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.2">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export default function Panel({ branchName = 'Todas las sucursales' }: { branchName?: string }) {
  const today = PATIENTS.filter((p) => p.day === 2); // Miércoles 12
  const max = Math.max(...MONTHLY_INCOME.map((m) => m.amount));
  const pending = PATIENTS.filter((p) => p.payStatus !== 'pagado');

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[26px] font-semibold tracking-tight">Hola, Felipe</h1>
          <span className="flex items-center gap-1.5 rounded-full border border-[rgba(212,105,74,0.35)] bg-[#3a241a] px-3 py-1.5 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#f2a98d]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {branchName}
          </span>
        </div>
        <p className="mt-1 text-[13.5px] text-[#a79e91]">Miércoles 12 de agosto · Tienes {today.length} sesiones hoy</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Ingresos de agosto', value: formatCLP(745000), sub: '▲ 12% vs. julio', subCls: 'text-[#a3c98a]' },
          { label: 'Citas esta semana', value: String(PATIENTS.length), sub: '7 confirmadas', subCls: 'text-[#a79e91]' },
          { label: 'Por cobrar', value: formatCLP(120000), sub: `${pending.length} pacientes`, subCls: 'text-[#f2a98d]' },
          { label: 'Agendadas por el agente', value: '5', sub: 'esta semana', subCls: 'text-[#a79e91]' },
        ].map((k, i) => (
          <motion.div key={k.label} {...fadeUp(i + 1)} className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-5">
            <p className="eyebrow text-[#a79e91] normal-case tracking-[0.08em]">{k.label}</p>
            <p className="mt-2 font-display text-[26px] font-semibold tracking-tight">{k.value}</p>
            <p className={`mt-1 font-mono-y text-[10.5px] ${k.subCls}`}>{k.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Hoy */}
        <motion.div {...fadeUp(4)} className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16]">
          <div className="flex items-center justify-between border-b border-[rgba(236,231,224,0.08)] px-5 py-4">
            <h2 className="font-display text-[17px] font-semibold">Sesiones de hoy</h2>
            <span className="font-mono-y text-[10.5px] uppercase tracking-[0.1em] text-[#a79e91]">Mié 12 ago</span>
          </div>
          <div className="divide-y divide-[rgba(236,231,224,0.06)]">
            {today.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar p={p} />
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold">{p.name}</p>
                  <p className="text-[12px] text-[#a79e91]">{procedureOf(p.procedureId).name} · {formatCLP(procedureOf(p.procedureId).price)}</p>
                </div>
                <span className="font-mono-y text-[12px] font-semibold">{p.time}</span>
                <div className="flex items-center gap-1.5">
                  <StatusDot s={p.status} />
                  <span className="text-[11.5px] text-[#a79e91] capitalize">{p.status}</span>
                </div>
                <PayBadge s={p.payStatus} />
              </div>
            ))}
          </div>
          {/* Ingresos mini chart */}
          <div className="border-t border-[rgba(236,231,224,0.08)] px-5 py-4">
            <p className="eyebrow text-[#a79e91] normal-case tracking-[0.08em]">Ingresos últimos 6 meses</p>
            <div className="mt-3 flex items-end gap-2.5">
              {MONTHLY_INCOME.map((m, i) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: Math.round((m.amount / max) * 72) }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-full rounded-t-md ${i === MONTHLY_INCOME.length - 1 ? 'bg-[#d4694a]' : 'bg-[#383026]'}`}
                    title={formatCLP(m.amount)}
                  />
                  <span className="font-mono-y text-[9.5px] uppercase text-[#a79e91]">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Actividad del agente */}
        <motion.div {...fadeUp(5)} className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16]">
          <div className="flex items-center gap-2 border-b border-[rgba(236,231,224,0.08)] px-5 py-4">
            <span className="h-2 w-2 rounded-full bg-[#7fae68] pulse-dot" />
            <h2 className="font-display text-[17px] font-semibold">El agente trabajó por ti</h2>
          </div>
          <div className="divide-y divide-[rgba(236,231,224,0.06)]">
            {AGENT_ACTIVITY.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 px-5 py-3.5"
              >
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${actIcon[a.type].bg}`}>
                  {actIcon[a.type].icon}
                </span>
                <div>
                  <p className="text-[13px] leading-snug">
                    <span className="font-semibold">El agente</span> {a.text}
                  </p>
                  <p className="mt-0.5 font-mono-y text-[10px] uppercase tracking-[0.08em] text-[#8d8478]">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
