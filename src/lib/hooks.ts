import { useEffect, useRef, useState } from 'react'

/** True once the element has entered the viewport (animate-once). */
export function useInView<T extends Element>(margin = '-10%') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, seen] as const
}

/** 0..1 progress of an element scrolling through the viewport (top at 65% → bottom at 65%). */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const next = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height))
      setP((o) => (Math.abs(o - next) > 0.003 ? next : o))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return [ref, p] as const
}
