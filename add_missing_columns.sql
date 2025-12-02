-- ============================================
-- FIX: Add missing columns to profiles table
-- ============================================

-- Add the missing columns if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;

-- Force PostgREST to reload the schema cache so it sees the new columns
NOTIFY pgrst, 'reload schema';

SELECT 'Columns added successfully and schema cache reloaded!' as status;
