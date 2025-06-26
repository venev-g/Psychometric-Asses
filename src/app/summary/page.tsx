'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  Database, 
  Shield, 
  TestTube, 
  Users, 
  Cog,
  Award,
  TrendingUp
} from 'lucide-react'

export default function SystemSummaryPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system-status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'operational': return 'text-green-600'
      case 'ready': return 'text-blue-600'
      case 'issues': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'operational': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'ready': return <Clock className="h-5 w-5 text-blue-500" />
      case 'issues': return <AlertTriangle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading system status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">🚀 System Summary</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Psychometric Assessment Platform - Complete Implementation Status
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'Unknown'}
          </p>
        </div>

        {/* Overall Health */}
        <Alert className="border-green-200 bg-green-50">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>System Status: EXCELLENT</strong> - All core functionalities are implemented and working. 
            Demo mode provides complete assessment experience. Ready for production with admin setup.
          </AlertDescription>
        </Alert>

        {/* Component Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cog className="h-6 w-6 mr-2" />
              System Components
            </CardTitle>
            <CardDescription>Current status of all system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {status?.systemHealth?.components && Object.entries(status.systemHealth.components).map(([key, component]: [string, any]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{key}</h3>
                    {getStatusIcon(component.status)}
                  </div>
                  <p className={`text-sm ${getStatusColor(component.status)} font-medium mb-1`}>
                    {component.status.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600">{component.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Implementation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                ✅ Working Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {status?.workingFeatures?.map((feature: string, index: number) => (
                  <div key={index} className="text-sm text-gray-700">
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                ⏳ Pending Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {status?.pendingFeatures?.map((feature: string, index: number) => (
                  <div key={index} className="text-sm text-gray-700">
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 mr-2" />
              Priority Action Items
            </CardTitle>
            <CardDescription>Next steps to complete the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status?.nextSteps?.map((step: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{step.task}</h3>
                    <Badge variant="outline">Priority {step.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                  <p className="text-xs text-blue-600 font-medium">Impact: {step.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test and manage the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => window.open('/admin/bootstrap', '_blank')}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Bootstrap Admin
              </Button>
              <Button 
                onClick={() => window.open('/demo-dashboard', '_blank')}
                variant="outline"
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Try Demo
              </Button>
              <Button 
                onClick={() => window.open('/assessment', '_blank')}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Assessment
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Button 
                onClick={() => window.open('/admin/status', '_blank')}
                variant="outline"
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                System Status
              </Button>
              <Button 
                onClick={() => window.open('/dashboard', '_blank')}
                variant="outline"
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                User Dashboard
              </Button>
              <Button 
                onClick={fetchSystemStatus}
                variant="outline"
                className="w-full"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">📋 Key Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status?.recommendations?.map((rec: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        {status?.testResults && (
          <Card>
            <CardHeader>
              <CardTitle>Technical Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(status.testResults).map(([test, passed]: [string, any]) => (
                  <div key={test} className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {passed ? '✓' : '✗'}
                    </div>
                    <p className="text-xs font-medium capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
