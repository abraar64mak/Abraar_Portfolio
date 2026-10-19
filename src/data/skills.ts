import type { Skill } from './types'

/** Every skill listed on the résumés, grouped the way the résumé groups them. Symbols must be unique. */
export const skills: Skill[] = [
  // Languages
  { name: 'Python', family: 'Languages', symbol: 'Py', note: 'Primary language across RAG, agents, ML services and APIs.' },
  { name: 'C', family: 'Languages', symbol: 'C', note: 'Systems-level programming.' },
  { name: 'Java', family: 'Languages', symbol: 'Ja', note: 'Object-oriented programming.' },
  { name: 'TypeScript', family: 'Languages', symbol: 'Ts', note: 'Production RAG and agentic systems; this portfolio.' },
  { name: 'JavaScript', family: 'Languages', symbol: 'Js', note: 'Dashboards and front-end work.' },
  { name: 'SQL', family: 'Languages', symbol: 'Sq', note: 'NL-to-SQL agents guarded by an AST firewall.' },
  { name: 'Bash', family: 'Languages', symbol: 'Ba', note: 'Automation and tooling.' },
  // AI systems
  { name: 'PyTorch', family: 'AI Systems', symbol: 'Pt', note: 'Streaming ECG inference and BeatNet.' },
  { name: 'scikit-learn', family: 'AI Systems', symbol: 'Sk', note: 'Random Forest malicious-code detector (99.45% accuracy).' },
  { name: 'Hugging Face Transformers', family: 'AI Systems', symbol: 'Hf', note: 'Fine-tuned RoBERTa for entity extraction.' },
  { name: 'LangGraph', family: 'AI Systems', symbol: 'Lg', note: 'Multi-agent NL-to-SQL orchestration.' },
  { name: 'MCP', family: 'AI Systems', symbol: 'Mc', note: 'Model Context Protocol tool layer for agents.' },
  { name: 'FAISS', family: 'AI Systems', symbol: 'Fa', note: 'Semantic retrieval, hybrid search and multi-vector reranking.' },
  { name: 'ONNX', family: 'AI Systems', symbol: 'On', note: 'Cut inference latency 42% on a streaming ECG service.' },
  { name: 'RAG', family: 'AI Systems', symbol: 'Rg', note: 'Production RAG, plus red-teaming and defending RAG systems.' },
  { name: 'LLM Evaluation', family: 'AI Systems', symbol: 'Ev', note: 'Expert-graded evaluation pipelines.' },
  { name: 'Agents', family: 'AI Systems', symbol: 'Ag', note: 'Tool-using, auditable agent graphs.' },
  { name: 'Ragas', family: 'AI Systems', symbol: 'Rs', note: 'Automated RAG quality metrics.' },
  // Backend & data
  { name: 'FastAPI', family: 'Backend & Data', symbol: 'Fp', note: 'Secure backends and inference APIs.' },
  { name: 'PostgreSQL', family: 'Backend & Data', symbol: 'Pg', note: 'Row-level security, connection pooling, audited state machines.' },
  { name: 'PySpark', family: 'Backend & Data', symbol: 'Ps', note: 'Distributed batch inference.' },
  { name: 'JSON Schema', family: 'Backend & Data', symbol: 'Jo', note: 'API specs that shortened developer onboarding.' },
  { name: 'Vector Databases', family: 'Backend & Data', symbol: 'Vd', note: 'FAISS indexes at scale.' },
  { name: 'Data Pipelines', family: 'Backend & Data', symbol: 'Dp', note: 'Indexing, deduplication and validation pipelines.' },
  // Systems & networking
  { name: 'Linux', family: 'Systems & Networking', symbol: 'Lx', note: 'Linux/Unix: the DoD sandbox ran on Linux.' },
  { name: 'Shell Scripting', family: 'Systems & Networking', symbol: 'Sh', note: 'Automation and tooling.' },
  { name: 'SSH', family: 'Systems & Networking', symbol: 'Ss', note: 'Remote access and HPC work.' },
  { name: 'Git', family: 'Systems & Networking', symbol: 'Gi', note: 'Version control, review and release quality.' },
  { name: 'Docker', family: 'Systems & Networking', symbol: 'Do', note: 'Per-test sandboxes and a policy-enforcing Docker API proxy.' },
  { name: 'TCP/IP', family: 'Systems & Networking', symbol: 'Tc', note: 'Coursework (TCP/IP, DNS, DHCP, NTP, SMTP, SNMP) and streaming services.' },
  { name: 'WebSockets', family: 'Systems & Networking', symbol: 'Ws', note: 'Persistent connections for real-time inference.' },
  { name: 'REST APIs', family: 'Systems & Networking', symbol: 'Re', note: 'Contract-first API design.' },
  { name: 'Connection Pooling', family: 'Systems & Networking', symbol: 'Cp', note: 'Removed per-request overhead on a latency-bound backend.' },
  { name: 'Kafka', family: 'Systems & Networking', symbol: 'Ka', note: 'At-least-once, idempotent grading pipeline.' },
  { name: 'Distributed Systems', family: 'Systems & Networking', symbol: 'Ds', note: 'Worker fan-out with fault isolation.' },
  // Cloud & DevOps
  { name: 'AWS', family: 'Cloud & DevOps', symbol: 'Aw', note: 'S3 and EC2.' },
  { name: 'Azure', family: 'Cloud & DevOps', symbol: 'Az', note: 'Cloud deployment.' },
  { name: 'GitHub Actions', family: 'Cloud & DevOps', symbol: 'Ga', note: 'CI quality gates, security tests and releases.' },
  { name: 'CI/CD', family: 'Cloud & DevOps', symbol: 'Ci', note: 'IEC 62304-compliant release gates.' },
  { name: 'OpenTelemetry', family: 'Cloud & DevOps', symbol: 'Ot', note: 'Per-answer trace IDs.' },
  { name: 'HPC', family: 'Cloud & DevOps', symbol: 'Hp', note: 'HiPerGator, multi-GPU training.' },
  // Security
  { name: 'RBAC/RLS', family: 'Security', symbol: 'Rl', note: 'Role-based access and PostgreSQL row-level security.' },
  { name: 'Agent Access Control', family: 'Security', symbol: 'Ac', note: 'Access control and threat modeling for LLM agents.' },
  { name: 'AST Query Validation', family: 'Security', symbol: 'Aq', note: 'sqlglot validation before any query executes.' },
  { name: 'Adversarial Evaluation', family: 'Security', symbol: 'Ae', note: '250 poisoned-document attacks, adaptive attackers.' },
  { name: 'Malware Detection', family: 'Security', symbol: 'Md', note: 'Malicious URL and Windows PE header classification.' },
  { name: 'Trusted Execution', family: 'Security', symbol: 'Te', note: 'Currently building: Intel SGX/TDX and AMD SEV-SNP.' },
  // AI-assisted development
  { name: 'Claude Code', family: 'AI-Assisted Dev', symbol: 'Cc', note: 'Daily driver, with review, tests and release quality owned by me.' },
  { name: 'Cursor', family: 'AI-Assisted Dev', symbol: 'Cu', note: 'AI-assisted development.' },
]

export const FAMILIES = ['Languages', 'AI Systems', 'Backend & Data', 'Systems & Networking', 'Cloud & DevOps', 'Security', 'AI-Assisted Dev'] as const

// guard: symbols must be unique (a duplicate would confuse the periodic table)
if (import.meta.env.DEV) {
  const seen = new Set<string>()
  skills.forEach((s) => { if (seen.has(s.symbol)) console.warn(`Duplicate skill symbol: ${s.symbol}`); seen.add(s.symbol) })
}
