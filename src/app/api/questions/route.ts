import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Question creation schema
const questionCreateSchema = z.object({
  question_text: z.string().min(1, 'Question text is required'),
  question_type: z.enum(['multiple_choice', 'rating_scale', 'yes_no', 'multiselect']),
  options: z.any().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  weight: z.number().min(0).default(1.0),
  is_active: z.boolean().default(true),
  order_index: z.number().min(0).optional(),
  test_type_id: z.string().uuid('Invalid test type ID')
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const testTypeId = searchParams.get('testTypeId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' })
      .order('order_index', { ascending: true })
      .range(offset, offset + limit - 1)

    if (testTypeId) {
      query = query.eq('test_type_id', testTypeId)
    }

    const { data: questions, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validatedData = questionCreateSchema.parse(body)

    const { data: question, error } = await supabase
      .from('questions')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ question }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}