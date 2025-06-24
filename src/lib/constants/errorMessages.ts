// src/lib/constants/errorMessages.ts
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
    ACCOUNT_LOCKED: 'Your account has been locked due to multiple failed login attempts.',
    WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
    EMAIL_ALREADY_EXISTS: 'An account with this email address already exists.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    FORBIDDEN: 'Access denied. Insufficient permissions.',
    TOKEN_INVALID: 'Invalid authentication token.',
    SIGNUP_DISABLED: 'New user registration is currently disabled.'
  },

  // Assessment errors
  ASSESSMENT: {
    SESSION_NOT_FOUND: 'Assessment session not found or has expired.',
    ALREADY_COMPLETED: 'This assessment has already been completed.',
    INVALID_RESPONSE: 'Invalid response format. Please try again.',
    QUESTION_NOT_FOUND: 'Question not found in this assessment.',
    TIME_LIMIT_EXCEEDED: 'Time limit for this assessment has been exceeded.',
    MAX_ATTEMPTS_REACHED: 'Maximum number of attempts for this assessment has been reached.',
    CONFIGURATION_INACTIVE: 'This assessment configuration is currently inactive.',
    RESPONSE_REQUIRED: 'A response is required for this question.',
    INVALID_QUESTION_TYPE: 'Unsupported question type.',
    SCORING_FAILED: 'Failed to calculate assessment scores. Please contact support.',
    INCOMPLETE_SESSION: 'Assessment session is incomplete and cannot be processed.',
    CONCURRENT_SESSION: 'Another assessment session is already in progress.'
  },

  // Configuration errors
  CONFIGURATION: {
    NOT_FOUND: 'Configuration not found.',
    INVALID_TEST_SEQUENCE: 'Invalid test sequence configuration.',
    DUPLICATE_NAME: 'A configuration with this name already exists.',
    MISSING_TEST_TYPES: 'At least one test type must be selected.',
    INVALID_TIME_LIMIT: 'Time limit must be a positive number.',
    INVALID_MAX_ATTEMPTS: 'Maximum attempts must be a positive number.',
    CANNOT_DELETE_ACTIVE: 'Cannot delete an active configuration.',
    DEPENDENCY_EXISTS: 'Cannot delete configuration with existing assessment sessions.'
  },

  // Question errors
  QUESTION: {
    NOT_FOUND: 'Question not found.',
    INVALID_TYPE: 'Invalid question type.',
    MISSING_OPTIONS: 'Question options are required for this question type.',
    INVALID_WEIGHT: 'Question weight must be a positive number.',
    MISSING_CATEGORY: 'Question category is required.',
    DUPLICATE_ORDER: 'Question order index already exists.',
    CANNOT_DELETE_IN_USE: 'Cannot delete question that is part of active assessments.'
  },

  // User errors
  USER: {
    NOT_FOUND: 'User not found.',
    PROFILE_UPDATE_FAILED: 'Failed to update user profile.',
    AVATAR_UPLOAD_FAILED: 'Failed to upload avatar image.',
    INVALID_ROLE: 'Invalid user role specified.',
    CANNOT_DELETE_SELF: 'Cannot delete your own account.',
    CANNOT_CHANGE_OWN_ROLE: 'Cannot change your own role.',
    EMAIL_UPDATE_FAILED: 'Failed to update email address.',
    PREFERENCES_INVALID: 'Invalid user preferences format.'
  },

  // System errors
  SYSTEM: {
    INTERNAL_ERROR: 'An internal server error occurred. Please try again later.',
    DATABASE_ERROR: 'Database connection error. Please try again.',
    VALIDATION_ERROR: 'Validation failed. Please check your input.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait before trying again.',
    MAINTENANCE_MODE: 'System is currently under maintenance. Please try again later.',
    FEATURE_DISABLED: 'This feature is currently disabled.',
    INSUFFICIENT_STORAGE: 'Insufficient storage space.',
    FILE_TOO_LARGE: 'File size exceeds maximum allowed limit.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported format.',
    QUOTA_EXCEEDED: 'Resource quota has been exceeded.'
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: (field: string) => `${field} is required.`,
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters.`,
    MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters.`,
    INVALID_FORMAT: (field: string) => `${field} format is invalid.`,
    INVALID_RANGE: (field: string, min: number, max: number) => 
      `${field} must be between ${min} and ${max}.`,
    INVALID_OPTION: (field: string) => `Invalid option selected for ${field}.`,
    FUTURE_DATE_REQUIRED: (field: string) => `${field} must be a future date.`,
    PAST_DATE_REQUIRED: (field: string) => `${field} must be a past date.`,
    INVALID_URL: 'Please enter a valid URL.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.'
  },

  // API errors
  API: {
    BAD_REQUEST: 'Bad request. Please check your input.',
    NOT_FOUND: 'Resource not found.',
    METHOD_NOT_ALLOWED: 'HTTP method not allowed.',
    CONFLICT: 'Resource conflict. The requested action cannot be completed.',
    UNPROCESSABLE_ENTITY: 'Request cannot be processed due to validation errors.',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
    GATEWAY_TIMEOUT: 'Gateway timeout. Please try again.',
    PAYLOAD_TOO_LARGE: 'Request payload is too large.',
    UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type.',
    EXPECTATION_FAILED: 'Request expectation failed.'
  }
} as const

