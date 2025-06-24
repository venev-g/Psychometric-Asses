'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { TestType } from '@/types/assessment.types'

interface TestSequence {
  id?: string
  testTypeId: string
  testType?: TestType
  sequenceOrder: number
  isRequired: boolean
}

interface TestSequenceBuilderProps {
  testTypes: TestType[]
  sequences: TestSequence[]
  onChange: (sequences: TestSequence[]) => void
}

export function TestSequenceBuilder({ testTypes, sequences, onChange }: TestSequenceBuilderProps) {
  const addSequence = () => {
    const newSequence: TestSequence = {
      testTypeId: '',
      sequenceOrder: sequences.length,
      isRequired: true
    }
    onChange([...sequences, newSequence])
  }

  const removeSequence = (index: number) => {
    const newSequences = sequences.filter((_, i) => i !== index)
      .map((seq, i) => ({ ...seq, sequenceOrder: i }))
    onChange(newSequences)
  }

  const updateSequence = (index: number, field: keyof TestSequence, value: any) => {
    const newSequences = [...sequences]
    newSequences[index] = { ...newSequences[index], [field]: value }
    onChange(newSequences)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newSequences = Array.from(sequences)
    const [reorderedItem] = newSequences.splice(result.source.index, 1)
    newSequences.splice(result.destination.index, 0, reorderedItem)

    // Update sequence orders
    const updatedSequences = newSequences.map((seq, index) => ({
      ...seq,
      sequenceOrder: index
    }))

    onChange(updatedSequences)
  }

  const getTestTypeName = (testTypeId: string) => {
    const testType = testTypes.find(t => t.id === testTypeId)
    return testType?.name || 'Unknown Test Type'
  }

  const getAvailableTestTypes = (currentIndex: number) => {
    const usedTestTypeIds = sequences
      .filter((_, index) => index !== currentIndex)
      .map(seq => seq.testTypeId)
    
    return testTypes.filter(type => !usedTestTypeIds.includes(type.id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Test Sequence</CardTitle>
          <Button type="button" onClick={addSequence} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Test
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sequences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tests added yet. Click "Add Test" to get started.
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sequences">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {sequences.map((sequence, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg p-4 bg-white ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {index + 1}
                              </Badge>
                            </div>

                            <div className="flex-1">
                              <Select
                                value={sequence.testTypeId}
                                onValueChange={(value) => updateSequence(index, 'testTypeId', value)}
                                required
                              >
                                <option value="">Select a test type...</option>
                                {getAvailableTestTypes(index).map(type => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                                {sequence.testTypeId && (
                                  <option value={sequence.testTypeId}>
                                    {getTestTypeName(sequence.testTypeId)}
                                  </option>
                                )}
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <label className="flex items-center space-x-1 text-sm">
                                <input
                                  type="checkbox"
                                  checked={sequence.isRequired}
                                  onChange={(e) => updateSequence(index, 'isRequired', e.target.checked)}
                                  className="rounded"
                                />
                                <span>Required</span>
                              </label>
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSequence(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {sequence.testTypeId && (
                            <div className="mt-2 text-sm text-gray-600">
                              {testTypes.find(t => t.id === sequence.testTypeId)?.description}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  )
}