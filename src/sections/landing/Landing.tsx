import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChatDemo from '@/components/ChatDemo';
import Features from './Features';
import HowItWorks from './HowItWorks';
import WhyHeir from './WhyHeir';
import DarkCta from './DarkCta';

const MARQUEE_ITEMS = [
  'Agenda online',
  'Multi-sucursal',
  'Agente de reservas',
  'Consultas de valores',
  'Recordatorios automáticos',
  'Billetera digital',
  'Pagos online',
  'Confirmación de asistencia',
  'Control de ingresos',
  'Todas tus sedes en una vista',
];

export default function Landing({ onEnter }: { onEnter: (view: 'pro' | 'patient') => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="paper-grain min-h-screen bg-[#17140f]">
      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[rgba(236,231,224,0.08)] bg-[rgba(23,20,15,0.85)] backdrop-blur-[14px] backdrop-saturate-150'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
            <span className="font-display text-[20px] font-bold tracking-[0.2em] text-[#f4efe8]">HEIR</span>
          </button>
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {[
              ['Funciones', '#funciones'],
              ['Cómo funciona', '#como-funciona'],
              ['Por qué HEIR', '#por-que-heir'],
              ['Para pacientes', '#pacientes'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-[13.5px] font-medium text-[#a79e91] transition-colors hover:text-[#ece7e0]">
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => onEnter('patient')}
              className="hidden rounded-full border border-[rgba(236,231,224,0.18)] px-4 py-2 text-[13px] font-medium transition-colors hover:border-[#ece7e0] sm:block"
            >
              Soy paciente
            </button>
            <button
              onClick={() => onEnter('pro')}
              className="group rounded-full bg-[#d4694a] px-4 py-2 text-[13px] font-semibold text-[#f4efe8] transition-colors hover:bg-[#f2a98d]"
            >
              Ver demo
              <span className="ml-1.5 inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-32 md:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,105,74,0.3)] bg-[#3a241a] px-3.5 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4694a] pulse-dot" />
              <span className="eyebrow text-[#f2a98d]">Demo · Agenda inteligente</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance mt-6 font-display text-[clamp(40px,5.6vw,68px)] font-semibold leading-[1.02] tracking-[-0.02em]"
            >
              Tu agenda, tus pacientes y tus pagos.{' '}
              <span className="text-[#d4694a]">Un solo lugar.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-[#a79e91]"
            >
              Un asistente que agenda citas por ti, responde las consultas de valores,
              recuerda cada sesión semanal a tus pacientes y registra cada pago —
              online, transferencia o efectivo — en tu billetera digital.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => onEnter('pro')}
                className="group rounded-xl border border-[#f2a98d] bg-[#d4694a] px-6 py-3.5 text-[14.5px] font-semibold text-[#f4efe8] shadow-warm-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#f2a98d] hover:shadow-warm"
              >
                Explorar panel del profesional
                <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => onEnter('patient')}
                className="rounded-xl border border-[rgba(236,231,224,0.22)] px-6 py-3.5 text-[14.5px] font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:border-[#ece7e0]"
              >
                Ver app de paciente
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {['Sin instalación', 'Agenda semanal recurrente', 'Multi-sucursal', 'Pagos en CLP'].map((t) => (
                <span key={t} className="flex items-center gap-2 font-mono-y text-[11px] uppercase tracking-[0.1em] text-[#a79e91]">
                  <span className="h-1 w-1 rounded-full bg-[#a3c98a]" />
                  {t}
                </span>
              ))}
            </motion.div>

            {/* Actividad del agente — tarjetas estáticas */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22301a]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.2">
                      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#a3c98a]">Recordatorio</span>
                </div>
                <p className="mt-2 text-[12px] leading-snug text-[#ece7e0]">
                  "Hola Ricardo, te recuerdo tu sesión mañana a las 18:30. ¿Confirmas?"
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#a79e91]">Pago recibido</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22301a]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <p className="mt-1.5 font-display text-[22px] font-semibold">$38.000</p>
                <p className="font-mono-y text-[10px] text-[#a79e91]">Ricardo F. · Online · HEIR Pay</p>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-[rgba(236,231,224,0.1)] bg-[#1f1a13] p-3.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#d4694a] pulse-dot" />
                <span className="text-[12px] font-medium leading-snug">El agente agendó una cita nueva</span>
              </div>
            </motion.div>
          </div>

          {/* Chat demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="shadow-warm h-[520px] overflow-hidden rounded-[20px] border border-[rgba(236,231,224,0.1)] bg-[#1f1a13]">
              <ChatDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-[rgba(236,231,224,0.1)] bg-[#1f1a13] py-4">
        <div className="marquee-track flex w-max items-center">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-5">
              <span className="font-display font-medium text-[15px] text-[#ece7e0]">{item}</span>
              <span className="ml-10 h-1.5 w-1.5 rounded-full bg-[#d4694a]" />
            </span>
          ))}
        </div>
      </div>

      <Features onEnter={onEnter} />
      <HowItWorks />
      <WhyHeir />
      <DarkCta onEnter={onEnter} />
    </div>
  );
}
