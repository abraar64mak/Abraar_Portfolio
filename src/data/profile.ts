export const profile = {
  name: 'Abraar Khan',
  handle: 'abraar64mak',
  location: 'United States',
  specialization: 'AI Systems & Applied ML',
  roles: ['ML & AI Systems Engineer', 'RAG & Agent Builder', 'Document Intelligence Engineer', 'Healthcare AI Researcher'],
  summary:
    'Machine learning engineer shipping production AI: RAG, agentic and document-intelligence systems, and real-time models. Healthcare is my home turf, from streaming ECG inference to physician-graded clinical RAG, and the craft applies anywhere AI ships.',
  // Privacy: no phone number is stored or displayed anywhere in this project.
  email: 'abraar.farooqali@gmail.com',
  cvProfile: [
    'Software engineer shipping production RAG, agentic, and document intelligence systems in Python and TypeScript.',
    'Built secure FastAPI backends for sensitive data with PostgreSQL Row-Level Security and PHI masking.',
    'Codes daily with Claude Code and Cursor while owning review, tests, and release quality for each change.',
  ],
  linkedin: 'https://www.linkedin.com/in/abraar-khan-ali',
  github: 'https://github.com/abraar64mak',
  vitals: [
    { label: 'Retrieval accuracy', from: 72, to: 88, suffix: '%', note: 'hybrid keyword + FAISS, 50K+ forms' },
    { label: 'Adversarial refusal', to: 100, suffix: '%', note: '65 attack tests, 0 writes leaked' },
    { label: 'Entity F1 (strict)', to: 0.916, decimals: 3, suffix: '', note: 'RoBERTa, CoNLL-2003' },
    { label: 'Patient lookups guarded', to: 60, suffix: 'K+', note: 'PHI masking guardrails' },
  ],
}
