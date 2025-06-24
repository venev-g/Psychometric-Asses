import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Eye, Download } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ResultsHistoryPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user's assessment sessions with results
  const { data: sessions } = await supabase
    .from('assessment_sessions')
    .select(`
      *,
      test_configurations (name, description),
      assessment_results (count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'abandoned': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assessment History</h1>
        <p className="text-gray-600">View and manage your past assessment results</p>
      </div>

      {!sessions || sessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No assessments found</p>
            <Link href="/assessment/start">
              <Button>Start Your First Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {session.test_configurations?.name || 'Unknown Configuration'}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {session.test_configurations?.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Started: {new Date(session.started_at).toLocaleDateString()}</span>
                      {session.completed_at && (
                        <span>Completed: {new Date(session.completed_at).toLocaleDateString()}</span>
                      )}
                      <Badge variant={getStatusColor(session.status)}>
                        {session.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {session.status === 'completed' && (
                      <>
                        <Link href={`/results/${session.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </>
                    )}
                    {session.status === 'in_progress' && (
                      <Link href={`/assessment/${session.id}`}>
                        <Button size="sm">
                          Continue Assessment
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}