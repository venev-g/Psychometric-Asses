import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          async setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Server Component issue - ignore
            }
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    // Create file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/profile.${fileExt}`

    // Check if bucket exists first
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
    
    if (bucketListError) {
      console.error('Bucket list error:', bucketListError)
    }

    const bucketExists = buckets?.some(bucket => bucket.id === 'profile-pictures')

    if (!bucketExists) {
      return NextResponse.json({
        success: false,
        error: 'Storage bucket not configured. Please contact administrator to set up file upload functionality.',
        details: 'The profile-pictures storage bucket needs to be created in Supabase.'
      }, { status: 503 })
    }

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      
      // Provide more specific error messages
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json({
          success: false,
          error: 'Storage bucket not found. Please contact administrator.',
          details: 'The profile-pictures bucket is not properly configured.'
        }, { status: 503 })
      }
      
      if (uploadError.message.includes('policies')) {
        return NextResponse.json({
          success: false,
          error: 'Permission denied. Storage access not configured properly.',
          details: 'Storage bucket policies need to be configured.'
        }, { status: 403 })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Failed to upload file: ' + uploadError.message
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName)

    // Update user profile with avatar URL
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        avatar_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      // Don't fail the request if profile update fails
    }

    return NextResponse.json({
      success: true,
      data: {
        path: uploadData.path,
        publicUrl: urlData.publicUrl
      },
      message: 'Profile picture uploaded successfully'
    })

  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          async setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Server Component issue - ignore
            }
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 })
    }

    // List user's files in profile-pictures bucket
    const { data: files, error: listError } = await supabase.storage
      .from('profile-pictures')
      .list(user.id)

    if (listError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to list files: ' + listError.message
      }, { status: 500 })
    }

    // Delete all profile pictures for this user
    if (files && files.length > 0) {
      const filePaths = files.map(file => `${user.id}/${file.name}`)
      
      const { error: deleteError } = await supabase.storage
        .from('profile-pictures')
        .remove(filePaths)

      if (deleteError) {
        return NextResponse.json({
          success: false,
          error: 'Failed to delete files: ' + deleteError.message
        }, { status: 500 })
      }
    }

    // Update user profile to remove avatar URL
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        avatar_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
    }

    return NextResponse.json({
      success: true,
      message: 'Profile picture deleted successfully'
    })

  } catch (error: any) {
    console.error('File delete error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}
