# Design Document

## Overview

This design document outlines the architecture and implementation strategy for converting the Orkut clone from a static, demo application to a fully functional, database-driven social media platform. The design focuses on integrating all UI components with the Supabase backend, implementing missing database tables, creating comprehensive API functions, and ensuring data consistency while preserving the authentic Orkut user experience.

The implementation will follow a modular approach, addressing each feature area (posts/feed, photos, home page statistics, communities) independently while maintaining consistency in error handling, loading states, and UI patterns.

## Architecture

### System Components

1. **Frontend Layer (React)**
   - Component-based UI using React 19.2.0
   - Client-side routing with React Router DOM
   - Local state management with React hooks
   - Error boundaries for graceful error handling

2. **API Layer (src/backend/api.js)**
   - Centralized API functions for all backend operations
   - Consistent error handling and response formatting
   - Supabase client integration

3. **Backend Layer (Supabase)**
   - PostgreSQL database with Row Level Security (RLS)
   - Storage buckets for images and media files
   - Real-time capabilities (future enhancement)

4. **Storage Layer**
   - Existing: `avatars` bucket for profile images
   - New: `photos` bucket for photo album images
   - New: `posts` bucket for feed post images

### Data Flow

```
User Action → React Component → API Function → Supabase Client → PostgreSQL/Storage
                                                                         ↓
User Interface ← React Component ← API Response ← Supabase Client ← Database/Storage
```

## Components and Interfaces

### Database Schema Extensions

#### posts table
```sql
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  likes_count int DEFAULT 0,
  comments_count int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

#### post_likes table
```sql
CREATE TABLE post_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id)
);
```

#### photo_albums table
```sql
CREATE TABLE photo_albums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

#### photos table
```sql
CREATE TABLE photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id uuid NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

#### status_updates table
```sql
CREATE TABLE status_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

### API Functions

#### Feed/Posts API
- `fetchPosts(userId, limit)` - Retrieve posts for feed
- `createPost({ userId, content, imageFile })` - Create new post with optional image
- `likePost(postId, userId)` - Add like to post
- `unlikePost(postId, userId)` - Remove like from post
- `deletePost(postId)` - Delete a post
- `uploadPostImage(file, userId)` - Upload image to posts bucket

#### Photos API
- `fetchPhotoAlbums(userId)` - Get all albums for user
- `fetchAlbumPhotos(albumId)` - Get all photos in an album
- `createPhotoAlbum({ userId, name, description })` - Create new album
- `uploadPhotos({ albumId, userId, files })` - Upload multiple photos to album
- `deletePhoto(photoId)` - Delete a photo
- `deletePhotoAlbum(albumId)` - Delete an album and all its photos

#### Home Page API
- `fetchUserStats(userId)` - Get aggregated statistics (scraps, photos, messages, fans)
- `fetchProfileViews(userId)` - Get profile view count and start date
- `fetchFriendSuggestions(userId, limit)` - Get suggested friends based on mutual connections
- `saveStatusUpdate({ userId, content })` - Save user's status update
- `fetchLatestStatus(userId)` - Get user's most recent status

#### Utility Functions
- `getDailyFortune(userId, date)` - Generate deterministic daily fortune message

## Data Models

### Post Model
```typescript
interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: {
    id: string;
    name: string;
    image: string;
  };
  liked_by_user?: boolean;
}
```

### PhotoAlbum Model
```typescript
interface PhotoAlbum {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  photo_count: number;
  cover_image?: string;
}
```

### Photo Model
```typescript
interface Photo {
  id: string;
  album_id: string;
  user_id: string;
  url: string;
  caption?: string;
  created_at: string;
}
```

### UserStats Model
```typescript
interface UserStats {
  scraps: number;
  photos: number;
  photosOfMe: number;
  fans: number;
  messages: number;
}
```

