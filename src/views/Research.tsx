import { Award, BookOpen, Bot, FileText, HeartPulse, Stethoscope } from 'lucide-react'
import BarChart from '../components/BarChart'
import DetailPane from '../components/DetailPane'
import MasterDetail from '../components/MasterDetail'
import Panel from '../components/Panel'
import { charts } from '../data/charts'
import { projects } from '../data/projects'
import type { Project } from '../data/types'
import type { View } from '../hooks/useRoute'

const ic: Record<Project['category'], typeof Award> = { 'Cardiac AI': HeartPulse, 'Healthcare ML': Stethoscope, 'Agentic AI': Bot, 'Document AI': FileText, Publication: BookOpen }

export default function Research({ id, go }: { id?: string; go: (v: View, id?: string) => void }) {
  const p = projects.find((x) => x.id === id) ?? projects[0]
  const chart = charts[p.id]
  const demo = p.id === 'beatnet' ? { label: 'Try the live ECG detector', v: 'overview' as View } : p.id === 'mcp-data-assistant' ? { label: 'Attack the SQL firewall', v: 'lab' as View, id: 'firewall' } : p.id === 'document-intelligence' ? { label: 'Try the entity tagger', v: 'lab' as View, id: 'ner' } : null

  return (
    <MasterDetail
      selected={p.id}
      onSelect={(i) => go('research', i)}
      items={projects.map((x) => { const I = ic[x.category]; return { id: x.id, title: x.title, sub: x.category, badge: x.badge, icon: <I size={16} /> } })}
    >
      <DetailPane c={{
        eyebrow: `Research file · ${p.category}`, title: p.title, subtitle: p.subtitle,
        tags: p.tags, metrics: p.metrics, pipeline: p.pipeline, pipelineTitle: 'System architecture',
        highlights: p.highlights, highlightsTitle: 'Key insights', links: p.links,
        extra: (
          <>
            {chart && <Panel tag="Results · from the paper" title={chart.title}><BarChart data={chart} /></Panel>}
            {demo && (
              <button onClick={() => go(demo.v, demo.id)} className="panel panel-hover flex w-full items-center justify-between p-4 text-left">
                <span><span className="mono-label block">Interactive</span><span className="text-white">{demo.label}</span></span>
                <span className="btn btn-primary">Open →</span>
              </button>
            )}
          </>
        ),
      }} />
    </MasterDetail>
  )
}
