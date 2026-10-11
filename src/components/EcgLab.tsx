import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotionSafe'
import Panel from './Panel'

type Rhythm = 'normal' | 'tachy' | 'pvc' | 'afib'
type Kind = 'N' | 'V' | 'A'
interface Beat { t: number; kind: Kind }
interface Stats { hr: number; rr: number; qrs: number; probs: Record<Rhythm, number>; label: Rhythm }

const RHYTHMS: { id: Rhythm; label: string; full: string }[] = [
  { id: 'normal', label: 'Normal', full: 'Normal sinus rhythm' },
  { id: 'tachy', label: 'Tachy', full: 'Sinus tachycardia' },
  { id: 'pvc', label: 'PVC', full: 'Premature ventricular contraction' },
  { id: 'afib', label: 'AFib', full: 'Atrial fibrillation' },
]
const g = (x: number, mu: number, s: number, a: number) => a * Math.exp(-((x - mu) ** 2) / (2 * s * s))

const shape = (k: Kind, d: number) =>
  k === 'V'
    ? g(d, 0, 0.034, 1.1) + g(d, 0.07, 0.03, -0.25) + g(d, 0.3, 0.065, -0.4)
    : (k === 'N' ? g(d, -0.16, 0.025, 0.14) : 0) + g(d, -0.028, 0.009, -0.15) + g(d, 0, 0.011, 1) + g(d, 0.028, 0.01, -0.26) + g(d, 0.26, 0.05, 0.3)

const LM: Record<Kind, { n: string; d: number; a: number; c: string }[]> = {
  N: [{ n: 'P', d: -0.16, a: 0.14, c: '#22d3ee' }, { n: 'Q', d: -0.028, a: -0.15, c: '#a78bfa' }, { n: 'R', d: 0, a: 1, c: '#fb7185' }, { n: 'S', d: 0.028, a: -0.26, c: '#a78bfa' }, { n: 'T', d: 0.26, a: 0.3, c: '#2dd4bf' }],
  A: [{ n: 'Q', d: -0.028, a: -0.15, c: '#a78bfa' }, { n: 'R', d: 0, a: 1, c: '#fb7185' }, { n: 'S', d: 0.028, a: -0.26, c: '#a78bfa' }, { n: 'T', d: 0.26, a: 0.3, c: '#2dd4bf' }],
  V: [{ n: 'PVC', d: 0, a: 1.1, c: '#fbbf24' }, { n: 'T′', d: 0.3, a: -0.4, c: '#fbbf24' }],
}

