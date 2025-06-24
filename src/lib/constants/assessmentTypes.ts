// src/lib/constants/assessmentTypes.ts
export const ASSESSMENT_TYPES = {
  DOMINANT_INTELLIGENCE: 'dominant-intelligence',
  PERSONALITY_PATTERN: 'personality-pattern',
  VARK: 'vark',
  LEARNING_STYLE: 'learning-style',
  CAREER_APTITUDE: 'career-aptitude'
} as const

export type AssessmentType = typeof ASSESSMENT_TYPES[keyof typeof ASSESSMENT_TYPES]

export const ASSESSMENT_METADATA = {
  [ASSESSMENT_TYPES.DOMINANT_INTELLIGENCE]: {
    name: 'Dominant Intelligence Assessment',
    description: 'Identifies your strongest intelligence types based on Howard Gardner\'s Multiple Intelligence Theory',
    duration: 20,
    questionCount: 40,
    categories: [
      'linguistic',
      'logical-mathematical',
      'spatial',
      'bodily-kinesthetic',
      'musical',
      'interpersonal',
      'intrapersonal',
      'naturalistic'
    ],
    scoring: {
      type: 'weighted-sum',
      maxScore: 200,
      normalization: 'percentage'
    }
  },
  [ASSESSMENT_TYPES.PERSONALITY_PATTERN]: {
    name: 'Personality Pattern Assessment',
    description: 'Analyzes your behavioral patterns using the DISC model',
    duration: 15,
    questionCount: 28,
    categories: [
      'dominance',
      'influence',
      'steadiness',
      'conscientiousness'
    ],
    scoring: {
      type: 'forced-choice',
      maxScore: 100,
      normalization: 'percentage'
    }
  },
  [ASSESSMENT_TYPES.VARK]: {
    name: 'VARK Learning Styles Assessment',
    description: 'Determines your preferred learning modalities',
    duration: 10,
    questionCount: 16,
    categories: [
      'visual',
      'auditory',
      'reading-writing',
      'kinesthetic'
    ],
    scoring: {
      type: 'frequency-count',
      maxScore: 64,
      normalization: 'percentage'
    }
  }
} as const

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  RATING_SCALE: 'rating_scale',
  YES_NO: 'yes_no',
  MULTISELECT: 'multiselect',
  RANKING: 'ranking',
  SLIDER: 'slider'
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export const ASSESSMENT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
} as const

export type AssessmentStatus = typeof ASSESSMENT_STATUS[keyof typeof ASSESSMENT_STATUS]

export const SESSION_STATUS = {
  STARTED: 'started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  EXPIRED: 'expired'
} as const

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS]

export const SCORING_ALGORITHMS = {
  WEIGHTED_SUM: 'weighted_sum',
  AVERAGE_SCORE: 'average_score',
  FREQUENCY_COUNT: 'frequency_count',
  PERCENTILE_RANK: 'percentile_rank',
  STANDARD_SCORE: 'standard_score'
} as const

export const RESULT_INTERPRETATIONS = {
  HIGH: { min: 80, label: 'High', color: '#22c55e' },
  MODERATE_HIGH: { min: 60, label: 'Moderately High', color: '#84cc16' },
  AVERAGE: { min: 40, label: 'Average', color: '#eab308' },
  MODERATE_LOW: { min: 20, label: 'Moderately Low', color: '#f97316' },
  LOW: { min: 0, label: 'Low', color: '#ef4444' }
} as const