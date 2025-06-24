// src/lib/validations/user.ts
import { z } from 'zod'

export const userProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  avatarUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''))
})

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().default('UTC'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    assessmentReminders: z.boolean().default(true),
    weeklyReports: z.boolean().default(false)
  }).default({}),
  privacy: z.object({
    shareResults: z.boolean().default(false),
    allowAnalytics: z.boolean().default(true)
  }).default({})
})

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['user', 'admin', 'moderator'])
})

export const userSearchSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  isActive: z.boolean().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user must be selected'),
  action: z.enum(['activate', 'deactivate', 'delete', 'changeRole']),
  params: z.record(z.any()).optional()
})

export const userActivityFilterSchema = z.object({
  userId: z.string().uuid().optional(),
  type: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type UserPreferencesFormData = z.infer<typeof userPreferencesSchema>
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>
export type UserSearchParams = z.infer<typeof userSearchSchema>
export type BulkUserActionData = z.infer<typeof bulkUserActionSchema>
export type UserActivityFilterParams = z.infer<typeof userActivityFilterSchema>