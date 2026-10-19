export interface ChartMetric { name: string; unit: string; values: number[]; lowerIsBetter?: boolean }
export interface ChartData { title: string; source: string; groups: string[]; metrics: ChartMetric[] }

/** Numbers transcribed from the published papers (Table 1 of each). */
export const charts: Record<string, ChartData> = {
  'fetal-health': {
    title: 'CNN depth comparison',
    source: 'IConIC 2K23 · Table 1',
    groups: ['Layer 1', 'Layer 2', 'Layer 3'],
    metrics: [
      { name: 'Accuracy', unit: '%', values: [88.5, 90.38, 91.55] },
      { name: 'Precision', unit: '%', values: [89.23, 90.59, 91.73] },
      { name: 'Recall', unit: '%', values: [87.56, 90.38, 91.08] },
      { name: 'Loss', unit: '', values: [0.284, 0.2363, 0.2702], lowerIsBetter: true },
    ],
  },
  'exercise-form': {
    title: 'Posture classifier benchmark',
    source: 'ICCCNet 2023 · Table 1',
    groups: ['Logistic Reg.', 'Ridge', 'Random Forest', 'Grad. Boosting'],
    metrics: [
      { name: 'Accuracy', unit: '%', values: [95.08, 96.72, 96.72, 93.44] },
      { name: 'Precision', unit: '%', values: [95.34, 97.61, 95.45, 93.18] },
      { name: 'Recall', unit: '%', values: [89.47, 94.73, 89.47, 84.21] },
    ],
  },
}
