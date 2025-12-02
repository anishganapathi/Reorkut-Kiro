-- ============================================
-- FIX: Add missing thumbnail column to videos table
-- ============================================

-- Add the thumbnail column if it doesn't exist
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS thumbnail text;

-- Force PostgREST to reload the schema cache so it sees the new column
NOTIFY pgrst, 'reload schema';

SELECT 'Thumbnail column added to videos table and schema cache reloaded!' as status;