export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGNIN_SUCCESS: 'Successfully signed in!',
    SIGNUP_SUCCESS: 'Account created successfully! Please verify your email.',
    SIGNOUT_SUCCESS: 'Successfully signed out.',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully.',
    EMAIL_VERIFIED: 'Email address verified successfully.'
  },
  
  ASSESSMENT: {
    SESSION_STARTED: 'Assessment session started successfully.',
    RESPONSE_SAVED: 'Response saved successfully.',
    ASSESSMENT_COMPLETED: 'Assessment completed successfully!',
    RESULTS_GENERATED: 'Assessment results generated successfully.'
  },
  
  CONFIGURATION: {
    CREATED: 'Configuration created successfully.',
    UPDATED: 'Configuration updated successfully.',
    DELETED: 'Configuration deleted successfully.',
    ACTIVATED: 'Configuration activated successfully.',
    DEACTIVATED: 'Configuration deactivated successfully.'
  },
  
  USER: {
    PROFILE_UPDATED: 'Profile updated successfully.',
    AVATAR_UPLOADED: 'Avatar uploaded successfully.',
    PREFERENCES_SAVED: 'Preferences saved successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.'
  },
  
  SYSTEM: {
    OPERATION_COMPLETED: 'Operation completed successfully.',
    DATA_EXPORTED: 'Data exported successfully.',
    REPORT_GENERATED: 'Report generated successfully.',
    BACKUP_CREATED: 'Backup created successfully.'
  }
} as const

export const WARNING_MESSAGES = {
  ASSESSMENT: {
    TIME_RUNNING_OUT: 'Warning: Less than 5 minutes remaining!',
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    BROWSER_COMPATIBILITY: 'Your browser may not be fully compatible with this assessment.',
    SLOW_CONNECTION: 'Slow network connection detected. Responses may take longer to save.'
  },
  
  SYSTEM: {
    MAINTENANCE_SCHEDULED: 'Scheduled maintenance in 30 minutes. Please complete your tasks.',
    BETA_FEATURE: 'This is a beta feature and may not work as expected.',
    DATA_LOSS_WARNING: 'This action cannot be undone and will permanently delete data.',
    QUOTA_WARNING: 'You are approaching your usage quota limit.'
  }
} as const

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  return ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR
}

export function formatValidationError(field: string, rule: string, ...args: any[]): string {
  switch (rule) {
    case 'required':
      return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD(field)
    case 'minLength':
      return ERROR_MESSAGES.VALIDATION.MIN_LENGTH(field, args[0])
    case 'maxLength':
      return ERROR_MESSAGES.VALIDATION.MAX_LENGTH(field, args[0])
    case 'range':
      return ERROR_MESSAGES.VALIDATION.INVALID_RANGE(field, args[0], args[1])
    default:
      return ERROR_MESSAGES.VALIDATION.INVALID_FORMAT(field)
  }
}