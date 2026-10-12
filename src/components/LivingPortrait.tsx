import { useEffect, useRef, useState } from 'react'

const base = import.meta.env.BASE_URL

/**
 * A silent "living photo": the cut-out portrait breathes, tilts toward the cursor (or the finger on
 * touch devices), and floats over a soft shadow. Falls back to a silhouette if public/hero/me.webp is missing.
 */
export default function LivingPortrait({ onMissing }: { onMissing: () => void }) {
  const stage = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const host = stage.current?.closest('section') ?? window
    const el = img.current
    if (!el) return
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, on = true
    const move = (e: Event) => {
      const p = (e as PointerEvent)
      tx = (p.clientX / window.innerWidth - 0.5) * 2
      ty = (p.clientY / window.innerHeight - 0.5) * 2
    }
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting })
    if (stage.current) io.observe(stage.current)
    host.addEventListener('pointermove', move)
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!on) return
      x += (tx - x) * 0.06; y += (ty - y) * 0.06
      el.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 2.5}deg) translate3d(${x * 10}px, ${y * 4}px, 0)`
      // the ghost name drifts the opposite way for depth
      document.documentElement.style.setProperty('--gx', `${-x * 22}px`)
      document.documentElement.style.setProperty('--gy', `${-y * 8}px`)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); io.disconnect(); host.removeEventListener('pointermove', move) }
  }, [])

  return (
    <div ref={stage} className="relative flex h-full w-full items-end justify-center" role="img" aria-label="Portrait of Abraar Khan in his University of Florida graduation gown">
      {/* halo that slowly pulses like a heartbeat */}
      <span aria-hidden className="absolute bottom-[26%] left-1/2 h-[46%] aspect-square -translate-x-1/2 rounded-full border border-ink/10 animate-ring" />
      <span aria-hidden className="absolute bottom-[26%] left-1/2 h-[46%] aspect-square -translate-x-1/2 rounded-full border border-ink/10 animate-ring" style={{ animationDelay: '1.2s' }} />
      {/* ground shadow */}
      <span aria-hidden className="absolute bottom-[1.5%] left-1/2 h-[3.5%] w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl" />
      <div ref={img} className="relative flex h-full w-full items-end justify-center will-change-transform" style={{ transformOrigin: '50% 100%' }}>
        <div className={`h-full w-full origin-bottom transition-all duration-[1400ms] ${ready ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-md'}`} style={{ transitionTimingFunction: 'var(--ease)' }}>
          <img
            src={`${base}hero/me.webp`} alt="" draggable={false}
            onLoad={() => setReady(true)} onError={onMissing}
            className="h-full w-full origin-bottom animate-[breathe_5.5s_ease-in-out_infinite] object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  )
}
