import { useEffect, useRef, useState, type RefObject } from 'react'
import { scrollToTarget } from '../lib/scroll'

interface Msg { t: number; text: string; cta?: boolean }
/** When each message "arrives", in seconds into the 7.2 s hero loop (timed to the lip movement). */
const MSGS: Msg[] = [
  { t: 0.5, text: 'Hi, I’m Abraar.' },
  { t: 1.9, text: 'I build production AI systems: RAG, agents and document intelligence.' },
  { t: 3.8, text: 'LLM work: LangGraph agents, RAG and evaluation.' },
  { t: 5.4, text: 'Open to AI roles. Let’s talk →', cta: true },
]
const TYPING = 0.6      // typing dots show this long before a message lands
const FALLBACK_LOOP = 8 // seconds, used when there is no video to follow

/** Seconds into the loop. Follows the video when there is one, otherwise runs its own clock. */
function usePlayhead(video: RefObject<HTMLVideoElement>, follow: boolean) {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf = 0, last = -1
    const t0 = performance.now()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const v = video.current
      const now = follow && v ? v.currentTime : ((performance.now() - t0) / 1000) % FALLBACK_LOOP
      const q = Math.round(now * 12) / 12
      if (q !== last) { last = q; setT(q) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [video, follow])
  return t
}

const Dots = () => (
  <span className="flex items-center gap-1 px-1 py-1.5" aria-hidden>
    {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-faint" style={{ animationDelay: `${i * 150}ms` }} />)}
  </span>
)

/** Chat-style messages that pop in beside the avatar, as if he were speaking. Silent by design. */
export default function SpeechBubbles({ video, follow, loopSec }: { video: RefObject<HTMLVideoElement>; follow: boolean; loopSec: number }) {
  const t = usePlayhead(video, follow)
  const reduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const end = follow ? loopSec : FALLBACK_LOOP
  const fading = !reduced && t > end - 0.55   // clear the thread just before the loop restarts

  return (
    <div
      className={`absolute left-[62%] top-[6%] z-10 w-[135px] space-y-2 transition-opacity duration-500 sm:left-[62%] sm:w-[230px] lg:top-[10%] lg:w-[300px] ${fading ? 'opacity-0' : 'opacity-100'}`}
      role="log" aria-label="Short introduction"
    >
      <p className="tag flex items-center gap-1.5 !text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-ink" />Abraar</p>
      {MSGS.map((m, i) => {
        const shown = reduced || t >= m.t
        const typing = !reduced && !shown && t >= m.t - TYPING && (i === 0 || t >= MSGS[i - 1].t)
        return (
          <div key={m.text} className="min-h-[2.2rem]">
            <div
              className={`pointer-events-auto w-fit max-w-full origin-top-left rounded-2xl rounded-tl-md px-3.5 py-2 text-[11.5px] leading-snug shadow-[inset_0_0_0_1px_rgba(13,13,13,.1),0_12px_30px_-16px_rgba(0,0,0,.3)] transition-all duration-500 sm:text-[13.5px] ${
                shown || typing ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-90 opacity-0'
              } ${m.cta ? 'bg-ink text-white' : 'bg-white text-ink'}`}
              style={{ transitionTimingFunction: 'var(--ease)' }}
            >
              {typing ? <Dots /> : m.cta ? (
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget('contact') }} className="font-medium">{m.text}</a>
              ) : m.text}
            </div>
          </div>
        )
      })}
    </div>
  )
}
