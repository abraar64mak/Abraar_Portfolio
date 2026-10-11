import { Award, BookOpen, ExternalLink } from 'lucide-react'
import BarChart from '../components/BarChart'
import Panel from '../components/Panel'
import { charts } from '../data/charts'
import { papers } from '../data/papers'
import type { View } from '../hooks/useRoute'

export default function Papers({ id, go }: { id?: string; go: (v: View, id?: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[['2×', 'Best Paper Awards'], ['2', 'Peer-reviewed papers'], ['AIP · Springer', 'Publishers']].map(([v, l]) => (
          <div key={l} className="panel flex items-center gap-3 p-4"><Award className="text-amber-300" size={22} /><div><div className="font-mono text-xl font-semibold text-white">{v}</div><div className="text-xs text-slate-500">{l}</div></div></div>
        ))}
      </div>
      {papers.map((p) => (
        <Panel key={p.id} tag={p.publisher} title={p.title} className={id === p.id ? 'ring-1 ring-cyan-300/50' : ''} bodyClass="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-200"><Award size={12} />{p.award}</span>
            {p.indexing.map((x) => <span key={x} className="chip">{x}</span>)}
          </div>
          <p className="mt-4 text-sm text-slate-400">{p.venue}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{p.summary}</p>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="mono-label mb-2">Authors</p>
              <p className="text-sm text-slate-300">{p.authors.map((a, i) => <span key={a}>{a.includes('Abraar') ? <b className="text-cyan-200">{a}</b> : a}{i < p.authors.length - 1 ? ', ' : ''}</span>)}</p>
              <p className="mt-1 text-xs text-slate-500">{p.affiliation}</p>
              <p className="mono-label mb-2 mt-4">Keywords</p>
              <div className="flex flex-wrap gap-1.5">{p.keywords.map((k) => <span key={k} className="chip">{k}</span>)}</div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => go('research', p.projectId)} className="btn btn-ghost"><BookOpen size={15} />Architecture & results</button>
                <a className="btn btn-ghost" href={p.id === 'exercise-form' ? 'https://www.springer.com/series/15179' : 'https://pubs.aip.org/aip/acp'} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Publisher</a>
              </div>
            </div>
            <div className="rounded-xl border border-cyan-300/10 bg-ink-900/50 p-4"><BarChart data={charts[p.id]} /></div>
          </div>
        </Panel>
      ))}
    </div>
  )
}
