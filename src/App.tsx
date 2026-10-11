import { useMemo } from 'react'
import Background from './components/Background'
import Contact from './components/Contact'
import DetailSheet, { type DetailContent } from './components/DetailSheet'
import ExperienceLog from './components/ExperienceLog'
import Hero from './components/Hero'
import Nav from './components/Nav'
import ProjectHub from './components/ProjectHub'
import SkillMatrix from './components/SkillMatrix'
import { experience } from './data/experience'
import { projects } from './data/projects'
import { useDetailRoute } from './hooks/useDetailRoute'

export default function App() {
  const { route, open, close } = useDetailRoute()

  const content: DetailContent | null = useMemo(() => {
    if (!route) return null
    if (route.kind === 'experience') {
      const e = experience.find((x) => x.id === route.id)
      if (!e) return null
      return {
        eyebrow: `Case file · ${e.kind === 'work' ? 'Experience' : 'Academic'}`,
        title: e.role,
        subtitle: e.org,
        meta: `${e.period} · ${e.location}`,
        tags: e.tags,
        metrics: e.metrics,
        pipeline: e.pipeline,
        pipelineTitle: 'Technical architecture',
        highlights: e.highlights,
        highlightsTitle: 'Key contributions',
        closing: { label: 'Impact', text: e.impact },
      }
    }
    const p = projects.find((x) => x.id === route.id)
    if (!p) return null
    return {
      eyebrow: `Research file · ${p.category}`,
      title: p.title,
      subtitle: p.subtitle,
      tags: p.tags,
      metrics: p.metrics,
      pipeline: p.pipeline,
      pipelineTitle: 'System architecture',
      highlights: p.highlights,
      highlightsTitle: 'Key insights',
      links: p.links,
    }
  }, [route])

  return (
    <>
      <Background />
      <Nav />
      <main>
        <Hero />
        <ExperienceLog onOpen={(id) => open('experience', id)} />
        <ProjectHub onOpen={(id) => open('project', id)} />
        <SkillMatrix onOpen={open} />
        <Contact />
      </main>
      <DetailSheet content={content} onClose={close} />
    </>
  )
}
