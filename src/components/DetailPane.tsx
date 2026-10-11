import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Github, Globe } from 'lucide-react'
import type { ReactNode } from 'react'
import type { LinkItem, Metric, PipelineStep } from '../data/types'
import Panel from './Panel'
import PipelineFlow from './PipelineFlow'

export interface DetailContent {
  eyebrow: string
  title: string
  subtitle: string
  meta?: string
  tags: string[]
  metrics: Metric[]
  pipeline: PipelineStep[]
  pipelineTitle: string
  highlights: string[]
  highlightsTitle: string
  closing?: { label: string; text: string }
  links?: LinkItem[]
  extra?: ReactNode
}

const icon = { github: Github, paper: BookOpen, web: Globe }

/** Inline detail view (replaces the old slide-over overlay): lives in the page, can't get stuck open. */
export default function DetailPane({ c }: { c: DetailContent }) {
  return (
    <motion.div key={c.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <Panel tag={c.eyebrow} bodyClass="p-5 sm:p-6">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{c.title}</h2>
        <p className="mt-1.5 text-base text-cyan-100/80">{c.subtitle}</p>
        {c.meta && <p className="mt-1 font-mono text-xs text-slate-400">{c.meta}</p>}
        <div className="mt-4 flex flex-wrap gap-1.5">{c.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] p-3">
              <div className={`break-words font-mono font-semibold text-cyan-200 ${m.value.length > 9 ? 'text-base' : 'text-xl'}`}>{m.value}</div>
              <div className="mt-1 text-xs text-slate-300">{m.label}</div>
              {m.note && <div className="text-[11px] text-slate-500">{m.note}</div>}
            </div>
          ))}
        </div>
      </Panel>

      {c.extra}

      <Panel tag="Architecture" title={c.pipelineTitle}><PipelineFlow steps={c.pipeline} /></Panel>

      <Panel tag="Detail" title={c.highlightsTitle}>
        <ul className="space-y-2.5">
          {c.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />{h}
            </li>
          ))}
        </ul>
        {c.closing && (
          <p className="mt-5 rounded-lg border-l-2 border-teal-300/60 bg-teal-300/5 p-4 text-[15px] italic leading-relaxed text-slate-200">
            <span className="mono-label mb-1 block not-italic">{c.closing.label}</span>{c.closing.text}
          </p>
        )}
        {c.links && c.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {c.links.map((l) => {
              const Icon = icon[l.kind]
              return <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Icon size={16} />{l.label}<ArrowUpRight size={14} /></a>
            })}
          </div>
        )}
      </Panel>
    </motion.div>
  )
}
