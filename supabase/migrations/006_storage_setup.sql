-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Set up RLS policies for the profile-pictures bucket
CREATE POLICY "Allow authenticated users to upload profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow users to view their own profile pictures" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow users to update their own profile pictures" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow users to delete their own profile pictures" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public access policy for viewing profile pictures
CREATE POLICY "Allow public viewing of profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');
