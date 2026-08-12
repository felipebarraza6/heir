import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROFESSIONAL } from '@/data/demo';
import Panel from './views/Panel';
import Agenda from './views/Agenda';
import Pacientes from './views/Pacientes';
import Pagos from './views/Pagos';
import Recordatorios from './views/Recordatorios';

type ProView = 'panel' | 'agenda' | 'pacientes' | 'pagos' | 'recordatorios';

const BRANCHES = ['Todas las sucursales', 'Providencia · Av. Ricardo Lyon', 'Las Condes · Av. Apoquindo'];

const NAV: { id: ProView; label: string; icon: React.ReactNode }[] = [
  {
    id: 'panel',
    label: 'Panel',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'pacientes',
    label: 'Pacientes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'recordatorios',
    label: 'Recordatorios',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ProApp({ onBack, onSwitchToPatient }: { onBack: () => void; onSwitchToPatient: () => void }) {
  const [view, setView] = useState<ProView>('panel');
  const [branch, setBranch] = useState(0);
  const [branchOpen, setBranchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#1f1a13]">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-[rgba(236,231,224,0.08)] bg-[#231e16] md:flex">
        <button onClick={onBack} className="flex items-center gap-2.5 border-b border-[rgba(236,231,224,0.08)] px-5 py-5 text-left">
          <div>
            <p className="font-display text-[17px] font-bold leading-tight tracking-[0.2em] text-[#f4efe8]">HEIR</p>
            <p className="font-mono-y text-[9px] uppercase tracking-[0.12em] text-[#a79e91]">← Volver a la web</p>
          </div>
        </button>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                view === n.id ? 'text-[#f2a98d]' : 'text-[#a79e91] hover:bg-[#1f1a13] hover:text-[#ece7e0]'
              }`}
            >
              {view === n.id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-[#3a241a]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <span className="relative z-10">{n.icon}</span>
              <span className="relative z-10">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-[rgba(236,231,224,0.08)] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#1f1a13] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c2620] text-[11px] font-semibold text-[#f4efe8]">
              {PROFESSIONAL.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold">{PROFESSIONAL.name}</p>
              <p className="truncate font-mono-y text-[9.5px] uppercase tracking-[0.1em] text-[#a79e91]">{PROFESSIONAL.role}</p>
            </div>
          </div>
          <button
            onClick={onSwitchToPatient}
            className="mt-2.5 w-full rounded-xl border border-[rgba(236,231,224,0.14)] py-2.5 text-[12px] font-medium text-[#a79e91] transition-colors hover:border-[#ece7e0] hover:text-[#ece7e0]"
          >
            Ver como paciente →
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex min-h-screen flex-1 flex-col md:pl-60">
        {/* Topbar móvil */}
        <div className="sticky top-0 z-40 border-b border-[rgba(236,231,224,0.08)] bg-[rgba(31,26,19,0.92)] backdrop-blur-[14px]">
          <div className="flex items-center gap-3 px-4 py-3 md:px-8">
            <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium text-[#a79e91] transition-colors hover:text-[#ece7e0] md:hidden">
              <span className="font-display text-[14px] font-bold tracking-[0.2em] text-[#f4efe8]">HEIR</span>
              ← Web
            </button>
            <div className="ml-auto flex items-center gap-2.5">
              {/* Selector de sucursal */}
              <div className="relative">
                <button
                  onClick={() => setBranchOpen(!branchOpen)}
                  className="flex items-center gap-2 rounded-full border border-[rgba(236,231,224,0.16)] bg-[#231e16] px-3.5 py-1.5 text-[11.5px] font-medium text-[#ece7e0] transition-colors hover:border-[rgba(236,231,224,0.32)]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4694a" strokeWidth="2.2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="hidden sm:inline">{BRANCHES[branch]}</span>
                  <span className="sm:hidden">{BRANCHES[branch].split(' ·')[0]}</span>
                  <motion.svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a79e91" strokeWidth="2.4"
                    animate={{ rotate: branchOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {branchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-xl border border-[rgba(236,231,224,0.12)] bg-[#231e16] shadow-warm"
                    >
                      <p className="border-b border-[rgba(236,231,224,0.08)] px-4 py-2.5 font-mono-y text-[9.5px] uppercase tracking-[0.14em] text-[#8d8478]">
                        Sucursal activa
                      </p>
                      {BRANCHES.map((b, i) => (
                        <button
                          key={b}
                          onClick={() => { setBranch(i); setBranchOpen(false); }}
                          className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-[12.5px] transition-colors hover:bg-[#2c2620] ${
                            branch === i ? 'text-[#f2a98d]' : 'text-[#ece7e0]'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${branch === i ? 'bg-[#d4694a]' : 'bg-[#8d8478]'}`} />
                          {b}
                          {branch === i && <span className="ml-auto font-mono-y text-[10px]">✓</span>}
                        </button>
                      ))}
                      <button className="flex w-full items-center gap-2 border-t border-[rgba(236,231,224,0.08)] px-4 py-3 text-[12px] font-medium text-[#a79e91] transition-colors hover:bg-[#2c2620] hover:text-[#ece7e0]">
                        + Agregar sucursal
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-[#22301a] px-3 py-1.5 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#a3c98a] lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a3c98a] pulse-dot" />
                Agente activo
              </span>
              <span className="rounded-full border border-[rgba(236,231,224,0.14)] px-3 py-1.5 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#a79e91]">
                Demo
              </span>
            </div>
          </div>
          {/* Nav móvil */}
          <div className="nice-scroll flex gap-1 overflow-x-auto px-3 pb-2.5 md:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  view === n.id ? 'bg-[#2c2620] text-[#f4efe8]' : 'text-[#a79e91]'
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'panel' && <Panel branchName={BRANCHES[branch]} />}
              {view === 'agenda' && <Agenda />}
              {view === 'pacientes' && <Pacientes />}
              {view === 'pagos' && <Pagos />}
              {view === 'recordatorios' && <Recordatorios />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
