import type { Patient, PayStatus, ApptStatus } from '@/data/demo';

export function Avatar({ p, size = 'md' }: { p: Patient; size?: 'sm' | 'md' }) {
  const bg =
    p.color === 'terra' ? 'bg-[#3a241a] text-[#f2a98d]' : p.color === 'sage' ? 'bg-[#22301a] text-[#a3c98a]' : 'bg-[#27211a] text-[#a79e91]';
  const sz = size === 'sm' ? 'h-8 w-8 text-[10.5px]' : 'h-10 w-10 text-[12px]';
  return <div className={`flex items-center justify-center rounded-full font-semibold ${bg} ${sz}`}>{p.initials}</div>;
}

export function PayBadge({ s }: { s: PayStatus }) {
  const map = {
    pagado: ['bg-[#22301a] text-[#a3c98a]', 'Pagado'],
    pendiente: ['bg-[#3a241a] text-[#f2a98d]', 'Pendiente'],
    por_cobrar: ['bg-[#27211a] text-[#a79e91]', 'Por cobrar'],
  } as const;
  const [cls, label] = map[s];
  return <span className={`rounded-full px-2.5 py-1 font-mono-y text-[10px] uppercase tracking-[0.08em] ${cls}`}>{label}</span>;
}

export function StatusDot({ s }: { s: ApptStatus }) {
  const map = { confirmada: 'bg-[#a3c98a]', pendiente: 'bg-[#d4694a]', completada: 'bg-[#8d8478]' } as const;
  return <span className={`inline-block h-2 w-2 rounded-full ${map[s]}`} />;
}

export const blockTone: Record<string, string> = {
  terra: 'bg-[#3a241a] border-[rgba(212,105,74,0.35)] hover:border-[#d4694a]',
  sage: 'bg-[#22301a] border-[rgba(163,201,138,0.3)] hover:border-[#a3c98a]',
  sand: 'bg-[#27211a] border-[rgba(236,231,224,0.18)] hover:border-[#a79e91]',
};
