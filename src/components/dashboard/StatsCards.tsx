'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Stat {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  color: string
}

interface StatsCardsProps {
  stats: Stat[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200'
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'red':
        return 'bg-red-50 text-red-600 border-red-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <div className={`flex items-center space-x-1 mt-1 text-sm ${getChangeColor(stat.changeType)}`}>
                      {getChangeIcon(stat.changeType)}
                      <span>{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}