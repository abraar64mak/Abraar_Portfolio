export const profile = {
  name: 'Abraar Khan',
  handle: 'abraar64mak',
  location: 'Nevada, USA · open to relocating',
  specialization: 'AI Systems & Healthcare Analytics',
  roles: ['Clinical RAG Engineer', 'Agentic Systems Builder', 'ECG Deep Learning Researcher', 'Healthcare AI Author'],
  summary:
    'Machine learning engineer bridging artificial intelligence and medical healthcare research. From streaming ECG inference on wearables to physician-graded RAG over Medicaid charts, I build AI that clinicians can trust: secure by design, measured honestly, shipped to production.',
  // Privacy: no phone number is stored or displayed anywhere in this project.
  email: 'abraar.farooqali@gmail.com',
  linkedin: 'https://www.linkedin.com/in/abraar-khan-ali',
  github: 'https://github.com/abraar64mak',
  vitals: [
    { label: 'Retrieval accuracy', from: 72, to: 88, suffix: '%', note: 'hybrid keyword + FAISS, 50K+ forms' },
    { label: 'Adversarial refusal', to: 100, suffix: '%', note: '65 attack tests, 0 writes leaked' },
    { label: 'Entity F1 (strict)', to: 0.916, decimals: 3, suffix: '', note: 'RoBERTa, CoNLL-2003' },
    { label: 'Patient lookups guarded', to: 60, suffix: 'K+', note: 'PHI masking guardrails' },
  ],
}
