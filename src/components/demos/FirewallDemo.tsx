import { Check, Loader2, ShieldAlert, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Role = 'analyst' | 'auditor'
const TABLES: Record<Role, string[]> = { analyst: ['patients_summary', 'visits', 'claims'], auditor: ['patients_summary', 'visits', 'claims', 'audit_log'] }
const PRESETS = [
  { label: 'Valid read', sql: 'SELECT visit_date, dx_code FROM visits WHERE dx_code = \'F32.1\' LIMIT 5' },
  { label: 'DROP TABLE', sql: 'DROP TABLE patients_summary' },
  { label: 'Injection', sql: "SELECT * FROM visits WHERE id = 1 OR 1=1; DELETE FROM claims" },
  { label: 'Unauthorized table', sql: 'SELECT user, action FROM audit_log LIMIT 10' },
  { label: 'Unbounded scan', sql: 'SELECT * FROM claims' },
]
const WRITE = /\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|merge|exec)\b/i
const INJECT = /(--|\/\*|\bor\b\s+1\s*=\s*1|\bunion\b\s+select|;\s*\S)/i

interface Check { id: string; label: string; fail?: string }
function evaluate(sql: string, role: Role) {
  const s = sql.trim()
  const tables = [...s.matchAll(/\b(?:from|join)\s+([a-z_][\w.]*)/gi)].map((m) => m[1].toLowerCase())
  const checks: Check[] = [
    { id: 'parse', label: 'Parse to AST (sqlglot): single SELECT statement', fail: /^\s*(with|select)\b/i.test(s) ? undefined : 'Statement is not a SELECT' },
    { id: 'write', label: 'No write / DDL operations', fail: WRITE.test(s) ? `Write operation detected: ${s.match(WRITE)![1].toUpperCase()}` : undefined },
    { id: 'inject', label: 'No injection patterns', fail: INJECT.test(s) ? 'Injection pattern detected (stacked statement, comment, or tautology)' : undefined },
    { id: 'rbac', label: `Role-based table access (${role})`, fail: tables.find((t) => !TABLES[role].includes(t)) ? `Role "${role}" cannot read "${tables.find((t) => !TABLES[role].includes(t))}"` : tables.length === 0 ? 'No table referenced' : undefined },
    { id: 'cost', label: 'Query cost budget', fail: /select\s+\*/i.test(s) && !/\blimit\b/i.test(s) ? 'Unbounded SELECT * exceeds cost budget; add LIMIT' : undefined },
    { id: 'rls', label: 'Row-level security: tenant filter injected' },
  ]
  const firstFail = checks.findIndex((c) => c.fail)
  let rewritten = s.replace(/;\s*$/, '')
  if (/\bwhere\b/i.test(rewritten)) rewritten = rewritten.replace(/\bwhere\b/i, "WHERE tenant_id = 'clinic_a' AND")
  else rewritten = /\b(order by|group by|limit)\b/i.test(rewritten) ? rewritten.replace(/\b(order by|group by|limit)\b/i, "WHERE tenant_id = 'clinic_a' $1") : `${rewritten} WHERE tenant_id = 'clinic_a'`
  return { checks, firstFail, rewritten }
}

