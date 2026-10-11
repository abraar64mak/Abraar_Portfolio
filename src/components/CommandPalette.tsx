import { CornerDownLeft, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { experience } from '../data/experience'
import { papers } from '../data/papers'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import type { View } from '../hooks/useRoute'
import { MODULES } from './Sidebar'

interface Item { label: string; group: string; view: View; id?: string }

export default function CommandPalette({ onGo, onClose }: { onGo: (v: View, id?: string) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const all = useMemo<Item[]>(() => [
    ...MODULES.map((m) => ({ label: m.label, group: 'Module', view: m.view })),
    ...experience.map((e) => ({ label: `${e.role} · ${e.org}`, group: 'Clinical log', view: 'log' as View, id: e.id })),
    ...projects.map((p) => ({ label: p.title, group: 'Project', view: 'research' as View, id: p.id })),
    ...papers.map((p) => ({ label: p.title, group: 'Publication', view: 'papers' as View, id: p.id })),
    ...skills.map((s) => ({ label: s.name, group: 'Skill', view: 'skills' as View, id: s.name })),
  ], [])
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    return (t ? all.filter((x) => x.label.toLowerCase().includes(t)) : all.slice(0, 12)).slice(0, 12)
  }, [q, all])

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => setI(0), [q])

  const pick = (it?: Item) => { if (!it) return; onGo(it.view, it.id); onClose() }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(x + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(x - 1, 0)) }
    else if (e.key === 'Enter') pick(results[i])
    else if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="panel relative w-full max-w-xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-cyan-300/10 px-4">
          <Search size={18} className="text-cyan-300" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a module, project, paper or skill…" className="h-14 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500" />
          <kbd className="rounded border border-cyan-300/20 px-1.5 font-mono text-[10px] text-slate-400">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="p-4 text-sm text-slate-500">No matches.</li>}
          {results.map((r, idx) => (
            <li key={`${r.group}-${r.label}`}>
              <button onClick={() => pick(r)} onMouseEnter={() => setI(idx)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left ${idx === i ? 'bg-cyan-300/10 text-white' : 'text-slate-300'}`}>
                <span className="truncate text-sm">{r.label}</span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">{r.group}{idx === i && <CornerDownLeft size={12} />}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
