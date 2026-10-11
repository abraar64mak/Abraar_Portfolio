import { motion } from 'framer-motion'
import { Briefcase, ChevronRight, GraduationCap } from 'lucide-react'
import { experience } from '../data/experience'
import Section from './Section'

export default function ExperienceLog({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <Section id="experience" eyebrow="Clinical log · 01" title="Experience & Academic Record" lead="Select any entry to open its full case file: architecture, metrics and impact.">
      <div className="relative">
        <div aria-hidden className="absolute bottom-0 left-[15px] top-2 w-px bg-gradient-to-b from-cyan-300/60 via-cyan-300/20 to-transparent md:left-[19px]" />
        <ol className="space-y-5">
          {experience.map((e, i) => {
            const Icon = e.kind === 'work' ? Briefcase : GraduationCap
            return (
              <motion.li key={e.id} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.05, duration: 0.5 }} className="relative pl-12 md:pl-14">
                <span className="absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/40 bg-ink-900 text-cyan-300 md:h-10 md:w-10">
                  {i === 0 && <span className="absolute inset-0 animate-ring rounded-full border border-cyan-300/60" />}
                  <Icon size={16} />
                </span>
                <button
                  onClick={() => onOpen(e.id)}
                  className="glass glass-hover group relative w-full rounded-xl p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 sm:p-6"
                  aria-label={`Open details: ${e.role} at ${e.org}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-cyan-300/80">{e.period}</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{e.role}</h3>
                      <p className="text-slate-300">{e.org} <span className="text-slate-500">· {e.location}</span></p>
                    </div>
                    <span className="mono-label hidden items-center gap-1 opacity-0 transition group-hover:opacity-100 sm:flex">Open case file <ChevronRight size={14} /></span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-400">{e.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">{e.tags.slice(0, 5).map((t) => <span key={t} className="chip">{t}</span>)}</div>
                  <ChevronRight aria-hidden className="absolute bottom-5 right-5 text-cyan-300/40 transition group-hover:translate-x-1 group-hover:text-cyan-300 sm:hidden" size={18} />
                </button>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
