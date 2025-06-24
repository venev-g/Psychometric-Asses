'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function QuestionManager() {
  const [questions, setQuestions] = useState([])
  const [testTypes, setTestTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTestType, setSelectedTestType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedTestType, searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (selectedTestType) params.append('testTypeId', selectedTestType)
      if (searchQuery) params.append('search', searchQuery)
      
      const [questionsResponse, typesResponse] = await Promise.all([
        fetch(`/api/questions?${params}`),
        fetch('/api/test-types')
      ])
      
      const questionsData = await questionsResponse.json()
      const typesData = await typesResponse.json()
      
      setQuestions(questionsData.questions || [])
      setTestTypes(typesData.testTypes || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' })
      loadData()
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }

  const columns = [
    {
      key: 'questionText',
      header: 'Question',
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'questionType',
      header: 'Type',
      render: (value: string) => (
        <Badge variant="secondary">
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (value: string) => value || '-'
    },
    {
      key: 'weight',
      header: 'Weight',
      render: (value: number) => value?.toString() || '1'
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/questions/${row.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteQuestion(row.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questions</CardTitle>
            <Link href="/admin/questions/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search questions..."
              />
            </div>
            <div className="w-64">
              <Select
                value={selectedTestType}
                onValueChange={(value) => setSelectedTestType(value)}
              >
                <option value="">All Test Types</option>
                {testTypes.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={questions}
            columns={columns}
            loading={loading}
            emptyMessage="No questions found"
          />
        </CardContent>
      </Card>
    </div>
  )
}