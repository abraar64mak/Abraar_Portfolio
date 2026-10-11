import { motion } from 'framer-motion'
import { Activity, BookOpen, Brain, FlaskConical, Github, HeartPulse, Layers, Linkedin, Mail, Stethoscope, X } from 'lucide-react'
import { profile } from '../data/profile'
import type { View } from '../hooks/useRoute'

export const MODULES: { view: View; label: string; sub: string; Icon: typeof Activity; key: string }[] = [
  { view: 'overview', label: 'Overview', sub: 'Live console', Icon: HeartPulse, key: '1' },
  { view: 'log', label: 'Clinical Log', sub: 'Experience & education', Icon: Stethoscope, key: '2' },
  { view: 'research', label: 'Research Lab', sub: 'Projects', Icon: FlaskConical, key: '3' },
  { view: 'lab', label: 'AI Lab', sub: 'Interactive demos', Icon: Brain, key: '4' },
  { view: 'skills', label: 'Skills Map', sub: 'Stack explorer', Icon: Layers, key: '5' },
  { view: 'papers', label: 'Publications', sub: 'Peer-reviewed', Icon: BookOpen, key: '6' },
  { view: 'contact', label: 'Contact', sub: 'Open channel', Icon: Mail, key: '7' },
]

interface Props { active: View; onGo: (v: View) => void; open: boolean; onClose: () => void }

export default function Sidebar({ active, onGo, open, onClose }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cyan-300/10 bg-ink-900/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-cyan-300/10 px-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-300/10 text-cyan-300">
              <span className="absolute inset-0 animate-ring rounded-lg border border-cyan-300/50" />
              <Activity size={16} />
            </span>
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold text-white">abraar<span className="text-cyan-300">.khan</span></p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">AI · healthcare</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Modules">
          <p className="mono-label px-2 pb-1 pt-2">Modules</p>
          {MODULES.map(({ view, label, sub, Icon, key }) => {
            const on = active === view
            return (
              <button key={view} onClick={() => { onGo(view); onClose() }} aria-current={on ? 'page' : undefined} className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${on ? 'text-white' : 'text-slate-400 hover:bg-cyan-300/5 hover:text-white'}`}>
                {on && <motion.span layoutId="side-active" className="absolute inset-0 rounded-lg border border-cyan-300/30 bg-cyan-300/10" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                {on && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />}
                <Icon size={18} className={`relative ${on ? 'text-cyan-300' : ''}`} />
                <span className="relative flex-1"><span className="block text-sm font-medium">{label}</span><span className="block text-[11px] text-slate-500">{sub}</span></span>
                <kbd className="relative hidden rounded border border-cyan-300/15 px-1.5 font-mono text-[10px] text-slate-500 lg:block">{key}</kbd>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-cyan-300/10 p-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-300"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ring rounded-full bg-emerald-400" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>System online</div>
          <div className="mt-3 flex gap-1.5">
            {[{ h: profile.github, I: Github, l: 'GitHub' }, { h: profile.linkedin, I: Linkedin, l: 'LinkedIn' }, { h: `mailto:${profile.email}`, I: Mail, l: 'Email' }].map(({ h, I, l }) => (
              <a key={l} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={l} className="flex h-9 flex-1 items-center justify-center rounded-lg border border-cyan-300/15 text-slate-400 transition hover:border-cyan-300/50 hover:text-cyan-200"><I size={16} /></a>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
