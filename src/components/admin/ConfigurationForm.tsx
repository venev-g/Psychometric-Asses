'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { TestSequenceBuilder } from '@/components/admin/TestSequenceBuilder'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { configurationSchema } from '@/lib/validations/configuration'
import type { TestConfiguration, TestType } from '@/types/assessment.types'

interface ConfigurationFormProps {
  configuration?: TestConfiguration
  testTypes: TestType[]
}

export function ConfigurationForm({ configuration, testTypes }: ConfigurationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sequences, setSequences] = useState(configuration?.test_sequences || [])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      name: configuration?.name || '',
      description: configuration?.description || '',
      maxAttempts: configuration?.maxAttempts || 3,
      timeLimitMinutes: configuration?.timeLimitMinutes || undefined,
      isActive: configuration?.isActive ?? true
    }
  })

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      
      const payload = {
        ...data,
        testSequences: sequences
      }

      const url = configuration 
        ? `/api/configurations/${configuration.id}`
        : '/api/configurations'
      
      const method = configuration ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to save configuration')
      }

      router.push('/admin/configurations')
    } catch (error) {
      console.error('Error saving configuration:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Configuration Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Complete Psychometric Profile"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe what this configuration assesses..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxAttempts">Max Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                {...register('maxAttempts', { valueAsNumber: true })}
                min="1"
                max="10"
              />
              {errors.maxAttempts && (
                <p className="text-sm text-red-600 mt-1">{errors.maxAttempts.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="timeLimitMinutes">Time Limit (minutes)</Label>
              <Input
                id="timeLimitMinutes"
                type="number"
                {...register('timeLimitMinutes', { valueAsNumber: true })}
                placeholder="Optional"
                min="5"
              />
              {errors.timeLimitMinutes && (
                <p className="text-sm text-red-600 mt-1">{errors.timeLimitMinutes.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TestSequenceBuilder
        testTypes={testTypes}
        sequences={sequences}
        onChange={setSequences}
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : configuration ? 'Update' : 'Create'} Configuration
        </Button>
      </div>
    </form>
  )
}