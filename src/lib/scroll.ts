import Lenis from 'lenis'

let lenis: Lenis | null = null
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smooth scrolling (Lenis). Skipped entirely for reduced-motion users. */
export function initScroll() {
  if (reduced()) return () => {}
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  let raf = 0
  const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)
  return () => { cancelAnimationFrame(raf); lenis?.destroy(); lenis = null }
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop(); else lenis?.start()
  document.body.style.overflow = locked ? 'hidden' : ''
}

export function scrollToTarget(id: string) {
  const el = id === 'top' ? document.body : document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(id === 'top' ? 0 : el, { offset: -64, duration: 1.3 })
  else window.scrollTo({ top: id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 64 })
}
