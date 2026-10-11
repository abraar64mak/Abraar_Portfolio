import { Command, Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MODULES } from './Sidebar'
import type { View } from '../hooks/useRoute'

export default function Topbar({ view, onMenu, onSearch }: { view: View; onMenu: () => void; onSearch: () => void }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const mod = MODULES.find((m) => m.view === view)!
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-cyan-300/10 bg-ink-950/80 px-4 backdrop-blur-xl sm:px-6">
      <button className="rounded-lg border border-cyan-300/15 p-2 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
      <div className="min-w-0">
        <p className="mono-label hidden sm:block">Abraar Khan / {mod.label}</p>
        <h1 className="truncate text-lg font-semibold text-white">{mod.label}</h1>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button onClick={onSearch} className="flex h-10 items-center gap-2 rounded-lg border border-cyan-300/15 bg-ink-800/60 px-3 text-sm text-slate-400 transition hover:border-cyan-300/50 hover:text-white" aria-label="Search">
          <Search size={15} /><span className="hidden sm:inline">Search</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-cyan-300/20 px-1.5 font-mono text-[10px] sm:flex"><Command size={10} />K</kbd>
        </button>
        <div className="hidden items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/5 px-3 py-2 font-mono text-[11px] text-emerald-300 md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          ONLINE · {now.toLocaleTimeString([], { hour12: false })}
        </div>
      </div>
    </header>
  )
}
