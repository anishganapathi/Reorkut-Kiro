-- ============================================
-- VIDEOS TABLE
-- ============================================

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  thumbnail text,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS videos_user_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);

SELECT 'Videos table setup complete!' as status;
