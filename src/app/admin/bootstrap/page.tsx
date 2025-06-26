'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'

export default function AdminBootstrapPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    serviceRoleKey: '',
    adminEmail: '',
    adminPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Unknown error occurred')
      }
    } catch (err: any) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const testCurrentSetup = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Test multiple endpoints
      const tests = await Promise.all([
        fetch('/api/test-types').then(r => r.json()),
        fetch('/api/questions?testTypeId=7c8d2f56-3b83-4930-800a-5a50940c98ec').then(r => r.json()),
        fetch('/api/configurations').then(r => r.json()),
      ])

      setResult({
        success: true,
        tests: {
          testTypes: tests[0],
          questions: tests[1],
          configurations: tests[2]
        }
      })
    } catch (err: any) {
      setError('Test failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Bootstrap</h1>
          <p className="text-gray-600 mt-2">
            Set up the initial admin user and configurations for the psychometric assessment platform
          </p>
        </div>

        {/* Current System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status Check</CardTitle>
            <CardDescription>
              Test the current system status and see what's working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testCurrentSetup} disabled={loading} className="w-full">
              {loading ? 'Testing...' : 'Test Current Setup'}
            </Button>
          </CardContent>
        </Card>

        {/* Bootstrap Form */}
        <Card>
          <CardHeader>
            <CardTitle>Bootstrap System</CardTitle>
            <CardDescription>
              Create an admin user and seed test configurations. You need the Supabase service role key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceRoleKey">Supabase Service Role Key</Label>
                <Input
                  id="serviceRoleKey"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.serviceRoleKey}
                  onChange={(e) => setFormData({ ...formData, serviceRoleKey: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-500">
                  Get this from Supabase Dashboard → Settings → API → service_role key
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Bootstrapping...' : 'Bootstrap System'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Step 1: Get Service Role Key</h3>
              <p className="text-sm text-gray-600">
                1. Go to your Supabase project dashboard<br/>
                2. Navigate to Settings → API<br/>
                3. Copy the service_role key (not the anon key)<br/>
                4. This key bypasses RLS and can perform admin operations
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Step 2: Bootstrap</h3>
              <p className="text-sm text-gray-600">
                Use the form above to create the first admin user and seed the necessary configurations.
                This will enable the full authenticated assessment flow.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Step 3: Update Environment</h3>
              <p className="text-sm text-gray-600">
                After successful bootstrap, update your .env.local file with the service role key
                to enable admin operations in the application.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
