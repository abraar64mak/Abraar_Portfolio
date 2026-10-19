import type { Skill } from './types'

/** Exactly the skills listed on the résumé, grouped as the résumé groups them. */
export const skills: Skill[] = [
  { name: 'Python', family: 'Languages', symbol: 'Py', note: 'Primary language across RAG, agents, ECG models and APIs.' },
  { name: 'TypeScript', family: 'Languages', symbol: 'Ts', note: 'Production RAG and agentic systems in TypeScript.' },
  { name: 'JavaScript', family: 'Languages', symbol: 'Js', note: 'Chart.js clinical dashboard for cardiologists.' },
  { name: 'SQL', family: 'Languages', symbol: 'Sq', note: 'NL-to-SQL agents guarded by an AST firewall.' },
  { name: 'Bash', family: 'Languages', symbol: 'Ba', note: 'Automation and tooling.' },
  { name: 'PyTorch', family: 'AI & LLM Systems', symbol: 'Pt', note: 'Streaming ECG inference service; BeatNet.' },
  { name: 'Hugging Face Transformers', family: 'AI & LLM Systems', symbol: 'Hf', note: 'Fine-tuned RoBERTa for entity extraction.' },
  { name: 'LangGraph', family: 'AI & LLM Systems', symbol: 'Lg', note: 'Multi-agent NL-to-SQL orchestration.' },
  { name: 'MCP', family: 'AI & LLM Systems', symbol: 'Mc', note: 'Model Context Protocol tool layer for agents.' },
  { name: 'RAG', family: 'AI & LLM Systems', symbol: 'Rg', note: 'Clinical RAG summarization over 50K+ Medicaid forms.' },
  { name: 'FAISS', family: 'AI & LLM Systems', symbol: 'Fa', note: 'Hybrid retrieval and multi-vector reranking.' },
  { name: 'Agents', family: 'AI & LLM Systems', symbol: 'Ag', note: 'Tool-using, auditable agent graphs.' },
  { name: 'LLM Evaluation', family: 'AI & LLM Systems', symbol: 'Ev', note: 'Physician-graded evaluation pipelines.' },
  { name: 'Ragas', family: 'AI & LLM Systems', symbol: 'Rs', note: 'Automated RAG quality metrics.' },
  { name: 'FastAPI', family: 'Backend & Data', symbol: 'Fp', note: 'Secure backends for sensitive data and inference.' },
  { name: 'REST APIs', family: 'Backend & Data', symbol: 'Re', note: 'Contract-first API design.' },
  { name: 'PostgreSQL', family: 'Backend & Data', symbol: 'Pg', note: 'Row-level security and pooled, latency-bound backends.' },
  { name: 'PySpark', family: 'Backend & Data', symbol: 'Ps', note: 'Distributed batch NER extraction.' },
  { name: 'JSON Schema', family: 'Backend & Data', symbol: 'Jo', note: 'API specs that shortened developer onboarding.' },
  { name: 'Vector Databases', family: 'Backend & Data', symbol: 'Vd', note: 'FAISS indexes at scale.' },
  { name: 'Distributed Systems', family: 'Backend & Data', symbol: 'Ds', note: 'Worker fan-out with fault isolation.' },
  { name: 'AWS', family: 'Cloud & DevOps', symbol: 'Aw', note: 'Cloud deployment.' },
  { name: 'Azure', family: 'Cloud & DevOps', symbol: 'Az', note: 'Cloud deployment.' },
  { name: 'Docker', family: 'Cloud & DevOps', symbol: 'Do', note: 'Reproducible services.' },
  { name: 'GitHub Actions', family: 'Cloud & DevOps', symbol: 'Ga', note: 'CI quality gates.' },
  { name: 'CI/CD', family: 'Cloud & DevOps', symbol: 'Ci', note: 'IEC 62304-compliant release gates.' },
  { name: 'RBAC/RLS', family: 'Cloud & DevOps', symbol: 'Rl', note: 'Tenant isolation and PHI protection.' },
  { name: 'Claude Code', family: 'AI-Assisted Dev', symbol: 'Cc', note: 'Daily driver, with review, tests and release quality owned by me.' },
  { name: 'Cursor', family: 'AI-Assisted Dev', symbol: 'Cu', note: 'AI-assisted development.' },
]

export const FAMILIES = ['Languages', 'AI & LLM Systems', 'Backend & Data', 'Cloud & DevOps', 'AI-Assisted Dev'] as const
