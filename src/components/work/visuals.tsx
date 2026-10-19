import { motion } from 'framer-motion'
import { charts } from '../../data/charts'
import BarChart from '../BarChart'

const Frame = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative h-full w-full overflow-hidden rounded-2xl bg-paper p-4 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)] sm:p-5">
    <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-mute shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">{label}</span>
    {children}
  </div>
)
const Chip = ({ children, solid }: { children: React.ReactNode; solid?: boolean }) => (
  <span className={`rounded-full px-3 py-1 font-mono text-[11px] ${solid ? 'bg-ink text-white' : 'bg-white text-mute shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)]'}`}>{children}</span>
)

/** SecureAI-RAG: attack success before and after the four-stage defense (numbers from the project) */
export function SecureRagVisual() {
  const stages = ['Ingestion', 'Retrieval', 'Prompt', 'Output']
  return (
    <Frame label="From the project">
      <p className="tag mb-4">Attack success · 250 attacks · 3 seeds</p>
      {[['No defense', 68, '68.0%', 'bg-[#cfccc6]'], ['All four stages', 1.6, '1.6%', 'bg-ink']].map(([l, v, t, c], i) => (
        <div key={l as string} className="mb-4">
          <div className="mb-1 flex justify-between font-mono text-xs"><span>{l}</span><span className="font-semibold">{t}</span></div>
          <div className="h-4 overflow-hidden rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(v as number, 1.5)}%` }} transition={{ delay: 0.3 + i * 0.3, duration: 1, ease: 'easeOut' }} className={`h-full rounded-full ${c}`} />
          </div>
        </div>
      ))}
      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {stages.map((s, i) => <span key={s} className="flex items-center gap-1.5"><Chip solid>{s}</Chip>{i < 3 && <span className="text-faint">→</span>}</span>)}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-mute">96.5% benign utility kept. Instruction-free retrieval poisoning still succeeds in 83% of adaptive scenarios, the gap this work set out to expose.</p>
    </Frame>
  )
}

/** Distributed Code Judge: sandbox hardening (illustrative layout, limits from the project) */
export function SandboxVisual() {
  const limits = ['cap_drop: ALL', 'no-new-privileges', 'uid 65534', 'pids ≤ 64', 'output ≤ 64 KB', 'swap off', 'gVisor (optional)']
  return (
    <Frame label="Illustrative UI">
      <p className="tag mb-3">Untrusted code → hardened sandbox</p>
      <div className="flex items-center gap-2 text-[12px]">
        {['Runner', 'Docker API proxy', 'Sandbox'].map((x, i) => <span key={x} className="flex items-center gap-2"><span className={`rounded-xl px-3 py-2 font-medium ${i === 1 ? 'bg-ink text-white' : 'bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)]'}`}>{x}</span>{i < 2 && <span className="text-faint">→</span>}</span>)}
      </div>
      <p className="mb-2 mt-5 font-mono text-[10px] uppercase tracking-wider text-mute">Every container-create request is validated</p>
      <div className="flex flex-wrap gap-1.5">{limits.map((l) => <Chip key={l}>{l}</Chip>)}</div>
      <div className="mt-5 rounded-xl bg-white p-3 font-mono text-[11px] shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]">
        <div>docker.sock <span className="text-faint">·</span> <b>blocked</b> for the runner</div>
        <div>bind-mount attempt <span className="text-faint">·</span> <b>rejected</b></div>
        <div>cross-container tamper <span className="text-faint">·</span> <b>rejected</b></div>
      </div>
    </Frame>
  )
}

/** Secure Data Sandbox: latency tiles and the review loop */
export function SandboxPipelineVisual() {
  return (
    <Frame label="Illustrative UI">
      <p className="tag mb-3">Secure RAG sandbox · Linux</p>
      <div className="grid grid-cols-2 gap-2 text-center">
        {[['< 150 ms', 'query latency'], ['< 8 s', 'ingest → searchable']].map(([a, b]) => <div key={b} className="rounded-xl bg-white py-4 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]"><div className="font-mono text-2xl font-semibold">{a}</div><div className="text-[11px] text-mute">{b}</div></div>)}
      </div>
      <p className="mb-2 mt-5 font-mono text-[10px] uppercase tracking-wider text-mute">Hybrid threat detection</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip solid>LLM services</Chip><span className="text-faint">+</span><Chip solid>Rule-based filters</Chip><span className="text-faint">→</span><Chip>Analyst review</Chip>
      </div>
    </Frame>
  )
}

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
      <div className="mt-3 flex flex-wrap gap-2"><Chip solid>1D U-Net + TCN</Chip><Chip>ECG-FM classifier</Chip><Chip>ONNX · −42% latency</Chip></div>
    </Frame>
  )
}

/** Multi-agent assistant: firewall decisions (illustrative) */
export function AgentVisual() {
  const rows: [string, boolean][] = [['SELECT order_date FROM orders LIMIT 5', true], ['DROP TABLE accounts_summary', false], ["… WHERE id=1 OR 1=1; DELETE FROM invoices", false], ['SELECT user FROM audit_log', false]]
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
      <p className="mt-3 font-mono text-[10px] text-mute">trace_id 9f3c…a41e · p95 7.6 s · 75% execution accuracy</p>
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
        <Mark t="Priya Raman" k="PER" /> joined <Mark t="Acme Labs" k="ORG" /> in <Mark t="Austin" k="LOC" /> on <Mark t="March 2, 2026" k="DATE" />.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">{[['0.9155', 'strict F1'], ['32', 'docs / request'], ['3,453', 'test documents']].map(([a, b]) => <div key={b} className="rounded-xl bg-white py-2.5 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)]"><div className="text-base font-semibold">{a}</div><div className="text-[9px] text-mute">{b}</div></div>)}</div>
    </Frame>
  )
}

/** Malicious Code Detection: real benchmark from the thesis */
export function MaliciousVisual() {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-paper p-4 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)] sm:p-5">
      <p className="tag mb-3">Results · from the thesis</p>
      <BarChart data={charts['malicious-code']} tone="light" />
      <div className="mt-3 flex flex-wrap gap-2"><Chip solid>Random Forest: 99.45% accuracy</Chip><Chip>99.31% precision</Chip><Chip>98.42% recall</Chip></div>
    </div>
  )
}
