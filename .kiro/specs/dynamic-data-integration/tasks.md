# Implementation Plan

- [ ] 1. Set up database schema and storage buckets
  - Create new database tables (posts, post_likes, photo_albums, photos, status_updates)
  - Create storage buckets for photos and posts
  - Set up Row Level Security policies for all new tables
  - Create database indexes for performance optimization
  - _Requirements: 10.1, 10.3, 10.4, 10.5_

- [ ] 2. Implement Feed/Posts functionality
- [ ] 2.1 Create posts API functions
  - Implement `fetchPosts(userId, limit)` to retrieve posts with author info
  - Implement `createPost({ userId, content, imageFile })` with image upload
  - Implement `uploadPostImage(file, userId)` for storage bucket uploads
  - Implement `deletePost(postId)` with authorization checks
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2.2 Create post likes API functions
  - Implement `likePost(postId, userId)` to add like and increment count
  - Implement `unlikePost(postId, userId)` to remove like and decrement count
  - Implement `checkUserLikedPost(postId, userId)` to check like status
  - _Requirements: 1.4, 1.5_

- [ ] 2.3 Update Feed component to use dynamic data
  - Replace static posts array with API calls to `fetchPosts`
  - Implement post creation with image upload
  - Implement like/unlike functionality with optimistic updates
  - Add loading states and error handling
  - Maintain Orkut UI styling
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2.4 Write property test for post creation persistence
  - **Property 1: Post creation persistence**
  - **Validates: Requirements 1.1**

- [ ] 2.5 Write property test for like count consistency
  - **Property 2: Like count consistency**
  - **Validates: Requirements 1.4, 1.5**

- [-] 3. Implement Photos functionality
- [x] 3.1 Create photo albums API functions
  - Implement `fetchPhotoAlbums(userId)` to get albums with photo counts
  - Implement `createPhotoAlbum({ userId, name, description })` to create albums
  - Implement `deletePhotoAlbum(albumId)` with cascade delete of photos
  - _Requirements: 2.1, 2.3_

- [x] 3.2 Create photos API functions
  - Implement `fetchAlbumPhotos(albumId)` to get all photos in album
  - Implement `uploadPhotos({ albumId, userId, files })` for multiple uploads
  - Implement `deletePhoto(photoId)` to remove photo from storage and database
  - _Requirements: 2.2, 2.4, 2.5_

- [x] 3.3 Update Photos component to use dynamic data
  - Replace static albums array with API calls to `fetchPhotoAlbums`
  - Implement album creation functionality
  - Implement photo upload with multiple file support
  - Implement photo deletion
  - Add loading states and error handling
  - Maintain Orkut UI styling
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3.4 Write property test for photo album ownership
  - **Property 3: Photo album ownership**
  - **Validates: Requirements 2.1, 2.2**

- [ ] 3.5 Write property test for photo count accuracy
  - **Property 4: Photo count accuracy**
  - **Validates: Requirements 2.3**

- [ ] 4. Implement Home page statistics and features
- [ ] 4.1 Create user statistics API function
  - Implement `fetchUserStats(userId)` to aggregate counts from multiple tables
  - Query scraps_count, photos_count, messages count, and friends count
  - Return structured UserStats object
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4.2 Create profile views API functions
  - Implement `fetchProfileViews(userId)` to get view count and start date
  - Implement `trackProfileVisit(visitorId, profileId)` with self-visit filtering
  - Implement `fetchProfileVisitors(profileId, limit)` to get recent visitors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 4.3 Create friend suggestions API function
  - Implement `fetchFriendSuggestions(userId, limit)` based on mutual friends
  - Exclude existing friends and pending requests
  - Include mutual friend count in results
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ] 4.4 Create status update API functions
  - Implement `saveStatusUpdate({ userId, content })` to store status
  - Implement `fetchLatestStatus(userId)` to get most recent status
  - _Requirements: 6.2, 6.4, 6.5_

