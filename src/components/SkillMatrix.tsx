import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Database, Layers, Server } from 'lucide-react'
import { useMemo, useState } from 'react'
import { experience } from '../data/experience'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import type { Domain } from '../data/types'
import Section from './Section'

const domains: { name: Domain; Icon: typeof Brain; blurb: string }[] = [
  { name: 'AI / ML', Icon: Brain, blurb: 'Models, retrieval and evaluation' },
  { name: 'Data Engineering', Icon: Database, blurb: 'Storage, scale and data quality' },
  { name: 'Frameworks & Languages', Icon: Layers, blurb: 'How systems get built' },
  { name: 'Systems Architecture', Icon: Server, blurb: 'Security, delivery and observability' },
]

export default function SkillMatrix({ onOpen }: { onOpen: (kind: 'experience' | 'project', id: string) => void }) {
  const [domain, setDomain] = useState<Domain>('AI / ML')
  const [picked, setPicked] = useState<string | null>('PyTorch')

  const list = skills.filter((s) => s.domain === domain)
  const used = useMemo(() => {
    if (!picked) return { exp: [], proj: [] }
    const match = (tags: string[]) => tags.some((t) => t.toLowerCase() === picked.toLowerCase())
    return { exp: experience.filter((e) => match(e.tags)), proj: projects.filter((p) => match(p.tags)) }
  }, [picked])
  const skill = skills.find((s) => s.name === picked)

  return (
    <Section id="skills" eyebrow="Tech stack · 03" title="Skills Matrix" lead="Pick a domain, then a skill to see where it was applied in real work.">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1" role="tablist" aria-label="Skill domains">
          {domains.map(({ name, Icon, blurb }) => {
            const on = name === domain
            return (
              <button
                key={name}
                role="tab"
                aria-selected={on}
                onClick={() => { setDomain(name); setPicked(skills.find((s) => s.domain === name)?.name ?? null) }}
                className={`relative rounded-xl border p-4 text-left transition ${on ? 'border-cyan-300/50' : 'border-cyan-300/10 hover:border-cyan-300/30'}`}
              >
                {on && <motion.span layoutId="domain-bg" className="absolute inset-0 rounded-xl bg-cyan-300/10" />}
                <span className="relative flex items-center gap-2 text-sm font-semibold text-white"><Icon size={16} className="text-cyan-300" />{name}</span>
                <span className="relative mt-1 hidden text-xs text-slate-500 sm:block">{blurb}</span>
              </button>
            )
          })}
        </div>

        <div className="glass rounded-2xl p-6">
          <motion.ul layout className="flex flex-wrap gap-2.5">
            <AnimatePresence mode="popLayout">
              {list.map((s, i) => (
                <motion.li key={s.name} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ delay: i * 0.025 }}>
                  <button
                    onClick={() => setPicked(s.name)}
                    aria-pressed={picked === s.name}
                    className={`rounded-lg border px-3.5 py-2 font-mono text-sm transition ${picked === s.name ? 'border-cyan-300 bg-cyan-300/15 text-white shadow-[0_0_20px_-4px_#22d3ee]' : 'border-cyan-300/15 bg-ink-900/60 text-slate-300 hover:border-cyan-300/50 hover:text-white'}`}
                  >
                    {s.name}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <div className="mt-6 min-h-[8rem] border-t border-cyan-300/10 pt-5">
            <AnimatePresence mode="wait">
              {skill && (
                <motion.div key={skill.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <p className="text-lg font-semibold text-white">{skill.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{skill.note}</p>
                  {(used.exp.length > 0 || used.proj.length > 0) ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="mono-label mr-1 self-center">Applied in</span>
                      {used.exp.map((e) => <button key={e.id} onClick={() => onOpen('experience', e.id)} className="chip hover:border-cyan-300/60 hover:text-white">{e.org}</button>)}
                      {used.proj.map((p) => <button key={p.id} onClick={() => onOpen('project', p.id)} className="chip border-teal-300/25 bg-teal-300/5 hover:border-teal-300/60 hover:text-white">{p.title}</button>)}
                    </div>
                  ) : (
                    <p className="mt-4 font-mono text-xs text-slate-500">Working knowledge across projects and tooling.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}
