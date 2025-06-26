// src/components/test/PersonalityReport.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface PersonalityReportProps {
  responses: any[]
  onContinue: () => void
}

export default function PersonalityReport({ responses, onContinue }: PersonalityReportProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Personality Report</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Your personality assessment results will be displayed here.
        </p>
        <Button onClick={onContinue}>Continue to Learning Style Test</Button>
      </CardContent>
    </Card>
  )
}
