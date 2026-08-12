import { useState } from 'react';
import { motion } from 'framer-motion';
import { REMINDERS, PATIENTS } from '@/data/demo';
import { Avatar } from '../ui';

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Recordatorios() {
  const [auto, setAuto] = useState(true);
  const [timing, setTiming] = useState('24 h');
  const [channel, setChannel] = useState('WhatsApp');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[26px] font-semibold tracking-tight">Recordatorios</h1>
        <p className="mt-1 text-[13.5px] text-[#a79e91]">
          El agente recuerda cada sesión semanal y pregunta por la confirmación de asistencia
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        {/* Configuración */}
        <motion.div {...fadeUp(0)} className="h-fit space-y-5 rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14.5px] font-semibold">Recordatorios automáticos</p>
              <p className="mt-0.5 text-[12px] text-[#a79e91]">Para pacientes con hora semanal fija</p>
            </div>
            <button
              onClick={() => setAuto(!auto)}
              className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${auto ? 'bg-[#a3c98a]' : 'bg-[#4a4033]'}`}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                className={`absolute top-1 h-5 w-5 rounded-full bg-[#231e16] shadow ${auto ? 'right-1' : 'left-1'}`}
              />
            </button>
          </div>

          <div>
            <p className="eyebrow text-[#a79e91] normal-case tracking-[0.08em]">Enviar con anticipación</p>
            <div className="mt-2 flex gap-2">
              {['48 h', '24 h', '2 h'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTiming(t)}
                  className={`flex-1 rounded-lg border py-2.5 font-mono-y text-[12px] font-semibold transition-all ${
                    timing === t
                      ? 'border-[#d4694a] bg-[#3a241a] text-[#f2a98d]'
                      : 'border-[rgba(236,231,224,0.16)] text-[#a79e91] hover:border-[#ece7e0]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow text-[#a79e91] normal-case tracking-[0.08em]">Canal</p>
            <div className="mt-2 flex gap-2">
              {['WhatsApp', 'Correo'].map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`flex-1 rounded-lg border py-2.5 text-[12.5px] font-semibold transition-all ${
                    channel === c
                      ? 'border-[#a3c98a] bg-[#22301a] text-[#a3c98a]'
                      : 'border-[rgba(236,231,224,0.16)] text-[#a79e91] hover:border-[#ece7e0]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[rgba(163,201,138,0.2)] bg-[#22301a] p-4">
            <p className="eyebrow text-[#a3c98a] normal-case tracking-[0.08em]">Vista previa del mensaje</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[#ece7e0]">
              "Hola {'{nombre}'}, te recuerdo tu sesión de {'{procedimiento}'} mañana a las{' '}
              {'{hora}'} con Felipe. ¿Confirmas tu asistencia? Responde SÍ o NO."
            </p>
          </div>

          <div className="flex items-center gap-2 border-t border-[rgba(236,231,224,0.08)] pt-4">
            <span className={`h-2 w-2 rounded-full ${auto ? 'bg-[#a3c98a] pulse-dot' : 'bg-[#8d8478]'}`} />
            <span className="font-mono-y text-[10.5px] uppercase tracking-[0.1em] text-[#a79e91]">
              {auto ? `Activo · ${channel} · ${timing} antes` : 'Automatización en pausa'}
            </span>
          </div>
        </motion.div>

        {/* Cola de recordatorios */}
        <motion.div {...fadeUp(1)} className="rounded-[14px] border border-[rgba(236,231,224,0.1)] bg-[#231e16]">
          <div className="flex items-center justify-between border-b border-[rgba(236,231,224,0.08)] px-5 py-4">
            <h2 className="font-display text-[17px] font-semibold">Cola de esta semana</h2>
            <span className="font-mono-y text-[10.5px] uppercase tracking-[0.1em] text-[#a79e91]">
              {REMINDERS.filter((r) => r.status === 'enviado').length} enviados ·{' '}
              {REMINDERS.filter((r) => r.status === 'programado').length} programados
            </span>
          </div>
          <div className="divide-y divide-[rgba(236,231,224,0.06)]">
            {REMINDERS.map((r, i) => {
              const p = PATIENTS.find((x) => x.id === r.patientId)!;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-3.5 px-5 py-4"
                >
                  <Avatar p={p} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13.5px] font-semibold">{p.name}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono-y text-[9.5px] uppercase tracking-[0.08em] ${
                          r.status === 'enviado' ? 'bg-[#22301a] text-[#a3c98a]' : 'bg-[#27211a] text-[#a79e91]'
                        }`}
                      >
                        {r.status === 'enviado' ? '✓ Enviado' : 'Programado'}
                      </span>
                      <span className="font-mono-y text-[10px] uppercase tracking-[0.08em] text-[#8d8478]">{r.channel}</span>
                    </div>
                    <p className="mt-1.5 max-w-[64ch] text-[12.5px] leading-relaxed text-[#a79e91]">"{r.message}"</p>
                  </div>
                  <span className="whitespace-nowrap font-mono-y text-[11px] text-[#a79e91]">{r.when}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
