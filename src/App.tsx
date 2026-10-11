import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CommandPalette from './components/CommandPalette'
import Sidebar, { MODULES } from './components/Sidebar'
import Topbar from './components/Topbar'
import { useRoute } from './hooks/useRoute'
import Contact from './views/Contact'
import Lab from './views/Lab'
import Log from './views/Log'
import Overview from './views/Overview'
import Papers from './views/Papers'
import Research from './views/Research'
import Skills from './views/Skills'

export default function App() {
  const { route, go } = useRoute()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)

  // scroll to top when switching modules
  useEffect(() => { window.scrollTo({ top: 0 }) }, [route.view])

  // keyboard: ⌘/Ctrl+K opens search, 1–7 jump between modules
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT'
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch((s) => !s) }
      else if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '/') { e.preventDefault(); setSearch(true) }
        const m = MODULES.find((x) => x.key === e.key)
        if (m) go(m.view)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const { view, id } = route
  return (
    <div className="min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-20 top-0 h-[480px] w-[480px] animate-float rounded-full bg-cyan-400/[0.08] blur-[120px]" />
        <div className="absolute -right-20 top-1/3 h-[420px] w-[420px] animate-float rounded-full bg-violet-500/[0.08] blur-[120px]" style={{ animationDelay: '-4s' }} />
      </div>
      <Sidebar active={view} onGo={go} open={menu} onClose={() => setMenu(false)} />
      <div className="lg:pl-64">
        <Topbar view={view} onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
        <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {view === 'overview' && <Overview go={go} />}
            {view === 'log' && <Log id={id} go={go} />}
            {view === 'research' && <Research id={id} go={go} />}
            {view === 'lab' && <Lab id={id} go={go} />}
            {view === 'skills' && <Skills id={id} go={go} />}
            {view === 'papers' && <Papers id={id} go={go} />}
            {view === 'contact' && <Contact />}
          </motion.div>
          <footer className="mt-12 border-t border-cyan-300/10 pt-5 text-center font-mono text-[11px] text-slate-600">
            © {new Date().getFullYear()} Abraar Khan · press <kbd className="rounded border border-cyan-300/20 px-1">⌘K</kbd> to search · <kbd className="rounded border border-cyan-300/20 px-1">1–7</kbd> to switch modules
          </footer>
        </main>
      </div>
      {search && <CommandPalette onGo={go} onClose={() => setSearch(false)} />}
    </div>
  )
}
