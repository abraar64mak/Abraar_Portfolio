import { Brain, Database, ShieldCheck, Tags } from 'lucide-react'
import FirewallDemo from '../components/demos/FirewallDemo'
import NerDemo from '../components/demos/NerDemo'
import RagDemo from '../components/demos/RagDemo'
import Panel from '../components/Panel'
import type { View } from '../hooks/useRoute'

const TABS = [
  { id: 'rag', label: 'Clinical RAG', sub: 'hybrid retrieval + PHI guard', Icon: Database, C: RagDemo },
  { id: 'firewall', label: 'SQL Firewall', sub: 'agent security', Icon: ShieldCheck, C: FirewallDemo },
  { id: 'ner', label: 'Entity Tagger', sub: 'document intelligence', Icon: Tags, C: NerDemo },
]

export default function Lab({ id, go }: { id?: string; go: (v: View, id?: string) => void }) {
  const tab = TABS.find((t) => t.id === id) ?? TABS[0]
  const { C } = tab
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="tablist" aria-label="Demos">
        {TABS.map((t) => {
          const on = t.id === tab.id
          return (
            <button key={t.id} role="tab" aria-selected={on} onClick={() => go('lab', t.id)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${on ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_30px_-10px_#22d3ee]' : 'border-cyan-300/10 bg-ink-800/50 hover:border-cyan-300/35'}`}>
              <t.Icon size={22} className={on ? 'text-cyan-300' : 'text-slate-500'} />
              <span><span className="block font-semibold text-white">{t.label}</span><span className="block text-xs text-slate-500">{t.sub}</span></span>
            </button>
          )
        })}
      </div>
      <Panel tag="AI Lab · interactive" title={tab.label} right={<span className="hidden items-center gap-1.5 font-mono text-[11px] text-violet-300 sm:flex"><Brain size={13} />simulation</span>} bodyClass="p-5 sm:p-6">
        <C key={tab.id} />
      </Panel>
      <button onClick={() => go('overview')} className="panel panel-hover flex w-full items-center justify-between p-4 text-left">
        <span><span className="mono-label block">Also interactive</span><span className="text-white">Live ECG landmark detector on the Overview</span></span>
        <span className="btn btn-ghost">Open →</span>
      </button>
    </div>
  )
}
