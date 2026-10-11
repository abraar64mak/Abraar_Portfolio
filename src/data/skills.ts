import type { Skill } from './types'

export const skills: Skill[] = [
  // AI / ML
  { name: 'PyTorch', domain: 'AI / ML', note: 'Streaming ECG inference, BeatNet, RoBERTa fine-tuning' },
  { name: 'Hugging Face Transformers', domain: 'AI / ML', note: 'Fine-tuned RoBERTa for NER' },
  { name: 'LangGraph', domain: 'AI / ML', note: 'Multi-agent NL-to-SQL orchestration' },
  { name: 'MCP', domain: 'AI / ML', note: 'Model Context Protocol tool layer' },
  { name: 'RAG', domain: 'AI / ML', note: 'Clinical summarization over 50K+ forms' },
  { name: 'FAISS', domain: 'AI / ML', note: 'Hybrid retrieval and multi-vector reranking' },
  { name: 'LLM Evaluation', domain: 'AI / ML', note: 'Physician-graded pipelines, Ragas' },
  { name: 'Agents', domain: 'AI / ML', note: 'Tool-using, auditable agent graphs' },
  { name: 'CNN', domain: 'AI / ML', note: 'Fetal health prediction paper' },
  { name: 'Computer Vision', domain: 'AI / ML', note: 'MediaPipe pose estimation' },
  { name: 'Transformers', domain: 'AI / ML', note: 'Attention over ECG landmarks' },
  // Data Engineering
  { name: 'PySpark', domain: 'Data Engineering', note: 'Distributed NER batch extraction' },
  { name: 'PostgreSQL', domain: 'Data Engineering', note: 'Row-level security, pooled backends' },
  { name: 'SQL', domain: 'Data Engineering', note: 'Query design, AST validation' },
  { name: 'Vector Databases', domain: 'Data Engineering', note: 'FAISS indexes at scale' },
  { name: 'JSON Schema', domain: 'Data Engineering', note: 'API contracts and validation' },
  { name: 'Data Validation', domain: 'Data Engineering', note: 'Outlier detection on 10+ streams' },
  // Frameworks & Languages
  { name: 'Python', domain: 'Frameworks & Languages', note: 'Primary language' },
  { name: 'TypeScript', domain: 'Frameworks & Languages', note: 'Full-stack and tooling' },
  { name: 'JavaScript', domain: 'Frameworks & Languages', note: 'Chart.js clinical dashboards' },
  { name: 'FastAPI', domain: 'Frameworks & Languages', note: 'Secure inference and data APIs' },
  { name: 'REST APIs', domain: 'Frameworks & Languages', note: 'Contract-first design' },
  { name: 'Chart.js', domain: 'Frameworks & Languages', note: 'Cardiologist-facing dashboards' },
  { name: 'Bash', domain: 'Frameworks & Languages', note: 'Automation' },
  // Systems Architecture
  { name: 'AWS', domain: 'Systems Architecture', note: 'Cloud deployment' },
  { name: 'Azure', domain: 'Systems Architecture', note: 'Cloud deployment' },
  { name: 'Docker', domain: 'Systems Architecture', note: 'Reproducible services' },
  { name: 'GitHub Actions', domain: 'Systems Architecture', note: 'CI quality gates' },
  { name: 'CI/CD', domain: 'Systems Architecture', note: 'IEC 62304-aligned release gates' },
  { name: 'RBAC/RLS', domain: 'Systems Architecture', note: 'Tenant isolation and PHI protection' },
  { name: 'Distributed Systems', domain: 'Systems Architecture', note: 'Fan-out workers, fault isolation' },
  { name: 'OpenTelemetry', domain: 'Systems Architecture', note: 'Per-answer trace IDs' },
]
