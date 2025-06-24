import React from 'react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading admin panel...</p>
      </div>
    </div>
  )
}