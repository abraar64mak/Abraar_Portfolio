import { Briefcase, GraduationCap } from 'lucide-react'
import DetailPane from '../components/DetailPane'
import MasterDetail from '../components/MasterDetail'
import { experience } from '../data/experience'
import type { View } from '../hooks/useRoute'

export default function Log({ id, go }: { id?: string; go: (v: View, id?: string) => void }) {
  const e = experience.find((x) => x.id === id) ?? experience[0]
  return (
    <MasterDetail
      selected={e.id}
      onSelect={(i) => go('log', i)}
      items={experience.map((x) => ({ id: x.id, title: x.org, sub: `${x.role} · ${x.period}`, icon: x.kind === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} /> }))}
    >
      <DetailPane c={{
        eyebrow: `Case file · ${e.kind === 'work' ? 'Experience' : 'Academic'}`,
        title: e.role, subtitle: e.org, meta: `${e.period} · ${e.location}`,
        tags: e.tags, metrics: e.metrics, pipeline: e.pipeline, pipelineTitle: 'Technical architecture',
        highlights: e.highlights, highlightsTitle: 'Key contributions', closing: { label: 'Impact', text: e.impact },
      }} />
    </MasterDetail>
  )
}