export default function EcgLab() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [rhythm, setRhythm] = useState<Rhythm>('normal')
  const [bpm, setBpm] = useState(72)
  const [overlay, setOverlay] = useState(true)
  const [paused, setPaused] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const reduced = usePrefersReducedMotion()

  // live-tunable params read inside the animation loop
  const live = useRef({ rhythm, bpm, overlay, paused })
  live.current = { rhythm, bpm, overlay, paused }
  // when the rhythm changes, the loop discards pre-generated beats and re-acquires
  const changed = useRef(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    changed.current = true; setStats(null)
  }, [rhythm])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0, visible = true, lastStats = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(canvas)

    const SPEED = 170
    let simT = 6
    let k = 0
    let since = 0
    const beats: Beat[] = []
    const nextBeat = (): Beat => {
      const { rhythm: r, bpm: b } = live.current
      const base = r === 'tachy' ? 60 / 132 : 60 / b
      const last = beats[beats.length - 1]?.t ?? 0
      let kind: Kind = 'N', rr = base * (1 + (Math.sin(k * 12.9898) * 0.02))
      if (r === 'pvc') {
        if (k % 5 === 4) { kind = 'V'; rr = base * 0.62 } else if (k % 5 === 0 && k > 0) rr = base * 1.38
      } else if (r === 'afib') { kind = 'A'; rr = 0.36 + Math.abs(Math.sin(k * 78.233) * 0.6) }
      k++
      return { t: last + rr, kind }
    }
    beats.push({ t: 0, kind: 'N' })
    while (beats[beats.length - 1].t < simT + 0.5) beats.push(nextBeat())

    const val = (t: number) => {
      let v = 0
      for (const b of beats) { const d = t - b.t; if (d > -0.4 && d < 0.7) v += shape(b.kind, d) }
      if (live.current.rhythm === 'afib') v += 0.05 * Math.sin(2 * Math.PI * 5.8 * t) + 0.03 * Math.sin(2 * Math.PI * 8.7 * t + 1)
      return v + Math.sin(t * 91) * 0.004 + Math.sin(t * 37.7) * 0.003
    }

    let prev = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - prev) / 1000, 0.05); prev = now
      if (!visible) return
      if (changed.current) {
        changed.current = false
        since = simT
        while (beats.length > 1 && beats[beats.length - 1].t > simT) beats.pop()
        k = 0
      }
      if (!live.current.paused) {
        simT += dt
        while (beats[beats.length - 1].t < simT + 0.5) beats.push(nextBeat())
        while (beats.length > 40 && beats[1].t < simT - 8) beats.shift()
      }
      ctx.clearRect(0, 0, w, h)
      const base = h * 0.7, amp = h * 0.4
      const X = (t: number) => w - (simT - t) * SPEED
      const Y = (v: number) => base - v * amp

      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 10
      ctx.beginPath()
      for (let x = 0; x <= w; x += 1.5) { const y = Y(val(simT - (w - x) / SPEED)); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
      ctx.stroke(); ctx.shadowBlur = 0

      if (live.current.overlay) {
        ctx.font = '600 10px "JetBrains Mono", monospace'; ctx.textAlign = 'center'
        const vis = beats.filter((b) => X(b.t) > -40 && X(b.t) < w + 10)
        // QRS shading + landmarks
        vis.forEach((b) => {
          const half = b.kind === 'V' ? 0.075 : 0.045
          ctx.fillStyle = b.kind === 'V' ? 'rgba(251,191,36,0.10)' : 'rgba(251,113,133,0.10)'
          ctx.fillRect(X(b.t - half), 8, X(b.t + half) - X(b.t - half), h - 16)
          LM[b.kind].forEach((l) => {
            const x = X(b.t + l.d); if (x < 8 || x > w - 8) return
            const y = Y(l.a + 0)
            ctx.fillStyle = l.c; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 6.3); ctx.fill()
            ctx.fillText(l.n, x, l.a >= 0 ? y - 9 : y + 17)
          })
        })
        // RR interval bracket on the two most recent R peaks in view
        const rs = vis.filter((b) => X(b.t) > 10 && X(b.t) < w - 10).slice(-2)
        if (rs.length === 2) {
          const x1 = X(rs[0].t), x2 = X(rs[1].t), y = 22
          ctx.strokeStyle = 'rgba(251,113,133,0.8)'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.moveTo(x1, y - 4); ctx.lineTo(x1, y + 4); ctx.moveTo(x2, y - 4); ctx.lineTo(x2, y + 4); ctx.stroke()
          ctx.fillStyle = '#fda4af'; ctx.fillText(`RR ${Math.round((rs[1].t - rs[0].t) * 1000)} ms`, (x1 + x2) / 2, y - 6)
        }
      }

      if (now - lastStats > 400) {
        lastStats = now
        const done = beats.filter((b) => b.t <= simT)
        const rec = done.filter((b) => b.t >= since).slice(-8)
        if (rec.length >= 5) {
          const rrs = rec.slice(1).map((b, i) => b.t - rec[i].t)
          const mean = rrs.reduce((a, c) => a + c, 0) / rrs.length
          const sd = Math.sqrt(rrs.reduce((a, c) => a + (c - mean) ** 2, 0) / rrs.length)
          const irr = sd / mean, hr = 60 / mean
          const hasV = rec.some((b) => b.kind === 'V')
          const s: Record<Rhythm, number> = { normal: 0.15, tachy: 0.05, pvc: 0.05, afib: 0.05 }
          if (irr > 0.12 && !hasV) s.afib += 2.6
          if (hasV) s.pvc += 2.6
          if (hr > 100 && irr <= 0.12 && !hasV) s.tachy += 2.4
          if (irr <= 0.12 && hr <= 100 && !hasV) s.normal += 2.6
          const tot = Object.values(s).reduce((a, c) => a + c, 0)
          const probs = Object.fromEntries(Object.entries(s).map(([a, c]) => [a, c / tot])) as Record<Rhythm, number>
          const label = (Object.keys(probs) as Rhythm[]).sort((a, c) => probs[c] - probs[a])[0]
          setStats({ hr: Math.round(hr), rr: Math.round(rrs[rrs.length - 1] * 1000), qrs: rec[rec.length - 1].kind === 'V' ? 148 : 92, probs, label })
        }
      }
    }
    if (reduced) { frame(performance.now()); cancelAnimationFrame(raf) } else raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [reduced])

  const pred = stats ? RHYTHMS.find((r) => r.id === stats.label)! : null
  const alert = stats && stats.label !== 'normal'

  return (
    <Panel
      tag="Module 01 · BeatNet-style inference"
      title="Single-lead ECG · fiducial detection & rhythm classification"
      bodyClass="p-0"
      right={
        <span className={`flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${paused ? 'border-amber-300/40 text-amber-200' : 'border-emerald-400/40 text-emerald-300'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${paused ? 'bg-amber-300' : 'animate-pulse bg-emerald-400'}`} />{paused ? 'frozen' : 'live'}
        </span>
      }
    >
      <div className="grid lg:grid-cols-[1fr_250px]">
        <div>
          <div className="ecg-paper relative h-60 border-b border-cyan-300/10 sm:h-72">
            <canvas ref={ref} className="block h-full w-full" role="img" aria-label="Live synthetic ECG with detected P, Q, R, S, T landmarks" />
            <span className="absolute bottom-2 left-3 font-mono text-[10px] text-slate-500">LEAD I · 25 mm/s · synthetic signal</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4">
            <div role="group" aria-label="Inject rhythm" className="flex flex-wrap gap-1.5">
              {RHYTHMS.map((r) => (
                <button key={r.id} onClick={() => setRhythm(r.id)} aria-pressed={rhythm === r.id} className={`rounded-md border px-3 py-1.5 font-mono text-xs transition ${rhythm === r.id ? 'border-cyan-300/70 bg-cyan-300/15 text-white shadow-[0_0_18px_-6px_#22d3ee]' : 'border-cyan-300/15 text-slate-400 hover:text-white'}`}>{r.label}</button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label className={`flex items-center gap-2 font-mono text-xs ${rhythm === 'normal' ? 'text-slate-300' : 'text-slate-600'}`}>
                {bpm} bpm
                <input type="range" min={45} max={110} value={bpm} disabled={rhythm !== 'normal'} onChange={(e) => setBpm(+e.target.value)} className="w-24 accent-cyan-300" aria-label="Heart rate" />
              </label>
              <button onClick={() => setOverlay((o) => !o)} aria-pressed={overlay} className={`rounded-md border px-3 py-1.5 font-mono text-xs transition ${overlay ? 'border-rose-300/50 bg-rose-300/10 text-rose-200' : 'border-cyan-300/15 text-slate-400'}`}>Landmarks</button>
              <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Resume' : 'Freeze'} className="rounded-md border border-cyan-300/15 p-1.5 text-slate-300 transition hover:border-cyan-300/50 hover:text-white">{paused ? <Play size={15} /> : <Pause size={15} />}</button>
            </div>
          </div>
        </div>

        <aside className="border-t border-cyan-300/10 p-4 lg:border-l lg:border-t-0">
          <p className="mono-label">Classifier output</p>
          <div className={`mt-2 rounded-lg border p-3 transition-colors ${alert ? 'border-amber-300/40 bg-amber-300/10' : 'border-emerald-400/30 bg-emerald-400/10'}`}>
            <div className={`font-mono text-[10px] uppercase tracking-wider ${alert ? 'text-amber-200' : 'text-emerald-300'}`}>{alert ? '⚠ Abnormal' : '● Normal'}</div>
            <div className="mt-0.5 text-sm font-semibold leading-snug text-white">{pred?.full ?? 'Acquiring…'}</div>
          </div>
          <div className="mt-3 space-y-2">
            {RHYTHMS.map((r) => {
              const p = stats?.probs[r.id] ?? 0
              return (
                <div key={r.id}>
                  <div className="flex justify-between font-mono text-[11px] text-slate-400"><span>{r.label}</span><span>{(p * 100).toFixed(0)}%</span></div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-ink-700"><div className={`h-full rounded-full transition-all duration-500 ${stats?.label === r.id ? 'bg-cyan-300' : 'bg-slate-600'}`} style={{ width: `${p * 100}%` }} /></div>
                </div>
              )
            })}
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[['HR', stats?.hr ?? '–', 'bpm'], ['RR', stats?.rr ?? '–', 'ms'], ['QRS', stats?.qrs ?? '–', 'ms']].map(([a, b, c]) => (
              <div key={a as string} className="rounded-md bg-ink-900/70 py-2"><dt className="font-mono text-[10px] text-slate-500">{a}</dt><dd className="font-mono text-lg font-semibold text-white">{b}</dd><dd className="font-mono text-[10px] text-slate-500">{c}</dd></div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Illustrative demo on a synthetic signal. Output comes from simple rules to show the idea, not from the trained BeatNet model.</p>
        </aside>
      </div>
    </Panel>
  )
}
