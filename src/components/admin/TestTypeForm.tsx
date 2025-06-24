'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { TestType } from '@/types/assessment.types'

interface TestTypeFormProps {
  testType?: TestType
}

export function TestTypeForm({ testType }: TestTypeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: testType?.name || '',
      slug: testType?.slug || '',
      description: testType?.description || '',
      version: testType?.version || '1.0',
      instructions: testType?.instructions || '',
      estimatedDurationMinutes: testType?.estimatedDurationMinutes || 15,
      isActive: testType?.isActive ?? true
    }
  })

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)

      // Generate slug from name if not provided
      if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }

      // Default scoring algorithm
      const scoringAlgorithm = {
        categories: [],
        scoring_method: "weighted_sum",
        normalization: "percentage"
      }

      const payload = {
        ...data,
        scoringAlgorithm
      }

      const url = testType 
        ? `/api/test-types/${testType.id}`
        : '/api/test-types'
      
      const method = testType ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to save test type')
      }

      router.push('/admin/test-types')
    } catch (error) {
      console.error('Error saving test type:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Type Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Test Type Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Dominant Intelligence Assessment"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="e.g., dominant-intelligence"
              pattern="^[a-z0-9-]+$"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL-friendly identifier (lowercase letters, numbers, and hyphens only)
            </p>
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe what this test measures..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                {...register('version')}
                placeholder="1.0"
                required
              />
            </div>

            <div>
              <Label htmlFor="estimatedDurationMinutes">Duration (minutes)</Label>
              <Input
                id="estimatedDurationMinutes"
                type="number"
                {...register('estimatedDurationMinutes', { valueAsNumber: true })}
                min="1"
                max="180"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              {...register('instructions')}
              placeholder="Instructions for test takers..."
              rows={4}
            />
            {errors.instructions && (
              <p className="text-sm text-red-600 mt-1">{errors.instructions.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : testType ? 'Update' : 'Create'} Test Type
        </Button>
      </div>
    </form>
  )
}