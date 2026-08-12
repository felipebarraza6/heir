import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROFESSIONAL, formatCLP } from '@/data/demo';

type Tab = 'citas' | 'pagos';

interface Appt {
  id: string;
  date: string;
  time: string;
  procedure: string;
  price: number;
  status: 'confirmada' | 'pendiente';
  paid: boolean;
}

const INITIAL_APPTS: Appt[] = [
  { id: 'a1', date: 'Miércoles 19 de agosto', time: '18:30', procedure: 'Rehabilitación deportiva', price: 38000, status: 'confirmada', paid: false },
  { id: 'a2', date: 'Miércoles 26 de agosto', time: '18:30', procedure: 'Rehabilitación deportiva', price: 38000, status: 'pendiente', paid: false },
  { id: 'a3', date: 'Miércoles 2 de septiembre', time: '18:30', procedure: 'Rehabilitación deportiva', price: 38000, status: 'pendiente', paid: false },
];

const HISTORY = [
  { id: 'h1', concept: 'Sesión Mié 12 ago', amount: 38000, method: 'Online', date: '12 ago' },
  { id: 'h2', concept: 'Sesión Mié 05 ago', amount: 38000, method: 'Online', date: '05 ago' },
  { id: 'h3', concept: 'Sesión Mié 29 jul', amount: 38000, method: 'Transferencia', date: '29 jul' },
];

