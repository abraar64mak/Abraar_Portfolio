import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

const base = import.meta.env.BASE_URL
const BACK = [
  'M.S. Artificial Intelligence Systems, University of Florida',
  'Data Scientist at CDF: clinical RAG for Medicaid charts',
  'Built BeatNet, a Multi-Agent Data Assistant and a Document Intelligence Platform',
  'B.Tech AI & ML, Anna University (2020–2024)',
  '2× Best Paper: ICCCNet 2023 (Springer), IConIC 2K23 (AIP)',
]

export default function IdCard() {
  const stage = useRef<HTMLDivElement>(null)
  const swing = useRef<HTMLDivElement>(null)
  const [flip, setFlip] = useState(false)
  const [photoOk, setPhotoOk] = useState(true)

  // damped pendulum: pointer velocity -> angular velocity, plus a gentle idle sway
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = swing.current, host = stage.current
    if (!el || !host) return
    let theta = 0, omega = 0, last = performance.now(), px = 0, pt = 0, raf = 0, on = true
    const move = (e: PointerEvent) => {
      const now = performance.now()
      if (pt) omega += Math.max(-60, Math.min(60, ((e.clientX - px) / Math.max(now - pt, 8)) * 14))
      px = e.clientX; pt = now
    }
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting })
    io.observe(host)
    host.addEventListener('pointermove', move)
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.04); last = now
      if (!on) return
      const target = Math.sin(now / 1100) * 1.4
      omega += (-38 * (theta - target) - 2.2 * omega) * dt
      theta = Math.max(-20, Math.min(20, theta + omega * dt))
      el.style.transform = `rotate(${theta}deg)`
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); io.disconnect(); host.removeEventListener('pointermove', move) }
  }, [])

  const strap = 'ABRAAR KHAN · ML & AI ENGINEER · '.repeat(3)
  return (
    <div ref={stage} className="relative mx-auto flex h-[560px] w-full justify-center overflow-visible">
      <div ref={swing} className="absolute left-1/2 top-0 -ml-[150px] w-[300px]" style={{ transformOrigin: '50% 0' }}>
        {/* strap + clip */}
        <div className="relative mx-auto h-14 w-[30px] overflow-hidden bg-ink">
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] tracking-[0.2em] text-white/80" style={{ writingMode: 'vertical-rl' }} aria-hidden>
            <span className="animate-[float_6s_ease-in-out_infinite] whitespace-nowrap">{strap}</span>
          </div>
        </div>
        <div aria-hidden className="relative z-10 mx-auto -mt-1 h-7 w-9 rounded-b-md bg-gradient-to-b from-[#cfcfcf] via-[#8e8e8e] to-[#d9d9d9] shadow-md" />
        <div aria-hidden className="relative z-10 mx-auto -mt-2 h-2 w-14 rounded-full bg-gradient-to-b from-[#bdbdbd] to-[#7a7a7a]" />

        {/* card */}
        <div
          role="button" tabIndex={0} aria-pressed={flip} aria-label="ID card. Press to flip."
          onMouseEnter={() => setFlip(true)} onMouseLeave={() => setFlip(false)} onClick={() => setFlip((f) => !f)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFlip((f) => !f))}
          className="relative mx-auto -mt-1 h-[404px] w-[300px] cursor-pointer [perspective:1200px]"
        >
          <div className="absolute inset-0 transition-transform duration-[900ms] [transform-style:preserve-3d]" style={{ transform: flip ? 'rotateY(180deg)' : 'none', transitionTimingFunction: 'var(--ease)' }}>
            {/* front */}
            <div className="absolute inset-0 overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-24px_rgba(0,0,0,.35),inset_0_0_0_1px_rgba(13,13,13,.08)] [backface-visibility:hidden]">
              <div className="bg-ink py-2.5 text-center font-mono text-[10px] tracking-[0.32em] text-white">ML ENGINEER ID</div>
              <div className="mt-5 flex justify-center">
                <div className="group relative h-[156px] w-[128px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#f2f2f2] to-[#cfcfcf] p-[3px] shadow-[0_14px_30px_-12px_rgba(0,0,0,.4)]">
                  <div className="h-full w-full overflow-hidden rounded-[13px] bg-white">
                    {photoOk ? <img src={`${base}portrait-bust.webp`} alt="Portrait of Abraar Khan" onError={() => setPhotoOk(false)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      : <div className="flex h-full items-center justify-center bg-soft font-mono text-3xl font-semibold text-ink2" aria-label="Initials AK">AK</div>}
                  </div>
                </div>
              </div>
              <div className="mt-4 px-6 text-center">
                <p className="text-[22px] font-bold leading-none tracking-tight">Abraar Khan</p>
                <p className="mt-1.5 text-[12px] text-mute">ML &amp; AI Systems Engineer</p>
              </div>
              <dl className="mx-6 mt-4 space-y-1.5 font-mono text-[10px]">
                {[['FIELD', 'Applied AI'], ['DEGREE', 'M.S. AI Systems'], ['BASE', 'United States']].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-dashed border-ink/15 pb-1"><dt className="text-faint">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              <div className="absolute inset-x-6 bottom-4 flex items-end justify-between">
                <div aria-hidden className="h-8 w-28" style={{ background: 'repeating-linear-gradient(90deg,#0d0d0d 0 2px,transparent 2px 4px,#0d0d0d 4px 5px,transparent 5px 8px,#0d0d0d 8px 11px,transparent 11px 13px)' }} />
                <div aria-hidden className="h-9 w-9 rounded-full" style={{ background: 'conic-gradient(from 90deg,#f5f5f5,#bdbdbd,#fafafa,#8a8a8a,#f0f0f0,#c9c9c9,#f5f5f5)' }} />
              </div>
            </div>
            {/* back */}
            <div className="absolute inset-0 overflow-hidden rounded-[26px] bg-ink p-7 text-white shadow-[0_30px_60px_-24px_rgba(0,0,0,.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/50">WHAT I AM</p>
              <ul className="mt-5 space-y-3.5 text-[13px] leading-snug">
                {BACK.map((b) => <li key={b} className="flex gap-2.5"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/70" />{b}</li>)}
              </ul>
              <p className="absolute bottom-16 left-7 font-serif text-3xl italic text-white/90">Abraar Khan</p>
              <p className="absolute bottom-6 left-7 right-7 font-mono text-[10px] text-white/50">If found, say hello · {profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
