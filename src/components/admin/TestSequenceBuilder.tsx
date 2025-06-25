'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

// Sortable item component
function SortableSequenceItem({ 
  sequence, 
  index, 
  testTypes, 
  onUpdate, 
  onRemove, 
  getAvailableTestTypes, 
  getTestTypeName 
}: {
  sequence: TestSequence
  index: number
  testTypes: TestType[]
  onUpdate: (index: number, field: keyof TestSequence, value: any) => void
  onRemove: (index: number) => void
  getAvailableTestTypes: (index: number) => TestType[]
  getTestTypeName: (testTypeId: string) => string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 bg-white ${
        isDragging ? 'shadow-lg opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <div {...attributes} {...listeners} className="cursor-move">
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
            onValueChange={(value) => onUpdate(index, 'testTypeId', value)}
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
              onChange={(e) => onUpdate(index, 'isRequired', e.target.checked)}
              className="rounded"
            />
            <span>Required</span>
          </label>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRemove(index)}
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
  )
}

export function TestSequenceBuilder({ testTypes, sequences, onChange }: TestSequenceBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id as string)
      const newIndex = parseInt(over?.id as string)

      const newSequences = arrayMove(sequences, oldIndex, newIndex)
      
      // Update sequence orders
      const updatedSequences = newSequences.map((seq, index) => ({
        ...seq,
        sequenceOrder: index
      }))

      onChange(updatedSequences)
    }
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sequences.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sequences.map((sequence, index) => (
                  <SortableSequenceItem
                    key={index}
                    sequence={sequence}
                    index={index}
                    testTypes={testTypes}
                    onUpdate={updateSequence}
                    onRemove={removeSequence}
                    getAvailableTestTypes={getAvailableTestTypes}
                    getTestTypeName={getTestTypeName}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}