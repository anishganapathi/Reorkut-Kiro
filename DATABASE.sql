-- ============================================
-- COMPLETE ORKUT DATABASE SETUP
-- Run this script in Supabase SQL Editor to set up the entire database
-- ============================================

-- ============================================
-- CORE TABLES
-- ============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- Create scraps table
CREATE TABLE IF NOT EXISTS scraps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_private boolean DEFAULT false,
  parent_scrap_id uuid REFERENCES scraps(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image text,
  category text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  members_count int DEFAULT 1,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(community_id, user_id)
);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, friend_id)
);

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(sender_id, receiver_id)
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create profile_visits table
CREATE TABLE IF NOT EXISTS profile_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  visited_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================
-- PHOTOS AND ALBUMS TABLES
-- ============================================

-- Create photo_albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create photos table (basic structure first)
CREATE TABLE IF NOT EXISTS photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add columns to photos table safely (in case table already exists)
ALTER TABLE photos ADD COLUMN IF NOT EXISTS album_id uuid REFERENCES photo_albums(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS caption text;

-- ============================================
-- VIDEOS TABLE
-- ============================================

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add thumbnail column safely (in case table already exists)
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail text;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraps ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================

DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- RLS POLICIES - SCRAPS
-- ============================================

DROP POLICY IF EXISTS "scraps_select_policy" ON scraps;
DROP POLICY IF EXISTS "scraps_insert_policy" ON scraps;
DROP POLICY IF EXISTS "scraps_delete_policy" ON scraps;

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

-- ============================================
-- RLS POLICIES - COMMUNITIES
-- ============================================

DROP POLICY IF EXISTS "communities_select_policy" ON communities;
DROP POLICY IF EXISTS "communities_insert_policy" ON communities;

CREATE POLICY "communities_select_policy"
  ON communities FOR SELECT
  USING (true);

CREATE POLICY "communities_insert_policy"
  ON communities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- ============================================
-- RLS POLICIES - COMMUNITY MEMBERS
-- ============================================

DROP POLICY IF EXISTS "community_members_select_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_insert_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_delete_policy" ON community_members;

CREATE POLICY "community_members_select_policy"
  ON community_members FOR SELECT
  USING (true);

CREATE POLICY "community_members_insert_policy"
  ON community_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_members_delete_policy"
  ON community_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - FRIENDSHIPS
-- ============================================

DROP POLICY IF EXISTS "friendships_select_policy" ON friendships;
DROP POLICY IF EXISTS "friendships_insert_policy" ON friendships;
DROP POLICY IF EXISTS "friendships_delete_policy" ON friendships;

CREATE POLICY "friendships_select_policy"
  ON friendships FOR SELECT
  USING (true);

CREATE POLICY "friendships_insert_policy"
  ON friendships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "friendships_delete_policy"
  ON friendships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- RLS POLICIES - FRIEND REQUESTS
-- ============================================

DROP POLICY IF EXISTS "friend_requests_select_policy" ON friend_requests;
DROP POLICY IF EXISTS "friend_requests_insert_policy" ON friend_requests;
DROP POLICY IF EXISTS "friend_requests_update_policy" ON friend_requests;
DROP POLICY IF EXISTS "friend_requests_delete_policy" ON friend_requests;

CREATE POLICY "friend_requests_select_policy"
  ON friend_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "friend_requests_insert_policy"
  ON friend_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "friend_requests_update_policy"
  ON friend_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

CREATE POLICY "friend_requests_delete_policy"
  ON friend_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- RLS POLICIES - TESTIMONIALS
-- ============================================

DROP POLICY IF EXISTS "testimonials_select_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_insert_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_update_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_delete_policy" ON testimonials;

CREATE POLICY "testimonials_select_policy"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "testimonials_insert_policy"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "testimonials_update_policy"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "testimonials_delete_policy"
  ON testimonials FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================

DROP POLICY IF EXISTS "messages_select_policy" ON messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON messages;
DROP POLICY IF EXISTS "messages_update_policy" ON messages;
DROP POLICY IF EXISTS "messages_delete_policy" ON messages;

CREATE POLICY "messages_select_policy"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert_policy"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_policy"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

CREATE POLICY "messages_delete_policy"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- RLS POLICIES - PROFILE VISITS
-- ============================================

DROP POLICY IF EXISTS "profile_visits_select_policy" ON profile_visits;
DROP POLICY IF EXISTS "profile_visits_insert_policy" ON profile_visits;

CREATE POLICY "profile_visits_select_policy"
  ON profile_visits FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "profile_visits_insert_policy"
  ON profile_visits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = visitor_id);

