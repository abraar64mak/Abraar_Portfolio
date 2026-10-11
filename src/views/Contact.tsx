import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { useState } from 'react'
import Panel from '../components/Panel'
import { profile } from '../data/profile'

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'LinkedIn', value: 'abraar-khan-ali', href: profile.linkedin, Icon: Linkedin },
  { label: 'GitHub', value: profile.handle, href: profile.github, Icon: Github },
]

export default function Contact() {
  const [msg, setMsg] = useState({ name: '', subject: '', body: '' })
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(msg.subject || 'Hello Abraar')}&body=${encodeURIComponent(`${msg.body}\n\n— ${msg.name}`)}`
  const input = 'w-full rounded-lg border border-cyan-300/20 bg-ink-950/80 p-3 text-sm text-slate-200 outline-none focus:border-cyan-300/60'
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="space-y-3">
        {channels.map(({ label, value, href, Icon }) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="panel panel-hover group flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-300"><Icon size={20} /></span>
            <span className="min-w-0 flex-1"><span className="mono-label block">{label}</span><span className="block truncate text-white">{value}</span></span>
            <ArrowUpRight size={18} className="text-cyan-300/50 transition group-hover:text-cyan-300" />
          </a>
        ))}
        <p className="px-1 text-sm text-slate-500">Open to roles in healthcare AI, applied ML and agentic systems. {profile.location}.</p>
      </div>
      <Panel tag="Open channel" title="Send a message">
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto }}>
          <input className={input} placeholder="Your name" value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} aria-label="Your name" />
          <input className={input} placeholder="Subject" value={msg.subject} onChange={(e) => setMsg({ ...msg, subject: e.target.value })} aria-label="Subject" />
          <textarea className={`${input} resize-none`} rows={5} placeholder="Message" value={msg.body} onChange={(e) => setMsg({ ...msg, body: e.target.value })} aria-label="Message" />
          <button type="submit" className="btn btn-primary">Open in email app</button>
          <p className="text-xs text-slate-500">Opens your email client with the message pre-filled. Nothing is sent to a server.</p>
        </form>
      </Panel>
    </div>
  )
}