export default function PatientApp({ onBack, onSwitchToPro }: { onBack: () => void; onSwitchToPro: () => void }) {
  const [tab, setTab] = useState<Tab>('citas');
  const [appts, setAppts] = useState(INITIAL_APPTS);
  const [paying, setPaying] = useState<Appt | null>(null);
  const [payStep, setPayStep] = useState<'form' | 'processing' | 'done'>('form');
  const [confirmed, setConfirmed] = useState(false);

  const next = appts[0];

  const startPay = (a: Appt) => {
    setPaying(a);
    setPayStep('form');
  };

  const doPay = () => {
    setPayStep('processing');
    setTimeout(() => {
      setPayStep('done');
      setAppts((prev) => prev.map((x) => (x.id === paying!.id ? { ...x, paid: true } : x)));
    }, 1600);
  };

  return (
    <div className="paper-grain min-h-screen bg-[#17140f]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(236,231,224,0.08)] bg-[rgba(23,20,15,0.85)] backdrop-blur-[14px]">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-5 py-3.5">
          <button onClick={onBack} className="flex items-center gap-2">
            <span className="font-display text-[14px] font-bold tracking-[0.2em] text-[#f4efe8]">HEIR</span>
          </button>
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold leading-tight">Consulta {PROFESSIONAL.name}</p>
            <p className="font-mono-y text-[9.5px] uppercase tracking-[0.12em] text-[#a79e91]">{PROFESSIONAL.specialty}</p>
          </div>
          <button
            onClick={onSwitchToPro}
            className="rounded-full border border-[rgba(236,231,224,0.16)] px-3 py-1.5 font-mono-y text-[9.5px] uppercase tracking-[0.1em] text-[#a79e91] transition-colors hover:border-[#ece7e0] hover:text-[#ece7e0]"
          >
            Vista profesional
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6">
        {/* Saludo */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-[24px] font-semibold tracking-tight">Hola, Ricardo</h1>
          <p className="mt-0.5 text-[13px] text-[#a79e91]">Tu hora semanal: miércoles a las 18:30</p>
        </motion.div>

        {/* Próxima cita */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative mt-5 overflow-hidden rounded-[16px] bg-[#2c2620] p-5 text-[#f4efe8]"
          style={{ background: 'radial-gradient(ellipse 90% 100% at 95% 0%, rgba(212,105,74,0.4), transparent), #2c2620' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono-y text-[10px] uppercase tracking-[0.14em] text-[#f4efe8]/55">Próxima sesión</span>
            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-y text-[9.5px] uppercase tracking-[0.1em] ${
              confirmed || next.status === 'confirmada' ? 'bg-[rgba(201,231,181,0.18)] text-[#c9e7b5]' : 'bg-[rgba(255,181,131,0.18)] text-[#ffb583]'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot" />
              {confirmed || next.status === 'confirmada' ? 'Confirmada' : 'Por confirmar'}
            </span>
          </div>
          <p className="mt-3 font-display text-[26px] font-semibold leading-tight">{next.date}</p>
          <p className="mt-1 text-[14px] text-[#f4efe8]/70">{next.time} hrs · {next.procedure}</p>
          <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#f4efe8]/55">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {PROFESSIONAL.location}
          </div>
          <div className="mt-4 flex gap-2">
            {!confirmed && next.status !== 'confirmada' ? (
              <button
                onClick={() => setConfirmed(true)}
                className="flex-1 rounded-xl bg-[#d4694a] py-3 text-[13px] font-semibold transition-colors hover:bg-[#f2a98d]"
              >
                Confirmar asistencia
              </button>
            ) : (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[rgba(201,231,181,0.14)] py-3 text-[13px] font-semibold text-[#c9e7b5]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Asistencia confirmada
              </div>
            )}
            <button className="rounded-xl border border-white/20 px-4 py-3 text-[13px] font-medium transition-colors hover:border-white/50">
              Reagendar
            </button>
          </div>
          {next.paid ? (
            <p className="mt-3 text-center font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#c9e7b5]">✓ Sesión pagada</p>
          ) : (
            <button onClick={() => startPay(next)} className="mt-3 w-full text-center font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#ffb583] underline underline-offset-4 hover:text-[#f4efe8]">
              Pagar ahora · {formatCLP(next.price)}
            </button>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="mt-6 flex rounded-xl border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-1">
          {(['citas', 'pagos'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 rounded-lg py-2.5 text-[13px] font-semibold capitalize transition-colors ${
                tab === t ? 'text-[#f4efe8]' : 'text-[#a79e91]'
              }`}
            >
              {tab === t && (
                <motion.span layoutId="patient-tab" className="absolute inset-0 rounded-lg bg-[#2c2620]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <span className="relative z-10">{t === 'citas' ? 'Mis citas' : 'Mis pagos'}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'citas' ? (
            <motion.div key="citas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 space-y-3">
              {appts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                  className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14.5px] font-semibold">{a.date}</p>
                      <p className="mt-0.5 text-[12.5px] text-[#a79e91]">{a.time} hrs · {a.procedure}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 font-mono-y text-[9.5px] uppercase tracking-[0.08em] ${
                      a.paid ? 'bg-[#22301a] text-[#a3c98a]' : 'bg-[#3a241a] text-[#f2a98d]'
                    }`}>
                      {a.paid ? 'Pagada' : formatCLP(a.price)}
                    </span>
                  </div>
                  {!a.paid && (
                    <button
                      onClick={() => startPay(a)}
                      className="mt-3 w-full rounded-lg border border-[rgba(212,105,74,0.35)] bg-[#3a241a] py-2.5 text-[12.5px] font-semibold text-[#f2a98d] transition-colors hover:bg-[#f0d8c8]"
                    >
                      Pagar online
                    </button>
                  )}
                </motion.div>
              ))}
              <p className="pt-1 text-center font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#8d8478]">
                Las próximas horas se reservan automáticamente cada semana
              </p>
            </motion.div>
          ) : (
            <motion.div key="pagos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-5">
                <div>
                  <p className="eyebrow text-[#a79e91] normal-case tracking-[0.08em]">Total pagado este año</p>
                  <p className="mt-1 font-display text-[26px] font-semibold">{formatCLP(494000)}</p>
                </div>
                <span className="font-mono-y text-[11px] text-[#a3c98a]">13 sesiones</span>
              </div>
              {HISTORY.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                  className="flex items-center gap-3 rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] px-5 py-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22301a]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.4">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-semibold">{h.concept}</p>
                    <p className="font-mono-y text-[10.5px] uppercase tracking-[0.08em] text-[#a79e91]">{h.date} · {h.method}</p>
                  </div>
                  <span className="font-mono-y text-[13px] font-semibold">{formatCLP(h.amount)}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal de pago */}
      <AnimatePresence>
        {paying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(8,6,4,0.62)] backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => payStep !== 'processing' && setPaying(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[20px] bg-[#231e16] p-6 shadow-warm sm:rounded-[20px]"
            >
              {payStep === 'done' ? (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22301a]"
                  >
                    <motion.svg
                      width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.6"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
                      />
                    </motion.svg>
                  </motion.div>
                  <p className="mt-4 font-display text-[22px] font-semibold">Pago exitoso</p>
                  <p className="mt-1 text-[13px] text-[#a79e91]">
                    {formatCLP(paying.price)} · {paying.procedure}
                  </p>
                  <p className="mt-1 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#8d8478]">
                    Comprobante enviado a tu correo
                  </p>
                  <button
                    onClick={() => setPaying(null)}
                    className="mt-6 w-full rounded-xl bg-[#2c2620] py-3.5 text-[13.5px] font-semibold text-[#f4efe8] transition-colors hover:bg-black"
                  >
                    Listo
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[20px] font-semibold">Pagar sesión</h3>
                    <span className="font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#a79e91]">HEIR Pay</span>
                  </div>
                  <div className="mt-4 rounded-xl bg-[#1f1a13] p-4">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#a79e91]">{paying.procedure}</span>
                      <span className="font-mono-y font-semibold">{formatCLP(paying.price)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[12px]">
                      <span className="text-[#a79e91]">{paying.date} · {paying.time}</span>
                      <span className="font-mono-y text-[10px] uppercase text-[#a79e91]">Sin cargos extra</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-[rgba(236,231,224,0.16)] px-4 py-3 focus-within:border-[#d4694a]">
                      <p className="font-mono-y text-[9px] uppercase tracking-[0.12em] text-[#a79e91]">Número de tarjeta</p>
                      <p className="mt-0.5 font-mono-y text-[14px] tracking-[0.1em]">4242 •••• •••• 4242</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[rgba(236,231,224,0.16)] px-4 py-3">
                        <p className="font-mono-y text-[9px] uppercase tracking-[0.12em] text-[#a79e91]">Vencimiento</p>
                        <p className="mt-0.5 font-mono-y text-[14px]">12 / 28</p>
                      </div>
                      <div className="rounded-lg border border-[rgba(236,231,224,0.16)] px-4 py-3">
                        <p className="font-mono-y text-[9px] uppercase tracking-[0.12em] text-[#a79e91]">CVV</p>
                        <p className="mt-0.5 font-mono-y text-[14px]">•••</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={doPay}
                    disabled={payStep === 'processing'}
                    className="relative mt-5 w-full overflow-hidden rounded-xl bg-[#d4694a] py-3.5 text-[14px] font-semibold text-[#f4efe8] transition-colors hover:bg-[#f2a98d] disabled:opacity-90"
                  >
                    {payStep === 'processing' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#231e16]" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#231e16]" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#231e16]" />
                        <span className="ml-1">Procesando…</span>
                      </span>
                    ) : (
                      `Pagar ${formatCLP(paying.price)}`
                    )}
                    {payStep === 'processing' && <span className="shimmer-chip absolute inset-0" />}
                  </button>
                  <p className="mt-3 text-center font-mono-y text-[9.5px] uppercase tracking-[0.1em] text-[#8d8478]">
                    Pago seguro · simulación sin cargo real
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