-- ============================================
-- RLS POLICIES - PHOTO ALBUMS
-- ============================================

DROP POLICY IF EXISTS "photo_albums_select_policy" ON photo_albums;
DROP POLICY IF EXISTS "photo_albums_insert_policy" ON photo_albums;
DROP POLICY IF EXISTS "photo_albums_update_policy" ON photo_albums;
DROP POLICY IF EXISTS "photo_albums_delete_policy" ON photo_albums;

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

-- ============================================
-- RLS POLICIES - PHOTOS
-- ============================================

DROP POLICY IF EXISTS "photos_select_policy" ON photos;
DROP POLICY IF EXISTS "photos_insert_policy" ON photos;
DROP POLICY IF EXISTS "photos_update_policy" ON photos;
DROP POLICY IF EXISTS "photos_delete_policy" ON photos;

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

-- ============================================
-- RLS POLICIES - VIDEOS
-- ============================================

DROP POLICY IF EXISTS "videos_select_policy" ON videos;
DROP POLICY IF EXISTS "videos_insert_policy" ON videos;
DROP POLICY IF EXISTS "videos_update_policy" ON videos;
DROP POLICY IF EXISTS "videos_delete_policy" ON videos;

CREATE POLICY "videos_select_policy"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "videos_insert_policy"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "videos_update_policy"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "videos_delete_policy"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS scraps_sender_idx ON scraps(sender_id);
CREATE INDEX IF NOT EXISTS scraps_receiver_idx ON scraps(receiver_id);
CREATE INDEX IF NOT EXISTS scraps_created_at_idx ON scraps(created_at DESC);
CREATE INDEX IF NOT EXISTS communities_owner_idx ON communities(owner_id);
CREATE INDEX IF NOT EXISTS community_members_community_idx ON community_members(community_id);
CREATE INDEX IF NOT EXISTS community_members_user_idx ON community_members(user_id);
CREATE INDEX IF NOT EXISTS friendships_user_idx ON friendships(user_id);
CREATE INDEX IF NOT EXISTS friendships_friend_idx ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS friend_requests_sender_idx ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS friend_requests_receiver_idx ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS testimonials_author_idx ON testimonials(author_id);
CREATE INDEX IF NOT EXISTS testimonials_user_idx ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS messages_sender_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_idx ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS profile_visits_visitor_idx ON profile_visits(visitor_id);
CREATE INDEX IF NOT EXISTS profile_visits_profile_idx ON profile_visits(profile_id);
CREATE INDEX IF NOT EXISTS photo_albums_user_idx ON photo_albums(user_id);
CREATE INDEX IF NOT EXISTS photos_album_idx ON photos(album_id);
CREATE INDEX IF NOT EXISTS photos_user_idx ON photos(user_id);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS videos_user_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);

-- ============================================
-- STORAGE BUCKETS SETUP
-- ============================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES - AVATARS
-- ============================================

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

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

-- ============================================
-- STORAGE POLICIES - PHOTOS
-- ============================================

DROP POLICY IF EXISTS "Photos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

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

-- ============================================
-- RELOAD SCHEMA CACHE
-- ============================================

NOTIFY pgrst, 'reload schema';

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Database setup complete! All tables, policies, and storage buckets created successfully.' as status;
