import { Reveal, SectionLabel } from '@/components/Reveal';
import { WEEK_DAYS, PATIENTS, procedureOf } from '@/data/demo';

const colorMap: Record<string, string> = {
  terra: 'bg-[#3a241a] border-[rgba(212,105,74,0.3)]',
  sage: 'bg-[#22301a] border-[rgba(163,201,138,0.25)]',
  sand: 'bg-[#27211a] border-[rgba(236,231,224,0.15)]',
};

export default function HowItWorks() {
  const preview = PATIENTS.slice(0, 6);
  return (
    <section id="como-funciona" className="border-y border-[rgba(236,231,224,0.08)] bg-[#1f1a13] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel index="02" text="Cómo funciona" />
        </Reveal>
        <div className="mt-5 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal delay={0.06}>
              <h2 className="text-balance font-display text-[clamp(30px,4vw,46px)] font-semibold leading-[1.08] tracking-[-0.015em]">
                Tu semana se repite. El sistema la entiende.
              </h2>
            </Reveal>
            <div className="mt-10 space-y-0">
              {[
                ['01', 'Tu paciente conversa con el agente', 'Agenda, reagenda o pregunta valores directamente, sin descargar nada.'],
                ['02', 'La agenda se actualiza sola', 'Cada reserva cae en tu calendario semanal. Los horarios fijos de siempre quedan protegidos.'],
                ['03', 'El recordatorio sale automático', '24 horas antes, el agente pregunta por WhatsApp si confirman su asistencia.'],
                ['04', 'El pago queda registrado', 'Online, transferencia o efectivo: todo entra a tu billetera con el detalle por paciente.'],
              ].map(([n, t, d], i) => (
                <Reveal key={n} delay={0.08 + i * 0.06}>
                  <div className="flex gap-5 border-b border-[rgba(236,231,224,0.1)] py-6 first:border-t">
                    <span className="font-mono-y text-[12px] font-semibold text-[#d4694a]">{n}</span>
                    <div>
                      <h3 className="font-display text-[19px] font-semibold">{t}</h3>
                      <p className="mt-1 max-w-[46ch] text-[13.5px] leading-relaxed text-[#a79e91]">{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mini agenda semanal */}
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-[16px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] shadow-warm">
              <div className="flex items-center justify-between border-b border-[rgba(236,231,224,0.08)] px-5 py-3.5">
                <div>
                  <p className="font-display text-[16px] font-semibold">Agenda semanal</p>
                  <p className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#a79e91]">10 – 14 ago 2026</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-[#22301a] px-3 py-1.5 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#a3c98a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#a3c98a] pulse-dot" />
                  Sincronizada
                </span>
              </div>
              <div className="grid grid-cols-5 divide-x divide-[rgba(236,231,224,0.06)]">
                {WEEK_DAYS.map((d) => (
                  <div key={d} className="border-b border-[rgba(236,231,224,0.08)] px-2 py-2.5 text-center">
                    <span className="font-mono-y text-[10.5px] uppercase tracking-[0.08em] text-[#a79e91]">{d}</span>
                  </div>
                ))}
                {WEEK_DAYS.map((d, dayIdx) => (
                  <div key={d} className="space-y-1.5 p-2">
                    {preview
                      .filter((p) => p.day === dayIdx)
                      .map((p) => (
                        <div key={p.id} className={`rounded-lg border p-2 ${colorMap[p.color]}`}>
                          <p className="truncate text-[10.5px] font-semibold leading-tight">{p.name.split(' ')[0]} {p.name.split(' ')[1]?.[0] ?? ''}.</p>
                          <p className="font-mono-y text-[9px] text-[#a79e91]">{p.time}</p>
                          <p className="mt-0.5 truncate text-[9.5px] text-[#a79e91]">{procedureOf(p.procedureId).name.replace('Sesión de ', '').replace('Rehabilitación', 'Rehab.')}</p>
                        </div>
                      ))}
                    {preview.filter((p) => p.day === dayIdx).length === 0 && (
                      <p className="pt-2 text-center font-mono-y text-[9.5px] text-[#8d8478]">—</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-[rgba(236,231,224,0.08)] px-5 py-3">
                <span className="flex items-center gap-1.5 font-mono-y text-[10px] uppercase tracking-[0.08em] text-[#a79e91]">
                  <span className="h-2 w-2 rounded-sm bg-[#3a241a]" /> Horario semanal fijo
                </span>
                <span className="flex items-center gap-1.5 font-mono-y text-[10px] uppercase tracking-[0.08em] text-[#a79e91]">
                  <span className="h-2 w-2 rounded-full bg-[#a3c98a]" /> Confirmada
                </span>
                <span className="flex items-center gap-1.5 font-mono-y text-[10px] uppercase tracking-[0.08em] text-[#a79e91]">
                  <span className="h-2 w-2 rounded-full bg-[#d4694a]" /> Agendada por el agente
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
