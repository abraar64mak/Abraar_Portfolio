import { ArrowUpRight, Download, Github, Linkedin } from 'lucide-react'
import { experience } from '../data/experience'
import { profile } from '../data/profile'
import IdCard from './IdCard'
import SectionHead from './SectionHead'

const base = import.meta.env.BASE_URL
const cdf = experience.find((e) => e.id === 'cdf')!
const uf = experience.find((e) => e.id === 'uf')!

export default function About() {
  const facts = [
    ['Location', profile.location],
    ['Education', `${uf.role.replace('M.S. in ', 'M.S. ')}, University of Florida`],
    ['Currently', `${cdf.role}, ${cdf.org} (${cdf.period.split(' – ')[0]} – present)`],
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
              <a href={`${base}${profile.resume}`} download className="pill pill-solid"><Download size={15} />Résumé</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="pill pill-line"><Github size={15} />GitHub</a>
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
      </div>
    </section>
  )
}
