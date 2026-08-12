import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PATIENTS, WEEK_DAYS, formatCLP, procedureOf, type Patient } from '@/data/demo';
import { Avatar, PayBadge, StatusDot, blockTone } from '../ui';

const ROW_H = 52; // px por hora
const START_H = 8; // 08:00

function timeToTop(t: string) {
  const [h, m] = t.split(':').map(Number);
  return (h - START_H) * ROW_H + (m / 60) * ROW_H;
}

export default function Agenda() {
  const [selected, setSelected] = useState<Patient | null>(null);
  const hours = Array.from({ length: 13 }, (_, i) => START_H + i);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-semibold tracking-tight">Agenda online</h1>
          <p className="mt-1 text-[13.5px] text-[#a79e91]">Semana del 10 al 14 de agosto · horarios semanales fijos</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-[rgba(236,231,224,0.18)] px-3.5 py-2 text-[12.5px] font-medium transition-colors hover:border-[#ece7e0]">
            ← Semana anterior
          </button>
          <button className="rounded-lg border border-[rgba(236,231,224,0.18)] px-3.5 py-2 text-[12.5px] font-medium transition-colors hover:border-[#ece7e0]">
            Semana siguiente →
          </button>
          <button className="rounded-lg bg-[#d4694a] px-3.5 py-2 text-[12.5px] font-semibold text-[#f4efe8] transition-colors hover:bg-[#f2a98d]">
            + Bloquear horario
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        {/* Grilla semanal */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="nice-scroll overflow-x-auto rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16]"
        >
          <div className="min-w-[720px]">
            {/* Cabecera días */}
            <div className="grid grid-cols-[56px_repeat(5,1fr)] border-b border-[rgba(236,231,224,0.1)]">
              <div />
              {WEEK_DAYS.map((d, i) => (
                <div key={d} className={`border-l border-[rgba(236,231,224,0.08)] px-3 py-3 text-center ${i === 2 ? 'bg-[#17140f]' : ''}`}>
                  <p className="font-mono-y text-[11px] font-semibold uppercase tracking-[0.1em]">{d}</p>
                  {i === 2 && <p className="font-mono-y text-[9px] uppercase tracking-[0.1em] text-[#d4694a]">Hoy</p>}
                </div>
              ))}
            </div>
            {/* Cuerpo */}
            <div className="grid grid-cols-[56px_repeat(5,1fr)]">
              {/* Horas */}
              <div className="relative">
                {hours.map((h) => (
                  <div key={h} className="pr-2 text-right" style={{ height: ROW_H }}>
                    <span className="relative -top-2 font-mono-y text-[10px] text-[#8d8478]">
                      {String(h).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>
              {/* Columnas por día */}
              {WEEK_DAYS.map((d, dayIdx) => (
                <div key={d} className={`relative border-l border-[rgba(236,231,224,0.08)] ${dayIdx === 2 ? 'bg-[#17140f]' : ''}`}>
                  {hours.map((h) => (
                    <div key={h} className="border-b border-dashed border-[rgba(236,231,224,0.07)]" style={{ height: ROW_H }} />
                  ))}
                  {PATIENTS.filter((p) => p.day === dayIdx).map((p) => (
                    <motion.button
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + p.day * 0.06, duration: 0.35 }}
                      onClick={() => setSelected(p)}
                      className={`absolute inset-x-1.5 rounded-lg border p-2 text-left transition-colors duration-150 ${blockTone[p.color]} ${
                        selected?.id === p.id ? 'ring-2 ring-[#2c2620] ring-offset-1' : ''
                      }`}
                      style={{ top: timeToTop(p.time) + 2, height: ROW_H - 6 }}
                    >
                      <div className="flex items-center gap-1.5">
                        <StatusDot s={p.status} />
                        <p className="truncate text-[11px] font-semibold leading-tight">{p.name}</p>
                      </div>
                      <p className="mt-0.5 truncate font-mono-y text-[9.5px] text-[#a79e91]">
                        {p.time} · {procedureOf(p.procedureId).name.replace('Sesión de ', '')}
                      </p>
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detalle de cita */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-fit rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-5"
            >
              <div className="flex items-center gap-3">
                <Avatar p={selected} />
                <div>
                  <p className="text-[14.5px] font-semibold">{selected.name}</p>
                  <p className="font-mono-y text-[10.5px] uppercase tracking-[0.08em] text-[#a79e91]">
                    Hora semanal · {selected.weeklySlot}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 border-t border-[rgba(236,231,224,0.08)] pt-4 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#a79e91]">Procedimiento</span>
                  <span className="font-medium">{procedureOf(selected.procedureId).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a79e91]">Valor</span>
                  <span className="font-mono-y font-semibold text-[#d4694a]">{formatCLP(procedureOf(selected.procedureId).price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a79e91]">Estado</span>
                  <span className="flex items-center gap-1.5 capitalize">
                    <StatusDot s={selected.status} /> {selected.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#a79e91]">Pago</span>
                  <PayBadge s={selected.payStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a79e91]">Agendada por</span>
                  <span className={selected.bookedBy === 'agente' ? 'font-medium text-[#f2a98d]' : 'font-medium'}>
                    {selected.bookedBy === 'agente' ? '✦ Agente HEIR' : 'Felipe'}
                  </span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="rounded-lg bg-[#2c2620] py-2.5 text-[12px] font-semibold text-[#f4efe8] transition-colors hover:bg-black">
                  {selected.payStatus === 'pagado' ? 'Ver comprobante' : 'Registrar pago'}
                </button>
                <button className="rounded-lg border border-[rgba(236,231,224,0.18)] py-2.5 text-[12px] font-medium transition-colors hover:border-[#ece7e0]">
                  Reagendar
                </button>
              </div>
              <button className="mt-2 w-full rounded-lg border border-[rgba(212,105,74,0.3)] bg-[#3a241a] py-2.5 text-[12px] font-semibold text-[#f2a98d] transition-colors hover:bg-[#f0d8c8]">
                Enviar recordatorio ahora
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden h-fit rounded-[14px] border border-dashed border-[rgba(236,231,224,0.2)] bg-[#1f1a13] p-6 text-center xl:block"
            >
              <p className="font-display text-[16px] font-semibold">Selecciona una cita</p>
              <p className="mt-1 text-[12.5px] text-[#a79e91]">
                Haz clic en un bloque de la agenda para ver el detalle, registrar el pago o enviar un recordatorio.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
