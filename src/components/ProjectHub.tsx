import { motion } from 'framer-motion'
import { Award, ArrowUpRight, HeartPulse, Bot, FileText, BookOpen, Stethoscope } from 'lucide-react'
import { useMemo, useState } from 'react'
import { projects } from '../data/projects'
import type { Project } from '../data/types'
import Section from './Section'

const catIcon: Record<Project['category'], typeof Award> = {
  'Cardiac AI': HeartPulse,
  'Healthcare ML': Stethoscope,
  'Agentic AI': Bot,
  'Document AI': FileText,
  Publication: BookOpen,
}

export default function ProjectHub({ onOpen }: { onOpen: (id: string) => void }) {
  const cats = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [])
  const [cat, setCat] = useState('All')
  const list = projects.filter((p) => cat === 'All' || p.category === cat)

  return (
    <Section id="projects" eyebrow="Research portfolio · 02" title="Project Hub" lead="Production systems and published research. Every card opens a deep-dive with architecture, metrics and links.">
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`relative rounded-full border px-4 py-1.5 font-mono text-xs transition ${cat === c ? 'border-cyan-300/60 text-white' : 'border-cyan-300/15 text-slate-400 hover:text-white'}`}>
            {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-cyan-300/15" />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => {
          const Icon = catIcon[p.category]
          return (
            <motion.button
              layout
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => onOpen(p.id)}
              className="glass glass-hover group relative flex flex-col overflow-hidden rounded-2xl p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              aria-label={`Open project: ${p.title}`}
            >
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:bg-cyan-300/25" />
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-300"><Icon size={20} /></span>
                {p.badge && <span className="flex items-center gap-1 rounded-full border border-teal-300/30 bg-teal-300/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-teal-200">{p.badge.includes('Best') && <Award size={11} />}{p.badge}</span>}
              </div>
              <p className="mono-label mt-5">{p.category}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-cyan-100/70">{p.subtitle}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.blurb}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {p.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="rounded-md bg-ink-900/70 px-3 py-2">
                    <div className="font-mono text-base font-semibold text-cyan-200">{m.value}</div>
                    <div className="text-[11px] text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">{p.tags.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}</div>
              <span className="mt-5 flex items-center gap-1 font-mono text-xs text-cyan-300 opacity-70 transition group-hover:opacity-100">Open deep-dive <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            </motion.button>
          )
        })}
      </motion.div>
    </Section>
  )
}
