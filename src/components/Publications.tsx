import { Award, ArrowUpRight } from 'lucide-react'
import { charts } from '../data/charts'
import { papers } from '../data/papers'
import BarChart from './BarChart'

const links: Record<string, string> = {
  'fetal-health': 'https://pubs.aip.org/aip/acp/article-abstract/3175/1/020058/3339024/AI-in-healthcare-Predicting-the-fetus-health-using?redirectedFrom=PDF',
  'exercise-form': 'https://link.springer.com/chapter/10.1007/978-981-97-0892-5_50',
}

/** The two peer-reviewed papers, with their real result tables. */
export default function Publications() {
  return (
    <div className="mt-24">
      <p className="tag rv mb-3">Published research</p>
      <h3 className="rv mb-8 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Two papers, <em className="serif-accent">both Best Paper.</em></h3>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {papers.map((p, i) => (
          <article key={p.id} className="card-l rv flex flex-col p-6 sm:p-7" style={{ ['--i' as string]: i }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white"><Award size={12} />{p.award}</span>
              {p.indexing.slice(0, 3).map((x) => <span key={x} className="rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] text-mute shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">{x}</span>)}
            </div>
            <h4 className="mt-4 text-xl font-semibold leading-snug tracking-tight">{p.title}</h4>
            <p className="mt-1.5 text-xs text-mute">{p.publisher} · {p.venue.split(',')[0]}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink2">{p.summary}</p>
            <div className="mt-5 rounded-xl bg-paper p-4 shadow-[inset_0_0_0_1px_rgba(13,13,13,.06)]"><BarChart data={charts[p.id]} tone="light" /></div>
            <a href={links[p.id]} target="_blank" rel="noopener noreferrer" className="pill pill-solid mt-5 w-fit">Read the paper <ArrowUpRight size={15} /></a>
          </article>
        ))}
      </div>
    </div>
  )
}
