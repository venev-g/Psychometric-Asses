import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { bucketName, isPublic = false } = await request.json()

    if (!bucketName) {
      return NextResponse.json({
        success: false,
        error: 'Bucket name is required'
      }, { status: 400 })
    }

    // Create bucket using admin client
    const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: isPublic,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    })

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create bucket: ' + error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Bucket '${bucketName}' created successfully`
    })

  } catch (error: any) {
    console.error('Storage setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // List all buckets
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to list buckets: ' + error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      buckets
    })

  } catch (error: any) {
    console.error('Storage list error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}