- [ ] 4.5 Create daily fortune utility function
  - Implement `getDailyFortune(userId, date)` with deterministic algorithm
  - Use hash of userId + date to select from fortune messages array
  - Ensure same fortune for same user/date combination
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 4.6 Update Home component to use dynamic data
  - Replace placeholder data with API calls for all sections
  - Implement status update functionality
  - Integrate friend suggestions with dismiss functionality
  - Add loading states for each section independently
  - Add error handling with graceful degradation
  - Maintain Orkut UI styling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.2, 4.4, 5.1, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1_

- [ ] 4.7 Write property test for statistics calculation correctness
  - **Property 5: Statistics calculation correctness**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [ ] 4.8 Write property test for self-visit exclusion
  - **Property 6: Self-visit exclusion**
  - **Validates: Requirements 4.3**

- [ ] 4.9 Write property test for profile visitor ordering
  - **Property 7: Profile visitor ordering**
  - **Validates: Requirements 4.4**

- [ ] 4.10 Write property test for friend suggestion exclusion
  - **Property 8: Friend suggestion exclusion**
  - **Validates: Requirements 5.2, 5.3**

- [ ] 4.11 Write property test for daily fortune determinism
  - **Property 9: Daily fortune determinism**
  - **Validates: Requirements 7.2, 7.4**

- [ ] 5. Implement Communities dynamic functionality
- [ ] 5.1 Update Communities component to use dynamic data
  - Replace static communities array with API call to `fetchUserCommunities`
  - Implement join community functionality with `joinCommunity`
  - Implement leave community functionality with `leaveCommunity`
  - Update member counts after join/leave operations
  - Add loading states and error handling
  - Maintain Orkut UI styling
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 5.2 Write property test for community member count accuracy
  - **Property 10: Community member count accuracy**
  - **Validates: Requirements 8.3, 8.4**

- [ ] 6. Enhance Messages component
- [ ] 6.1 Improve Messages UI and functionality
  - Add user search/autocomplete for recipient selection
  - Implement inbox/sent tabs switching
  - Add message threading/reply functionality
  - Improve visual distinction for unread messages
  - Add loading states and error handling
  - Maintain Orkut UI styling
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6.2 Write property test for message read state persistence
  - **Property 11: Message read state persistence**
  - **Validates: Requirements 9.4**

- [ ] 7. Update Profile component to use dynamic data
- [ ] 7.1 Integrate profile with dynamic friends and communities
  - Fetch friends using `fetchFriends(userId)` API
  - Fetch communities using `fetchUserCommunities(userId)` API
  - Display actual counts instead of hardcoded values
  - Track profile visits when viewing other profiles
  - Add loading states and error handling
  - Maintain Orkut UI styling
  - _Requirements: 4.1, 8.5_

- [ ] 8. Add comprehensive error handling
- [ ] 8.1 Implement error handling patterns across all components
  - Add try-catch blocks in all API functions
  - Return structured error objects from API layer
  - Display user-friendly error messages in components
  - Implement retry mechanisms where appropriate
  - Log errors to console with context
  - _Requirements: 10.2_

- [ ] 8.2 Write property test for foreign key integrity
  - **Property 12: Foreign key integrity**
  - **Validates: Requirements 10.3**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Final integration and testing
- [ ] 10.1 Test all features end-to-end
  - Create posts with and without images
  - Create photo albums and upload photos
  - Verify statistics update correctly
  - Test friend suggestions and profile visits
  - Test community join/leave functionality
  - Verify messages work correctly
  - Test on different screen sizes

- [ ] 10.2 Verify Orkut UI consistency
  - Check all pages maintain Orkut color scheme
  - Verify layout consistency across components
  - Test responsive design on mobile devices
  - Ensure loading states are visually consistent
  - Verify error messages follow UI patterns

- [ ] 10.3 Performance optimization
  - Add database indexes for frequently queried columns
  - Implement pagination for large datasets
  - Add optimistic updates for like/unlike actions
  - Cache fetched data in React state appropriately

- [ ] 11. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
