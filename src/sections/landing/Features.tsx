import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { Reveal, SectionLabel } from '@/components/Reveal';

function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + Math.round(v).toLocaleString('es-CL') + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function CardShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group flex flex-col rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-[rgba(236,231,224,0.22)] hover:shadow-warm-sm ${className}`}
    >
      {children}
    </div>
  );
}

const monoLabel = 'eyebrow text-[#a79e91]';

export default function Features({ onEnter }: { onEnter: (view: 'pro' | 'patient') => void }) {
  return (
    <section id="funciones" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <SectionLabel index="01" text="Funciones" />
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-balance mt-5 max-w-[20ch] font-display text-[clamp(30px,4vw,46px)] font-semibold leading-[1.08] tracking-[-0.015em]">
          Todo lo que hoy haces a mano, el agente lo hace por ti
        </h2>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.12} className="mt-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[rgba(236,231,224,0.1)] md:grid-cols-4">
          {[
            { v: <Counter to={24} suffix="/7" />, label: 'El agente agenda y responde' },
            { v: <Counter to={92} suffix="%" />, label: 'Asistencia con recordatorios' },
            { v: <Counter to={6} suffix=" h" />, label: 'Ahorradas a la semana' },
            { v: <Counter to={100} suffix="%" />, label: 'De tus pagos registrados' },
          ].map((s) => (
            <div key={s.label} className="bg-[#231e16] px-6 py-7">
              <p className="font-display text-[34px] font-semibold tracking-tight text-[#d4694a]">{s.v}</p>
              <p className={`${monoLabel} mt-1.5 normal-case tracking-[0.06em]`}>{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Grid asimétrica */}
      <div className="mt-6 grid gap-4 md:grid-cols-12">
        {/* Agente de reservas — grande */}
        <Reveal className="md:col-span-7" delay={0.05}>
          <CardShell className="h-full">
            <p className={monoLabel}>Agente de reservas</p>
            <h3 className="mt-2 font-display text-[24px] font-semibold leading-snug">
              Tus pacientes agendan solos, a cualquier hora
            </h3>
            <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-[#a79e91]">
              El agente conversa con tus pacientes, muestra tus horarios disponibles y
              confirma la reserva directo en tu agenda. Sin llamadas, sin mensajes perdidos.
            </p>
            <div className="mt-5 space-y-2.5">
              <div className="w-fit max-w-full rounded-2xl rounded-bl-md bg-[#1f1a13] px-4 py-2.5 text-[12.5px] text-[#ece7e0]">
                ¿Tienes hora esta semana para kinesiología?
              </div>
              <div className="ml-auto w-fit max-w-full rounded-2xl rounded-br-md bg-[#2c2620] px-4 py-2.5 text-[12.5px] text-[#f4efe8]">
                Sí. Mié 12 · 15:00, Jue 13 · 11:00 o Vie 14 · 17:30. ¿Cuál te acomoda?
              </div>
              <div className="flex gap-1.5">
                {['Mié 15:00', 'Jue 11:00', 'Vie 17:30'].map((c, i) => (
                  <span
                    key={c}
                    className={`shimmer-chip rounded-full border px-3 py-1.5 font-mono-y text-[10.5px] ${
                      i === 1
                        ? 'border-[#d4694a] bg-[#d4694a] text-[#f4efe8]'
                        : 'border-[rgba(212,105,74,0.35)] bg-[#3a241a] text-[#f2a98d]'
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </CardShell>
        </Reveal>

        {/* Consultas de valores */}
        <Reveal className="md:col-span-5" delay={0.1}>
          <CardShell className="h-full">
            <p className={monoLabel}>Consultas de valores</p>
            <h3 className="mt-2 font-display text-[24px] font-semibold leading-snug">
              Responde precios y procedimientos al instante
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#a79e91]">
              El agente conoce tu lista de valores y la explica con tus propias palabras.
            </p>
            <div className="mt-5 space-y-2 rounded-xl border border-[rgba(236,231,224,0.08)] bg-[#17140f] p-3">
              {[
                ['Sesión de kinesiología', '$35.000'],
                ['Rehabilitación deportiva', '$38.000'],
                ['Kinesiología neurológica', '$45.000'],
              ].map(([n, p]) => (
                <div key={n} className="flex items-center justify-between border-b border-dashed border-[rgba(236,231,224,0.12)] pb-2 text-[12.5px] last:border-0 last:pb-0">
                  <span>{n}</span>
                  <span className="font-mono-y text-[12px] font-semibold text-[#d4694a]">{p}</span>
                </div>
              ))}
            </div>
          </CardShell>
        </Reveal>

        {/* Recordatorios */}
        <Reveal className="md:col-span-5" delay={0.05}>
          <CardShell className="h-full">
            <p className={monoLabel}>Recordatorios automáticos</p>
            <h3 className="mt-2 font-display text-[24px] font-semibold leading-snug">
              Cada semana, la misma hora, sin perseguir a nadie
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#a79e91]">
              Como tus pacientes asisten semanalmente, el agente les recuerda su hora con
              anticipación y les pregunta si confirman su asistencia.
            </p>
            <div className="mt-5 space-y-2.5">
              <div className="w-fit max-w-[92%] rounded-2xl rounded-tl-md border border-[rgba(163,201,138,0.2)] bg-[#22301a] px-4 py-2.5 text-[12.5px]">
                Hola Fernanda, mañana miércoles 09:30 es tu sesión. ¿Confirmas tu asistencia?
              </div>
              <div className="ml-auto w-fit rounded-2xl rounded-tr-md bg-[#2c2620] px-4 py-2.5 text-[12.5px] text-[#f4efe8]">
                Sí, ahí estaré ✓
              </div>
              <p className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#a3c98a]">
                Confirmada · agenda actualizada
              </p>
            </div>
          </CardShell>
        </Reveal>

        {/* Billetera — grande */}
        <Reveal className="md:col-span-7" delay={0.1}>
          <CardShell className="h-full">
            <p className={monoLabel}>Billetera digital</p>
            <h3 className="mt-2 font-display text-[24px] font-semibold leading-snug">
              Cada pago, registrado y bajo control
            </h3>
            <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-[#a79e91]">
              Tus pacientes pagan online al agendar. Y si te pagan por transferencia o en
              efectivo, lo registras en segundos desde tu perfil. Todo suma en tu balance.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr]">
              <div className="rounded-xl bg-[#2c2620] p-4 text-[#f4efe8]">
                <p className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#f4efe8]/60">Balance agosto</p>
                <p className="mt-1 font-display text-[28px] font-semibold">
                  <Counter to={745000} prefix="$" />
                </p>
                <p className="mt-1 font-mono-y text-[10px] text-[#c9e7b5]">▲ 12% vs. julio</p>
              </div>
              <div className="space-y-2">
                {[
                  ['Ricardo F. · Online', '+$38.000'],
                  ['Fernanda O. · Transferencia', '+$30.000'],
                  ['María José P. · Efectivo', '+$35.000'],
                ].map(([n, a]) => (
                  <div key={n} className="flex items-center justify-between rounded-lg border border-[rgba(236,231,224,0.08)] bg-[#17140f] px-3.5 py-2.5 text-[12.5px]">
                    <span>{n}</span>
                    <span className="font-mono-y text-[12px] font-semibold text-[#a3c98a]">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardShell>
        </Reveal>

        {/* Multi-sucursal — banda ancha */}
        <Reveal className="md:col-span-12" delay={0.08}>
          <CardShell className="md:flex-row md:items-center md:gap-10">
            <div className="md:max-w-[46%]">
              <p className={monoLabel}>Multi-sucursal</p>
              <h3 className="mt-2 font-display text-[24px] font-semibold leading-snug">
                Todas tus sedes, una sola agenda y una sola billetera
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#a79e91]">
                Si atiendes en más de un lugar, el agente ofrece horarios según la sucursal que
                elija el paciente, y tú ves agenda e ingresos de cada sede por separado — o
                consolidados en una sola vista.
              </p>
            </div>
            <div className="mt-5 flex-1 space-y-2 md:mt-0">
              {[
                ['Providencia · Av. Ricardo Lyon', '12 citas esta semana', '$456.000'],
                ['Las Condes · Av. Apoquindo', '8 citas esta semana', '$289.000'],
              ].map(([sede, citas, monto], i) => (
                <div
                  key={sede}
                  className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-4 py-3.5 transition-colors ${
                    i === 0
                      ? 'border-[rgba(212,105,74,0.35)] bg-[#3a241a]'
                      : 'border-[rgba(236,231,224,0.1)] bg-[#17140f]'
                  }`}
                >
                  <span className="flex items-center gap-2 text-[13px] font-semibold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? '#f2a98d' : '#a79e91'} strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {sede}
                  </span>
                  <span className="font-mono-y text-[10px] uppercase tracking-[0.08em] text-[#a79e91]">{citas}</span>
                  <span className="ml-auto font-mono-y text-[13px] font-semibold text-[#a3c98a]">{monto}</span>
                </div>
              ))}
              <p className="pt-1 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#8d8478]">
                + Agrega nuevas sucursales cuando las necesites
              </p>
            </div>
          </CardShell>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-10 text-center">
        <button
          onClick={() => onEnter('pro')}
          className="group rounded-xl border border-[#f2a98d] bg-[#d4694a] px-6 py-3.5 text-[14.5px] font-semibold text-[#f4efe8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#f2a98d]"
        >
          Ver todo funcionando en el panel
          <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
        </button>
      </Reveal>
    </section>
  );
}
