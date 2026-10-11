import { Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Counter from './Counter'
import EcgLine from './EcgLine'
import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/scroll'

const base = import.meta.env.BASE_URL
const STATS = [
  { to: 88, suffix: '%', label: 'retrieval accuracy', from: 72 },
  { to: 100, suffix: '%', label: 'adversarial refusal' },
  { to: 0.916, decimals: 3, label: 'strict entity F1' },
  { to: 2, suffix: '×', label: 'Best Paper awards' },
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [missing, setMissing] = useState(false)
  const [sound, setSound] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const userChoice = useRef<boolean | null>(null) // null = user hasn't touched the button
  const visible = useRef(true)

  const tryPlay = useCallback(async (withSound: boolean) => {
    const v = video.current
    if (!v) return
    v.muted = !withSound
    try { await v.play(); setSound(withSound); setBlocked(!withSound && userChoice.current === null) }
    catch { v.muted = true; v.play().catch(() => {}); setSound(false); setBlocked(true) }
  }, [])

  // autoplay: try with sound, fall back to muted
  useEffect(() => { void tryPlay(true) }, [tryPlay])

  // unlock sound on the first real gesture
  useEffect(() => {
    const unlock = () => {
      if (userChoice.current === null && visible.current) void tryPlay(true)
      ;['pointerdown', 'keydown', 'touchend'].forEach((t) => window.removeEventListener(t, unlock))
    }
    ;['pointerdown', 'keydown', 'touchend'].forEach((t) => window.addEventListener(t, unlock, { once: true }))
    return () => ['pointerdown', 'keydown', 'touchend'].forEach((t) => window.removeEventListener(t, unlock))
  }, [tryPlay])

  // pause (and silence) the video when the hero is mostly out of view
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.intersectionRatio >= 0.35
      const v = video.current
      if (!v) return
      if (visible.current) v.play().catch(() => {}); else v.pause()
    }, { threshold: [0, 0.35, 1] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const v = video.current
    if (!v) return
    userChoice.current = !sound
    if (sound) { v.muted = true; setSound(false) } else { setBlocked(false); void tryPlay(true) }
  }

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-[72px] sm:pb-14">
      {/* ghost first name */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[9%] select-none text-center font-sans text-[clamp(5rem,24vw,22rem)] font-extrabold uppercase leading-none tracking-tighter" style={{ WebkitTextStroke: '1.5px rgba(13,13,13,.14)', color: 'transparent' }}>Abraar</div>
      <EcgLine className="pointer-events-none absolute inset-x-0 bottom-[22%] hidden h-24 w-full opacity-30 lg:block" />

      {/* the talking video: stacked above the text on phones, centred behind it on desktop */}
      <div className="pointer-events-none relative mx-auto flex h-[58svh] w-full items-end justify-center lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-12 lg:h-auto">
        <div className="relative h-full lg:h-[min(96svh,1040px)] lg:max-h-full" style={{ aspectRatio: '768 / 960' }}>
          {!missing ? (
            <video ref={video} loop muted playsInline preload="auto" aria-label="Abraar introducing himself" className="h-full w-full object-contain mix-blend-multiply" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)' }}>
              <source src={`${base}hero/hero.webm`} type="video/webm" />
              <source src={`${base}hero/hero.mp4`} type="video/mp4" onError={() => setMissing(true)} />
            </video>
          ) : (
            <Placeholder />
          )}
        </div>
        {/* sound control: icon-only, ▶ when off, ❚❚ when on */}
        {!missing && (
          <button onClick={toggle} aria-label={sound ? 'Turn sound off' : 'Turn sound on'} aria-pressed={sound} className="pointer-events-auto absolute bottom-3 left-1/2 z-20 flex h-[46px] w-[46px] -translate-x-1/2 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform hover:scale-105 lg:bottom-8">
            {blocked && !sound && <span aria-hidden className="absolute inset-0 animate-ring rounded-full border border-ink" />}
            {sound ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
        )}
      </div>

      <div className="wrap relative z-10 mt-6 grid w-full gap-8 lg:mt-0 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <div className="max-w-lg">
          <p className="tag rv mb-4"><span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ink align-middle" />Available · Healthcare AI</p>
          <h1 className="text-[clamp(2.6rem,6.4vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            <span className="rv-mask"><span>ML &amp; AI Systems</span></span>
            <span className="rv-mask" style={{ ['--i' as string]: 1 }}><span><em className="serif-accent">Engineer.</em></span></span>
          </h1>
          <p className="rv mt-5 max-w-md text-[15px] leading-relaxed text-ink2" style={{ ['--i' as string]: 3 }}>I build clinical-grade AI: from real-time ECG models to secure RAG and agentic systems that handle sensitive patient data.</p>
          <div className="rv mt-7 flex flex-wrap gap-3" style={{ ['--i' as string]: 4 }}>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget('work') }} className="pill pill-solid">Explore work</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget('contact') }} className="pill pill-line">Let’s talk</a>
            <a href={`${base}${profile.resume}`} download className="pill pill-line">Résumé ↓</a>
          </div>
        </div>

        <div className="hidden lg:block lg:w-[min(30vw,420px)]" aria-hidden />

        <dl className="rv grid w-full max-w-md grid-cols-2 gap-x-8 gap-y-5 lg:ml-auto lg:max-w-xs" style={{ ['--i' as string]: 3 }}>
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-ink/20 pt-3">
              <dt className="order-2 text-xs text-mute">{s.label}</dt>
              <dd className="font-mono text-2xl font-semibold tracking-tight"><Counter from={s.from} to={s.to} decimals={s.decimals} suffix={s.suffix} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** Shown until public/hero/hero.mp4 exists. */
function Placeholder() {
  return (
    <div className="flex h-full w-full items-end justify-center" role="img" aria-label="Portrait placeholder">
      <svg viewBox="0 0 400 720" className="h-[92%] w-auto" aria-hidden>
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e4e1db" /><stop offset="1" stopColor="#f4f2ee" /></linearGradient></defs>
        <circle cx="200" cy="110" r="78" fill="url(#g)" />
        <path d="M70 330c0-70 60-110 130-110s130 40 130 110v330H70z" fill="url(#g)" />
        <path d="M120 700V440M280 700V440" stroke="#e4e1db" strokeWidth="2" />
      </svg>
      {import.meta.env.DEV && <p className="absolute bottom-24 rounded-full bg-white/90 px-4 py-2 font-mono text-[11px] text-mute shadow">dev hint: drop hero.mp4 + hero.webm into public/hero/</p>}
    </div>
  )
}
