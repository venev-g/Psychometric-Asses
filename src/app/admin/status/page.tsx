'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { CheckCircle, AlertCircle, Clock, Users, Database, Shield, Cog, TestTube } from 'lucide-react'

interface SystemStatus {
  database: { status: 'working' | 'partial' | 'error', details: string }
  authentication: { status: 'working' | 'partial' | 'error', details: string }
  assessments: { status: 'working' | 'partial' | 'error', details: string }
  configurations: { status: 'working' | 'partial' | 'error', details: string }
  userManagement: { status: 'working' | 'partial' | 'error', details: string }
  adminPanel: { status: 'working' | 'partial' | 'error', details: string }
}

export default function SystemStatusDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [tests, setTests] = useState<any>(null)

  const runSystemCheck = async () => {
    setLoading(true)
    try {
      // Test multiple system components
      const results = await Promise.allSettled([
        fetch('/api/test-types').then(r => r.json()),
        fetch('/api/questions?testTypeId=7c8d2f56-3b83-4930-800a-5a50940c98ec').then(r => r.json()),
        fetch('/api/configurations').then(r => r.json()),
        fetch('/api/demo/start-assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ configurationId: 'temp-quick-check' }) }).then(r => r.json()),
        fetch('/api/assessments/sessions').then(r => r.json()),
      ])

      const [testTypesResult, questionsResult, configurationsResult, demoResult, sessionsResult] = results

      const testTypes = testTypesResult.status === 'fulfilled' ? testTypesResult.value : null
      const questions = questionsResult.status === 'fulfilled' ? questionsResult.value : null
      const configurations = configurationsResult.status === 'fulfilled' ? configurationsResult.value : null
      const demo = demoResult.status === 'fulfilled' ? demoResult.value : null
      const sessions = sessionsResult.status === 'fulfilled' ? sessionsResult.value : null

      setTests({
        testTypes,
        questions,
        configurations,
        demo,
        sessions
      })

      // Analyze results and create status
      const newStatus: SystemStatus = {
        database: {
          status: testTypes?.success && questions?.success ? 'working' : 'error',
          details: testTypes?.success && questions?.success ? 
            `${testTypes.testTypes?.length || 0} test types, ${questions.questions?.length || 0} questions loaded` :
            'Database connection or data issues'
        },
        authentication: {
          status: 'partial',
          details: 'Supabase auth configured, but RLS policies need admin user setup'
        },
        assessments: {
          status: demo?.success ? 'working' : 'partial',
          details: demo?.success ? 
            'Demo assessments working, full auth flow needs admin setup' :
            'Assessment flow has issues'
        },
        configurations: {
          status: configurations?.success ? 'working' : 'error',
          details: configurations?.success ? 
            `${configurations.configurations?.length || 0} configurations available (${configurations.source || 'database'})` :
            'Configuration loading failed'
        },
        userManagement: {
          status: 'partial',
          details: 'User registration works, but admin management needs bootstrap'
        },
        adminPanel: {
          status: 'partial',
          details: 'Bootstrap page ready, needs service role key for full functionality'
        }
      }

      setStatus(newStatus)
    } catch (error) {
      console.error('System check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSystemCheck()
  }, [])

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'working': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'partial': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (statusValue: string) => {
    const variants = {
      working: 'default',
      partial: 'secondary', 
      error: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[statusValue as keyof typeof variants] || 'outline'}>
        {statusValue}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">System Status Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage the psychometric assessment platform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={runSystemCheck} disabled={loading}>
            {loading ? 'Checking...' : 'Run System Check'}
          </Button>
          <Button variant="outline" onClick={() => window.open('/admin/bootstrap', '_blank')}>
            Bootstrap Admin
          </Button>
          <Button variant="outline" onClick={() => window.open('/demo-dashboard', '_blank')}>
            Demo Dashboard
          </Button>
          <Button variant="outline" onClick={() => window.open('/assessment', '_blank')}>
            Test Assessment
          </Button>
        </div>

        {/* System Status Overview */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                {getStatusIcon(status.database.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Database className="h-8 w-8 text-blue-500" />
                  {getStatusBadge(status.database.status)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{status.database.details}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Authentication</CardTitle>
                {getStatusIcon(status.authentication.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Shield className="h-8 w-8 text-green-500" />
                  {getStatusBadge(status.authentication.status)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{status.authentication.details}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                {getStatusIcon(status.assessments.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <TestTube className="h-8 w-8 text-purple-500" />
                  {getStatusBadge(status.assessments.status)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{status.assessments.details}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Configurations</CardTitle>
                {getStatusIcon(status.configurations.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Cog className="h-8 w-8 text-orange-500" />
                  {getStatusBadge(status.configurations.status)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{status.configurations.details}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Management</CardTitle>
                {getStatusIcon(status.userManagement.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-indigo-500" />
                  {getStatusBadge(status.userManagement.status)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{status.userManagement.details}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admin Panel</CardTitle>
                {getStatusIcon(status.adminPanel.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Shield className="h-8 w-8 text-red-500" />
                  {getStatusBadge(status.adminPanel.status)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{status.adminPanel.details}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps to Complete the System</CardTitle>
            <CardDescription>
              These are the remaining tasks to have a fully functional system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>✅ Working:</strong> Demo assessments, temporary configurations, basic auth, API endpoints
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>🔄 In Progress:</strong> Admin user creation, RLS policy resolution, database seeding
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Priority Tasks:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Get Supabase service role key and bootstrap admin user</li>
                <li>• Enable full authenticated assessment flow</li>
                <li>• Complete user profile management</li>
                <li>• Implement admin panel for managing assessments</li>
                <li>• Set up Supabase storage for file uploads</li>
                <li>• Add comprehensive error handling and validation</li>
                <li>• Remove temporary/demo code once DB is working</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Test Results Details */}
        {tests && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs max-h-96">
                {JSON.stringify(tests, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
