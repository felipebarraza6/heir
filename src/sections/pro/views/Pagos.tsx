import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PATIENTS,
  TRANSACTIONS,
  MONTHLY_INCOME,
  formatCLP,
  type Transaction,
  type PayMethod,
} from '@/data/demo';
import { Avatar } from '../ui';

const methodMeta: Record<PayMethod, { label: string; cls: string }> = {
  online: { label: 'Online', cls: 'bg-[#2c2620] text-[#f4efe8]' },
  transferencia: { label: 'Transferencia', cls: 'bg-[#3a241a] text-[#f2a98d]' },
  efectivo: { label: 'Efectivo', cls: 'bg-[#22301a] text-[#a3c98a]' },
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Pagos() {
  const [txs, setTxs] = useState<Transaction[]>(TRANSACTIONS);
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState(PATIENTS[0].id);
  const [method, setMethod] = useState<PayMethod>('transferencia');
  const [amount, setAmount] = useState('35000');
  const [saved, setSaved] = useState(false);

  const completados = txs.filter((t) => t.status === 'completado');
  const pendientes = txs.filter((t) => t.status === 'pendiente');
  const balance = completados.reduce((a, t) => a + t.amount, 0) + 585000; // base histórica simulada
  const porCobrar = pendientes.reduce((a, t) => a + t.amount, 0) + 35000;
  const max = Math.max(...MONTHLY_INCOME.map((m) => m.amount));

  const register = () => {
    const p = PATIENTS.find((x) => x.id === patientId)!;
    const t: Transaction = {
      id: 't' + Date.now(),
      patientId: p.id,
      amount: Math.max(0, parseInt(amount.replace(/\D/g, '') || '0', 10)),
      method,
      date: 'Hoy · ahora',
      concept: 'Registro manual',
      status: 'completado',
    };
    setTxs((prev) => [t, ...prev]);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1400);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-semibold tracking-tight">Billetera y pagos</h1>
          <p className="mt-1 text-[13.5px] text-[#a79e91]">Pagos online automáticos y registro manual de transferencias o efectivo</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-[#d4694a] px-5 py-2.5 text-[13px] font-semibold text-[#f4efe8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#f2a98d]"
        >
          + Registrar pago
        </button>
      </div>

      {/* Balance */}
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <motion.div
          {...fadeUp(0)}
          className="relative overflow-hidden rounded-[14px] bg-[#2c2620] p-6 text-[#f4efe8]"
          style={{ background: 'radial-gradient(ellipse 80% 90% at 90% 0%, rgba(212,105,74,0.35), transparent), #2c2620' }}
        >
          <p className="eyebrow text-[#f4efe8]/50">Balance disponible</p>
          <p className="mt-2 font-display text-[38px] font-semibold tracking-tight">{formatCLP(balance)}</p>
          <div className="mt-4 space-y-2 text-[12.5px]">
            <div className="flex justify-between text-[#f4efe8]/70">
              <span>Por cobrar</span>
              <span className="font-mono-y font-semibold text-[#ffb583]">{formatCLP(porCobrar)}</span>
            </div>
            <div className="flex justify-between text-[#f4efe8]/70">
              <span>Pagos online (automáticos)</span>
              <span className="font-mono-y">{completados.filter((t) => t.method === 'online').length}</span>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button className="flex-1 rounded-lg bg-white/10 py-2.5 text-[12px] font-semibold backdrop-blur transition-colors hover:bg-white/20">
              Transferir a mi banco
            </button>
            <button className="flex-1 rounded-lg bg-white/10 py-2.5 text-[12px] font-semibold backdrop-blur transition-colors hover:bg-white/20">
              Descargar informe
            </button>
          </div>
        </motion.div>

        {/* Chart mensual */}
        <motion.div {...fadeUp(1)} className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-[#a79e91] normal-case tracking-[0.08em]">Ingresos por mes</p>
            <span className="font-mono-y text-[10.5px] text-[#a3c98a]">▲ Agosto en curso</span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            {MONTHLY_INCOME.map((m, i) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                <span className="font-mono-y text-[10px] font-semibold text-[#ece7e0] opacity-0 transition-opacity group-hover:opacity-100">
                  {(m.amount / 1000).toFixed(0)}k
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: Math.round((m.amount / max) * 120) }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full rounded-t-lg transition-colors ${
                    i === MONTHLY_INCOME.length - 1 ? 'bg-[#d4694a]' : 'bg-[#383026] group-hover:bg-[#4a4033]'
                  }`}
                />
                <span className="font-mono-y text-[10px] uppercase text-[#a79e91]">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Movimientos */}
      <motion.div {...fadeUp(2)} className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16]">
        <div className="flex items-center justify-between border-b border-[rgba(236,231,224,0.08)] px-5 py-4">
          <h2 className="font-display text-[17px] font-semibold">Movimientos</h2>
          <span className="font-mono-y text-[10.5px] uppercase tracking-[0.1em] text-[#a79e91]">{txs.length} registros</span>
        </div>
        <div className="divide-y divide-[rgba(236,231,224,0.06)]">
          <AnimatePresence initial={false}>
            {txs.map((t) => {
              const p = PATIENTS.find((x) => x.id === t.patientId)!;
              const mm = methodMeta[t.method];
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                >
                  <Avatar p={p} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{p.name}</p>
                    <p className="text-[12px] text-[#a79e91]">{t.concept}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-mono-y text-[10px] uppercase tracking-[0.08em] ${mm.cls}`}>
                    {mm.label}
                  </span>
                  <span className="w-24 text-right font-mono-y text-[12px] text-[#a79e91]">{t.date}</span>
                  <span
                    className={`w-24 text-right font-mono-y text-[13.5px] font-semibold ${
                      t.status === 'pendiente' ? 'text-[#f2a98d]' : 'text-[#a3c98a]'
                    }`}
                  >
                    {t.status === 'pendiente' ? 'Pendiente' : '+' + formatCLP(t.amount)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal registrar pago */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,6,4,0.62)] p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[16px] bg-[#231e16] p-6 shadow-warm"
            >
              {saved ? (
                <div className="py-8 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#22301a]"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.6">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <p className="mt-4 font-display text-[19px] font-semibold">Pago registrado</p>
                  <p className="mt-1 text-[13px] text-[#a79e91]">Se sumó a tu billetera y quedó en el historial del paciente.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-[20px] font-semibold">Registrar pago manual</h3>
                  <p className="mt-1 text-[13px] text-[#a79e91]">Para pagos por transferencia o en efectivo.</p>

                  <label className="mt-5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#a79e91]">Paciente</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[rgba(236,231,224,0.18)] bg-[#17140f] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#d4694a]"
                  >
                    {PATIENTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.weeklySlot}</option>
                    ))}
                  </select>

                  <label className="mt-4 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#a79e91]">Monto (CLP)</label>
                  <div className="mt-1.5 flex items-center rounded-lg border border-[rgba(236,231,224,0.18)] bg-[#17140f] px-3.5 focus-within:border-[#d4694a]">
                    <span className="font-mono-y text-[14px] text-[#a79e91]">$</span>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputMode="numeric"
                      className="w-full bg-transparent py-2.5 pl-1 font-mono-y text-[14px] outline-none"
                    />
                  </div>

                  <label className="mt-4 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#a79e91]">Método</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(['transferencia', 'efectivo'] as PayMethod[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`rounded-lg border py-2.5 text-[12.5px] font-semibold capitalize transition-all ${
                          method === m
                            ? 'border-[#d4694a] bg-[#3a241a] text-[#f2a98d]'
                            : 'border-[rgba(236,231,224,0.18)] hover:border-[#ece7e0]'
                        }`}
                      >
                        {methodMeta[m].label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-[rgba(236,231,224,0.18)] py-3 text-[13px] font-medium transition-colors hover:border-[#ece7e0]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={register}
                      className="flex-1 rounded-lg bg-[#d4694a] py-3 text-[13px] font-semibold text-[#f4efe8] transition-colors hover:bg-[#f2a98d]"
                    >
                      Guardar pago
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
