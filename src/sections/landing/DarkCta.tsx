import { Reveal } from '@/components/Reveal';

export default function DarkCta({ onEnter }: { onEnter: (view: 'pro' | 'patient') => void }) {
  return (
    <>
      {/* Banda CTA oscura con glow terracota */}
      <section id="pacientes" className="relative overflow-hidden bg-[#2c2620] py-24 text-[#f4efe8]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 45% at 88% 12%, rgba(212,105,74,0.32), transparent), radial-gradient(ellipse 40% 40% at 8% 90%, rgba(201,231,181,0.08), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <p className="eyebrow text-[#c9e7b5]">Demo interactiva</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-balance mx-auto mt-5 max-w-[22ch] font-display text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.05] tracking-[-0.015em]">
              Recorre el sistema como si ya fuera <span className="text-[#ffb583]">tuyo</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-4 max-w-[54ch] text-[15px] leading-relaxed text-[#f4efe8]/65">
              Dos recorridos: el panel donde el profesional controla agenda, recordatorios y
              dinero; y la app donde el paciente ve sus citas, confirma y paga online.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onEnter('pro')}
                className="group rounded-xl bg-[#d4694a] px-7 py-4 text-[15px] font-semibold text-[#f4efe8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#f2a98d]"
              >
                Panel del profesional
                <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => onEnter('patient')}
                className="rounded-xl border border-white/25 px-7 py-4 text-[15px] font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:border-white/60"
              >
                App del paciente
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(236,231,224,0.08)] bg-[#17140f] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[16px] font-bold tracking-[0.2em] text-[#f4efe8]">HEIR</span>
            <span className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#a79e91]">· powered by HEIR infra</span>
          </div>
          <p className="font-mono-y text-[10.5px] uppercase tracking-[0.1em] text-[#8d8478]">
            Demo visual — todos los datos son simulados
          </p>
        </div>
      </footer>
    </>
  );
}
