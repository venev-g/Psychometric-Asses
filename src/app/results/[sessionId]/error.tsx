'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ResultsError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to Load Results
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't load your assessment results. This might be due to a connection issue or the results may not be available yet.
        </p>
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/results/history'}
            className="w-full"
          >
            View All Results
          </Button>
        </div>
      </div>
    </div>
  )
}