import { Reveal, SectionLabel } from '@/components/Reveal';

const ROWS: { label: string; heir: string; others: string; separate: string; dim?: boolean }[] = [
  {
    label: 'Agenda online',
    heir: 'Incluida, con horarios semanales recurrentes',
    others: 'Incluida',
    separate: 'App de agenda (pago mensual)',
  },
  {
    label: 'Agente que agenda y responde valores',
    heir: 'Incluido, 24/7 con tu lista de precios',
    others: 'No existe — respondes tú cada mensaje',
    separate: 'Bot genérico que no conoce tu negocio',
    dim: true,
  },
  {
    label: 'Recordatorios de confirmación',
    heir: 'Automáticos por WhatsApp, 24 h antes',
    others: 'Aviso simple, sin preguntar asistencia',
    separate: 'Otra herramienta más por pagar',
    dim: true,
  },
  {
    label: 'Billetera y control de ingresos',
    heir: 'Integrada con la agenda y cada paciente',
    others: 'No existe — lo llevas aparte',
    separate: 'Planilla o app de finanzas desconectada',
  },
  {
    label: 'Multi-sucursal',
    heir: 'Incluido, agenda e ingresos por sede',
    others: 'Plan caro o directamente no está',
    separate: 'Imposible de consolidar entre apps',
    dim: true,
  },
];

function Cell({ children, state }: { children: React.ReactNode; state: 'good' | 'bad' | 'plain' }) {
  return (
    <td className="px-4 py-4 align-top md:px-5">
      <div className="flex items-start gap-2">
        {state === 'good' && (
          <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3c98a" strokeWidth="2.6">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {state === 'bad' && (
          <svg className="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d4694a" strokeWidth="2.4">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        )}
        <span className={`text-[12.5px] leading-snug md:text-[13px] ${state === 'good' ? 'font-medium text-[#ece7e0]' : 'text-[#a79e91]'}`}>
          {children}
        </span>
      </div>
    </td>
  );
}

export default function WhyHeir() {
  return (
    <section id="por-que-heir" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <SectionLabel index="03" text="Por qué HEIR" />
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="text-balance mt-5 max-w-[24ch] font-display text-[clamp(30px,4vw,46px)] font-semibold leading-[1.08] tracking-[-0.015em]">
          Una plataforma, no cuatro suscripciones pegadas con cinta
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-[#a79e91]">
          Hoy lo típico es pagar una app de agenda, otra de recordatorios, un bot genérico y
          llevar los ingresos en una planilla. HEIR lo trae todo junto — y el agente conoce
          tu negocio: tus valores, tus horarios y tus sucursales.
        </p>
      </Reveal>

      <Reveal delay={0.14} className="mt-10">
        <div className="overflow-x-auto rounded-[16px] border border-[rgba(236,231,224,0.1)] bg-[#231e16]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[rgba(236,231,224,0.1)]">
                <th className="w-[22%] px-4 py-4 md:px-5">
                  <span className="eyebrow text-[#8d8478]">Función</span>
                </th>
                <th className="w-[30%] bg-[#3a241a]/50 px-4 py-4 md:px-5">
                  <span className="font-display text-[15px] font-bold tracking-[0.18em] text-[#f2a98d]">HEIR</span>
                </th>
                <th className="w-[24%] px-4 py-4 md:px-5">
                  <span className="eyebrow text-[#a79e91]">Apps de agendamiento genéricas</span>
                </th>
                <th className="w-[24%] px-4 py-4 md:px-5">
                  <span className="eyebrow text-[#a79e91]">Varias apps separadas</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className={`border-b border-[rgba(236,231,224,0.07)] last:border-0 ${r.dim ? 'bg-[rgba(31,26,19,0.5)]' : ''}`}>
                  <td className="px-4 py-4 align-top md:px-5">
                    <span className="text-[13px] font-semibold text-[#ece7e0]">{r.label}</span>
                  </td>
                  <Cell state="good">{r.heir}</Cell>
                  <Cell state={r.others.startsWith('No') || r.others.startsWith('Plan') || r.others.startsWith('Aviso') ? 'bad' : 'plain'}>{r.others}</Cell>
                  <Cell state="bad">{r.separate}</Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={0.18} className="mt-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-[12px] border border-[rgba(163,201,138,0.2)] bg-[#22301a]/60 px-5 py-4">
          <span className="text-[13.5px] font-semibold text-[#a3c98a]">
            El resultado: menos apps, menos mensajes perdidos y todo tu dinero en una sola vista.
          </span>
          <span className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#8d8478]">
            Comparación referencial frente a soluciones típicas del mercado
          </span>
        </div>
      </Reveal>
    </section>
  );
}
