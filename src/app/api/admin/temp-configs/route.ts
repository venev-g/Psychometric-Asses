// src/app/api/admin/temp-configs/route.ts
import { NextResponse } from 'next/server'

// Temporary in-memory configurations until database seeding is resolved
const tempConfigurations = [
  {
    id: 'temp-complete-profile',
    name: 'Complete Psychometric Profile',
    description: 'A comprehensive assessment covering intelligence patterns, personality traits, and learning preferences. Perfect for personal development and career planning.',
    max_attempts: 3,
    time_limit_minutes: 45,
    is_active: true,
    created_at: new Date().toISOString(),
    test_sequences: [
      { test_type_id: '7c8d2f56-3b83-4930-800a-5a50940c98ec', sequence_order: 0, is_required: true }, // intelligence
      { test_type_id: '66dc483d-6a2c-42ec-8ce3-751b17becbfe', sequence_order: 1, is_required: true }, // personality
      { test_type_id: '31ec4fc1-e033-4276-bb47-cac323548f7c', sequence_order: 2, is_required: true }  // vark
    ]
  },
  {
    id: 'temp-quick-check',
    name: 'Quick Personality Check',
    description: 'A focused assessment on personality patterns and learning styles for quick insights.',
    max_attempts: 5,
    time_limit_minutes: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    test_sequences: [
      { test_type_id: '66dc483d-6a2c-42ec-8ce3-751b17becbfe', sequence_order: 0, is_required: true }, // personality
      { test_type_id: '31ec4fc1-e033-4276-bb47-cac323548f7c', sequence_order: 1, is_required: true }  // vark
    ]
  }
]

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    configurations: tempConfigurations,
    note: 'Using temporary configurations until database seeding is resolved'
  })
}
