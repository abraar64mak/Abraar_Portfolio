import { useMemo, useState } from 'react'

type T = 'PERSON' | 'ORG' | 'LOC' | 'DATE' | 'MONEY'
const COLORS: Record<T, string> = { PERSON: 'bg-cyan-300/20 text-cyan-100 border-cyan-300/50', ORG: 'bg-violet-300/20 text-violet-100 border-violet-300/50', LOC: 'bg-emerald-300/20 text-emerald-100 border-emerald-300/50', DATE: 'bg-amber-300/20 text-amber-100 border-amber-300/50', MONEY: 'bg-pink-300/20 text-pink-100 border-pink-300/50' }
const DEFAULT = 'Priya Raman joined Acme Labs in Austin, Texas on March 2, 2026. The team raised $4.5 million and plans to open a Chicago office by 04/15/2026.'

const RULES: { t: T; re: RegExp }[] = [
  { t: 'MONEY', re: /\$\d[\d,]*(?:\.\d+)?(?:\s?(?:million|billion|thousand|[KMB]))?/gi },
  { t: 'DATE', re: /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}, \d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{4}\b/g },
  { t: 'ORG', re: /\b(?:[A-Z][a-z]+ )*(?:Labs|Inc|Corp|University|Systems|Technologies)\b/g },
  { t: 'PERSON', re: /\b(?:Dr\. )?[A-Z][a-z]+ [A-Z][a-z]+(?= (?:at|joined|reviewed|works|worked|left|moved|said|was|is|has|and)\b|\.|,|$)/g },
  { t: 'LOC', re: /\b(?:Austin|Texas|Chicago|Boston|Seattle|Denver|Gainesville|Florida|Chennai|Bengaluru)\b/g },
]
const conf = (s: string) => 0.9 + ((s.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 95) / 1000)

interface Span { s: number; e: number; t: T }
export default function NerDemo() {
  const [text, setText] = useState(DEFAULT)
  const [on, setOn] = useState<Record<T, boolean>>({ PERSON: true, ORG: true, LOC: true, DATE: true, MONEY: true })

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
        <p className="mono-label mb-2">1 · Paste any text</p>
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
