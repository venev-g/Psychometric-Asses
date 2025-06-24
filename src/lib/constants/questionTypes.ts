// src/lib/constants/questionTypes.ts
export const QUESTION_TYPE_CONFIGS = {
  multiple_choice: {
    name: 'Multiple Choice',
    description: 'Single selection from multiple options',
    validation: {
      required: true,
      minOptions: 2,
      maxOptions: 8
    },
    defaultOptions: [
      { value: 'a', text: 'Option A' },
      { value: 'b', text: 'Option B' },
      { value: 'c', text: 'Option C' },
      { value: 'd', text: 'Option D' }
    ]
  },
  rating_scale: {
    name: 'Rating Scale',
    description: 'Numeric scale rating (e.g., 1-5, 1-7)',
    validation: {
      required: true,
      minScale: 1,
      maxScale: 10
    },
    defaultScale: {
      min: 1,
      max: 5,
      labels: {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree'
      }
    }
  },
  yes_no: {
    name: 'Yes/No',
    description: 'Binary choice question',
    validation: {
      required: true
    },
    defaultOptions: [
      { value: true, text: 'Yes' },
      { value: false, text: 'No' }
    ]
  },
  multiselect: {
    name: 'Multiple Select',
    description: 'Multiple selections from options',
    validation: {
      required: true,
      minOptions: 2,
      maxOptions: 10,
      minSelections: 1,
      maxSelections: 'unlimited'
    },
    defaultOptions: [
      { value: 'option1', text: 'Option 1' },
      { value: 'option2', text: 'Option 2' },
      { value: 'option3', text: 'Option 3' }
    ]
  },
  ranking: {
    name: 'Ranking',
    description: 'Rank options in order of preference',
    validation: {
      required: true,
      minOptions: 2,
      maxOptions: 8
    },
    defaultOptions: [
      { value: 'item1', text: 'Item 1' },
      { value: 'item2', text: 'Item 2' },
      { value: 'item3', text: 'Item 3' }
    ]
  },
  slider: {
    name: 'Slider',
    description: 'Continuous scale slider',
    validation: {
      required: true,
      min: 0,
      max: 100,
      step: 1
    },
    defaultConfig: {
      min: 0,
      max: 100,
      step: 5,
      showValue: true,
      labels: {
        start: 'Minimum',
        end: 'Maximum'
      }
    }
  }
} as const

export const QUESTION_CATEGORIES = {
  // Dominant Intelligence Categories
  LINGUISTIC: 'linguistic',
  LOGICAL_MATHEMATICAL: 'logical-mathematical',
  SPATIAL: 'spatial',
  BODILY_KINESTHETIC: 'bodily-kinesthetic',
  MUSICAL: 'musical',
  INTERPERSONAL: 'interpersonal',
  INTRAPERSONAL: 'intrapersonal',
  NATURALISTIC: 'naturalistic',
  
  // DISC Personality Categories
  DOMINANCE: 'dominance',
  INFLUENCE: 'influence',
  STEADINESS: 'steadiness',
  CONSCIENTIOUSNESS: 'conscientiousness',
  
  // VARK Learning Style Categories
  VISUAL: 'visual',
  AUDITORY: 'auditory',
  READING_WRITING: 'reading-writing',
  KINESTHETIC: 'kinesthetic'
} as const

export const RESPONSE_VALIDATION_RULES = {
  multiple_choice: {
    validate: (response: any, options: any[]) => {
      return options.some(option => option.value === response)
    },
    errorMessage: 'Please select a valid option'
  },
  rating_scale: {
    validate: (response: any, config: any) => {
      const num = Number(response)
      return !isNaN(num) && num >= config.min && num <= config.max
    },
    errorMessage: 'Please select a rating within the valid range'
  },
  yes_no: {
    validate: (response: any) => {
      return typeof response === 'boolean'
    },
    errorMessage: 'Please select Yes or No'
  },
  multiselect: {
    validate: (response: any[], options: any[], config: any) => {
      if (!Array.isArray(response)) return false
      if (response.length < config.minSelections) return false
      if (config.maxSelections !== 'unlimited' && response.length > config.maxSelections) return false
      return response.every(r => options.some(option => option.value === r))
    },
    errorMessage: 'Please select valid options within the allowed range'
  },
  ranking: {
    validate: (response: any[], options: any[]) => {
      if (!Array.isArray(response)) return false
      if (response.length !== options.length) return false
      const uniqueValues = new Set(response)
      return uniqueValues.size === response.length && 
             response.every(r => options.some(option => option.value === r))
    },
    errorMessage: 'Please rank all options in order'
  },
  slider: {
    validate: (response: any, config: any) => {
      const num = Number(response)
      return !isNaN(num) && num >= config.min && num <= config.max
    },
    errorMessage: 'Please select a value within the valid range'
  }
} as const