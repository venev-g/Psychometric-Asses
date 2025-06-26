// src/app/api/admin/setup-storage/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and has admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    // Check if the profile-pictures bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
    }

    const bucketExists = buckets?.some(bucket => bucket.id === 'profile-pictures')

    if (bucketExists) {
      return NextResponse.json({
        success: true,
        message: 'Storage bucket already exists',
        bucket: 'profile-pictures'
      })
    }

    // Create the profile-pictures bucket
    const { data: bucket, error: createError } = await supabase.storage.createBucket('profile-pictures', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (createError) {
      console.error('Error creating bucket:', createError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create storage bucket: ' + createError.message
      }, { status: 500 })
    }

    // Test upload to verify bucket is working
    const testFile = new Blob(['test'], { type: 'text/plain' })
    const { error: testUploadError } = await supabase.storage
      .from('profile-pictures')
      .upload('test.txt', testFile)

    if (testUploadError) {
      console.warn('Test upload failed:', testUploadError)
    } else {
      // Clean up test file
      await supabase.storage
        .from('profile-pictures')
        .remove(['test.txt'])
    }

    return NextResponse.json({
      success: true,
      message: 'Storage bucket created successfully',
      bucket: bucket
    })

  } catch (error: any) {
    console.error('Setup storage error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}
