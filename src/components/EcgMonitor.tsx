import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotionSafe'

const g = (x: number, mu: number, s: number, a: number) => a * Math.exp(-((x - mu) ** 2) / (2 * s * s))

/** One synthetic PQRST beat, phase 0..1 */
export const ecgBeat = (p: number) =>
  g(p, 0.16, 0.025, 0.14) + // P
  g(p, 0.285, 0.008, -0.16) + // Q
  g(p, 0.31, 0.01, 1) + // R
  g(p, 0.335, 0.01, -0.28) + // S
  g(p, 0.56, 0.045, 0.3) // T

interface Props { bpm: number; className?: string }

export default function EcgMonitor({ bpm, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const bpmRef = useRef(bpm)
  const reduced = usePrefersReducedMotion()
  bpmRef.current = bpm

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, raf = 0, visible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)

    const SPEED = 140 // px / s
    let t = 0, last = performance.now()
    const buf: number[] = []
    // prefill so the trace spans the panel immediately
    const period0 = 60 / bpmRef.current
    for (let i = 0; i < Math.ceil(w); i++) buf.push(ecgBeat(((i / SPEED) % period0) / period0))

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!visible) return
      t += dt
      const cols = Math.ceil(w)
      const period = 60 / bpmRef.current
      // advance buffer by pixels travelled
      const steps = Math.max(1, Math.round(dt * SPEED))
      for (let i = 0; i < steps; i++) {
        const tt = t - (steps - i) / SPEED
        const phase = (((tt % period) + period) % period) / period
        buf.push(ecgBeat(phase) + (Math.random() - 0.5) * 0.012)
      }
      while (buf.length > cols) buf.shift()

      ctx.clearRect(0, 0, w, h)
      // grid
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 24) { ctx.strokeStyle = 'rgba(34,211,238,0.06)'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 24) { ctx.strokeStyle = 'rgba(34,211,238,0.06)'; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      const base = h * 0.68, amp = h * 0.55
      ctx.lineJoin = 'round'; ctx.lineCap = 'round'
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 12
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, 'rgba(34,211,238,0)'); grad.addColorStop(0.5, 'rgba(34,211,238,0.9)'); grad.addColorStop(1, '#a5f3fc')
      ctx.strokeStyle = grad; ctx.lineWidth = 2
      ctx.beginPath()
      const off = cols - buf.length
      buf.forEach((v, i) => { const x = off + i, y = base - v * amp; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) })
      ctx.stroke()
      ctx.shadowBlur = 0
      // sweep dot
      const lx = cols - 1, ly = base - (buf[buf.length - 1] ?? 0) * amp
      ctx.fillStyle = '#ecfeff'; ctx.beginPath(); ctx.arc(lx - 2, ly, 3, 0, Math.PI * 2); ctx.fill()
    }

    if (reduced) {
      // static trace
      const cols = Math.ceil(w)
      for (let i = 0; i < cols; i++) buf.push(ecgBeat(((i / 140) / (60 / bpmRef.current)) % 1))
      last = performance.now()
      frame(last); cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(frame)
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [reduced])

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-label="Animated ECG trace" role="img" />
}
