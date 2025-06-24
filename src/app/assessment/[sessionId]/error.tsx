'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AssessmentError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Assessment Error
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading your assessment. This might be due to a connection issue or the session may have expired.
        </p>
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error Details
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}