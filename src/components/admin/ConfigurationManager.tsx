// src/components/admin/ConfigurationManager.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'

export function ConfigurationManager() {
  const [configurations, setConfigurations] = useState([])
  const [testTypes, setTestTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [configsResponse, typesResponse] = await Promise.all([
        fetch('/api/configurations'),
        fetch('/api/test-types')
      ])
      
      const configsData = await configsResponse.json()
      const typesData = await typesResponse.json()
      
      setConfigurations(configsData.configurations || [])
      setTestTypes(typesData.testTypes || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteConfiguration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return
    
    try {
      await fetch(`/api/configurations/${id}`, { method: 'DELETE' })
      loadData()
    } catch (error) {
      console.error('Failed to delete configuration:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Test Configurations</CardTitle>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Configuration</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Configurations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {configurations.map((config: any) => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                  {config.description && (
                    <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteConfiguration(config.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={config.is_active ? 'text-green-600' : 'text-red-600'}>
                    {config.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {config.max_attempts && (
                  <div className="flex justify-between">
                    <span>Max Attempts:</span>
                    <span>{config.max_attempts}</span>
                  </div>
                )}
                {config.time_limit_minutes && (
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span>{config.time_limit_minutes} min</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(config.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateConfigurationForm
          testTypes={testTypes}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}

// Create Configuration Form Component
function CreateConfigurationForm({ testTypes, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxAttempts: 1,
    timeLimitMinutes: null as number | null,
    selectedTests: [] as string[]
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create configuration
      const configResponse = await fetch('/api/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          max_attempts: formData.maxAttempts,
          time_limit_minutes: formData.timeLimitMinutes
        })
      })

      const configData = await configResponse.json()
      
      // Add test sequences
      for (let i = 0; i < formData.selectedTests.length; i++) {
        await fetch('/api/configurations/sequences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            configurationId: configData.configuration.id,
            testTypeId: formData.selectedTests[i],
            sequenceOrder: i,
            isRequired: true
          })
        })
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to create configuration:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-md h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max Attempts</label>
              <input
                type="number"
                min="1"
                value={formData.maxAttempts}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
              <input
                type="number"
                min="1"
                value={formData.timeLimitMinutes || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  timeLimitMinutes: e.target.value ? parseInt(e.target.value) : null 
                }))}
                className="w-full p-2 border rounded-md"
                placeholder="No limit"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Tests</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
              {testTypes.map((testType: any) => (
                <label key={testType.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.selectedTests.includes(testType.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          selectedTests: [...prev.selectedTests, testType.id]
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          selectedTests: prev.selectedTests.filter(id => id !== testType.id)
                        }))
                      }
                    }}
                  />
                  <span className="text-sm">{testType.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !formData.name || formData.selectedTests.length === 0}
            >
              {submitting ? 'Creating...' : 'Create Configuration'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}