// src/lib/errors.ts
export class AssessmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AssessmentError'
  }
}

export class ValidationError extends AssessmentError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AssessmentError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AssessmentError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AssessmentError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  if (error instanceof AssessmentError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }
  
  if (error.code === '23505') { // Unique constraint violation
    return {
      error: 'A record with this information already exists',
      code: 'DUPLICATE_ERROR',
      statusCode: 409
    }
  }
  
  if (error.code === '23503') { // Foreign key constraint violation
    return {
      error: 'Referenced resource does not exist',
      code: 'REFERENCE_ERROR',
      statusCode: 400
    }
  }
  
  return {
    error: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500
  }
}