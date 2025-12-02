-- Fix for interests column issue
-- Run this in Supabase SQL Editor

-- Ensure the interests column exists in the profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests text;

-- Reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'interests';
