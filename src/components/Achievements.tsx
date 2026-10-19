import { Award, BookOpen, Bug, Search, ShieldAlert, ShieldCheck, Tags, Zap } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Counter from './Counter'

interface A { icon: typeof Award; label: string; caption: string; detail: string; to: number; from?: number; decimals?: number; suffix?: string; prefix?: string }
const ITEMS: A[] = [
  { icon: Award, label: 'Best Paper Award', caption: 'ICCCNet 2023 · Springer LNNS', detail: 'Quantifying exercise form with AI', from: 2000, to: 2023 },
  { icon: BookOpen, label: 'Best Paper Award', caption: 'IConIC 2K23 · AIP Proceedings', detail: 'Predicting fetal health using CNN', from: 2000, to: 2023 },
  { icon: ShieldAlert, label: 'RAG attack success', caption: 'SecureAI-RAG · 250 attacks, 4 families', detail: 'Down from 68.0% with a four-stage defense; 96.5% benign utility kept', from: 68, to: 1.6, decimals: 1, suffix: '%' },
  { icon: Bug, label: 'Malicious-code detection', caption: 'Capstone thesis · Random Forest', detail: '99.31% precision and 98.42% recall on malicious URLs and PE headers', to: 99.45, decimals: 2, suffix: '%' },
  { icon: Zap, label: 'Inference latency cut', caption: 'Streaming ECG service · ONNX', detail: 'Plus +14% arrhythmia F1 and +11% AUC from rebalanced training data', to: 42, suffix: '%' },
  { icon: Search, label: 'Retrieval accuracy', caption: 'Hybrid keyword + FAISS search', detail: 'Across 50K+ forms, up from 72%', to: 88, suffix: '%' },
  { icon: ShieldCheck, label: 'Adversarial refusal', caption: 'Multi-agent data assistant', detail: '6 of 6 benchmark cases refused; 65 firewall attack tests blocked', to: 100, suffix: '%' },
  { icon: Tags, label: 'Strict entity F1', caption: 'Fine-tuned RoBERTa', detail: '3,453 CoNLL-2003 test documents', to: 0.9155, decimals: 4 },
]

export default function Achievements() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const w = wrap.current, t = track.current, b = bar.current
    if (!w || !t || !b) return
    let travel = 0, raf = 0
    const measure = () => {
      travel = Math.max(0, t.scrollWidth - window.innerWidth + 2 * parseFloat(getComputedStyle(t).paddingLeft))
      w.style.height = `${window.innerHeight + travel}px`
      update()
    }
    const update = () => {
      raf = 0
      const r = w.getBoundingClientRect()
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0
      t.style.transform = `translate3d(${-p * travel}px,0,0)`
      b.style.transform = `scaleX(${p})`
      // lift the card nearest the centre
      const mid = window.innerWidth / 2
      let best: HTMLElement | null = null, bd = 1e9
      t.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => { const cr = c.getBoundingClientRect(); const d = Math.abs(cr.left + cr.width / 2 - mid); if (d < bd) { bd = d; best = c } })
      t.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => { c.dataset.near = c === best ? '1' : '0' })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    measure()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', measure)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', measure); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="achievements" aria-label="Achievements">
      <div ref={wrap} className="relative">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="wrap w-full">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="tag mb-4">06 — Achievements</p>
                <h2 className="h2"><span>Proof, </span><em>in numbers.</em></h2>
              </div>
              <div className="hidden w-48 sm:block"><div className="mb-2 flex justify-between font-mono text-[10px] text-mute"><span>scroll</span><span>→</span></div><div className="h-px w-full bg-line"><div ref={bar} className="h-px origin-left bg-ink" style={{ transform: 'scaleX(0)' }} /></div></div>
            </div>
          </div>
          <div ref={track} className="flex w-max gap-5 will-change-transform" style={{ paddingInline: 'var(--gutter)' }}>
            {ITEMS.map((a, i) => (
              <article key={a.label + i} data-card data-near="0" className="group relative flex h-[clamp(260px,36vh,310px)] w-[clamp(300px,40vw,540px)] shrink-0 flex-col justify-between rounded-[28px] bg-white p-6 shadow-[inset_0_0_0_1px_rgba(13,13,13,.08)] transition-all duration-700 data-[near='1']:-translate-y-3 data-[near='1']:shadow-[inset_0_0_0_1px_rgba(13,13,13,.08),0_40px_70px_-30px_rgba(0,0,0,.28)]">
                <div className="flex items-start justify-between">
                  <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-paper"><span aria-hidden className="absolute inset-0 rounded-2xl bg-ink/5 opacity-0 blur-xl transition-opacity duration-700 group-data-[near='1']:opacity-100" /><a.icon size={30} strokeWidth={1.3} /></span>
                  <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')} / {String(ITEMS.length).padStart(2, '0')}</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0"><p className="text-lg font-bold leading-tight tracking-tight">{a.label}</p><p className="mt-1 text-sm text-mute">{a.caption}</p><p className="mt-2 text-[13px] leading-snug text-ink2">{a.detail}</p></div>
                  <p className="shrink-0 font-sans text-[clamp(3rem,6vw,5rem)] font-bold leading-none tracking-[-0.05em]"><Counter from={a.from} to={a.to} decimals={a.decimals} suffix={a.suffix} /></p>
                </div>
              </article>
            ))}
            <div className="flex w-[clamp(200px,24vw,300px)] shrink-0 items-center"><p className="font-serif text-4xl italic text-mute">and counting →</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
