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
  category: 'AI Security' | 'Secure Systems' | 'Agentic AI' | 'Real-time ML' | 'Document AI' | 'Security ML'
  blurb: string
  tags: string[]
  metrics: Metric[]
  pipeline: PipelineStep[]
  highlights: string[]
  links: LinkItem[]
  badge?: string
}

export type Family = 'Languages' | 'AI Systems' | 'Backend & Data' | 'Systems & Networking' | 'Cloud & DevOps' | 'Security' | 'AI-Assisted Dev'
export interface Skill { name: string; family: Family; symbol: string; note: string }
