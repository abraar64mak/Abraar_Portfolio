import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { PipelineStep } from '../data/types'

/** Interactive architecture flow: hover/click a stage to read what it does. */
export default function PipelineFlow({ steps }: { steps: PipelineStep[] }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch" role="tablist" aria-label="Architecture stages">
        {steps.map((s, i) => {
          const on = i === active
          return (
            <li key={s.title} className="flex flex-1 items-center gap-2">
              <button
                role="tab"
                aria-selected={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                  on ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-cyan-300/10 bg-ink-900/60 hover:border-cyan-300/30'
                }`}
              >
                <span className="font-mono text-[10px] text-cyan-300/60">0{i + 1}</span>
                <span className={`mt-0.5 block text-sm font-semibold leading-snug ${on ? 'text-white' : 'text-slate-300'}`}>{s.title}</span>
                {on && <motion.span layoutId={`pipe-glow-${steps[0].title}`} className="absolute inset-0 -z-10 rounded-lg shadow-[0_0_28px_-4px_rgba(34,211,238,0.5)]" />}
              </button>
              {i < steps.length - 1 && <span aria-hidden className="hidden text-cyan-300/40 sm:block">→</span>}
            </li>
          )
        })}
      </ol>
      <div className="mt-3 min-h-[3.5rem] rounded-lg border border-cyan-300/10 bg-ink-900/60 p-4" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-sm leading-relaxed text-slate-300"
          >
            <span className="mono-label mr-2">stage {active + 1}</span>
            {steps[active].desc}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
