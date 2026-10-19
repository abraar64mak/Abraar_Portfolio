import { useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotionSafe'
import Panel from './Panel'

type K = 'data' | 'model' | 'guard'
interface N { id: string; label: string; x: number; y: number; k: K; desc: string }
const nodes: N[] = [
  { id: 'forms', label: 'Source documents', x: 70, y: 110, k: 'data', desc: '50K+ assessment forms enter the pipeline.' },
  { id: 'chunk', label: 'Section chunker', x: 215, y: 110, k: 'data', desc: 'Long forms are split into sections that fit the context window (−2.4 s latency).' },
  { id: 'bm25', label: 'Keyword search', x: 365, y: 45, k: 'model', desc: 'Lexical retrieval catches exact terms, identifiers and codes.' },
  { id: 'faiss', label: 'FAISS vectors', x: 365, y: 175, k: 'model', desc: 'Dense retrieval catches paraphrases. Fused with keyword search: accuracy 72% → 88%.' },
  { id: 'guard', label: 'Guardrails', x: 520, y: 110, k: 'guard', desc: 'Masks personal data and verifies domain terms. Protects 60K+ lookups from leakage.' },
  { id: 'llm', label: 'LLM summarizer', x: 665, y: 110, k: 'model', desc: 'Writes a summary grounded only in retrieved sections.' },
  { id: 'eval', label: 'Expert eval', x: 805, y: 110, k: 'guard', desc: 'Expert-graded pipeline: 93% reliability, unsupported claims halved.' },
]
const edges: [string, string][] = [['forms', 'chunk'], ['chunk', 'bm25'], ['chunk', 'faiss'], ['bm25', 'guard'], ['faiss', 'guard'], ['guard', 'llm'], ['llm', 'eval']]
const col: Record<K, string> = { data: '#22d3ee', model: '#a78bfa', guard: '#fbbf24' }
const get = (id: string) => nodes.find((n) => n.id === id)!

export default function SystemGraph() {
  const [sel, setSel] = useState('faiss')
  const reduced = usePrefersReducedMotion()
  const n = get(sel)
  return (
    <Panel tag="Module 02 · Production system" title="Production RAG pipeline · live data flow" right={<span className="hidden font-mono text-[11px] text-slate-500 sm:block">tap a node</span>}>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 880 220" className="min-w-[640px] w-full" role="img" aria-label="Production RAG pipeline diagram">
          {edges.map(([a, b], i) => {
            const A = get(a), B = get(b)
            const d = `M${A.x + 52} ${A.y} C ${(A.x + B.x) / 2 + 20} ${A.y}, ${(A.x + B.x) / 2 - 20} ${B.y}, ${B.x - 52} ${B.y}`
            return (
              <g key={i}>
                <path id={`e${i}`} d={d} fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" strokeDasharray="4 5" />
                {!reduced && [0, 1].map((j) => (
                  <circle key={j} r="3.2" fill="#67e8f9"><animateMotion dur="2.6s" begin={`${j * 1.3 + i * 0.2}s`} repeatCount="indefinite"><mpath href={`#e${i}`} /></animateMotion></circle>
                ))}
              </g>
            )
          })}
          {nodes.map((nd) => {
            const on = nd.id === sel
            return (
              <g key={nd.id} transform={`translate(${nd.x - 52} ${nd.y - 24})`} onClick={() => setSel(nd.id)} onMouseEnter={() => setSel(nd.id)} className="cursor-pointer" role="button" tabIndex={0} aria-label={nd.label} onKeyDown={(e) => e.key === 'Enter' && setSel(nd.id)}>
                <rect width="104" height="48" rx="10" fill="#0c1424" stroke={col[nd.k]} strokeOpacity={on ? 1 : 0.4} strokeWidth={on ? 2 : 1.2} style={{ filter: on ? `drop-shadow(0 0 10px ${col[nd.k]})` : undefined }} />
                <circle cx="12" cy="12" r="3" fill={col[nd.k]} />
                <text x="52" y="29" textAnchor="middle" fontSize="11" fontWeight="600" fill={on ? '#fff' : '#cbd5e1'} fontFamily="Inter, sans-serif">{nd.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="mt-2 flex items-start gap-3 rounded-lg border border-cyan-300/10 bg-ink-900/60 p-3" aria-live="polite">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: col[n.k], boxShadow: `0 0 10px ${col[n.k]}` }} />
        <p className="text-sm text-slate-300"><span className="font-semibold text-white">{n.label}.</span> {n.desc}</p>
      </div>
      <div className="mt-3 flex gap-4 font-mono text-[11px] text-slate-500">
        {([['data', 'data'], ['model', 'AI model'], ['guard', 'safety / eval']] as [K, string][]).map(([k, l]) => <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: col[k] }} />{l}</span>)}
      </div>
    </Panel>
  )
}
