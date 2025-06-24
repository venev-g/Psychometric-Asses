'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { TestSequenceBuilder } from '@/components/admin/TestSequenceBuilder'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createConfigurationSchema, updateConfigurationSchema } from '@/lib/validations/configuration'
import type { TestConfiguration, TestType } from '@/types/assessment.types'

// Define the TestSequence type since it's missing from assessment.types.ts
interface TestSequence {
  testTypeId: string
  sequenceOrder: number
  isRequired: boolean
  timeLimit?: number
  passingScore?: number
}

// Extend TestConfiguration to include test_sequences
interface ExtendedTestConfiguration extends TestConfiguration {
  test_sequences?: TestSequence[]
  settings?: {
    allowPause: boolean
    showProgress: boolean
    randomizeQuestions: boolean
    requireAllQuestions: boolean
    allowBackward: boolean
    showResults: boolean
    emailResults: boolean
  }
}

interface ConfigurationFormProps {
  configuration?: ExtendedTestConfiguration
  testTypes: TestType[]
}

export function ConfigurationForm({ configuration, testTypes }: ConfigurationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sequences, setSequences] = useState<TestSequence[]>(configuration?.test_sequences || [])

  // Use the correct schema based on whether we're creating or updating
  const schema = configuration ? updateConfigurationSchema : createConfigurationSchema
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: {
      id: configuration?.id,
      name: configuration?.name || '',
      description: configuration?.description || '',
      maxAttempts: configuration?.maxAttempts || 3,
      timeLimitMinutes: configuration?.timeLimitMinutes || undefined,
      isActive: configuration?.isActive ?? true,
      testTypeIds: sequences.map(seq => seq.testTypeId),
      settings: configuration?.settings || {
        allowPause: true,
        showProgress: true,
        randomizeQuestions: false,
        requireAllQuestions: true,
        allowBackward: false,
        showResults: true,
        emailResults: false
      }
    }
  })

  // Update testTypeIds field when sequences change
  useEffect(() => {
    const testTypeIds = sequences.map(seq => seq.testTypeId);
    setValue('testTypeIds', testTypeIds);
  }, [sequences, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      
      if (sequences.length === 0) {
        // Don't submit if no sequences are defined
        return;
      }
      
      // Format the data to match your API expectations
      const payload = {
        ...data,
        // Convert sequences to the format expected by your API
        sequences: sequences.map((seq, index) => ({
          testTypeId: seq.testTypeId,
          sequenceOrder: index + 1,
          isRequired: seq.isRequired ?? true,
          timeLimit: seq.timeLimit,
          passingScore: seq.passingScore
        }))
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save configuration');
      }

      router.push('/admin/configurations');
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Implement proper error handling here (e.g., toast notification)
    } finally {
      setLoading(false);
    }
  }

  // Watch settings to update form values
  const formSettings = watch('settings');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" required>Configuration Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Complete Psychometric Profile"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name?.message?.toString()}</p>
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
              <p className="text-sm text-red-600 mt-1">{errors.description?.message?.toString()}</p>
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
                <p className="text-sm text-red-600 mt-1">{errors.maxAttempts?.message?.toString()}</p>
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
                max="180"
              />
              {errors.timeLimitMinutes && (
                <p className="text-sm text-red-600 mt-1">{errors.timeLimitMinutes?.message?.toString()}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('isActive')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Active Configuration</span>
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.allowPause')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Allow Pausing Tests</span>
            </Label>
            
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.showProgress')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Show Progress Indicator</span>
            </Label>
            
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.randomizeQuestions')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Randomize Questions</span>
            </Label>
            
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.requireAllQuestions')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>All Questions Required</span>
            </Label>
            
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.allowBackward')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Allow Going Back to Previous Questions</span>
            </Label>
            
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.showResults')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Show Results After Completion</span>
            </Label>
            
            <Label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                {...register('settings.emailResults')}
                className="h-4 w-4 rounded border-gray-300" 
              />
              <span>Email Results to User</span>
            </Label>
          </div>
          
          {errors.settings && (
            <p className="text-sm text-red-600 mt-1">Settings configuration error</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <TestSequenceBuilder
            testTypes={testTypes}
            sequences={sequences}
            onChange={setSequences}
          />
          
          {errors.testTypeIds && (
            <p className="text-sm text-red-600 mt-2">{errors.testTypeIds?.message?.toString()}</p>
          )}
          
          {sequences.length === 0 && (
            <p className="text-sm text-red-600 mt-2">At least one test sequence is required</p>
          )}
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
        <Button 
          type="submit" 
          disabled={loading || sequences.length === 0}
        >
          {loading ? 'Saving...' : configuration ? 'Update' : 'Create'} Configuration
        </Button>
      </div>
    </form>
  )
}