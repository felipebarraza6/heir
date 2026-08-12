import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow text-[#d4694a]">{index}</span>
      <span className="h-px w-8 bg-[rgba(236,231,224,0.22)]" />
      <span className="eyebrow text-[#a79e91]">{text}</span>
    </div>
  );
}
