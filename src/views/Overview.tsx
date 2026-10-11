import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import Counter from '../components/Counter'
import EcgLab from '../components/EcgLab'
import Panel from '../components/Panel'
import { MODULES } from '../components/Sidebar'
import SystemGraph from '../components/SystemGraph'
import { experience } from '../data/experience'
import { papers } from '../data/papers'
import { profile } from '../data/profile'
import type { View } from '../hooks/useRoute'

export default function Overview({ go }: { go: (v: View, id?: string) => void }) {
  const [r, setR] = useState(0)
  useEffect(() => { const t = setInterval(() => setR((x) => (x + 1) % profile.roles.length), 2600); return () => clearInterval(t) }, [])

  const feed = [
    ...experience.filter((e) => e.kind === 'work').slice(0, 3).map((e) => ({ k: 'log' as View, id: e.id, when: e.period, title: e.role, sub: e.org, tag: 'Role' })),
    ...papers.map((p) => ({ k: 'papers' as View, id: p.id, when: '2023', title: p.title, sub: p.publisher, tag: p.award })),
  ]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* identity */}
      <Panel className="lg:col-span-5" bodyClass="p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <span className="absolute inset-0 animate-ring rounded-full border border-cyan-300/60" />
            <span className="absolute inset-0 animate-ring rounded-full border border-cyan-300/60" style={{ animationDelay: '1.2s' }} />
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-gradient-to-br from-cyan-300/20 to-violet-400/20 font-mono text-xl font-bold text-white">AK</span>
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />System status: online</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-cyan-200/80">Specialization: {profile.specialization}</p>
          </div>
        </div>
        <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Abraar <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">Khan</span></h2>
        <div className="mt-2 h-7 font-mono text-base text-cyan-100/90" aria-live="polite">
          <span className="text-cyan-300">&gt; </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={r} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="inline-block">{profile.roles[r]}</motion.span>
          </AnimatePresence>
          <span className="animate-blink text-cyan-300">▍</span>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-300">{profile.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button onClick={() => go('lab')} className="btn btn-primary">Try the AI demos <ArrowRight size={16} /></button>
          <button onClick={() => go('research')} className="btn btn-ghost">Research lab</button>
        </div>
        <div className="mt-5 flex items-center gap-1 border-t border-cyan-300/10 pt-4">
          {[{ h: profile.github, I: Github, l: 'GitHub' }, { h: profile.linkedin, I: Linkedin, l: 'LinkedIn' }, { h: `mailto:${profile.email}`, I: Mail, l: 'Email' }].map(({ h, I, l }) => (
            <a key={l} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={l} className="rounded-lg p-2.5 text-slate-400 transition hover:bg-cyan-300/10 hover:text-cyan-200"><I size={19} /></a>
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} />{profile.location}</span>
        </div>
      </Panel>

      <div className="lg:col-span-7"><EcgLab /></div>

      {/* KPIs */}
      {profile.vitals.map((v, i) => (
        <Panel key={v.label} hover className="sm:col-span-1 lg:col-span-3" bodyClass="p-5">
          <p className="mono-label">{v.label}</p>
          <p className="mt-2 font-mono text-4xl font-semibold text-white"><Counter from={v.from} to={v.to} decimals={v.decimals} suffix={v.suffix} /></p>
          {v.from !== undefined ? (
            <div className="mt-3 space-y-1.5">
              {[['before', v.from, 'bg-slate-500'], ['after', v.to, 'bg-cyan-300']].map(([l, n, c]) => (
                <div key={l as string} className="flex items-center gap-2"><span className="w-10 font-mono text-[10px] text-slate-500">{l}</span><motion.div initial={{ width: 0 }} animate={{ width: `${n}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.9 }} className={`h-1.5 rounded-full ${c}`} /></div>
              ))}
            </div>
          ) : <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700"><motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.4, duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" /></div>}
          <p className="mt-2 text-xs text-slate-500">{v.note}</p>
        </Panel>
      ))}

      <div className="lg:col-span-8"><SystemGraph /></div>

      <Panel className="lg:col-span-4" tag="Activity" title="Recent record" bodyClass="p-2">
        <ul>
          {feed.map((f) => (
            <li key={f.title}>
              <button onClick={() => go(f.k, f.id)} className="group flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-cyan-300/5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] text-cyan-300/70">{f.when} · {f.tag}</span>
                  <span className="block truncate text-sm font-medium text-white">{f.title}</span>
                  <span className="block truncate text-xs text-slate-500">{f.sub}</span>
                </span>
                <ArrowRight size={14} className="mt-2 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-12 lg:grid-cols-6">
        {MODULES.filter((m) => m.view !== 'overview').map(({ view, label, sub, Icon }) => (
          <button key={view} onClick={() => go(view)} className="panel panel-hover group flex items-center gap-3 p-4 text-left">
            <Icon size={20} className="text-cyan-300" />
            <span><span className="block text-sm font-semibold text-white">{label}</span><span className="block text-[11px] text-slate-500">{sub}</span></span>
          </button>
        ))}
      </div>
    </div>
  )
}
