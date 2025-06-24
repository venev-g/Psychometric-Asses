'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, History, Settings, Download, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface QuickActionsProps {
  hasInProgressAssessment?: boolean
  inProgressSessionId?: string
}

export function QuickActions({ hasInProgressAssessment, inProgressSessionId }: QuickActionsProps) {
  const actions = [
    {
      title: hasInProgressAssessment ? 'Continue Assessment' : 'Start New Assessment',
      description: hasInProgressAssessment 
        ? 'Resume your current assessment where you left off'
        : 'Begin a new psychometric assessment',
      icon: Play,
      href: hasInProgressAssessment 
        ? `/assessment/${inProgressSessionId}`
        : '/assessment/start',
      variant: 'default' as const,
      featured: true
    },
    {
      title: 'View Results History',
      description: 'Review your past assessment results and insights',
      icon: History,
      href: '/results/history',
      variant: 'outline' as const
    },
    {
      title: 'Profile Settings',
      description: 'Update your account information and preferences',
      icon: Settings,
      href: '/profile/settings',
      variant: 'outline' as const
    },
    {
      title: 'Download Reports',
      description: 'Export your assessment results as PDF reports',
      icon: Download,
      href: '/results/download',
      variant: 'outline' as const
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <div className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                  action.featured ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      action.featured ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Learning Resources */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Learning Resources</span>
          </h4>
          <div className="space-y-2">
            <a 
              href="/resources/multiple-intelligences" 
              className="block text-sm text-blue-600 hover:text-blue-700"
            >
              Understanding Multiple Intelligences
            </a>
            <a 
              href="/resources/personality-types" 
              className="block text-sm text-blue-600 hover:text-blue-700"
            >
              DISC Personality Types Guide
            </a>
            <a 
              href="/resources/learning-styles" 
              className="block text-sm text-blue-600 hover:text-blue-700"
            >
              VARK Learning Styles Explained
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}