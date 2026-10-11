import { useMemo, useState } from 'react'
import { experience } from '../data/experience'
import { projects } from '../data/projects'
import { FAMILIES, skills } from '../data/skills'
import { scrollToTarget } from '../lib/scroll'
import SectionHead from './SectionHead'
import TechLogo from './TechLogo'

const COLS = 8

export default function Skills() {
  const [family, setFamily] = useState<string>('All')
  const [active, setActive] = useState(skills[0].name)
  const cur = skills.find((s) => s.name === active)!

  const usedIn = useMemo(() => {
    const m = (tags: string[]) => tags.some((t) => t.toLowerCase() === active.toLowerCase())
    return [
      ...projects.filter((p) => m(p.tags)).map((p) => ({ kind: 'Project', id: p.id, name: p.title })),
      ...experience.filter((e) => m(e.tags)).map((e) => ({ kind: 'Experience', id: e.id, name: e.org })),
    ]
  }, [active])

  const openProject = (id: string) => { window.dispatchEvent(new CustomEvent('open-project', { detail: id })); scrollToTarget('work') }

  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHead tag="02 — Skills" title="The periodic table" accent="of my stack." className="mb-10" />
        <div className="rv mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by family">
          {['All', ...FAMILIES].map((f) => (
            <button key={f} onClick={() => setFamily(f)} aria-pressed={family === f} className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${family === f ? 'bg-ink text-white' : 'shadow-[inset_0_0_0_1px_rgba(13,13,13,.14)] hover:bg-white'}`}>{f}</button>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ul className="grid grid-cols-4 gap-2.5 sm:gap-3 md:grid-cols-8">
            {skills.map((s, i) => {
              const dim = family !== 'All' && s.family !== family
              const on = s.name === active
              return (
                <li key={s.name} className="rv" style={{ ['--i' as string]: ((Math.floor(i / COLS) + (i % COLS)) * 0.5) as number }}>
                  <button
                    onMouseEnter={() => setActive(s.name)} onFocus={() => setActive(s.name)} onClick={() => setActive(s.name)}
                    aria-pressed={on} aria-label={`${s.name}, ${s.family}`}
                    className={`group relative flex aspect-[4/5] w-full flex-col justify-between rounded-2xl p-2.5 text-left transition-all duration-500 ${on ? 'bg-ink text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,.5)] md:-translate-y-1' : 'bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)] hover:shadow-[inset_0_0_0_1px_rgba(13,13,13,.4)]'} ${dim ? 'opacity-25' : ''}`}
                    style={{ transitionTimingFunction: 'var(--ease)' }}
                  >
                    <span className={`font-mono text-[9px] ${on ? 'text-white/60' : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-center text-[clamp(1.2rem,2.6vw,1.9rem)] font-bold leading-none tracking-tighter">{s.symbol}</span>
                    <span className={`line-clamp-2 text-[9px] leading-tight sm:text-[10px] ${on ? 'text-white/80' : 'text-mute'}`}>{s.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <aside aria-live="polite" className="card-l rv p-6 lg:sticky lg:top-24">
            <p className="tag">{cur.family}</p>
            <div className="my-5 flex h-[150px] items-center justify-center"><div key={cur.name} className="animate-[pop_.5s_var(--ease)]"><TechLogo name={cur.name} size={110} glow /></div></div>
            <h3 className="text-2xl font-bold tracking-tight">{cur.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">{cur.note}</p>
            <div className="mt-5 border-t border-line pt-4">
              <p className="tag mb-2.5">Used in</p>
              {usedIn.length === 0 ? <p className="text-sm text-mute">Working knowledge across projects and tooling.</p> : (
                <ul className="space-y-1.5">
                  {usedIn.map((u) => (
                    <li key={u.kind + u.id}>
                      <button onClick={() => (u.kind === 'Project' ? openProject(u.id) : scrollToTarget('experience'))} className="flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-soft">
                        <span className="font-medium">{u.name}</span><span className="font-mono text-[10px] uppercase text-faint">{u.kind}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
