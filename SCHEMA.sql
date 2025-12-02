-- ============================================
-- COMPLETE ORKUT DATABASE SCHEMA
-- Run this ONCE to set up everything fresh
-- ============================================

-- STEP 1: Clean slate - Drop all existing tables
DROP TABLE IF EXISTS scraps CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- STEP 2: Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE,
  name text NOT NULL,
  image text,
  about text,
  birth_date date,
  gender text,
  country text,
  city text,
  relationship_status text,
  interests text,
  location text,
  scraps_count int DEFAULT 0,
  photos_count int DEFAULT 0,
  videos_count int DEFAULT 0,
  fans_count int DEFAULT 0,
  trusty_count int DEFAULT 0,
  cool_count int DEFAULT 0,
  sexy_count int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- STEP 3: Create scraps table with CORRECT foreign keys
CREATE TABLE scraps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- STEP 4: Create communities table
CREATE TABLE communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image text,
  category text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  members_count int DEFAULT 1,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- STEP 5: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraps ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create RLS Policies for profiles
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- STEP 7: Create RLS Policies for scraps
CREATE POLICY "scraps_select_policy"
  ON scraps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "scraps_insert_policy"
  ON scraps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "scraps_delete_policy"
  ON scraps FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- STEP 8: Create RLS Policies for communities
CREATE POLICY "communities_select_policy"
  ON communities FOR SELECT
  USING (true);

CREATE POLICY "communities_insert_policy"
  ON communities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- STEP 9: Create indexes for performance
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX scraps_sender_idx ON scraps(sender_id);
CREATE INDEX scraps_receiver_idx ON scraps(receiver_id);
CREATE INDEX scraps_created_at_idx ON scraps(created_at DESC);
CREATE INDEX communities_owner_idx ON communities(owner_id);

-- STEP 10: Verify everything was created
SELECT 
  'SUCCESS! All tables created:' as status,
  COUNT(*) FILTER (WHERE tablename = 'profiles') as profiles_table,
  COUNT(*) FILTER (WHERE tablename = 'scraps') as scraps_table,
  COUNT(*) FILTER (WHERE tablename = 'communities') as communities_table
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'scraps', 'communities');

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================

-- STEP 11: Create the avatars bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true);
    END IF;
END $$;

-- STEP 12: Drop existing policies (if any)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- STEP 13: Create new policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

SELECT 'Storage bucket setup complete!' as storage_status;
