# Requirements Document

## Introduction

This feature adds a personalized welcome section to the homepage that displays user-specific information including a greeting, status update functionality, activity statistics, profile analytics, recent visitors, daily fortune, and friend suggestions. This transforms the generic homepage into a personalized dashboard that encourages user engagement and social interaction.

## Glossary

- **System**: The Orkut-style social networking application
- **User**: An authenticated person using the application
- **Status Update**: A text message that users can post to share their current thoughts or activities
- **Profile View**: A recorded instance of someone viewing a user's profile page
- **Profile Visitor**: A user who has viewed another user's profile
- **Fortune**: A randomly generated inspirational or humorous message displayed daily
- **Friend Suggestion**: A recommended user that the current user might want to connect with
- **Activity Stat**: A numerical count of user-generated content (scraps, photos, fans, messages)

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a personalized welcome message when I visit the homepage, so that I feel recognized and engaged with the platform.

#### Acceptance Criteria

1. WHEN a user navigates to the homepage THEN the System SHALL display "Welcome, [User's Name]" at the top of the main content area
2. WHEN the user's name is not available THEN the System SHALL display a generic welcome message
3. WHEN the welcome section loads THEN the System SHALL retrieve the user's name from the authenticated session

### Requirement 2

**User Story:** As a user, I want to update my status from the homepage, so that I can quickly share what I'm doing or thinking.

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display a status input field with placeholder text
2. WHEN a user types in the status field THEN the System SHALL enable the update button
3. WHEN a user clicks the update button THEN the System SHALL save the status to the database and clear the input field
4. WHEN a user clicks the cancel button THEN the System SHALL clear the input field without saving
5. WHEN a user clicks the emoji picker icon THEN the System SHALL display an emoji selection interface

### Requirement 3

**User Story:** As a user, I want to see my activity statistics on the homepage, so that I can quickly understand my engagement level on the platform.

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display counts for scraps, photos, photos of me, fans, and messages
2. WHEN the System retrieves activity statistics THEN the System SHALL query the database for current counts
3. WHEN a statistic count is zero THEN the System SHALL display "0" rather than hiding the statistic
4. WHEN activity statistics are displayed THEN the System SHALL show appropriate icons next to each count
5. WHEN a user clicks on a statistic THEN the System SHALL navigate to the corresponding section

### Requirement 4

**User Story:** As a user, I want to see how many times my profile has been viewed, so that I can gauge interest in my profile.

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display the total profile view count with the date since tracking began
2. WHEN the System calculates profile views THEN the System SHALL count all recorded visits to the user's profile
3. WHEN displaying the profile view count THEN the System SHALL include the format "Since [Month] '[YY]: [count]"

### Requirement 5

**User Story:** As a user, I want to see who recently visited my profile, so that I can identify people interested in connecting with me.

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display a list of recent profile visitors with their names
2. WHEN the System retrieves recent visitors THEN the System SHALL fetch the most recent 5 unique visitors
3. WHEN displaying visitor names THEN the System SHALL make each name clickable to navigate to that visitor's profile
4. WHEN no visitors exist THEN the System SHALL display a message indicating no recent visitors
5. WHEN multiple visits from the same user occur THEN the System SHALL display that user only once with the most recent visit time

### Requirement 6

**User Story:** As a user, I want to see a daily fortune message, so that I can enjoy a moment of inspiration or humor.

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display a fortune message labeled "Today's fortune:"
2. WHEN the System generates a fortune THEN the System SHALL select from a predefined list of fortune messages
3. WHEN the same user views the homepage multiple times in one day THEN the System SHALL display the same fortune message

### Requirement 7

**User Story:** As a user, I want to see friend suggestions on my homepage, so that I can discover and connect with new people.

#### Acceptance Criteria

1. WHEN a user views the homepage THEN the System SHALL display a carousel of friend suggestions with the heading "friend suggestions by orkut"
2. WHEN the System generates friend suggestions THEN the System SHALL recommend users who are not already friends
3. WHEN displaying each friend suggestion THEN the System SHALL show the user's profile picture, name, and an "add as friend" button
4. WHEN a user clicks "add as friend" THEN the System SHALL send a friend request and update the button state
5. WHEN a user clicks the close icon on a suggestion THEN the System SHALL remove that suggestion from the carousel
6. WHEN a user clicks the navigation arrow THEN the System SHALL scroll to show additional friend suggestions
7. WHEN fewer than 4 suggestions exist THEN the System SHALL display all available suggestions without navigation arrows
8. WHEN no friend suggestions exist THEN the System SHALL display a message indicating no suggestions are available
