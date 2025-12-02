-- ============================================
-- PHOTO ALBUMS AND PHOTOS TABLES
-- ============================================

-- Create photo_albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id uuid NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for photo_albums
CREATE POLICY "photo_albums_select_policy"
  ON photo_albums FOR SELECT
  USING (true);

CREATE POLICY "photo_albums_insert_policy"
  ON photo_albums FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photo_albums_update_policy"
  ON photo_albums FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "photo_albums_delete_policy"
  ON photo_albums FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for photos
CREATE POLICY "photos_select_policy"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "photos_insert_policy"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photos_update_policy"
  ON photos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "photos_delete_policy"
  ON photos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS photo_albums_user_idx ON photo_albums(user_id);
CREATE INDEX IF NOT EXISTS photos_album_idx ON photos(album_id);
CREATE INDEX IF NOT EXISTS photos_user_idx ON photos(user_id);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);

-- Create photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for photos bucket
CREATE POLICY "Photos are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'photos' );

CREATE POLICY "Anyone can upload photos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

SELECT 'Photo tables and storage bucket setup complete!' as status;
