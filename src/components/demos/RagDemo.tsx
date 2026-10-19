import { Check, Loader2, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Chunk { id: number; section: string; text: string; kw: number; vec: number; gold?: boolean }
interface Q { q: string; summary: string; chunks: Chunk[] }

const NAME = 'Maria Delgado'
const base: Chunk[] = [
  { id: 1, section: 'Behavioral Health Assessment', text: `Patient ${NAME} (DOB 04/12/1968, Medicaid ID 884-22-7391) completed a PHQ-9 screening on 2026-03-02 with a score of 14, indicating moderate depression. Outpatient counseling referral recommended.`, kw: 0, vec: 0 },
  { id: 2, section: 'Medication List', text: `Sertraline 50 mg daily started 2026-01-15. No adverse reactions reported by ${NAME}.`, kw: 0, vec: 0 },
  { id: 3, section: 'Billing Summary', text: 'Claim 55-1129 submitted under CPT 96127 (brief emotional/behavioral assessment) for member ID 884-22-7391; status: paid.', kw: 0, vec: 0 },
  { id: 4, section: 'Care Coordination', text: 'Case manager call on 2026-02-20 about transportation to appointments. No clinical changes noted for the member.', kw: 0, vec: 0 },
]
const mk = (gold: number, s: [number, number][]): Chunk[] => base.map((c, i) => ({ ...c, kw: s[i][0], vec: s[i][1], gold: c.id === gold }))

const QUERIES: Q[] = [
  { q: 'How has the member’s mood been lately?', summary: `[NAME] screened positive for moderate depression (PHQ-9 = 14) on 2026-03-02; outpatient counseling was recommended [1]. Sertraline 50 mg has been active since 2026-01-15 [2].`, chunks: mk(1, [[0.12, 0.88], [0.1, 0.55], [0.55, 0.22], [0.48, 0.3]]) },
  { q: 'Claim status for CPT 96127', summary: 'Claim 55-1129 was submitted under CPT 96127 (brief emotional/behavioral assessment) and its status is paid [1].', chunks: mk(3, [[0.2, 0.74], [0.05, 0.3], [0.95, 0.41], [0.1, 0.2]]) },
  { q: 'Current medications and any adverse reactions?', summary: 'Sertraline 50 mg daily since 2026-01-15; no adverse reactions reported [1].', chunks: mk(2, [[0.2, 0.5], [0.8, 0.85], [0.1, 0.2], [0.1, 0.15]]) },
]
type Mode = 'hybrid' | 'keyword' | 'vector'
const STAGES = ['Chunk forms into clinical sections', 'Retrieve evidence', 'Guardrails: PHI + medical-term check', 'Generate grounded summary', 'Physician-rubric evaluation']

const maskText = (t: string) => t.split(NAME).join('[NAME]').replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, '[DOB]').replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ID]')
const phiCount = (t: string) => (t.match(new RegExp(`${NAME}|\\b\\d{2}/\\d{2}/\\d{4}\\b|\\b\\d{3}-\\d{2}-\\d{4}\\b`, 'g')) ?? []).length

