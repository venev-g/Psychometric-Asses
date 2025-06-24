'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Edit, Trash2, Shield, ShieldOff } from 'lucide-react'

export function UserManager() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadUsers()
  }, [searchQuery])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    if (!confirm(`Are you sure you want to make this user ${newRole === 'admin' ? 'an administrator' : 'a regular user'}?`)) {
      return
    }
    
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      loadUsers()
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const columns = [
    {
      key: 'profile',
      header: 'User',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-3">
          <Avatar className="size-sm">
            <img 
              src={row.avatar_url} 
              alt={row.full_name || row.email} 
              className="h-full w-full object-cover"
            />
          </Avatar>
          <div>
            <div className="font-medium">{row.full_name || 'No name'}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (value: string, row: any) => (
        <button
          onClick={() => toggleUserRole(row.id, value)}
          className="cursor-pointer"
        >
          <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
            {value === 'admin' ? 'Administrator' : 'User'}
          </Badge>
        </button>
      )
    },
    {
      key: 'assessments_count',
      header: 'Assessments',
      render: (value: number) => value || 0
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'last_sign_in_at',
      header: 'Last Login',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleUserRole(row.id, row.role)}
            title={row.role === 'admin' ? 'Remove admin privileges' : 'Make admin'}
          >
            {row.role === 'admin' ? (
              <ShieldOff className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteUser(row.id)}
            disabled={row.role === 'admin'}
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
          <CardTitle>User Management</CardTitle>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users by name or email..."
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={users}
            columns={columns}
            loading={loading}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>
    </div>
  )
}