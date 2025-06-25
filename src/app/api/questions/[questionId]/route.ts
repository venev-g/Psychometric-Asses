import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Question update schema
const questionUpdateSchema = z.object({
  question_text: z.string().min(1).optional(),
  question_type: z.enum(['multiple_choice', 'rating_scale', 'yes_no', 'multiselect']).optional(),
  options: z.any().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  weight: z.number().min(0).optional(),
  is_active: z.boolean().optional(),
  order_index: z.number().min(0).optional(),
  test_type_id: z.string().uuid().optional()
})

interface RouteParams {
  params: {
    questionId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()

    const { data: question, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', params.questionId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validatedData = questionUpdateSchema.parse(body)

    const { data: question, error } = await supabase
      .from('questions')
      .update(validatedData)
      .eq('id', params.questionId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', params.questionId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}