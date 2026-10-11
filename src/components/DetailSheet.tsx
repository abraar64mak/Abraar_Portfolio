import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Github, Globe, X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import type { LinkItem, Metric, PipelineStep } from '../data/types'
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
}

const icon = { github: Github, paper: BookOpen, web: Globe }

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="mono-label mb-3">{title}</h3>
      {children}
    </section>
  )
}

interface Props { content: DetailContent | null; onClose: () => void }

export default function DetailSheet({ content, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!content) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [content, onClose])

  return (
    <AnimatePresence>
      {content && (
        <motion.div className="fixed inset-0 z-[60] flex justify-end" initial="hide" animate="show" exit="hide">
          <motion.div
            variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={content.title}
            variants={{ hide: { x: '100%', opacity: 0.6 }, show: { x: 0, opacity: 1 } }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="relative h-full w-full max-w-3xl overflow-y-auto border-l border-cyan-300/20 bg-ink-900/95 shadow-[-30px_0_80px_-20px_rgba(34,211,238,0.25)]"
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cyan-300/10 bg-ink-900/90 px-5 py-3 backdrop-blur-md sm:px-8">
              <span className="mono-label flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/70" /><span className="relative h-2 w-2 rounded-full bg-cyan-300" /></span>
                {content.eyebrow}
              </span>
              <button ref={closeRef} onClick={onClose} aria-label="Close detail view" className="rounded-md border border-cyan-300/20 p-1.5 text-slate-300 transition hover:border-cyan-300/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pb-16 pt-8 sm:px-8">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{content.title}</h2>
                <p className="mt-2 text-lg text-cyan-100/80">{content.subtitle}</p>
                {content.meta && <p className="mt-1 font-mono text-xs text-slate-400">{content.meta}</p>}
                <div className="mt-4 flex flex-wrap gap-1.5">{content.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </motion.div>

              <motion.div
                initial="h" animate="s"
                variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
                className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
              >
                {content.metrics.map((m) => (
                  <motion.div key={m.label} variants={{ h: { opacity: 0, y: 12 }, s: { opacity: 1, y: 0 } }} className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] p-3">
                    <div className={`break-words font-mono font-semibold text-cyan-200 ${m.value.length > 9 ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>{m.value}</div>
                    <div className="mt-1 text-xs text-slate-300">{m.label}</div>
                    {m.note && <div className="mt-0.5 text-[11px] text-slate-500">{m.note}</div>}
                  </motion.div>
                ))}
              </motion.div>

              <Block title={content.pipelineTitle}><PipelineFlow steps={content.pipeline} /></Block>

              <Block title={content.highlightsTitle}>
                <ul className="space-y-2.5">
                  {content.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />{h}
                    </li>
                  ))}
                </ul>
              </Block>

              {content.closing && (
                <Block title={content.closing.label}>
                  <p className="rounded-lg border-l-2 border-teal-300/60 bg-teal-300/5 p-4 text-[15px] italic leading-relaxed text-slate-200">{content.closing.text}</p>
                </Block>
              )}

              {content.links && content.links.length > 0 && (
                <Block title="Links">
                  <div className="flex flex-wrap gap-3">
                    {content.links.map((l) => {
                      const Icon = icon[l.kind]
                      return (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                          <Icon size={16} />{l.label}<ArrowUpRight size={14} />
                        </a>
                      )
                    })}
                  </div>
                </Block>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
