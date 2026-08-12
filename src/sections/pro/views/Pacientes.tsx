import { motion } from 'framer-motion';
import { PATIENTS, procedureOf, formatCLP } from '@/data/demo';
import { Avatar, PayBadge } from '../ui';

export default function Pacientes() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-semibold tracking-tight">Pacientes</h1>
          <p className="mt-1 text-[13.5px] text-[#a79e91]">{PATIENTS.length} pacientes activos con horario semanal fijo</p>
        </div>
        <button className="rounded-xl bg-[#2c2620] px-5 py-2.5 text-[13px] font-semibold text-[#f4efe8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-black">
          + Nuevo paciente
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {PATIENTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[rgba(236,231,224,0.22)] hover:shadow-warm-sm"
          >
            <div className="flex items-start gap-3.5">
              <Avatar p={p} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[14.5px] font-semibold">{p.name}</p>
                  <PayBadge s={p.payStatus} />
                </div>
                <p className="mt-0.5 text-[12.5px] text-[#a79e91]">{procedureOf(p.procedureId).name}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <span className="flex items-center gap-1.5 font-mono-y text-[10.5px] uppercase tracking-[0.06em] text-[#ece7e0]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d4694a" strokeWidth="2.2">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    </svg>
                    {p.weeklySlot}
                  </span>
                  <span className="font-mono-y text-[10.5px] uppercase tracking-[0.06em] text-[#a79e91]">{p.sessions} sesiones</span>
                  <span className="font-mono-y text-[10.5px] uppercase tracking-[0.06em] text-[#a79e91]">desde {p.since}</span>
                  <span className="font-mono-y text-[10.5px] font-semibold text-[#a3c98a]">{formatCLP(procedureOf(p.procedureId).price)}/sesión</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-[rgba(236,231,224,0.07)] pt-3.5">
              {p.bookedBy === 'agente' && (
                <span className="rounded-full bg-[#3a241a] px-2.5 py-1 font-mono-y text-[9.5px] uppercase tracking-[0.08em] text-[#f2a98d]">
                  ✦ Agendada por el agente
                </span>
              )}
              <div className="ml-auto flex gap-2">
                <button className="rounded-lg border border-[rgba(236,231,224,0.16)] px-3 py-1.5 text-[11.5px] font-medium transition-colors hover:border-[#ece7e0]">
                  Ver ficha
                </button>
                <button className="rounded-lg border border-[rgba(236,231,224,0.16)] px-3 py-1.5 text-[11.5px] font-medium transition-colors hover:border-[#ece7e0]">
                  Recordar cita
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
