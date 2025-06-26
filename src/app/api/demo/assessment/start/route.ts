// src/app/api/demo/assessment/start/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { testType } = await request.json()
    
    // Create a demo session
    const demoSession = {
      id: `demo-session-${Date.now()}`,
      user_id: 'demo-user',
      configuration_id: 'demo-config',
      status: 'started',
      current_test_index: 0,
      total_tests: 1,
      started_at: new Date().toISOString(),
      metadata: {
        demo_mode: true,
        test_type: testType || 'dominant-intelligence'
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      session: demoSession,
      demo: true
    })
  } catch (error: any) {
    console.error('Demo assessment start error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start demo assessment' }, 
      { status: 500 }
    )
  }
}
