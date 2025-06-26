// scripts/test-storage.js
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase connection setup using service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in .env.local file');
  console.log('Required environment variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkAndSetupStorage() {
  console.log('🔍 Checking Supabase storage setup...');
  
  try {
    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return false;
    }
    
    console.log(`📦 Found ${buckets.length} storage bucket(s)`);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.id} (public: ${bucket.public})`);
    });
    
    // Check if profile-pictures bucket exists
    const profileBucket = buckets.find(bucket => bucket.id === 'profile-pictures');
    
    if (profileBucket) {
      console.log('✅ Profile pictures bucket already exists');
      return await testBucketFunctionality();
    }
    
    // Create profile-pictures bucket
    console.log('🛠️ Creating profile-pictures bucket...');
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('profile-pictures', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      console.error('❌ Error creating bucket:', createError);
      return false;
    }
    
    console.log('✅ Profile pictures bucket created successfully');
    return await testBucketFunctionality();
    
  } catch (error) {
    console.error('❌ Storage setup error:', error);
    return false;
  }
}

async function testBucketFunctionality() {
  console.log('\n🧪 Testing bucket functionality...');
  
  try {
    // Test upload
    const testContent = Buffer.from('This is a test file for storage functionality');
    const testFileName = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      });
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError);
      return false;
    }
    
    console.log('✅ Upload test successful:', uploadData.path);
    
    // Test public URL generation
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(testFileName);
    
    console.log('✅ Public URL generated:', urlData.publicUrl);
    
    // Test file listing
    const { data: files, error: listFilesError } = await supabase.storage
      .from('profile-pictures')
      .list('', { limit: 10 });
    
    if (listFilesError) {
      console.error('❌ File listing failed:', listFilesError);
    } else {
      console.log(`✅ File listing successful: ${files.length} file(s) found`);
    }
    
    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from('profile-pictures')
      .remove([testFileName]);
    
    if (deleteError) {
      console.warn('⚠️ Failed to clean up test file:', deleteError);
    } else {
      console.log('✅ Test file cleaned up');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Bucket functionality test error:', error);
    return false;
  }
}

async function checkStoragePolicies() {
  console.log('\n🔒 Checking storage policies...');
  
  try {
    // Note: RLS policies for storage are usually set up via SQL
    // This is just a basic check to see if we can interact with storage
    console.log('ℹ️ Storage policies should be configured via Supabase dashboard or SQL migrations');
    console.log('ℹ️ Key policies needed:');
    console.log('   - Allow authenticated users to upload to their own folder');
    console.log('   - Allow public read access to profile pictures');
    console.log('   - Allow users to update/delete their own files');
    
    return true;
  } catch (error) {
    console.error('❌ Policy check error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase storage setup and test...\n');
  
  const storageReady = await checkAndSetupStorage();
  if (!storageReady) {
    console.log('\n❌ Storage setup failed');
    process.exit(1);
  }
  
  await checkStoragePolicies();
  
  console.log('\n✅ Storage setup and testing completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Test profile picture upload in the app');
  console.log('   2. Verify RLS policies are working correctly');
  console.log('   3. Check file upload limits and security');
}

main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});
