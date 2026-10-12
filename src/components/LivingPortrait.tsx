import { useEffect, useRef, useState } from 'react'
import { HERO_PORTRAIT as H } from '../data/hero'

const base = import.meta.env.BASE_URL
const SRC = `${base}hero/me.webp`

/**
 * A silent "living photo". The cut-out is drawn twice: the body breathes, and a copy masked to the head
 * pivots at the neck so the head turns and nods toward the cursor (idle drift when nobody is moving).
 * Falls back to a silhouette if public/hero/me.webp is missing.
 */
export default function LivingPortrait({ onMissing }: { onMissing: () => void }) {
  const stage = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLImageElement>(null)
  const [ratio, setRatio] = useState(0.5)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = body.current, hd = head.current
    if (!el || !hd) return
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, on = true
    const host = stage.current?.closest('section') ?? window
    const move = (e: Event) => { const p = e as PointerEvent; tx = (p.clientX / window.innerWidth - 0.5) * 2; ty = (p.clientY / window.innerHeight - 0.5) * 2 }
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting })
    if (stage.current) io.observe(stage.current)
    host.addEventListener('pointermove', move)
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!on) return
      x += (tx - x) * 0.06; y += (ty - y) * 0.06
      const t = now / 1000
      el.style.transform = `perspective(1100px) rotateY(${x * 6}deg) rotateX(${-y * 2}deg) translate3d(${x * 9}px, ${y * 3}px, 0)`
      // head: turns toward the cursor, with a slow idle drift and a tiny nod
      const roll = x * 3.2 + Math.sin(t * 0.7) * 0.9
      const nod = y * 2.2 + Math.sin(t * 1.1) * 0.7
      hd.style.transform = `rotate(${roll}deg) translate3d(${x * 4}px, ${nod}px, 0)`
      document.documentElement.style.setProperty('--gx', `${-x * 22}px`)
      document.documentElement.style.setProperty('--gy', `${-y * 8}px`)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); io.disconnect(); host.removeEventListener('pointermove', move) }
  }, [])

  const sp = H.headSplitY * 100
  const headMask = `linear-gradient(to bottom, #000 ${sp}%, transparent ${sp + H.headFade * 100}%)`
  // the body layer starts at the split line, so no unmoving copy of the head shows behind the moving head
  const bodyMask = `linear-gradient(to bottom, transparent ${sp - 0.3}%, #000 ${sp + 0.3}%)`
  return (
    <div ref={stage} className="relative flex h-full w-full items-end justify-center" role="img" aria-label="Portrait of Abraar Khan in his University of Florida graduation gown">
      {/* halo that slowly pulses like a heartbeat */}
      <span aria-hidden className="absolute bottom-[26%] left-1/2 aspect-square h-[46%] -translate-x-1/2 animate-ring rounded-full border border-ink/10" />
      <span aria-hidden className="absolute bottom-[26%] left-1/2 aspect-square h-[46%] -translate-x-1/2 animate-ring rounded-full border border-ink/10" style={{ animationDelay: '1.2s' }} />
      {/* ground shadow */}
      <span aria-hidden className="absolute bottom-[1.5%] left-1/2 h-[3.5%] w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl" />

      <div ref={body} className="relative h-full will-change-transform" style={{ aspectRatio: String(ratio), transformOrigin: '50% 100%' }}>
        <div className={`absolute inset-0 origin-bottom transition-all duration-[1400ms] ${ready ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-md'}`} style={{ transitionTimingFunction: 'var(--ease)' }}>
          <div className="absolute inset-0 origin-bottom animate-[breathe_5.5s_ease-in-out_infinite]">
            <img
              src={SRC} alt="" draggable={false}
              onLoad={(e) => { setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight); setReady(true) }} onError={onMissing}
              className="absolute inset-0 h-full w-full select-none"
              style={{ maskImage: bodyMask, WebkitMaskImage: bodyMask }}
            />
            <img
              ref={head} src={SRC} alt="" aria-hidden draggable={false}
              className="absolute inset-0 h-full w-full select-none will-change-transform"
              style={{ transformOrigin: `${H.pivotX * 100}% ${H.headSplitY * 100}%`, maskImage: headMask, WebkitMaskImage: headMask }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
