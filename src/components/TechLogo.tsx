import { siClaude, siCursor, siDocker, siFastapi, siGithubactions, siGnubash, siHuggingface, siJavascript, siLangchain, siPostgresql, siPython, siPytorch, siApachespark, siTypescript, siChartdotjs, siOpentelemetry } from 'simple-icons'
import { Bot, Boxes, Braces, ClipboardCheck, Cloud, Database, FileSearch, Gauge, Network, Plug, ScanSearch, ShieldCheck, Webhook, Workflow, type LucideIcon } from 'lucide-react'

interface Brand { path: string; hex: string }
const b = (i: { path: string; hex: string }): Brand => ({ path: i.path, hex: i.hex })

/** Real brand marks (simple-icons, CC0). Colours are the official brand colours. */
const BRAND: Record<string, Brand> = {
  Python: b(siPython), TypeScript: b(siTypescript), JavaScript: b(siJavascript), Bash: b(siGnubash),
  PyTorch: b(siPytorch), 'Hugging Face Transformers': b(siHuggingface), LangGraph: b(siLangchain),
  FastAPI: b(siFastapi), PostgreSQL: b(siPostgresql), PySpark: b(siApachespark), Docker: b(siDocker),
  'GitHub Actions': b(siGithubactions), 'Claude Code': b(siClaude), Cursor: b(siCursor),
  'Chart.js': b(siChartdotjs), OpenTelemetry: b(siOpentelemetry),
}
/** Concepts have no brand: thin line icons in the same visual weight. */
const CONCEPT: Record<string, LucideIcon> = {
  SQL: Database, MCP: Plug, RAG: FileSearch, FAISS: ScanSearch, Agents: Bot, 'LLM Evaluation': ClipboardCheck, Ragas: Gauge,
  'REST APIs': Webhook, 'JSON Schema': Braces, 'Vector Databases': Boxes, 'Distributed Systems': Network,
  AWS: Cloud, Azure: Cloud, 'CI/CD': Workflow, 'RBAC/RLS': ShieldCheck,
}
export const isBrand = (n: string) => n in BRAND

export default function TechLogo({ name, size = 40, glow = false }: { name: string; size?: number; glow?: boolean }) {
  const br = BRAND[name]
  if (br) {
    return (
      <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-hidden>
        {glow && <span className="absolute inset-[-18%] rounded-full blur-2xl" style={{ background: `#${br.hex}`, opacity: 0.22 }} />}
        <svg viewBox="0 0 24 24" width={size} height={size} className="relative" fill={`#${br.hex}`}><path d={br.path} /></svg>
      </span>
    )
  }
  const Icon = CONCEPT[name] ?? Workflow
  return <Icon size={size} strokeWidth={1.15} className="text-ink" aria-hidden />
}