### FriendSuggestion Model
```typescript
interface FriendSuggestion {
  id: string;
  name: string;
  image: string;
  city?: string;
  country?: string;
  mutual_friends_count: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Post creation persistence
*For any* valid post with user ID and content, creating the post should result in the post being retrievable from the database with the same content and user ID.
**Validates: Requirements 1.1**

### Property 2: Like count consistency
*For any* post, the likes_count field should always equal the number of records in post_likes table for that post.
**Validates: Requirements 1.4, 1.5**

### Property 3: Photo album ownership
*For any* photo album, all photos in that album should have the same user_id as the album's user_id.
**Validates: Requirements 2.1, 2.2**

### Property 4: Photo count accuracy
*For any* photo album, the displayed photo count should equal the actual number of photo records linked to that album.
**Validates: Requirements 2.3**

### Property 5: Statistics calculation correctness
*For any* user, the displayed statistics (scraps, photos, messages, fans) should match the actual counts from their respective database tables.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 6: Self-visit exclusion
*For any* user viewing their own profile, no profile visit record should be created.
**Validates: Requirements 4.3**

### Property 7: Profile visitor ordering
*For any* list of profile visitors, visitors should be ordered by visit timestamp in descending order (most recent first).
**Validates: Requirements 4.4**

### Property 8: Friend suggestion exclusion
*For any* user, friend suggestions should not include users who are already friends or have pending friend requests.
**Validates: Requirements 5.2, 5.3**

### Property 9: Daily fortune determinism
*For any* user and date, calling the fortune generation function multiple times should return the same fortune message.
**Validates: Requirements 7.2, 7.4**

### Property 10: Community member count accuracy
*For any* community, the displayed member count should equal the number of membership records for that community.
**Validates: Requirements 8.3, 8.4**

### Property 11: Message read state persistence
*For any* message, once marked as read, subsequent retrievals should show the message as read.
**Validates: Requirements 9.4**

### Property 12: Foreign key integrity
*For any* database record with a foreign key reference, deleting the referenced record should cascade delete or prevent deletion based on the constraint.
**Validates: Requirements 10.3**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection failures
   - Timeout errors
   - API unavailability

2. **Validation Errors**
   - Missing required fields
   - Invalid data formats
   - File size/type restrictions

3. **Authorization Errors**
   - Unauthenticated requests
   - Insufficient permissions
   - RLS policy violations

4. **Data Errors**
   - Foreign key violations
   - Unique constraint violations
   - Data not found

### Error Handling Strategy

1. **API Layer**
   - Wrap all Supabase calls in try-catch blocks
   - Log errors to console with context
   - Return structured error objects: `{ error: true, message: string, code?: string }`

2. **Component Layer**
   - Use error state variables to track errors
   - Display user-friendly error messages
   - Provide retry mechanisms where appropriate
   - Use Error Boundaries for catastrophic failures

3. **User Feedback**
   - Loading states during async operations
   - Success messages for completed actions
   - Clear error messages with actionable guidance
   - Graceful degradation (show partial data when possible)

### Example Error Handling Pattern
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.fetchPosts(userId);
    setData(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    setError('Unable to load posts. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Testing Strategy

### Unit Testing

Unit tests will verify individual API functions and utility functions:

- Test API functions with mock Supabase responses
- Test fortune generation algorithm for determinism
- Test data transformation functions
- Test validation logic

Example unit tests:
- `getDailyFortune` returns same fortune for same user/date
- `uploadPostImage` handles file upload errors
- `fetchUserStats` correctly aggregates counts

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (JavaScript property-based testing library).

Each property-based test will:
- Run a minimum of 100 iterations with random inputs
- Tag the test with a comment referencing the design document property
- Use the format: `**Feature: dynamic-data-integration, Property {number}: {property_text}**`

Example property-based tests:
- Generate random posts and verify like count consistency
- Generate random albums and verify photo ownership
- Generate random user IDs and verify statistics accuracy

### Integration Testing

Integration tests will verify end-to-end workflows:

- Create post → Fetch posts → Verify post appears
- Upload photos → Fetch album → Verify photos appear
- Like post → Fetch post → Verify like count incremented
- Join community → Fetch user communities → Verify membership

### Manual Testing

Manual testing will verify UI/UX aspects:

- Orkut visual styling preserved
- Loading states display correctly
- Error messages are user-friendly
- Responsive design works on mobile

## Implementation Notes

### Storage Bucket Configuration

Create new storage buckets with public access policies:

```sql
-- Create photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Create posts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true);
```

### Row Level Security Policies

All new tables must have RLS enabled with appropriate policies:

- Users can read all posts (public feed)
- Users can only create/update/delete their own posts
- Users can read all photo albums
- Users can only create/update/delete their own albums and photos
- Users can read all profile visits
- Users can only create profile visits as themselves

### Performance Considerations

1. **Indexes**: Create indexes on frequently queried columns
   - `posts(user_id, created_at DESC)`
   - `photos(album_id)`
   - `post_likes(post_id, user_id)`

2. **Pagination**: Implement pagination for large datasets
   - Feed posts: 20 per page
   - Photo albums: 12 per page
   - Photos in album: 24 per page

3. **Caching**: Use React state to cache fetched data
   - Avoid refetching on every render
   - Implement refresh mechanisms

4. **Optimistic Updates**: Update UI immediately, rollback on error
   - Like/unlike actions
   - Post creation
   - Status updates

### UI Consistency

Maintain Orkut visual identity:
- Blue header (#5e82c5)
- Pink accents (#ed2590)
- Three-column layout
- Classic button styles
- Consistent spacing and typography

All new components should follow existing CSS patterns in `src/css/` directory.
