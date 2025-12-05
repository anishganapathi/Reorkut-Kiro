# Requirements Document

## Introduction

This specification defines the requirements for converting the Orkut clone application from static, hardcoded data to a fully dynamic, database-driven system. The application currently uses placeholder data in components like Photos, Feed, Messages, Communities, and Home. This feature will integrate all components with the Supabase backend, implement missing database tables and API functions, and ensure all CRUD operations work correctly while maintaining the authentic Orkut UI/UX.

## Glossary

- **System**: The Orkut clone web application
- **User**: An authenticated person using the application
- **Post**: A feed item created by a user containing text and optionally an image
- **Photo Album**: A collection of photos organized by name and owned by a user
- **Photo**: An image file uploaded by a user and stored in a photo album
- **Scrap**: A message posted on a user's scrapbook (already implemented)
- **Message**: A private communication between two users (already implemented)
- **Video**: A YouTube video link added by a user (already implemented)
- **Community**: A group that users can join (partially implemented)
- **Friend**: A bidirectional connection between two users (already implemented)
- **Profile Visitor**: A user who has viewed another user's profile
- **Status Update**: A short text message posted by a user on their home page
- **Friend Suggestion**: A recommended user connection based on mutual friends or interests
- **Supabase**: The Backend-as-a-Service platform providing PostgreSQL database and storage

## Requirements

### Requirement 1

**User Story:** As a user, I want to create and view posts in my feed, so that I can share updates with my friends and see what they are sharing.

#### Acceptance Criteria

1. WHEN a user creates a post with text content THEN the System SHALL store the post in the database with the user's ID, content, and timestamp
2. WHEN a user creates a post with an image THEN the System SHALL upload the image to storage and store the image URL with the post
3. WHEN a user views the feed THEN the System SHALL retrieve and display posts from the database ordered by creation time descending
4. WHEN a user likes a post THEN the System SHALL increment the like count in the database and record the user's like
5. WHEN a user unlikes a post THEN the System SHALL decrement the like count and remove the user's like record

### Requirement 2

**User Story:** As a user, I want to organize my photos into albums, so that I can manage and share my memories in an organized way.

#### Acceptance Criteria

1. WHEN a user creates a photo album THEN the System SHALL store the album with a name, user ID, and creation timestamp
2. WHEN a user uploads photos to an album THEN the System SHALL store each photo file in storage and create database records linking photos to the album
3. WHEN a user views their albums THEN the System SHALL retrieve all albums owned by the user with photo counts
4. WHEN a user opens an album THEN the System SHALL retrieve and display all photos in that album
5. WHEN a user deletes a photo THEN the System SHALL remove the photo from storage and delete the database record

### Requirement 3

**User Story:** As a user, I want to see activity statistics on my home page, so that I can track my engagement on the platform.

#### Acceptance Criteria

1. WHEN a user views their home page THEN the System SHALL calculate and display the count of scraps received by the user
2. WHEN a user views their home page THEN the System SHALL calculate and display the count of photos uploaded by the user
3. WHEN a user views their home page THEN the System SHALL calculate and display the count of messages received by the user
4. WHEN a user views their home page THEN the System SHALL calculate and display the count of fans (friends) the user has
5. WHEN any of these counts change THEN the System SHALL reflect the updated values on the next page load

### Requirement 4

**User Story:** As a user, I want to see who has visited my profile, so that I can know who is interested in my profile.

#### Acceptance Criteria

1. WHEN a user visits another user's profile THEN the System SHALL record the visit with visitor ID, profile ID, and timestamp
2. WHEN a user views their own profile visitors THEN the System SHALL retrieve the most recent visitors with their names and profile images
3. WHEN a user visits their own profile THEN the System SHALL NOT record a self-visit
4. WHEN displaying profile visitors THEN the System SHALL show visitors ordered by visit time descending
5. WHEN displaying profile visitors THEN the System SHALL limit the display to the 10 most recent visitors

### Requirement 5

**User Story:** As a user, I want to receive friend suggestions, so that I can expand my network with relevant connections.

#### Acceptance Criteria

1. WHEN a user views their home page THEN the System SHALL generate friend suggestions based on mutual friends
2. WHEN generating suggestions THEN the System SHALL exclude users who are already friends with the user
3. WHEN generating suggestions THEN the System SHALL exclude users who have pending friend requests with the user
4. WHEN a user dismisses a suggestion THEN the System SHALL remove that suggestion from the current display
5. WHEN displaying suggestions THEN the System SHALL show user name, profile image, and location information

### Requirement 6

**User Story:** As a user, I want to post and update my status, so that I can share quick thoughts with my friends.

#### Acceptance Criteria

1. WHEN a user types a status update THEN the System SHALL enable the update button only when text is present
2. WHEN a user submits a status update THEN the System SHALL store the status with user ID, content, and timestamp
3. WHEN a user cancels a status update THEN the System SHALL clear the input field without saving
4. WHEN a user views their home page THEN the System SHALL display their most recent status update
5. WHEN a status is updated THEN the System SHALL replace the previous status with the new one

### Requirement 7

**User Story:** As a user, I want to see a daily fortune message, so that I can enjoy a personalized touch on my home page.

#### Acceptance Criteria

1. WHEN a user views their home page THEN the System SHALL generate a fortune message based on the current date and user ID
2. WHEN the same user views their home page multiple times on the same day THEN the System SHALL display the same fortune message
3. WHEN a new day begins THEN the System SHALL generate a different fortune message for the user
4. WHEN generating a fortune THEN the System SHALL use a deterministic algorithm to ensure consistency
5. WHEN displaying the fortune THEN the System SHALL show it in the daily fortune section of the home page

### Requirement 8

**User Story:** As a user, I want to browse and join communities dynamically, so that I can connect with groups that interest me.

#### Acceptance Criteria

1. WHEN a user views the communities page THEN the System SHALL retrieve all communities from the database
2. WHEN displaying communities THEN the System SHALL show community name, category, member count, and image
3. WHEN a user joins a community THEN the System SHALL create a membership record and increment the member count
4. WHEN a user leaves a community THEN the System SHALL delete the membership record and decrement the member count
5. WHEN a user views their communities THEN the System SHALL retrieve only communities where the user is a member

### Requirement 9

**User Story:** As a user, I want the messages interface to work seamlessly, so that I can communicate privately with other users.

#### Acceptance Criteria

1. WHEN a user composes a message THEN the System SHALL provide fields for recipient, subject, and content
2. WHEN a user sends a message THEN the System SHALL validate that all required fields are filled
3. WHEN displaying the inbox THEN the System SHALL show unread messages with visual distinction
4. WHEN a user views a message THEN the System SHALL mark it as read in the database
5. WHEN displaying messages THEN the System SHALL show sender name, subject, date, and read status

### Requirement 10

**User Story:** As a developer, I want proper database schema and API functions, so that all features have reliable backend support.

#### Acceptance Criteria

1. WHEN the database is initialized THEN the System SHALL create tables for posts, photos, photo_albums, status_updates, and likes
2. WHEN API functions are called THEN the System SHALL handle errors gracefully and return appropriate error messages
3. WHEN creating database records THEN the System SHALL enforce foreign key constraints to maintain data integrity
4. WHEN implementing Row Level Security THEN the System SHALL ensure users can only modify their own data
5. WHEN storage buckets are accessed THEN the System SHALL enforce proper access policies for file uploads and downloads
