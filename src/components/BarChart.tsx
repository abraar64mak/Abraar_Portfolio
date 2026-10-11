import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ChartData } from '../data/charts'

/** Interactive grouped bar chart: pick a metric, hover a bar. Best value is highlighted. */
export default function BarChart({ data, tone = 'dark' }: { data: ChartData; tone?: 'dark' | 'light' }) {
  const L = tone === 'light'
  const [mi, setMi] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const m = data.metrics[mi]
  const lo = m.lowerIsBetter
  const max = Math.max(...m.values)
  const min = Math.min(...m.values)
  // zoomed baseline so small differences are visible; axis is labelled
  const floor = m.unit === '%' ? Math.floor(min - 4) : 0
  const ceil = m.unit === '%' ? Math.min(100, Math.ceil(max + 1)) : max * 1.15
  const best = lo ? min : max
  const pct = (v: number) => ((v - floor) / (ceil - floor)) * 100

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Metric" className="flex flex-wrap gap-1.5">
          {data.metrics.map((x, i) => (
            <button key={x.name} onClick={() => setMi(i)} aria-pressed={i === mi} className={`rounded-md border px-2.5 py-1 font-mono text-xs transition ${L ? (i === mi ? 'border-ink bg-ink text-white' : 'border-ink/15 text-mute hover:text-ink') : i === mi ? 'border-cyan-300/60 bg-cyan-300/15 text-white' : 'border-cyan-300/15 text-slate-400 hover:text-white'}`}>
              {x.name}
            </button>
          ))}
        </div>
        <span className={`font-mono text-[11px] ${L ? 'text-faint' : 'text-slate-500'}`}>{data.source}</span>
      </div>

      <div className={`flex h-52 items-end gap-3 border-b border-l ${L ? 'border-ink/20' : 'border-cyan-300/20'} px-3 pt-4`}>
        {m.values.map((v, i) => {
          const isBest = v === best
          const on = hover === i
          return (
            <div key={data.groups[i]} className="group flex h-full flex-1 flex-col items-center justify-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <span className={`mb-1 font-mono text-xs transition ${on || isBest ? (L ? 'text-ink' : 'text-white') : L ? 'text-faint' : 'text-slate-500'}`}>{m.unit === '%' ? v.toFixed(2) : v.toFixed(4)}{m.unit}</span>
              <motion.div
                key={m.name}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct(v), 3)}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                className={`w-full max-w-[72px] rounded-t-md ${L ? (isBest ? 'bg-ink' : 'bg-[#cfccc6]') : isBest ? 'bg-gradient-to-t from-cyan-500/40 to-cyan-300 shadow-[0_0_24px_-4px_#22d3ee]' : 'bg-gradient-to-t from-slate-600/30 to-slate-500/70'} ${on ? 'brightness-110' : ''}`}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 px-3 pt-2">
        {data.groups.map((g) => <div key={g} className={`flex-1 text-center text-[11px] leading-tight ${L ? 'text-mute' : 'text-slate-400'}`}>{g}</div>)}
      </div>
      <p className={`mt-3 font-mono text-[11px] ${L ? 'text-faint' : 'text-slate-500'}`}>
        {m.unit === '%' ? `Axis starts at ${floor}% to make differences visible. ` : ''}{lo ? 'Lower is better.' : 'Higher is better.'} Highlighted bar = best.
      </p>
    </div>
  )
}
