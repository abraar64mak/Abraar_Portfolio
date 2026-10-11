import BarChart from '../BarChart'
import { charts } from '../../data/charts'

const Frame = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative h-full w-full overflow-hidden rounded-2xl bg-paper p-4 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)] sm:p-5">
    <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-mute shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">{label}</span>
    {children}
  </div>
)

/** BeatNet: ECG with detected landmarks (illustrative) */
export function BeatNetVisual() {
  const pts: [number, number, string][] = [[70, 118, 'P'], [128, 150, 'Q'], [140, 28, 'R'], [152, 168, 'S'], [215, 108, 'T'], [296, 118, 'P'], [354, 150, 'Q'], [366, 28, 'R'], [378, 168, 'S'], [441, 108, 'T']]
  return (
    <Frame label="Illustrative UI">
      <p className="tag mb-3">BeatNet · lead I</p>
      <svg viewBox="0 0 520 200" className="w-full" role="img" aria-label="ECG trace with labelled P, Q, R, S and T landmarks">
        <path d="M0 130H50Q70 108 90 130H120L130 142L140 28L152 178L162 130H190Q215 96 240 130H276Q296 108 316 130H346L356 142L366 28L378 178L388 130H416Q441 96 466 130H520" fill="none" stroke="#0d0d0d" strokeWidth="2" strokeLinejoin="round" />
        {pts.map(([x, y, l], i) => <g key={i}><circle cx={x} cy={y} r={l === 'R' ? 4.5 : 3.2} fill={l === 'R' ? '#0d0d0d' : '#77756f'} /><text x={x} y={y + (y > 130 ? 16 : -9)} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono Variable, monospace" fill="#3a3a3a">{l}</text></g>)}
        <path d="M140 14H366" stroke="#0d0d0d" strokeWidth="1" /><path d="M140 9v10M366 9v10" stroke="#0d0d0d" />
        <text x="253" y="10" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono Variable, monospace">RR 823 ms</text>
      </svg>
      <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px]">
        <span className="rounded-full bg-ink px-3 py-1 text-white">Normal sinus rhythm · 95%</span><span className="rounded-full bg-white px-3 py-1 text-mute shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)]">1D U-Net → Transformer</span>
      </div>
    </Frame>
  )
}

/** Multi-agent assistant: firewall decisions (illustrative) */
export function AgentVisual() {
  const rows: [string, boolean][] = [['SELECT visit_date FROM visits LIMIT 5', true], ['DROP TABLE patients_summary', false], ["… WHERE id=1 OR 1=1; DELETE FROM claims", false], ['SELECT user FROM audit_log', false]]
  return (
    <Frame label="Illustrative UI">
      <p className="tag mb-3">LangGraph agents · sqlglot AST firewall</p>
      <ul className="space-y-2">
        {rows.map(([q, ok]) => (
          <li key={q} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">
            <code className="min-w-0 truncate font-mono text-[11px]">{q}</code>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] ${ok ? 'bg-ink text-white' : 'text-ink shadow-[inset_0_0_0_1px_rgba(13,13,13,.5)]'}`}>{ok ? 'ALLOWED' : 'BLOCKED'}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-[10px] text-mute">trace_id 9f3c…a41e · planner 58 ms · sql_agent 127 ms</p>
    </Frame>
  )
}

/** Document intelligence: entity highlights (illustrative) */
export function DocVisual() {
  const Mark = ({ t, k }: { t: string; k: string }) => <mark className="mx-0.5 rounded bg-ink px-1.5 py-0.5 text-white">{t}<sub className="ml-1 font-mono text-[8px] opacity-70">{k}</sub></mark>
  return (
    <Frame label="Illustrative UI">
      <p className="tag mb-3">RoBERTa NER · PySpark workers</p>
      <p className="rounded-xl bg-white p-4 text-[14px] leading-8 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">
        <Mark t="Dr. Priya Raman" k="PER" /> at <Mark t="Shands Hospital" k="ORG" /> in <Mark t="Gainesville" k="LOC" /> reviewed the chart on <Mark t="March 2, 2026" k="DATE" />.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">{[['0.916', 'strict F1'], ['32', 'docs / request'], ['3,453', 'test samples']].map(([a, b]) => <div key={b} className="rounded-xl bg-white py-2.5 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]"><div className="text-base font-semibold">{a}</div><div className="text-[9px] text-mute">{b}</div></div>)}</div>
    </Frame>
  )
}

/** Real results from the two papers */
export function PaperVisual({ id }: { id: 'fetal-health' | 'exercise-form' }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-paper p-4 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)] sm:p-5">
      <p className="tag mb-3">Results · from the paper</p>
      <BarChart data={charts[id]} tone="light" />
    </div>
  )
}
