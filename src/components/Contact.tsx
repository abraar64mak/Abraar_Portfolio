import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import Section from './Section'

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'LinkedIn', value: 'abraar-khan-ali', href: profile.linkedin, Icon: Linkedin },
  { label: 'GitHub', value: profile.handle, href: profile.github, Icon: Github },
]

export default function Contact() {
  return (
    <Section id="contact" eyebrow="Open channel · 04" title="Let’s build something clinically meaningful" lead="Open to roles in healthcare AI, applied ML and agentic systems. Reach out through any channel below.">
      <div className="grid gap-4 md:grid-cols-3">
        {channels.map(({ label, value, href, Icon }, i) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="glass glass-hover group flex items-center gap-4 rounded-xl p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-300"><Icon size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="mono-label block">{label}</span>
              <span className="block truncate text-white">{value}</span>
            </span>
            <ArrowUpRight size={18} className="text-cyan-300/50 transition group-hover:text-cyan-300" />
          </motion.a>
        ))}
      </div>
      <footer className="mt-20 flex flex-col items-center justify-between gap-2 border-t border-cyan-300/10 pt-6 font-mono text-xs text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Abraar Khan</span>
        <span>React · TypeScript · Tailwind · Framer Motion</span>
      </footer>
    </Section>
  )
}
