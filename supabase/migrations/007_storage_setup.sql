-- Create storage buckets for the psychometric assessment platform

-- Profile pictures bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true);

-- Assessment attachments bucket (for future use)
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-attachments', 'assessment-attachments', false);

-- Assessment reports bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-reports', 'assessment-reports', false);

-- Storage policies for profile pictures
CREATE POLICY "Users can view any profile picture" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own profile picture" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile picture" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for assessment attachments
CREATE POLICY "Users can view their own assessment attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assessment-attachments' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own assessment attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assessment-attachments' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for assessment reports
CREATE POLICY "Users can view their own assessment reports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assessment-reports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can manage all assessment reports" ON storage.objects
  FOR ALL USING (
    bucket_id = 'assessment-reports' 
    AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
