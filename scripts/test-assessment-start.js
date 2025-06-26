// scripts/test-assessment-start.js
const fetch = require('node-fetch')

async function testAssessmentStart() {
  try {
    console.log('Testing assessment start...')
    
    // Try to start an assessment with temp configuration
    const response = await fetch('http://localhost:3003/api/assessments/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This won't work without proper auth cookies, but let's see the error
      },
      body: JSON.stringify({
        configurationId: 'temp-complete-profile'
      })
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', data)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testAssessmentStart()
