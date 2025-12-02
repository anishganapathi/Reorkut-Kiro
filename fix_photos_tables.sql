-- ============================================
-- FIX: PHOTO ALBUMS AND PHOTOS TABLES SETUP
-- ============================================

-- 1. Ensure photo_albums table exists
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Ensure photos table exists (basic structure)
CREATE TABLE IF NOT EXISTS photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Add missing columns to photos table safely
-- We use ALTER TABLE to add columns if they were missing from a previous creation
ALTER TABLE photos ADD COLUMN IF NOT EXISTS album_id uuid REFERENCES photo_albums(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS caption text;

-- 4. Enable Row Level Security
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Drop first to avoid errors if they exist)
DROP POLICY IF EXISTS "photo_albums_select_policy" ON photo_albums;
CREATE POLICY "photo_albums_select_policy" ON photo_albums FOR SELECT USING (true);

DROP POLICY IF EXISTS "photo_albums_insert_policy" ON photo_albums;
CREATE POLICY "photo_albums_insert_policy" ON photo_albums FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "photo_albums_update_policy" ON photo_albums;
CREATE POLICY "photo_albums_update_policy" ON photo_albums FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "photo_albums_delete_policy" ON photo_albums;
CREATE POLICY "photo_albums_delete_policy" ON photo_albums FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "photos_select_policy" ON photos;
CREATE POLICY "photos_select_policy" ON photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "photos_insert_policy" ON photos;
CREATE POLICY "photos_insert_policy" ON photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "photos_update_policy" ON photos;
CREATE POLICY "photos_update_policy" ON photos FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "photos_delete_policy" ON photos;
CREATE POLICY "photos_delete_policy" ON photos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. Create indexes (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS photo_albums_user_idx ON photo_albums(user_id);
CREATE INDEX IF NOT EXISTS photos_album_idx ON photos(album_id);
CREATE INDEX IF NOT EXISTS photos_user_idx ON photos(user_id);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);

-- 7. Create photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage policies (Drop first to avoid errors)
DROP POLICY IF EXISTS "Photos are publicly accessible" ON storage.objects;
CREATE POLICY "Photos are publicly accessible" ON storage.objects FOR SELECT USING ( bucket_id = 'photos' );

DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
CREATE POLICY "Anyone can upload photos" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
CREATE POLICY "Users can update their own photos" ON storage.objects FOR UPDATE USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
CREATE POLICY "Users can delete their own photos" ON storage.objects FOR DELETE USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

-- 9. Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Photo tables and storage bucket setup complete!' as status;
