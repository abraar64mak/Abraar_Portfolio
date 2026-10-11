export interface Metric { label: string; value: string; note?: string }
export interface LinkItem { label: string; href: string; kind: 'github' | 'paper' | 'web' }
export interface PipelineStep { title: string; desc: string }

export interface Experience {
  id: string
  org: string
  role: string
  period: string
  location: string
  kind: 'work' | 'academic'
  summary: string
  tags: string[]
  highlights: string[]
  pipeline: PipelineStep[]
  metrics: Metric[]
  impact: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  category: 'Cardiac AI' | 'Healthcare ML' | 'Agentic AI' | 'Document AI' | 'Publication'
  blurb: string
  tags: string[]
  metrics: Metric[]
  pipeline: PipelineStep[]
  highlights: string[]
  links: LinkItem[]
  badge?: string
}

export type Domain = 'AI / ML' | 'Data Engineering' | 'Frameworks & Languages' | 'Systems Architecture'
export interface Skill { name: string; domain: Domain; note: string }
