// src/app/api/admin/migrate/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if email column exists
    const { data: existingColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'user_profiles')
      .eq('column_name', 'email')

    if (existingColumns && existingColumns.length > 0) {
      return NextResponse.json({ 
        message: 'Email column already exists',
        success: true 
      })
    }

    // This approach won't work for schema changes, we need to use SQL directly
    return NextResponse.json({ 
      message: 'Migration requires direct database access',
      success: false 
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: error.message || 'Migration failed' 
    }, { status: 500 })
  }
}
