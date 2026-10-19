import { ArrowUpRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { projects } from '../data/projects'
import SectionHead from './SectionHead'
import TechLogo, { isBrand } from './TechLogo'
import { AgentVisual, BeatNetVisual, DocVisual, MaliciousVisual, SandboxPipelineVisual, SandboxVisual, SecureRagVisual } from './work/visuals'
import Publications from './Publications'

const visual = (id: string) => {
  switch (id) {
    case 'secureai-rag': return <SecureRagVisual />
    case 'distributed-code-judge': return <SandboxVisual />
    case 'secure-sandbox': return <SandboxPipelineVisual />
    case 'mcp-data-assistant': return <AgentVisual />
    case 'beatnet': return <BeatNetVisual />
    case 'document-intelligence': return <DocVisual />
    case 'malicious-code': return <MaliciousVisual />
    default: return null
  }
}

export default function Work() {
  const [open, setOpen] = useState(0)

  // other sections (skills inspector) can ask us to open a project
  useEffect(() => {
    const h = (e: Event) => { const i = projects.findIndex((p) => p.id === (e as CustomEvent<string>).detail); if (i >= 0) setOpen(i) }
    window.addEventListener('open-project', h)
    return () => window.removeEventListener('open-project', h)
  }, [])

  const hoverable = () => window.matchMedia('(hover: hover) and (min-width: 1024px)').matches

  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead tag="03 — Selected work" title="Things I’ve" accent="built." className="mb-12" />
        <div className="flex flex-col gap-3 lg:h-[min(84svh,700px)] lg:flex-row">
          {projects.map((p, i) => {
            const on = open === i
            return (
              <article
                key={p.id}
                onMouseEnter={() => hoverable() && setOpen(i)}
                className={`rv relative overflow-hidden rounded-[26px] bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)] transition-[flex-grow,box-shadow] duration-700 lg:min-w-0 ${on ? 'lg:flex-[11] shadow-[inset_0_0_0_1px_rgba(13,13,13,.1),0_30px_70px_-30px_rgba(0,0,0,.25)]' : 'lg:flex-1'}`}
                style={{ transitionTimingFunction: 'var(--ease)', ['--i' as string]: i }}
              >
                {/* spine / header */}
                <button onClick={() => setOpen(i)} onFocus={() => setOpen(i)} aria-expanded={on} aria-controls={`panel-${p.id}`} className={`group flex w-full items-center justify-between gap-4 p-5 text-left lg:absolute lg:inset-0 lg:z-10 lg:flex-col lg:items-center lg:justify-between lg:py-6 ${on ? 'lg:pointer-events-none lg:opacity-0' : ''} transition-opacity duration-300`}>
                  <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  <span className="flex-1 text-lg font-semibold tracking-tight lg:flex-none lg:[writing-mode:vertical-rl] lg:rotate-180">{p.title}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(13,13,13,.2)] transition-transform duration-500 group-hover:rotate-90"><Plus size={16} /></span>
                </button>

                <div id={`panel-${p.id}`} className={`grid gap-6 p-5 pt-0 transition-opacity duration-500 lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:p-7 ${on ? 'max-h-[2000px] opacity-100 delay-200' : 'max-h-0 overflow-hidden opacity-0 lg:max-h-none lg:pointer-events-none'}`} aria-hidden={!on}>
                  <div className="flex min-w-0 flex-col">
                    <p className="tag">0{i + 1} — {p.category}</p>
                    <h3 className="mt-2 text-3xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-4xl">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-mute">{p.subtitle}</p>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink2">{p.blurb}</p>
                    <ul className="mt-4 grid gap-x-5 gap-y-2 text-[13px] text-ink2 sm:grid-cols-2">
                      {p.highlights.slice(0, 3).map((h) => <li key={h} className="flex gap-2"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink" /><span>{h}</span></li>)}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                      {p.tags.slice(0, 6).map((t) => <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 font-mono text-[11px] shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">{isBrand(t) && <TechLogo name={t} size={12} />}{t}</span>)}
                    </div>
                    {p.links[0] && (
                      <a href={p.links[0].href} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1} className="pill pill-solid mt-5 w-fit">{p.links[0].kind === 'github' ? 'View on GitHub' : p.links[0].label} <ArrowUpRight size={15} /></a>
                    )}
                  </div>
                  <div className={`min-w-0 transition-[clip-path] duration-1000 ${on ? '[clip-path:inset(0_0_0_0_round_18px)]' : '[clip-path:inset(0_100%_0_0_round_18px)]'}`} style={{ transitionTimingFunction: 'var(--ease)', transitionDelay: on ? '250ms' : '0ms' }}>
                    {on && visual(p.id)}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <Publications />
      </div>
    </section>
  )
}
