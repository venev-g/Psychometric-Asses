// scripts/test-apis.js
const baseUrl = 'http://localhost:3000'

async function testAPIs() {
  console.log('Testing APIs...')
  
  try {
    // Test configurations API
    console.log('\n1. Testing /api/configurations')
    const configResponse = await fetch(`${baseUrl}/api/configurations`)
    const configData = await configResponse.json()
    console.log('Status:', configResponse.status)
    console.log('Data:', JSON.stringify(configData, null, 2))

    // Test configurations with test types
    console.log('\n2. Testing configurations with sequences')
    if (configData.success && configData.configurations) {
      configData.configurations.forEach((config, index) => {
        console.log(`Config ${index + 1}: ${config.name}`)
        console.log(`  - Sequences: ${config.test_sequences?.length || 0}`)
      })
    }

  } catch (error) {
    console.error('API test failed:', error)
  }
}

testAPIs()
