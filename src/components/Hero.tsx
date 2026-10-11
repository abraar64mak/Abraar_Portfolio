import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import Counter from './Counter'
import EcgMonitor from './EcgMonitor'

const LOG = [
  'loading hybrid retriever (bm25 + faiss) … ok',
  'phi_guardrail.mask() armed … ok',
  'ecg_stream.connect(lead=1) … ok',
  'langgraph.agents.ready = 4',
  'sqlglot.firewall: 65/65 attacks blocked',
  'eval.physician_graded: reliability 93%',
]

export default function Hero() {
  const [role, setRole] = useState(0)
  const [bpm, setBpm] = useState(72)
  const [logN, setLogN] = useState(1)

  useEffect(() => {
    const a = setInterval(() => setRole((r) => (r + 1) % profile.roles.length), 2600)
    const b = setInterval(() => setBpm((v) => Math.max(66, Math.min(78, v + Math.round((Math.random() - 0.5) * 4)))), 1800)
    const c = setInterval(() => setLogN((n) => (n >= LOG.length ? 1 : n + 1)), 1700)
    return () => { clearInterval(a); clearInterval(b); clearInterval(c) }
  }, [])

  return (
    <section id="console" className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider">
          <span className="flex items-center gap-2 text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ring rounded-full bg-emerald-400" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            System status: online
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-200/90">Specialization: {profile.specialization}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-7 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {profile.name.split(' ')[0]}{' '}
          <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">{profile.name.split(' ')[1]}</span>
        </motion.h1>

        <div className="mt-4 h-8 font-mono text-lg text-cyan-100/90 sm:text-xl" aria-live="polite">
          <span className="text-cyan-300">&gt; </span>
          <AnimatePresence mode="wait">
            <motion.span key={role} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="inline-block">
              {profile.roles[role]}
            </motion.span>
          </AnimatePresence>
          <span className="animate-blink text-cyan-300">▍</span>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          {profile.summary}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#projects" className="btn btn-primary">Explore research <ArrowDown size={16} /></a>
          <a href="#experience" className="btn btn-ghost">Open clinical log</a>
          <div className="ml-1 flex items-center gap-1">
            {[
              { href: profile.github, Icon: Github, label: 'GitHub' },
              { href: profile.linkedin, Icon: Linkedin, label: 'LinkedIn' },
              { href: `mailto:${profile.email}`, Icon: Mail, label: 'Email' },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label} className="rounded-lg p-2.5 text-slate-400 transition hover:bg-cyan-300/10 hover:text-cyan-200">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
        <p className="mt-5 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} />{profile.location}</p>
      </div>

      {/* research console */}
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="glass relative overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-cyan-300/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400/70" /><span className="h-2 w-2 rounded-full bg-amber-300/70" /><span className="h-2 w-2 rounded-full bg-emerald-400/70" /></span>
          <span>biometric-console · lead I</span>
        </div>

        <div className="relative px-4 pt-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="mono-label">Heart rate · simulated</div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-semibold tabular-nums text-white">{bpm}</span>
                <span className="font-mono text-sm text-cyan-300">BPM</span>
              </div>
            </div>
            <div className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute h-full w-full animate-ring rounded-full border border-cyan-300/60" />
              <span className="absolute h-full w-full animate-ring rounded-full border border-cyan-300/60" style={{ animationDelay: '1.2s' }} />
              <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_#22d3ee]" />
            </div>
          </div>
          <div className="mt-2 h-32"><EcgMonitor bpm={bpm} /></div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-cyan-300/10 border-y border-cyan-300/10">
          {profile.vitals.map((v) => (
            <div key={v.label} className="bg-ink-800/80 p-4">
              <div className="font-mono text-2xl font-semibold text-cyan-200">
                <Counter from={v.from} to={v.to} decimals={v.decimals} suffix={v.suffix} />
              </div>
              <div className="mt-0.5 text-xs font-medium text-slate-200">{v.label}</div>
              <div className="text-[11px] text-slate-500">{v.note}</div>
            </div>
          ))}
        </div>

        <div className="h-28 overflow-hidden bg-ink-950/60 p-4 font-mono text-[11px] leading-6 text-emerald-300/80" aria-hidden>
          {LOG.slice(0, logN).map((l, i) => (
            <motion.div key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={i === logN - 1 ? 'text-emerald-200' : 'text-emerald-300/50'}>
              <span className="text-cyan-300/60">▸</span> {l}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
