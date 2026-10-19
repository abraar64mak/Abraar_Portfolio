import { siApachekafka, siApachespark, siC, siChartdotjs, siClaude, siCursor, siDocker, siFastapi, siGit, siGithubactions, siGnubash, siHuggingface, siJavascript, siLangchain, siLinux, siOnnx, siOpenjdk, siOpentelemetry, siPostgresql, siPython, siPytorch, siScikitlearn, siTypescript } from 'simple-icons'
import { Bot, Boxes, Braces, Bug, Cable, ClipboardCheck, Cloud, Cpu, Database, FileCode, FileSearch, Gauge, KeyRound, Layers, Lock, LockKeyhole, Network, Plug, ScanSearch, Share2, ShieldCheck, Swords, Terminal, Webhook, Workflow, type LucideIcon } from 'lucide-react'

interface Brand { path: string; hex: string }
const b = (i: { path: string; hex: string }): Brand => ({ path: i.path, hex: i.hex })

/** Real brand marks (simple-icons, CC0). Colours are the official brand colours. */
const BRAND: Record<string, Brand> = {
  Python: b(siPython), TypeScript: b(siTypescript), JavaScript: b(siJavascript), Bash: b(siGnubash), C: b(siC), Java: b(siOpenjdk),
  PyTorch: b(siPytorch), 'scikit-learn': b(siScikitlearn), 'Hugging Face Transformers': b(siHuggingface), LangGraph: b(siLangchain), ONNX: b(siOnnx),
  FastAPI: b(siFastapi), PostgreSQL: b(siPostgresql), PySpark: b(siApachespark),
  Linux: b(siLinux), Git: b(siGit), Docker: b(siDocker), Kafka: b(siApachekafka),
  'GitHub Actions': b(siGithubactions), OpenTelemetry: b(siOpentelemetry),
  'Claude Code': b(siClaude), Cursor: b(siCursor), 'Chart.js': b(siChartdotjs),
}
/** Concepts have no brand: thin line icons in the same visual weight. */
const CONCEPT: Record<string, LucideIcon> = {
  SQL: Database, MCP: Plug, RAG: FileSearch, FAISS: ScanSearch, Agents: Bot, 'LLM Evaluation': ClipboardCheck, Ragas: Gauge,
  'REST APIs': Webhook, 'JSON Schema': Braces, 'Vector Databases': Boxes, 'Data Pipelines': Workflow,
  'Shell Scripting': Terminal, SSH: KeyRound, 'TCP/IP': Network, WebSockets: Cable, 'Connection Pooling': Layers, 'Distributed Systems': Share2,
  AWS: Cloud, Azure: Cloud, 'CI/CD': Workflow, HPC: Cpu,
  'RBAC/RLS': ShieldCheck, 'Agent Access Control': Lock, 'AST Query Validation': FileCode, 'Adversarial Evaluation': Swords, 'Malware Detection': Bug, 'Trusted Execution': LockKeyhole,
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
