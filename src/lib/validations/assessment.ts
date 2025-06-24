// src/lib/validations/assessment.ts
import { z } from 'zod'
import { QUESTION_TYPES, SESSION_STATUS } from '@/lib/constants/assessmentTypes'

export const startAssessmentSchema = z.object({
  configurationId: z.string().uuid('Invalid configuration ID'),
  metadata: z.record(z.any()).optional()
})

export const submitResponseSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  questionId: z.string().uuid('Invalid question ID'),
  responseValue: z.any(),
  responseTimeMs: z.number().min(0).optional()
})

export const completeAssessmentSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  completedAt: z.string().datetime().optional()
})

export const questionResponseSchema = z.object({
  questionId: z.string().uuid(),
  questionType: z.enum(Object.values(QUESTION_TYPES) as [string, ...string[]]),
  responseValue: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.any()),
    z.record(z.any())
  ]),
  responseTimeMs: z.number().min(0).optional()
})

export const assessmentSessionUpdateSchema = z.object({
  status: z.enum(Object.values(SESSION_STATUS) as [string, ...string[]]).optional(),
  currentTestIndex: z.number().min(0).optional(),
  metadata: z.record(z.any()).optional()
})

export const assessmentFilterSchema = z.object({
  userId: z.string().uuid().optional(),
  configurationId: z.string().uuid().optional(),
  status: z.enum(Object.values(SESSION_STATUS) as [string, ...string[]]).optional(),
  startedAfter: z.string().datetime().optional(),
  startedBefore: z.string().datetime().optional(),
  completedAfter: z.string().datetime().optional(),
  completedBefore: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['startedAt', 'completedAt', 'status']).default('startedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const assessmentResultsFilterSchema = z.object({
  sessionId: z.string().uuid().optional(),
  testTypeId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  includeRecommendations: z.boolean().default(true),
  includePercentiles: z.boolean().default(true),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional()
})

export const compareAssessmentsSchema = z.object({
  sessionIds: z.array(z.string().uuid()).min(2, 'At least 2 assessments required for comparison').max(5, 'Maximum 5 assessments can be compared'),
  compareBy: z.enum(['scores', 'categories', 'timeProgression']).default('scores')
})

export const assessmentAnalyticsSchema = z.object({
  timeRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
  metrics: z.array(z.enum(['completionRate', 'averageScore', 'sessionCount', 'averageTime'])),
  filters: z.object({
    configurationIds: z.array(z.string().uuid()).optional(),
    userRoles: z.array(z.string()).optional(),
    testTypes: z.array(z.string().uuid()).optional()
  }).optional()
})

// Response validation schemas for different question types
export const multipleChoiceResponseSchema = z.object({
  questionType: z.literal('multiple_choice'),
  responseValue: z.string().min(1, 'Please select an option')
})

export const ratingScaleResponseSchema = z.object({
  questionType: z.literal('rating_scale'),
  responseValue: z.number().min(1).max(10, 'Rating must be between 1 and 10')
})

export const yesNoResponseSchema = z.object({
  questionType: z.literal('yes_no'),
  responseValue: z.boolean()
})

export const multiselectResponseSchema = z.object({
  questionType: z.literal('multiselect'),
  responseValue: z.array(z.string()).min(1, 'Please select at least one option')
})

export const rankingResponseSchema = z.object({
  questionType: z.literal('ranking'),
  responseValue: z.array(z.string()).min(2, 'Please rank at least 2 items')
})

export const sliderResponseSchema = z.object({
  questionType: z.literal('slider'),
  responseValue: z.number().min(0).max(100)
})

export type StartAssessmentData = z.infer<typeof startAssessmentSchema>
export type SubmitResponseData = z.infer<typeof submitResponseSchema>
export type CompleteAssessmentData = z.infer<typeof completeAssessmentSchema>
export type QuestionResponseData = z.infer<typeof questionResponseSchema>
export type AssessmentSessionUpdateData = z.infer<typeof assessmentSessionUpdateSchema>
export type AssessmentFilterParams = z.infer<typeof assessmentFilterSchema>
export type AssessmentResultsFilterParams = z.infer<typeof assessmentResultsFilterSchema>
export type CompareAssessmentsData = z.infer<typeof compareAssessmentsSchema>
export type AssessmentAnalyticsParams = z.infer<typeof assessmentAnalyticsSchema>