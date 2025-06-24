// src/lib/validations/configuration.ts
import { z } from 'zod'

export const createConfigurationSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  testTypeIds: z
    .array(z.string().uuid())
    .min(1, 'At least one test type must be selected'),
  maxAttempts: z
    .number()
    .min(1, 'Maximum attempts must be at least 1')
    .max(10, 'Maximum attempts cannot exceed 10')
    .optional(),
  timeLimitMinutes: z
    .number()
    .min(5, 'Time limit must be at least 5 minutes')
    .max(180, 'Time limit cannot exceed 3 hours')
    .optional(),
  isActive: z.boolean().default(true),
  settings: z.object({
    allowPause: z.boolean().default(true),
    showProgress: z.boolean().default(true),
    randomizeQuestions: z.boolean().default(false),
    requireAllQuestions: z.boolean().default(true),
    allowBackward: z.boolean().default(false),
    showResults: z.boolean().default(true),
    emailResults: z.boolean().default(false)
  }).optional()
})

export const updateConfigurationSchema = createConfigurationSchema.partial().extend({
  id: z.string().uuid('Invalid configuration ID')
})

export const configurationSequenceSchema = z.object({
  configurationId: z.string().uuid(),
  sequences: z.array(z.object({
    testTypeId: z.string().uuid(),
    sequenceOrder: z.number().min(1),
    isRequired: z.boolean().default(true),
    timeLimit: z.number().min(1).optional(),
    passingScore: z.number().min(0).max(100).optional()
  })).min(1, 'At least one test sequence is required')
})

export const configurationFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  createdBy: z.string().uuid().optional(),
  hasTestType: z.string().uuid().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'isActive']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const bulkConfigurationActionSchema = z.object({
  configurationIds: z.array(z.string().uuid()).min(1, 'At least one configuration must be selected'),
  action: z.enum(['activate', 'deactivate', 'delete', 'duplicate']),
  params: z.record(z.any()).optional()
})

export const configurationStatsSchema = z.object({
  configurationId: z.string().uuid(),
  timeRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional(),
  includeUserBreakdown: z.boolean().default(false),
  includeCompletionTrends: z.boolean().default(true)
})

export const duplicateConfigurationSchema = z.object({
  sourceId: z.string().uuid('Invalid source configuration ID'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  copySettings: z.boolean().default(true),
  copySequences: z.boolean().default(true),
  isActive: z.boolean().default(false)
})

export type CreateConfigurationData = z.infer<typeof createConfigurationSchema>
export type UpdateConfigurationData = z.infer<typeof updateConfigurationSchema>
export type ConfigurationSequenceData = z.infer<typeof configurationSequenceSchema>
export type ConfigurationFilterParams = z.infer<typeof configurationFilterSchema>
export type BulkConfigurationActionData = z.infer<typeof bulkConfigurationActionSchema>
export type ConfigurationStatsParams = z.infer<typeof configurationStatsSchema>
export type DuplicateConfigurationData = z.infer<typeof duplicateConfigurationSchema>