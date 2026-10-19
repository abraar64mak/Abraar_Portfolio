import { ArrowUpRight, Github, Linkedin } from 'lucide-react'
import { experience } from '../data/experience'
import { profile } from '../data/profile'
import IdCard from './IdCard'
import SectionHead from './SectionHead'

const cdf = experience.find((e) => e.id === 'cdf')!
const uf = experience.find((e) => e.id === 'uf')!

export default function About() {
  const facts = [
    ['Location', profile.location],
    ['Education', `${uf.role.replace('M.S. in ', 'M.S. ')}, University of Florida · B.Tech AI & ML, Anna University (2020–2024)`],
    ['Currently', `${cdf.role}, ${cdf.org} (${cdf.period.split(' – ')[0]} – present)`],
    ['Focus', 'Production AI, and securing it'],
    ['Email', profile.email],
  ]
  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="wrap">
        <SectionHead tag="01 — About" title="Hello," accent="I’m Abraar." className="mb-14" />
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] lg:gap-10">
          <div className="rv order-2 space-y-4 lg:order-1">
            {profile.cvProfile.map((p) => <p key={p} className="text-lg leading-relaxed text-ink2">{p}</p>)}
            <div className="flex flex-wrap gap-3 pt-3">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="pill pill-solid"><Github size={15} />GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-line"><Linkedin size={15} />LinkedIn</a>
            </div>
          </div>

          <div className="order-1 lg:order-2"><IdCard /></div>

          <div className="rv order-3 space-y-6">
            <h3 className="tag">Quick facts</h3>
            <dl className="divide-y divide-line border-y border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[96px_1fr] gap-3 py-3.5 text-sm"><dt className="font-mono text-[11px] uppercase tracking-wider text-mute">{k}</dt><dd className="break-words font-medium">{v}</dd></div>
              ))}
            </dl>
            <blockquote className="card-l p-6">
              <p className="font-serif text-2xl italic leading-snug">“I own review, tests and release quality for every change I ship.”</p>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-mute hover:text-ink">Let’s connect <ArrowUpRight size={13} /></a>
            </blockquote>
          </div>
        </div>

        <div className="card-l rv mt-14 grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="tag mb-4">Research interests</p>
            <p className="text-xl font-medium leading-snug tracking-tight sm:text-2xl">{profile.researchInterests.headline}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink2">{profile.researchInterests.work}</p>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-8">
            <p className="tag mb-3">Related</p>
            <ul className="flex flex-wrap gap-2">
              {profile.researchInterests.related.map((r) => <li key={r} className="rounded-full bg-paper px-3 py-1.5 text-[13px] shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)]">{r}</li>)}
            </ul>
            <p className="mt-5 flex items-start gap-2 text-[13px] text-mute"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-ink" />{profile.researchInterests.building}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
