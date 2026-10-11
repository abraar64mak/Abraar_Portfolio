import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props { id: string; eyebrow: string; title: string; lead?: string; children: ReactNode }

export default function Section({ id, eyebrow, title, lead, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mb-12 max-w-2xl"
      >
        <p className="mono-label mb-3 flex items-center gap-2"><span className="h-px w-8 bg-cyan-300/60" />{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        {lead && <p className="mt-4 text-lg leading-relaxed text-slate-400">{lead}</p>}
      </motion.header>
      {children}
    </section>
  )
}
