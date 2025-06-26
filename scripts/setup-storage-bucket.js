// Setup storage bucket for profile pictures
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function setupStorageBucket() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
    console.log('SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey)
    return
  }

  console.log('🔄 Setting up Supabase storage bucket...')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Check if buckets exist
    console.log('📋 Checking existing buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    console.log('📦 Existing buckets:', buckets?.map(b => b.id) || [])

    const bucketExists = buckets?.some(bucket => bucket.id === 'profile-pictures')

    if (bucketExists) {
      console.log('✅ profile-pictures bucket already exists')
    } else {
      console.log('🔨 Creating profile-pictures bucket...')
      
      const { data: bucket, error: createError } = await supabase.storage.createBucket('profile-pictures', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (createError) {
        console.error('❌ Error creating bucket:', createError)
        return
      }

      console.log('✅ Bucket created:', bucket)
    }

    // Test bucket access
    console.log('🧪 Testing bucket access...')
    const testFile = new Blob(['test content'], { type: 'text/plain' })
    const testFileName = `test-${Date.now()}.txt`
    
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(testFileName, testFile)

    if (uploadError) {
      console.error('❌ Test upload failed:', uploadError)
    } else {
      console.log('✅ Test upload successful')
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('profile-pictures')
        .remove([testFileName])
      
      if (deleteError) {
        console.warn('⚠️ Test file cleanup failed:', deleteError)
      } else {
        console.log('🧹 Test file cleaned up')
      }
    }

    console.log('🎉 Storage setup complete!')

  } catch (error) {
    console.error('❌ Setup error:', error)
  }
}

setupStorageBucket()
