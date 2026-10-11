import { useEffect, useRef, useState } from 'react'
import { scrollToTarget, setScrollLocked } from '../lib/scroll'

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'lab', label: 'Live lab' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [ind, setInd] = useState({ x: 0, w: 0, on: false })

  useEffect(() => {
    let raf = 0
    const on = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setScrolled(window.scrollY > 40)
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach((n) => { const el = document.getElementById(n.id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    setInd(el ? { x: el.offsetLeft, w: el.offsetWidth, on: true } : (i) => ({ ...i, on: false }))
  }, [active, scrolled])

  useEffect(() => {
    setScrollLocked(open)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('keydown', esc); setScrollLocked(false) }
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToTarget(id), open ? 350 : 0) }

  return (
    <>
      <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-ink" />
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="wrap flex h-[72px] items-center justify-between">
          <a href="#top" onClick={go('top')} className="group flex items-center gap-3" aria-label="Abraar Khan, back to top">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full border border-ink font-mono text-[11px] font-semibold transition-all duration-500 group-hover:rotate-[360deg] ${scrolled ? 'bg-ink text-paper' : 'bg-transparent text-ink'}`}>AK</span>
            <span className={`text-[15px] font-semibold tracking-tight transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>Abraar Khan</span>
          </a>

          <nav aria-label="Primary" className={`hidden rounded-full p-1.5 transition-all duration-500 lg:block ${scrolled ? 'bg-white/75 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08),0_10px_30px_-12px_rgba(0,0,0,.18)] backdrop-blur-[12px]' : ''}`}>
            <ul ref={listRef} className="relative flex items-center">
              <span aria-hidden className="absolute inset-y-0 rounded-full bg-ink transition-all duration-500" style={{ left: ind.x, width: ind.w, opacity: ind.on ? 1 : 0, transitionTimingFunction: 'var(--ease)' }} />
              {NAV.map((n) => (
                <li key={n.id}>
                  <a data-id={n.id} href={`#${n.id}`} onClick={go(n.id)} className={`relative block rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${active === n.id ? 'text-white' : 'text-ink2 hover:text-ink'}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" className="rounded-full bg-white/80 px-5 py-2.5 text-[13px] font-semibold shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)] backdrop-blur lg:hidden">Menu</button>
        </div>
      </header>

      <div id="mobile-menu" aria-hidden={!open} className="fixed inset-0 z-[70] bg-paper transition-[clip-path] duration-700 lg:hidden" style={{ clipPath: open ? 'circle(150% at 90% 5%)' : 'circle(0% at 90% 5%)', transitionTimingFunction: 'var(--ease)', pointerEvents: open ? 'auto' : 'none', visibility: open ? 'visible' : 'hidden', transitionProperty: 'clip-path, visibility' }}>
        <div className="wrap flex h-[72px] items-center justify-between">
          <span className="tag">Menu</span>
          <button onClick={() => setOpen(false)} className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-white">Close</button>
        </div>
        <ul className="wrap mt-6 space-y-1">
          {NAV.map((n, i) => (
            <li key={n.id} style={{ transitionDelay: open ? `${180 + i * 60}ms` : '0ms' }} className={`transition-all duration-700 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <a href={`#${n.id}`} onClick={go(n.id)} className="flex items-baseline gap-4 border-b border-line py-4 text-[clamp(2rem,9vw,3.2rem)] font-bold tracking-tighter">
                <span className="font-mono text-xs font-normal text-mute">0{i + 1}</span>{n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