export default function RagDemo() {
  const [qi, setQi] = useState(0)
  const [mode, setMode] = useState<Mode>('hybrid')
  const [mask, setMask] = useState(true)
  const [stage, setStage] = useState(0)
  const timer = useRef<number>(0)

  const run = (i = qi) => {
    window.clearInterval(timer.current)
    setQi(i); setStage(0)
    let s = 0
    timer.current = window.setInterval(() => { s++; setStage(s); if (s >= STAGES.length) window.clearInterval(timer.current) }, 520)
  }
  useEffect(() => { run(0); return () => window.clearInterval(timer.current) }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const Q = QUERIES[qi]
  const score = (c: Chunk) => (mode === 'keyword' ? c.kw : mode === 'vector' ? c.vec : (c.kw + c.vec) / 2)
  const ranked = [...Q.chunks].sort((a, b) => score(b) - score(a))
  const goldRank = ranked.findIndex((c) => c.gold) + 1
  const shown = (t: string) => (mask ? maskText(t) : t)
  const summary = Q.summary.replace('[NAME]', mask ? '[NAME]' : NAME)
  const exposed = ranked.slice(0, 3).reduce((n, c) => n + phiCount(mask ? maskText(c.text) : c.text), 0) + phiCount(summary)
  const ready = stage >= 2

  return (
    <div className="space-y-5">
      <div>
        <p className="mono-label mb-2">1 · Ask a question about a (synthetic) patient chart</p>
        <div className="flex flex-wrap gap-2">
          {QUERIES.map((x, i) => (
            <button key={x.q} onClick={() => run(i)} className={`rounded-lg border px-3 py-2 text-left text-sm transition ${i === qi && stage > 0 ? 'border-cyan-300/60 bg-cyan-300/10 text-white' : 'border-cyan-300/15 text-slate-300 hover:border-cyan-300/40'}`}>{x.q}</button>
          ))}
        </div>
      </div>

      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {STAGES.map((s, i) => {
          const done = stage > i, cur = stage === i && stage < STAGES.length
          return (
            <li key={s} className={`rounded-lg border p-3 text-xs leading-snug transition ${done ? 'border-emerald-400/30 bg-emerald-400/5 text-slate-200' : cur ? 'border-cyan-300/50 bg-cyan-300/10 text-white' : 'border-cyan-300/10 text-slate-500'}`}>
              <span className="mb-1 flex items-center gap-1.5 font-mono text-[10px]">{done ? <Check size={12} className="text-emerald-300" /> : cur ? <Loader2 size={12} className="animate-spin text-cyan-300" /> : <span className="h-3 w-3" />}0{i + 1}</span>{s}
            </li>
          )
        })}
      </ol>

      {ready ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="mono-label">2 · Retrieval</p>
              <div role="group" aria-label="Retrieval mode" className="flex gap-1">
                {(['keyword', 'vector', 'hybrid'] as Mode[]).map((m) => <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`rounded-md border px-2.5 py-1 font-mono text-[11px] ${mode === m ? 'border-cyan-300/60 bg-cyan-300/15 text-white' : 'border-cyan-300/15 text-slate-400'}`}>{m === 'vector' ? 'FAISS' : m}</button>)}
              </div>
            </div>
            <ul className="space-y-2">
              {ranked.map((c, i) => (
                <li key={c.id} className={`rounded-lg border p-3 transition ${c.gold ? 'border-violet-300/40 bg-violet-300/5' : 'border-cyan-300/10 bg-ink-900/50'}`}>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-cyan-300">#{i + 1} · {c.section}{c.gold && <span className="ml-2 text-violet-300">gold evidence</span>}</span>
                    <span className="text-slate-400">{score(c).toFixed(2)}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink-700"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-500" style={{ width: `${score(c) * 100}%` }} /></div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{shown(c.text)}</p>
                </li>
              ))}
            </ul>
            <p className={`mt-3 flex items-center gap-2 font-mono text-xs ${goldRank === 1 ? 'text-emerald-300' : 'text-amber-300'}`}>
              {goldRank === 1 ? <Check size={14} /> : <X size={14} />} Gold evidence ranked #{goldRank} with {mode === 'vector' ? 'FAISS vector' : mode} search
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="mono-label">3 · Grounded summary</p>
              <button onClick={() => setMask((m) => !m)} aria-pressed={mask} className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] ${mask ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/50 bg-rose-400/10 text-rose-200'}`}><ShieldCheck size={13} />PHI mask {mask ? 'ON' : 'OFF'}</button>
            </div>
            <div className="rounded-lg border border-cyan-300/15 bg-ink-900/60 p-4">
              <p className="text-[15px] leading-relaxed text-slate-100">{stage >= 4 ? summary : <span className="text-slate-500">Generating…</span>}</p>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
                <span className={`rounded-md border px-2 py-1 ${exposed === 0 ? 'border-emerald-400/40 text-emerald-300' : 'border-rose-400/40 text-rose-300'}`}>PHI entities exposed: {exposed}</span>
                {stage >= 5 && <><span className="rounded-md border border-emerald-400/40 px-2 py-1 text-emerald-300">every claim cites a chunk</span><span className="rounded-md border border-cyan-300/30 px-2 py-1 text-cyan-200">rubric: faithful ✓</span></>}
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">Scripted illustration on a synthetic chart. The production system at CDF reached 88% retrieval accuracy, 93% physician-graded reliability, and halved unsupported claims.</p>
          </div>
        </div>
      ) : null}

    </div>
  )
}
