'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import type { Question, TestType } from '@/types/assessment.types'

interface QuestionFormProps {
  question?: Question
  testTypes: TestType[]
}

export function QuestionForm({ question, testTypes }: QuestionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      testTypeId: question?.testTypeId || '',
      questionText: question?.questionText || '',
      questionType: question?.questionType || 'multiple_choice',
      category: question?.category || '',
      subcategory: question?.subcategory || '',
      weight: question?.weight || 1,
      options: question?.options || [{ text: '', value: '', category: '' }],
      isActive: question?.isActive ?? true
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  })

  const questionType = watch('questionType')

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)

      const url = question 
        ? `/api/questions/${question.id}`
        : '/api/questions'
      
      const method = question ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save question')
      }

      router.push('/admin/questions')
    } catch (error) {
      console.error('Error saving question:', error)
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    append({ text: '', value: '', category: '' })
  }

  const removeOption = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testTypeId">Test Type</Label>
            <Select {...register('testTypeId')} required>
              <option value="">Select a test type...</option>
              {testTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            {errors.testTypeId && (
              <p className="text-sm text-red-600 mt-1">{errors.testTypeId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="questionText">Question Text</Label>
            <Textarea
              id="questionText"
              {...register('questionText')}
              placeholder="Enter the question..."
              rows={3}
              required
            />
            {errors.questionText && (
              <p className="text-sm text-red-600 mt-1">{errors.questionText.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="questionType">Question Type</Label>
              <Select {...register('questionType')} required>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="rating_scale">Rating Scale</option>
                <option value="yes_no">Yes/No</option>
                <option value="multiselect">Multi-select</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                {...register('weight', { valueAsNumber: true })}
                min="0.1"
                max="10"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="e.g., linguistic, visual"
              />
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                {...register('subcategory')}
                placeholder="Optional subcategory"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options Section */}
      {(questionType === 'multiple_choice' || questionType === 'multiselect' || questionType === 'rating_scale') && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Answer Options</CardTitle>
              <Button type="button" onClick={addOption} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end space-x-4">
                <div className="flex-1">
                  <Label htmlFor={`options.${index}.text`}>Option Text</Label>
                  <Input
                    {...register(`options.${index}.text`)}
                    placeholder="Option text"
                    required
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`options.${index}.value`}>Value</Label>
                  <Input
                    {...register(`options.${index}.value`)}
                    placeholder="Value"
                    required
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`options.${index}.category`}>Category</Label>
                  <Input
                    {...register(`options.${index}.category`)}
                    placeholder="Category"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : question ? 'Update' : 'Create'} Question
        </Button>
      </div>
    </form>
  )
}