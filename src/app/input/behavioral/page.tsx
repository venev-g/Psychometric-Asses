// src/app/input/behavioral/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, User, Calendar, BookOpen, TrendingUp } from 'lucide-react'

interface Student {
  id: string
  name: string
  email?: string
  created_at: string
  assessments_count: number
  last_assessment?: string
}

export default function BehavioralInputPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredStudents(filtered)
    }
  }, [searchTerm, students])

  const loadStudents = async () => {
    try {
      const supabase = createClient()
      
      // Get all user profiles (students) and their assessment sessions separately
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Get assessment sessions for each user
      const { data: sessions, error: sessionsError } = await supabase
        .from('assessment_sessions')
        .select('user_id, status, completed_at')

      if (sessionsError) throw sessionsError

      // Process the data to get student information with assessment counts
      const studentsData = (profiles || []).map(profile => {
        const userSessions = sessions?.filter(session => session.user_id === profile.id) || []
        const completedSessions = userSessions.filter(session => session.status === 'completed')
        
        return {
          id: profile.id,
          name: profile.full_name || 'Unknown User',
          email: '', // Email not available in user_profiles table
          created_at: profile.created_at || '',
          assessments_count: userSessions.length,
          last_assessment: completedSessions.length > 0 ? 
            completedSessions.sort((a, b) => new Date(b.completed_at || '').getTime() - new Date(a.completed_at || '').getTime())[0]?.completed_at || undefined : 
            undefined
        }
      })

      setStudents(studentsData)
      setFilteredStudents(studentsData)
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSelect = (studentId: string) => {
    router.push(`/input/behavioral/${studentId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-8 flex items-center gap-6 shadow-lg">
        <BookOpen className="w-14 h-14 text-white drop-shadow-lg" />
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight">Behavioral Input</h1>
          <p className="text-blue-100 text-lg">Record and manage behavioral assessments for students</p>
        </div>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Selection</span>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Student
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No students found' : 'No students registered'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Students will appear here once they register and complete assessments'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStudentSelect(student.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      {student.email && (
                        <p className="text-sm text-gray-500">{student.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Assessments</span>
                    <Badge variant="secondary">
                      {student.assessments_count}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Assessment</span>
                    <span className="text-gray-700">
                      {student.last_assessment 
                        ? new Date(student.last_assessment).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Joined</span>
                    <span className="text-gray-700">
                      {new Date(student.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Behavioral Data
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{students.length}</h3>
            <p className="text-gray-500">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              {students.reduce((sum, student) => sum + student.assessments_count, 0)}
            </h3>
            <p className="text-gray-500">Total Assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              {students.filter(s => s.last_assessment).length}
            </h3>
            <p className="text-gray-500">Active Students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
