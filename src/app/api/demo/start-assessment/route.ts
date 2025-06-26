// src/app/api/demo/start-assessment/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { configurationId } = await request.json()
    
    if (!configurationId) {
      return NextResponse.json(
        { error: 'Configuration ID is required' },
        { status: 400 }
      )
    }

    // Create a demo session (in-memory)
    const demoSession = {
      id: `demo-${Date.now()}`,
      configuration_id: configurationId,
      status: 'started',
      current_test_index: 0,
      total_tests: configurationId === 'temp-complete-profile' ? 3 : 2,
      started_at: new Date().toISOString(),
      user_id: 'demo-user',
      metadata: {
        demo_mode: true,
        started_timestamp: new Date().toISOString()
      }
    }
    
    return NextResponse.json({ success: true, session: demoSession })
  } catch (error: any) {
    console.error('Demo start assessment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start demo assessment' }, 
      { status: 500 }
    )
  }
}
