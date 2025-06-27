// src/app/input/behavioral-list/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { 
  Search, 
  ArrowLeft, 
  Eye, 
  Calendar, 
  User, 
  TrendingUp,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface AssessmentSession {
  id: string
  user_id: string | null
  status: string | null
  started_at: string | null
  completed_at: string | null
  total_tests: number | null
  current_test_index: number | null
  metadata: any
  user_profiles: {
    full_name: string | null
  } | null
}

interface AssessmentResult {
  id: string
  session_id: string
  test_type_id: string
  raw_scores: any
  processed_scores: any
  recommendations: any
  created_at: string
  test_types: {
    name: string
    slug: string
  } | null
}

export default function BehavioralAssessmentListPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<AssessmentSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<AssessmentSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'abandoned'>('all')

  useEffect(() => {
    loadAssessmentSessions()
  }, [])

  useEffect(() => {
    filterSessions()
  }, [searchTerm, statusFilter, sessions])

  const loadAssessmentSessions = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // First get assessment sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('assessment_sessions')
        .select('*')
        .order('started_at', { ascending: false })

      if (sessionsError) throw sessionsError

      // Then get user profiles for each session
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name')

      if (profilesError) throw profilesError

      // Combine the data
      const sessionsWithProfiles = (sessionsData || []).map(session => ({
        ...session,
        user_profiles: profilesData?.find(profile => profile.id === session.user_id) || null
      }))

      setSessions(sessionsWithProfiles)
    } catch (err) {
      console.error('Error loading assessment sessions:', err)
      setError('Failed to load assessment sessions')
    } finally {
      setLoading(false)
    }
  }

  const filterSessions = () => {
    let filtered = sessions

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(session => 
        session.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.user_id && session.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter)
    }

    setFilteredSessions(filtered)
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>
      case 'abandoned':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Abandoned</Badge>
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>
    }
  }

  const getProgressPercentage = (session: AssessmentSession) => {
    if (session.status === 'completed') return 100
    if (!session.total_tests || session.total_tests === 0 || !session.current_test_index) return 0
    return Math.round((session.current_test_index / session.total_tests) * 100)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const viewSessionDetails = (sessionId: string) => {
    router.push(`/results/${sessionId}`)
  }

  const continueAssessment = (userId: string | null) => {
    if (userId) {
      router.push(`/input/behavioral/${userId}`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading assessment sessions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Behavioral Assessment Sessions</h1>
            <p className="text-gray-600">Monitor and manage student assessment progress</p>
          </div>
        </div>
        <Button onClick={() => router.push('/input/behavioral')} className="bg-blue-600 hover:bg-blue-700">
          <User className="mr-2 h-4 w-4" />
          Start New Assessment
        </Button>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                size="sm"
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('in_progress')}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'abandoned' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('abandoned')}
                size="sm"
              >
                Abandoned
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'in_progress').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Abandoned</p>
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'abandoned').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                {sessions.length === 0 ? 'No assessment sessions found.' : 'No sessions match your filters.'}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {session.user_profiles?.full_name || 'Unknown User'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        User ID: {session.user_id ? session.user_id.slice(0, 8) + '...' : 'Unknown'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        {getStatusBadge(session.status)}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          Started: {formatDate(session.started_at)}
                        </div>
                        {session.completed_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed: {formatDate(session.completed_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getProgressPercentage(session)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{getProgressPercentage(session)}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {session.current_test_index}/{session.total_tests} tests
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {session.status === 'completed' ? (
                        <Button
                          onClick={() => viewSessionDetails(session.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      ) : (
                        <Button
                          onClick={() => continueAssessment(session.user_id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
