import { useMemo, useState } from 'react'

type T = 'PERSON' | 'ORG' | 'LOC' | 'DATE' | 'DRUG' | 'DOSE'
const COLORS: Record<T, string> = { PERSON: 'bg-cyan-300/20 text-cyan-100 border-cyan-300/50', ORG: 'bg-violet-300/20 text-violet-100 border-violet-300/50', LOC: 'bg-emerald-300/20 text-emerald-100 border-emerald-300/50', DATE: 'bg-amber-300/20 text-amber-100 border-amber-300/50', DRUG: 'bg-rose-300/20 text-rose-100 border-rose-300/50', DOSE: 'bg-pink-300/20 text-pink-100 border-pink-300/50' }
const DEFAULT = 'Dr. Priya Raman at Shands Hospital in Gainesville, Florida reviewed Maria Delgado on March 2, 2026. Started Sertraline 50 mg daily; follow-up with UF Health is scheduled for 04/15/2026 in Jacksonville.'

const RULES: { t: T; re: RegExp }[] = [
  { t: 'DOSE', re: /\b\d+(?:\.\d+)?\s?(?:mg|mcg|ml|g)\b/gi },
  { t: 'DATE', re: /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}, \d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{4}\b/g },
  { t: 'DRUG', re: /\b(?:Sertraline|Metformin|Lisinopril|Atorvastatin|Amoxicillin|Warfarin|Insulin|Aspirin)\b/gi },
  { t: 'ORG', re: /\b(?:[A-Z][a-z]+ )*(?:Hospital|Clinic|Health|University|Medical Center)\b/g },
  { t: 'PERSON', re: /\b(?:Dr\. |Patient )?[A-Z][a-z]+ [A-Z][a-z]+(?= (?:at|reviewed|was|is|has)\b|\.|,|$)/g },
  { t: 'LOC', re: /\b(?:Gainesville|Jacksonville|Florida|Nevada|Sparks|Chennai|Boca Raton|Miami|Orlando)\b/g },
]
const conf = (s: string) => 0.9 + ((s.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 95) / 1000)

interface Span { s: number; e: number; t: T }
export default function NerDemo() {
  const [text, setText] = useState(DEFAULT)
  const [on, setOn] = useState<Record<T, boolean>>({ PERSON: true, ORG: true, LOC: true, DATE: true, DRUG: true, DOSE: true })

  const spans = useMemo(() => {
    const taken: Span[] = []
    RULES.forEach(({ t, re }) => {
      for (const m of text.matchAll(re)) {
        const s = m.index!, e = s + m[0].length
        if (!taken.some((x) => s < x.e && e > x.s)) taken.push({ s, e, t })
      }
    })
    return taken.sort((a, b) => a.s - b.s)
  }, [text])

  const parts: { text: string; span?: Span }[] = []
  let cur = 0
  spans.forEach((sp) => { if (sp.s > cur) parts.push({ text: text.slice(cur, sp.s) }); parts.push({ text: text.slice(sp.s, sp.e), span: sp }); cur = sp.e })
  if (cur < text.length) parts.push({ text: text.slice(cur) })
  const counts = (Object.keys(COLORS) as T[]).map((t) => [t, spans.filter((s) => s.t === t).length] as const)

  return (
    <div className="space-y-4">
      <div>
        <p className="mono-label mb-2">1 · Paste clinical text</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} aria-label="Text to tag" className="w-full resize-none rounded-lg border border-cyan-300/20 bg-ink-950/80 p-3 text-sm text-slate-200 outline-none focus:border-cyan-300/60" />
      </div>
      <div>
        <p className="mono-label mb-2">2 · Entities (toggle types)</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {counts.map(([t, n]) => <button key={t} onClick={() => setOn((o) => ({ ...o, [t]: !o[t] }))} aria-pressed={on[t]} className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition ${on[t] ? COLORS[t] : 'border-cyan-300/10 text-slate-600'}`}>{t} · {n}</button>)}
        </div>
        <p className="rounded-lg border border-cyan-300/15 bg-ink-900/60 p-4 text-[15px] leading-9 text-slate-300">
          {parts.map((p, i) => p.span && on[p.span.t]
            ? <mark key={i} title={`${p.span.t} · confidence ${conf(p.text).toFixed(3)}`} className={`mx-0.5 rounded-md border px-1.5 py-0.5 ${COLORS[p.span.t]}`}>{p.text}<sub className="ml-1 font-mono text-[9px] opacity-80">{p.span.t}</sub></mark>
            : <span key={i}>{p.text}</span>)}
        </p>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">Rule-based illustration of entity extraction output (entities, confidence scores, offsets). The real platform fine-tunes RoBERTa (0.916 strict entity F1 on 3,453 CoNLL-2003 test samples) and batches up to 32 documents per request across PySpark workers.</p>
    </div>
  )
}
