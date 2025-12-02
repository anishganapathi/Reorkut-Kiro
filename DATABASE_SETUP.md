# Database Setup Instructions

This document explains how to set up the required database tables for the Orkut clone application.

## Prerequisites

- Supabase account and project
- Access to Supabase SQL Editor

## Setup Steps

### 1. Run Main Schema

First, run the main schema file to create all core tables:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open and run `SCHEMA.sql`

### 2. Create Photo Tables

Run the photo tables migration:

1. In SQL Editor, create a new query
2. Copy and paste the contents of `create_photo_tables.sql`
3. Click **Run** to execute

This will create:
- `photo_albums` table
- `photos` table
- `photos` storage bucket
- All necessary RLS policies and indexes

### 3. Create Videos Table

Run the videos table migration:

1. In SQL Editor, create a new query
2. Copy and paste the contents of `create_videos_table.sql`
3. Click **Run** to execute

This will create:
- `videos` table
- All necessary RLS policies and indexes

## Verification

After running all migrations, verify the tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('photo_albums', 'photos', 'videos');

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'photos';
```

## Troubleshooting

### "Failed to create album" Error

This usually means the `photo_albums` table doesn't exist. Run `create_photo_tables.sql`.

### "Failed to add video" Error

This usually means the `videos` table doesn't exist. Run `create_videos_table.sql`.

### Storage Upload Errors

1. Verify the `photos` storage bucket exists
2. Check that storage policies are properly set
3. Ensure you're authenticated when uploading

### RLS Policy Errors

If you get permission errors:

1. Check that RLS is enabled on the tables
2. Verify the policies are created correctly
3. Make sure you're logged in with a valid user

## Additional Notes

- All tables use UUID primary keys
- RLS (Row Level Security) is enabled on all tables
- Users can only modify their own content
- All content is publicly readable
- Storage bucket is public for easy image access
