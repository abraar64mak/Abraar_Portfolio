import { useState } from 'react'
import FirewallDemo from './demos/FirewallDemo'
import NerDemo from './demos/NerDemo'
import RagDemo from './demos/RagDemo'
import EcgLab from './EcgLab'
import Panel from './Panel'
import SectionHead from './SectionHead'
import SystemGraph from './SystemGraph'

const TABS = [
  { id: 'ecg', label: 'ECG landmarks', hint: 'BeatNet-style' },
  { id: 'rag', label: 'Clinical RAG', hint: 'hybrid retrieval + PHI guard' },
  { id: 'firewall', label: 'SQL firewall', hint: 'agent security' },
  { id: 'ner', label: 'Entity tagger', hint: 'document AI' },
  { id: 'flow', label: 'Pipeline', hint: 'production RAG' },
] as const

export default function Lab() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('ecg')
  const cur = TABS.find((t) => t.id === tab)!
  return (
    <section id="lab" className="section">
      <div className="wrap">
        <SectionHead tag="04 — Live lab" title="Don’t take my word." accent="Try it." className="mb-10" />
        <p className="rv mb-8 max-w-xl text-lg text-ink2">Small, working versions of the systems I build. Inject an arrhythmia, attack a firewall, retrieve from a chart.</p>

        {/* dark “instrument” card: the one dark surface on the page, contained and rounded */}
        <div className="dark-scope rv rounded-[32px] bg-ink-950 p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)] sm:p-5">
          <div role="tablist" aria-label="Demos" className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${tab === t.id ? 'bg-white text-ink' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>{t.label}</button>
            ))}
          </div>
          <div key={tab}>
            {tab === 'ecg' && <EcgLab />}
            {tab === 'rag' && <Panel tag="Live lab · simulation" title={cur.label} bodyClass="p-5 sm:p-6"><RagDemo /></Panel>}
            {tab === 'firewall' && <Panel tag="Live lab · simulation" title={cur.label} bodyClass="p-5 sm:p-6"><FirewallDemo /></Panel>}
            {tab === 'ner' && <Panel tag="Live lab · simulation" title={cur.label} bodyClass="p-5 sm:p-6"><NerDemo /></Panel>}
            {tab === 'flow' && <SystemGraph />}
          </div>
        </div>
      </div>
    </section>
  )
}
