import React from 'react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function AssessmentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Loading Assessment
        </h2>
        <p className="mt-2 text-gray-600">
          Please wait while we prepare your assessment...
        </p>
      </div>
    </div>
  )
}