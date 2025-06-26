// src/app/api/admin/direct-seed/route.ts
import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function POST() {
  try {
    console.log('Starting direct database seeding...')
    console.log('DB URL available:', !!process.env.DATABASE_URL)

    // Direct SQL approach using the database URL
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })

    await client.connect()
    console.log('Connected to database')

    // Check if configurations exist
    const checkResult = await client.query('SELECT COUNT(*) FROM test_configurations WHERE is_active = true')
    const configCount = parseInt(checkResult.rows[0].count)
    
    if (configCount > 0) {
      await client.end()
      return NextResponse.json({ 
        message: 'Configurations already exist', 
        count: configCount 
      })
    }

    // Insert configurations directly
    const configsResult = await client.query(`
      INSERT INTO test_configurations (name, description, max_attempts, time_limit_minutes, is_active)
      VALUES 
      ('Complete Psychometric Profile', 'A comprehensive assessment covering intelligence patterns, personality traits, and learning preferences. Perfect for personal development and career planning.', 3, 45, true),
      ('Quick Personality Check', 'A focused assessment on personality patterns and learning styles for quick insights.', 5, 25, true)
      RETURNING id, name
    `)

    console.log('Configurations inserted:', configsResult.rows.length)

    // Get test type IDs
    const testTypesResult = await client.query('SELECT id, slug FROM test_types WHERE is_active = true')
    const testTypes = testTypesResult.rows

    const intelligenceTest = testTypes.find((t: any) => t.slug === 'dominant-intelligence')
    const personalityTest = testTypes.find((t: any) => t.slug === 'personality-pattern')
    const varkTest = testTypes.find((t: any) => t.slug === 'vark')

    const completeProfile = configsResult.rows.find((c: any) => c.name === 'Complete Psychometric Profile')
    const quickCheck = configsResult.rows.find((c: any) => c.name === 'Quick Personality Check')

    // Insert test sequences
    const sequenceValues = []
    if (completeProfile && intelligenceTest && personalityTest && varkTest) {
      sequenceValues.push(
        `('${completeProfile.id}', '${intelligenceTest.id}', 0, true)`,
        `('${completeProfile.id}', '${personalityTest.id}', 1, true)`,
        `('${completeProfile.id}', '${varkTest.id}', 2, true)`
      )
    }

    if (quickCheck && personalityTest && varkTest) {
      sequenceValues.push(
        `('${quickCheck.id}', '${personalityTest.id}', 0, true)`,
        `('${quickCheck.id}', '${varkTest.id}', 1, true)`
      )
    }

    if (sequenceValues.length > 0) {
      const sequencesResult = await client.query(`
        INSERT INTO test_sequences (configuration_id, test_type_id, sequence_order, is_required)
        VALUES ${sequenceValues.join(', ')}
        RETURNING id
      `)
      console.log('Test sequences inserted:', sequencesResult.rows.length)
    }

    await client.end()

    return NextResponse.json({ 
      success: true,
      message: 'Direct database seeding completed successfully!',
      data: {
        configurations: configsResult.rows.length,
        sequences: sequenceValues.length,
        testTypes: testTypes.length
      }
    })

  } catch (error: any) {
    console.error('Direct seeding failed:', error)
    return NextResponse.json({ 
      error: error.message || 'Direct seeding failed' 
    }, { status: 500 })
  }
}
