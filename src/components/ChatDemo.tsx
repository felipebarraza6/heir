import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAT_SCRIPT, type ChatStep } from '@/data/demo';

interface RenderedMsg extends ChatStep {
  key: number;
  chipsSettled?: boolean;
  highlightChip?: string;
}

export default function ChatDemo() {
  const [msgs, setMsgs] = useState<RenderedMsg[]>([]);
  const [agentTyping, setAgentTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [highlight, setHighlight] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const keyCounter = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.current.push(
          setTimeout(() => {
            if (!cancelled) res();
          }, ms)
        );
      });

    const typeIntoInput = async (text: string) => {
      const chars = Math.min(text.length, 26);
      for (let i = 1; i <= chars; i++) {
        if (cancelled) return;
        setInputText(text.slice(0, Math.round((text.length * i) / chars)));
        await wait(28);
      }
      await wait(250);
    };

    const run = async () => {
      await wait(900);
      for (const step of CHAT_SCRIPT) {
        if (cancelled) return;
        if (step.from === 'agent') {
          setAgentTyping(true);
          await wait(1100 + step.text!.length * 6);
          setAgentTyping(false);
          setMsgs((m) => [...m, { ...step, key: keyCounter.current++ }]);
          if (step.pickedChip) {
            await wait(1400);
            setHighlight(step.pickedChip);
            await wait(900);
            setHighlight(null);
          }
          await wait(500);
        } else {
          await typeIntoInput(step.text!);
          setInputText('');
          setMsgs((m) => [...m, { ...step, key: keyCounter.current++ }]);
          await wait(700);
        }
      }
      await wait(4500);
      if (cancelled) return;
      setMsgs([]);
      run();
    };
    run();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Ancla el scroll al fondo sin animación para que no "tire" la vista al escribir
    el.scrollTop = el.scrollHeight;
  }, [msgs, agentTyping, inputText]);

  return (
    <div className="flex h-full flex-col">
      {/* Header del chat */}
      <div className="flex items-center gap-3 border-b border-[rgba(236,231,224,0.1)] px-5 py-3.5">
        <div className="relative mr-1.5 hidden sm:block">
          <span className="font-display text-[13px] font-bold tracking-[0.22em] text-[#f4efe8]">HEIR</span>
          <span className="absolute -right-3 top-0 h-2 w-2 rounded-full bg-[#7fae68] pulse-dot" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold leading-tight">Asistente HEIR</p>
          <p className="font-mono-y text-[10px] uppercase tracking-[0.12em] text-[#a79e91]">
            Agenda · Felipe Ulloa
          </p>
        </div>
        <span className="rounded-full bg-[#22301a] px-2.5 py-1 font-mono-y text-[10px] uppercase tracking-[0.1em] text-[#a3c98a]">
          En línea
        </span>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} className="nice-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.key}
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div className={m.from === 'user' ? 'max-w-[82%]' : 'max-w-[88%]'}>
                <div
                  className={
                    m.from === 'user'
                      ? 'rounded-2xl rounded-br-md bg-[#2c2620] px-4 py-2.5 text-[13px] leading-relaxed text-[#f4efe8]'
                      : 'rounded-2xl rounded-bl-md border border-[rgba(236,231,224,0.08)] bg-[#231e16] px-4 py-2.5 text-[13px] leading-relaxed text-[#ece7e0] shadow-warm-sm'
                  }
                >
                  {m.text}
                </div>
                {m.chips && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.chips.map((c, i) => (
                      <motion.span
                        key={c}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.12, duration: 0.3 }}
                        className={`shimmer-chip cursor-default rounded-full border px-3 py-1.5 font-mono-y text-[11px] transition-all duration-300 ${
                          highlight === c
                            ? 'border-[#d4694a] bg-[#d4694a] text-[#f4efe8] shadow-warm-sm'
                            : 'border-[rgba(212,105,74,0.35)] bg-[#3a241a] text-[#f2a98d]'
                        }`}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {agentTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[rgba(236,231,224,0.08)] bg-[#231e16] px-4 py-3 shadow-warm-sm">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#a79e91]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#a79e91]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#a79e91]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-[rgba(236,231,224,0.1)] px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-[rgba(236,231,224,0.14)] bg-[#17140f] px-4 py-2.5">
          <span className="flex-1 truncate text-[13px] text-[#ece7e0]">
            {inputText || <span className="text-[#8d8478]">Escribe tu consulta…</span>}
            <span className="caret-blink ml-0.5" />
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4694a]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
