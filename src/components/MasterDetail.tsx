import type { ReactNode } from 'react'

export interface ListItem { id: string; title: string; sub: string; badge?: string; icon: ReactNode }

/** Left list (chips on mobile) + right detail. Selecting never opens an overlay. */
export default function MasterDetail({ items, selected, onSelect, children }: { items: ListItem[]; selected: string; onSelect: (id: string) => void; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
      <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0" role="listbox" aria-label="Select an entry">
        {items.map((it) => {
          const on = it.id === selected
          return (
            <li key={it.id} className="shrink-0 lg:shrink">
              <button
                role="option"
                aria-selected={on}
                onClick={() => onSelect(it.id)}
                className={`flex w-60 items-start gap-3 rounded-xl border p-3.5 text-left transition lg:w-full ${on ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_30px_-10px_#22d3ee]' : 'border-cyan-300/10 bg-ink-800/50 hover:border-cyan-300/35'}`}
              >
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${on ? 'border-cyan-300/50 text-cyan-200' : 'border-cyan-300/15 text-cyan-300/70'}`}>{it.icon}</span>
                <span className="min-w-0">
                  <span className={`block truncate text-sm font-semibold ${on ? 'text-white' : 'text-slate-200'}`}>{it.title}</span>
                  <span className="block truncate text-xs text-slate-500">{it.sub}</span>
                  {it.badge && <span className="mt-1.5 inline-block rounded-full border border-teal-300/30 bg-teal-300/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-teal-200">{it.badge}</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
