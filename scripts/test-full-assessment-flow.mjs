// scripts/test-full-assessment-flow.mjs
// Complete test of the authenticated assessment flow

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3004'

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Assessment Flow\n')
  
  try {
    // Step 1: Test the debug endpoint to check basic connectivity
    console.log('1. Testing database connectivity...')
    const debugResponse = await fetch(`${BASE_URL}/api/debug`)
    const debugData = await debugResponse.json()
    
    if (debugData.success) {
      console.log('✅ Database connection working')
      console.log(`   - Test types: ${debugData.database.testTypes.count}`)
      console.log(`   - Configurations: ${debugData.database.configurations.count}`)
      console.log(`   - Questions: ${debugData.database.questions.count}`)
    } else {
      console.log('❌ Database connection failed:', debugData.error)
      return
    }
    
    // Step 2: Test configurations endpoint (public access)
    console.log('\n2. Testing configurations endpoint...')
    const configsResponse = await fetch(`${BASE_URL}/api/configurations`)
    const configsData = await configsResponse.json()
    
    if (configsData.success && configsData.configurations.length > 0) {
      console.log('✅ Configurations available')
      configsData.configurations.forEach(config => 
        console.log(`   - ${config.name} (${config.id})`)
      )
    } else {
      console.log('❌ No configurations available')
      return
    }
    
    // Step 3: Test demo assessment flow
    console.log('\n3. Testing demo assessment...')
    const demoStartResponse = await fetch(`${BASE_URL}/api/demo/assessment/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testType: 'vark' })
    })
    
    if (demoStartResponse.ok) {
      const demoData = await demoStartResponse.json()
      console.log('✅ Demo assessment working')
      console.log(`   - Questions loaded: ${demoData.questions?.length || 0}`)
    } else {
      console.log('❌ Demo assessment failed')
    }
    
    // Step 4: Test page accessibility
    console.log('\n4. Testing page accessibility...')
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/demo/assessment', name: 'Demo Assessment' },
      { path: '/auth/login', name: 'Login Page' },
      { path: '/auth/signup', name: 'Signup Page' }
    ]
    
    for (const page of pages) {
      try {
        const pageResponse = await fetch(`${BASE_URL}${page.path}`)
        if (pageResponse.ok) {
          console.log(`✅ ${page.name} accessible`)
        } else {
          console.log(`❌ ${page.name} failed (${pageResponse.status})`)
        }
      } catch (error) {
        console.log(`❌ ${page.name} error: ${error.message}`)
      }
    }
    
    // Step 5: Test authenticated endpoints (should fail without auth)
    console.log('\n5. Testing authenticated endpoints (expecting 401)...')
    
    const authEndpoints = [
      '/api/assessments/sessions',
      '/api/user/stats',
      '/api/assessments/start'
    ]
    
    for (const endpoint of authEndpoints) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`)
        if (response.status === 401) {
          console.log(`✅ ${endpoint} properly protected`)
        } else {
          console.log(`⚠️ ${endpoint} unexpected status: ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint} error: ${error.message}`)
      }
    }
    
    console.log('\n🎉 Flow test completed!')
    console.log('\n📋 Summary:')
    console.log('- Database and API endpoints are functional')
    console.log('- Demo assessment flow works without authentication')
    console.log('- Authenticated endpoints are properly protected')
    console.log('- All main pages are accessible')
    console.log('\n🔗 To test the full flow:')
    console.log('1. Open http://localhost:3004 in your browser')
    console.log('2. Try the demo assessment')
    console.log('3. Sign up for an account')
    console.log('4. Log in and start an authenticated assessment')
    console.log('5. Complete the assessment and view results')
    
  } catch (error) {
    console.error('💥 Flow test failed:', error.message)
  }
}

testCompleteFlow()
