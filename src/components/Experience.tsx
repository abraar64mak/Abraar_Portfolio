import { useState } from 'react'
import { experience } from '../data/experience'
import { useScrollProgress } from '../lib/hooks'
import SectionHead from './SectionHead'

const ORDER = ['anna', 'plumb5', 'uf', 'aventusoft', 'cdf']
const items = ORDER.map((id) => experience.find((e) => e.id === id)!)
const when = (p: string) => p.replace(/ – /g, ' → ')
const label = (e: { period: string; kind: string }) => [when(e.period), e.kind === 'academic' ? 'Education' : 'Experience'].filter(Boolean).join(' · ')

export default function Experience() {
  const [ref, p] = useScrollProgress<HTMLDivElement>()
  const [open, setOpen] = useState<string | null>('cdf')
  const n = items.length + 1 // + the closing card
  return (
    <section id="experience" className="section">
      <div className="wrap">
        <SectionHead tag="05 — Experience" title="Education &" accent="experience." className="mb-14" />
        <div ref={ref} className="relative mx-auto max-w-4xl">
          <div aria-hidden className="absolute bottom-0 left-[11px] top-2 w-px bg-line md:left-[15px]" />
          <div aria-hidden className="absolute left-[11px] top-2 w-px origin-top bg-ink md:left-[15px]" style={{ height: 'calc(100% - 8px)', transform: `scaleY(${p})` }} />
          <ol className="space-y-12">
            {items.map((e, i) => {
              const lit = p >= (i + 0.35) / n
              const isOpen = open === e.id
              return (
                <li key={e.id} className="rv relative pl-12 md:pl-16">
                  <span aria-hidden className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 transition-all duration-500 md:h-8 md:w-8 ${lit ? 'scale-100 border-ink bg-ink' : 'border-line bg-paper'}`} />
                  <p className="font-mono text-xs text-mute">{label(e)}</p>
                  <h3 className={`mt-1 text-2xl font-bold tracking-tight transition-colors duration-500 sm:text-3xl ${lit ? 'text-ink' : 'text-faint'}`}>{e.role}</h3>
                  <p className="mt-0.5 text-ink2">{e.org} <span className="text-mute">· {e.location}</span></p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink2">{e.summary}</p>
                  <ul className={`mt-4 max-w-2xl space-y-2 overflow-hidden text-[14px] text-ink2 transition-all duration-700 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={!isOpen}>
                    {e.highlights.map((h) => <li key={h} className="flex gap-2.5"><span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink" />{h}</li>)}
                  </ul>
                  <button onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen} className="mt-3 text-[13px] font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{isOpen ? 'Show less' : 'Show details'}</button>
                </li>
              )
            })}
            <li className="rv relative pl-12 md:pl-16">
              <span aria-hidden className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-dashed transition-colors duration-500 md:h-8 md:w-8 ${p > 0.95 ? 'border-ink' : 'border-line'}`} />
              <a href="#contact" className="block rounded-[26px] border border-dashed border-ink/30 p-6 transition hover:bg-white">
                <p className="tag">Next</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">Your team? <em className="serif-accent">Let’s talk →</em></p>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
