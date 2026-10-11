export interface Paper {
  id: string
  projectId: string
  title: string
  venue: string
  publisher: string
  indexing: string[]
  award: string
  authors: string[]
  affiliation: string
  keywords: string[]
  summary: string
}

export const papers: Paper[] = [
  {
    id: 'exercise-form',
    projectId: 'exercise-form',
    title: 'An Artificial Intelligence Approach to Quantifying Exercise Form for Optimal Performance and Injury Prevention',
    venue: 'International Conference on Computing and Communication Networks 2023 (ICCCNet 2023), Manchester Metropolitan University, UK',
    publisher: 'Springer · Lecture Notes in Networks and Systems',
    indexing: ['Scopus', 'INSPEC', 'WTI Frankfurt eG', 'zbMATH', 'SCImago'],
    award: 'Best Paper Award',
    authors: ['Sowmia K R', 'Jayaganeshan T', 'Mohammed Abraar Khan F', 'Madhesh S', 'Kabilesh S'],
    affiliation: 'Department of Artificial Intelligence and Machine Learning, Anna University, Chennai',
    keywords: ['posture estimation', 'biometrics', 'MediaPipe', 'computer vision', 'performance'],
    summary:
      'A pose-estimation system that scores exercise form from motion and camera data, counts reps and warns the user when posture drifts toward injury risk. Four classifiers were benchmarked; Ridge and Random Forest reached 96.72% accuracy.',
  },
  {
    id: 'fetal-health',
    projectId: 'fetal-health',
    title: 'AI in healthcare – Predicting the Fetus health using CNN',
    venue: '6th International Conference on Intelligent Computing (IConIC 2K23)',
    publisher: 'AIP (American Institute of Physics) Conference Proceedings',
    indexing: ['Scopus'],
    award: 'Best Paper Award',
    authors: ['Sowmia K R', 'Madhesh S', 'Harinath B', 'Nishanth G', 'Mohammed Abraar Khan F'],
    affiliation: 'Department of Artificial Intelligence and Machine Learning, Anna University, Chennai',
    keywords: ['healthcare', 'fetal health', 'CNN', 'artificial intelligence'],
    summary:
      'A CNN study for predicting fetal health, comparing 1-, 2- and 3-layer models on accuracy, precision, recall and loss. Accuracy climbed from 88.50% to 91.55% with depth.',
  },
]
