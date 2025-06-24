'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'
import Link from 'next/link'

export function TestTypeManager() {
  const [testTypes, setTestTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestTypes()
  }, [])

  const loadTestTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/test-types')
      const data = await response.json()
      setTestTypes(data.testTypes || [])
    } catch (error) {
      console.error('Failed to load test types:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTestType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test type?')) return
    
    try {
      await fetch(`/api/test-types/${id}`, { method: 'DELETE' })
      loadTestTypes()
    } catch (error) {
      console.error('Failed to delete test type:', error)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/test-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      loadTestTypes()
    } catch (error) {
      console.error('Failed to update test type:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (value: string) => (
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{value}</code>
      )
    },
    {
      key: 'version',
      header: 'Version',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'estimatedDurationMinutes',
      header: 'Duration',
      render: (value: number) => `${value} min`
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean, row: any) => (
        <button
          onClick={() => toggleActive(row.id, value)}
          className="cursor-pointer"
        >
          <Badge variant={value ? 'success' : 'secondary'}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
        </button>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/test-types/${row.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/admin/questions?testTypeId=${row.id}`}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteTestType(row.id)}
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
            <CardTitle>Test Types</CardTitle>
            <Link href="/admin/test-types/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Test Type
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Test Types Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={testTypes}
            columns={columns}
            loading={loading}
            emptyMessage="No test types found"
          />
        </CardContent>
      </Card>
    </div>
  )
}