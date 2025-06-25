import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Eye, Download, BookOpen, Brain, User, Clock } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const testTypeIcon = (name: string) => {
  if (!name) return <BookOpen className="w-8 h-8 text-gray-400" />
  switch (name.toLowerCase()) {
    case 'intelligence': return <Brain className="w-8 h-8 text-blue-500" />
    case 'personality': return <User className="w-8 h-8 text-purple-500" />
    case 'vark': return <BookOpen className="w-8 h-8 text-green-500" />
    default: return <BookOpen className="w-8 h-8 text-gray-400" />
  }
}

export default async function ResultsHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: sessions } = await supabase
    .from('assessment_sessions')
    .select(`*, test_configurations (name, description), assessment_results (count)`)
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Modern Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 p-8 flex items-center gap-6 shadow-lg mb-6 animate-fade-in">
        <BookOpen className="w-14 h-14 text-white drop-shadow-lg" />
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight">Assessment History</h1>
          <p className="text-blue-100 text-lg">View and manage your past assessment results</p>
        </div>
      </div>

      {/* Timeline/Stepper Style */}
      {!sessions || sessions.length === 0 ? (
        <Card className="shadow-xl animate-fade-in">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No assessments found</p>
            <Link href="/test/start">
              <Button>Start Your First Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="relative pl-6 before:content-[''] before:absolute before:top-0 before:left-2 before:w-1 before:h-full before:bg-gradient-to-b before:from-blue-200 before:to-purple-200 before:rounded-full">
          {sessions.map((session, idx) => (
            <div key={session.id} className="relative mb-8 group animate-fade-in-up">
              {/* Timeline dot */}
              <div className="absolute -left-2 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-4 border-white shadow-lg z-10 group-hover:scale-110 transition-transform"></div>
              <Card className="ml-8 shadow-lg rounded-xl border-0 group-hover:shadow-2xl transition-shadow bg-white/90">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    {testTypeIcon(session.test_configurations?.name || '')}
                    <span className="text-xs text-gray-400 mt-1">{session.test_configurations?.name || 'Test'}</span>
                  </div>
                  {/* Main Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1 text-gray-900 flex items-center gap-2">
                      {session.test_configurations?.name || 'Unknown Configuration'}
                      {session.status === 'completed' && <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">Completed</span>}
                      {session.status === 'in_progress' && <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">In Progress</span>}
                      {session.status === 'abandoned' && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Abandoned</span>}
                    </h3>
                    <p className="text-gray-600 mb-2">{session.test_configurations?.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Started: {session.started_at ? new Date(session.started_at).toLocaleDateString() : 'Unknown'}</span>
                      {session.completed_at && (
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Completed: {new Date(session.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(session.status || 'unknown')}>
                        {session.status ? session.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                      </Badge>
                      {/* Progress bar for in progress */}
                      {session.status === 'in_progress' && (
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden ml-2">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2" style={{ width: '50%' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end justify-center min-w-[120px]">
                    {session.status === 'completed' && (
                      <>
                        <Link href={`/results/${session.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />View Results
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-2" />Download
                        </Button>
                      </>
                    )}
                    {session.status === 'in_progress' && (
                      <Link href={`/assessment/${session.id}`}>
                        <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                          Continue
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}