export default function FirewallDemo() {
  const [sql, setSql] = useState(PRESETS[0].sql)
  const [role, setRole] = useState<Role>('analyst')
  const [step, setStep] = useState(-1)
  const [res, setRes] = useState<ReturnType<typeof evaluate> | null>(null)
  const [trace, setTrace] = useState('')
  const timer = useRef<number>(0)

  const run = (q = sql) => {
    window.clearInterval(timer.current)
    const r = evaluate(q, role)
    setRes(r); setStep(0)
    setTrace(Array.from({ length: 16 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''))
    const end = r.firstFail === -1 ? r.checks.length : r.firstFail + 1
    let i = 0
    timer.current = window.setInterval(() => { i++; setStep(i); if (i >= end) window.clearInterval(timer.current) }, 380)
  }
  useEffect(() => () => window.clearInterval(timer.current), [])

  const end = res ? (res.firstFail === -1 ? res.checks.length : res.firstFail + 1) : 0
  const done = res && step >= end
  const blocked = res && res.firstFail !== -1

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <p className="mono-label mb-2">1 · Try an attack (or write your own)</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => <button key={p.label} onClick={() => { setSql(p.sql); run(p.sql) }} className="rounded-md border border-cyan-300/15 px-2.5 py-1.5 font-mono text-xs text-slate-300 transition hover:border-cyan-300/50 hover:text-white">{p.label}</button>)}
          </div>
        </div>
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={4} spellCheck={false} aria-label="SQL query" className="w-full resize-none rounded-lg border border-cyan-300/20 bg-ink-950/80 p-3 font-mono text-sm text-cyan-100 outline-none focus:border-cyan-300/60" />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 font-mono text-xs text-slate-400">Role
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="rounded-md border border-cyan-300/20 bg-ink-900 px-2 py-1.5 text-slate-200"><option value="analyst">analyst</option><option value="auditor">auditor</option></select>
          </label>
          <button onClick={() => run()} className="btn btn-primary ml-auto">Run through firewall</button>
        </div>
        <p className="font-mono text-[11px] text-slate-500">Tables for {role}: {TABLES[role].join(', ')}</p>
      </div>

      <div>
        <p className="mono-label mb-2">2 · Firewall pipeline</p>
        <ol className="space-y-1.5">
          {(res?.checks ?? evaluate('', role).checks).map((c, i) => {
            const ran = res && step > i && i < end
            const cur = res && step === i && i < end
            const bad = ran && c.fail
            return (
              <li key={c.id} className={`flex items-start gap-3 rounded-lg border p-2.5 text-sm transition ${bad ? 'border-rose-400/40 bg-rose-400/10' : ran ? 'border-emerald-400/25 bg-emerald-400/5' : cur ? 'border-cyan-300/50 bg-cyan-300/10' : 'border-cyan-300/10 text-slate-500'}`}>
                <span className="mt-0.5">{bad ? <X size={15} className="text-rose-300" /> : ran ? <Check size={15} className="text-emerald-300" /> : cur ? <Loader2 size={15} className="animate-spin text-cyan-300" /> : <span className="block h-[15px] w-[15px] rounded-full border border-slate-600" />}</span>
                <span><span className={ran || cur ? 'text-slate-100' : ''}>{c.label}</span>{bad && <span className="mt-0.5 block text-xs text-rose-200">{c.fail}</span>}</span>
              </li>
            )
          })}
        </ol>

        {done && (
          <div className={`mt-4 rounded-lg border p-4 ${blocked ? 'border-rose-400/40 bg-rose-400/10' : 'border-emerald-400/40 bg-emerald-400/10'}`}>
            <p className={`flex items-center gap-2 font-semibold ${blocked ? 'text-rose-200' : 'text-emerald-200'}`}>{blocked ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}{blocked ? 'BLOCKED: query never reached the database' : 'ALLOWED: executed with tenant isolation'}</p>
            {!blocked && <>
              <p className="mono-label mt-3">Executed SQL</p>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-md bg-ink-950/80 p-2.5 font-mono text-xs text-cyan-100">{res!.rewritten}</pre>
            </>}
            <p className="mt-3 font-mono text-[11px] text-slate-400">trace_id {trace} · planner {(40 + trace.charCodeAt(0) % 40)} ms · sql_agent {(90 + trace.charCodeAt(1) % 60)} ms</p>
          </div>
        )}
        <p className="mt-3 text-xs leading-relaxed text-slate-500">Rule-based illustration of the project’s firewall. The real system parses SQL with sqlglot, blocked all writes, injections and unauthorized reads across 65 attack tests, and returns trace IDs via OpenTelemetry.</p>
      </div>
    </div>
  )
}
