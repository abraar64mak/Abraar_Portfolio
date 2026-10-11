import { motion, useScroll, useSpring } from 'framer-motion'
import { Activity, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { id: 'console', label: 'Console' },
  { id: 'experience', label: 'Clinical Log' },
  { id: 'projects', label: 'Research' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [active, setActive] = useState('console')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => { const el = document.getElementById(l.id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-300/10 bg-ink-950/70 backdrop-blur-xl">
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cyan-300 to-teal-300" />
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5" aria-label="Primary">
        <a href="#console" className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
          <Activity size={18} className="text-cyan-300" />
          <span>abraar<span className="text-cyan-300">.khan</span></span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${active === l.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                {active === l.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-cyan-300/10 ring-1 ring-cyan-300/30" />}
                <span className="relative">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <ul className="border-t border-cyan-300/10 bg-ink-950/95 px-5 py-2 md:hidden">
          {links.map((l) => (
            <li key={l.id}><a onClick={() => setOpen(false)} href={`#${l.id}`} className="block py-2.5 text-slate-300">{l.label}</a></li>
          ))}
        </ul>
      )}
    </header>
  )
}
