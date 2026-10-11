import { ArrowUpRight, Check, Copy, Github, Linkedin } from 'lucide-react'
import { useState } from 'react'
import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/scroll'

const Hop = ({ text }: { text: string }) => <>{text.split('').map((c, i) => (c === ' ' ? ' ' : <span key={i} className="hop">{c}</span>))}</>

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { window.location.href = `mailto:${profile.email}` } }
  return (
    <section id="contact" className="section">
      <div className="wrap">
        <p className="tag rv mb-6">07 — Contact</p>
        <h2 className="rv text-[clamp(2.8rem,9.5vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.055em]">
          <span className="block"><Hop text="Let’s build" /></span>
          <span className="block"><em className="serif-accent"><Hop text="something" /></em> <Hop text="together." /></span>
        </h2>

        <div className="rv mt-14 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="break-all text-[clamp(1.3rem,3.2vw,2.4rem)] font-semibold tracking-tight underline decoration-ink/25 decoration-2 underline-offset-[10px] transition hover:decoration-ink">{profile.email}</a>
              <button onClick={copy} className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold shadow-[inset_0_0_0_1px_rgba(13,13,13,.2)] transition hover:bg-ink hover:text-white" aria-live="polite">{copied ? <><Check size={13} />Copied ✓</> : <><Copy size={13} />Copy</>}</button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-line"><Linkedin size={15} />LinkedIn <ArrowUpRight size={14} /></a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="pill pill-line"><Github size={15} />GitHub <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div aria-hidden className="relative hidden h-40 w-40 lg:block">
            <svg viewBox="0 0 200 200" className="h-full w-full animate-spin360"><defs><path id="circ" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs><text fontSize="15" fontFamily="JetBrains Mono Variable, monospace" letterSpacing="4.2" fill="#0d0d0d"><textPath href="#circ">say hello · say hello · say hello · </textPath></text></svg>
            <span className="absolute inset-0 flex items-center justify-center font-serif text-4xl italic">AK</span>
          </div>
        </div>

        <footer className="mt-24 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-mute sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Abraar Khan</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget('top') }} className="font-medium text-ink underline underline-offset-4">Back to top ↑</a>
          <span className="font-mono text-xs">Built with React · Tailwind · Framer Motion</span>
        </footer>
      </div>
    </section>
  )
}
