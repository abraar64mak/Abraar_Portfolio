import { useEffect, useState } from 'react'
import Panel from '../components/Panel'
import { experience } from '../data/experience'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import type { Domain } from '../data/types'
import type { View } from '../hooks/useRoute'

const DOMAINS: { name: Domain; color: string; blurb: string }[] = [
  { name: 'AI / ML', color: '#a78bfa', blurb: 'Models, retrieval, agents, evaluation' },
  { name: 'Data Engineering', color: '#22d3ee', blurb: 'Storage, scale, data quality' },
  { name: 'Frameworks & Languages', color: '#2dd4bf', blurb: 'How systems get built' },
  { name: 'Systems Architecture', color: '#fbbf24', blurb: 'Security, delivery, observability' },
]

export default function Skills({ id, go }: { id?: string; go: (v: View, id?: string) => void }) {
  const [sel, setSel] = useState<string>(id && skills.some((s) => s.name === id) ? id : 'PyTorch')
  useEffect(() => { if (id && skills.some((s) => s.name === id)) setSel(id) }, [id])

  const skill = skills.find((s) => s.name === sel)!
  const domain = DOMAINS.find((d) => d.name === skill.domain)!
  const match = (tags: string[]) => tags.some((t) => t.toLowerCase() === sel.toLowerCase())
  const exp = experience.filter((e) => match(e.tags))
  const proj = projects.filter((p) => match(p.tags))

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
      <div className="relative">
        {/* pulsing hub, visible when the 2x2 grid is shown */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex">
          <span className="absolute inset-0 animate-ring rounded-full border border-cyan-300/60" />
          <span className="absolute inset-0 animate-ring rounded-full border border-cyan-300/60" style={{ animationDelay: '1.2s' }} />
          <span className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-cyan-300/60 bg-ink-900 text-center shadow-[0_0_30px_-4px_#22d3ee]">
            <span className="text-xs font-bold leading-tight text-white">AI<br />Systems</span>
            <span className="font-mono text-[9px] text-cyan-300">healthcare</span>
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DOMAINS.map((d) => {
            const list = skills.filter((s) => s.domain === d.name)
            const here = skill.domain === d.name
            return (
              <Panel key={d.name} bodyClass="p-5 md:px-8 md:py-6" className="transition-shadow" >
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color, boxShadow: `0 0 12px ${d.color}` }} />
                  <h2 className="text-[15px] font-semibold" style={{ color: d.color }}>{d.name}</h2>
                  <span className="ml-auto font-mono text-[11px] text-slate-500">{list.length}</span>
                </div>
                <p className="mb-4 text-xs text-slate-500">{d.blurb}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => {
                    const on = sel === s.name
                    return (
                      <button key={s.name} onClick={() => setSel(s.name)} aria-pressed={on} className="rounded-full border px-3 py-1.5 font-mono text-xs transition hover:text-white" style={{ borderColor: on ? d.color : `${d.color}40`, background: on ? `${d.color}26` : 'transparent', color: on ? '#fff' : '#cbd5e1', boxShadow: on ? `0 0 18px -4px ${d.color}` : undefined }}>
                        {s.name}
                      </button>
                    )
                  })}
                </div>
                {here && <div className="mt-4 h-px" style={{ background: `linear-gradient(90deg, ${d.color}, transparent)` }} />}
              </Panel>
            )
          })}
        </div>
      </div>

      <Panel tag={skill.domain} title={skill.name} className="h-fit lg:sticky lg:top-24">
        <p className="text-sm leading-relaxed text-slate-300">{skill.note}</p>
        <div className="mt-5">
          <p className="mono-label mb-2" style={{ color: domain.color }}>Applied in</p>
          {exp.length + proj.length === 0 && <p className="text-sm text-slate-500">Working knowledge across projects and tooling.</p>}
          <ul className="space-y-2">
            {exp.map((e) => <li key={e.id}><button onClick={() => go('log', e.id)} className="w-full rounded-lg border border-cyan-300/15 p-3 text-left transition hover:border-cyan-300/50"><span className="block font-mono text-[10px] uppercase text-slate-500">Experience</span><span className="text-sm text-white">{e.org}</span></button></li>)}
            {proj.map((p) => <li key={p.id}><button onClick={() => go('research', p.id)} className="w-full rounded-lg border border-violet-300/20 p-3 text-left transition hover:border-violet-300/60"><span className="block font-mono text-[10px] uppercase text-slate-500">Project</span><span className="text-sm text-white">{p.title}</span></button></li>)}
          </ul>
        </div>
      </Panel>
    </div>
  )
}
