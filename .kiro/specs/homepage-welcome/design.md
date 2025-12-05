# Design Document: Homepage Welcome Feature

## Overview

The homepage welcome feature transforms the current generic homepage into a personalized user dashboard. It displays a welcome greeting, status update functionality, activity statistics, profile analytics, recent visitors, daily fortune, and friend suggestions. This feature enhances user engagement by providing immediate access to relevant social information and interaction opportunities.

The implementation will replace the existing MainContent component with a new Home component that integrates with the existing Supabase backend and follows the established Orkut-style UI patterns.

## Architecture

### Component Structure

```
Home (new component)
├── WelcomeSection
│   ├── WelcomeHeader
│   └── StatusUpdate
├── ActivityStats
├── ProfileAnalytics
│   ├── ProfileViews
│   └── RecentVisitors
├── DailyFortune
└── FriendSuggestions
```

### Data Flow

1. **Authentication Context**: User data flows from localStorage (set during login) to the Home component
2. **API Layer**: Supabase client handles all database operations through the existing api.js module
3. **State Management**: React useState and useEffect hooks manage component-level state
4. **Real-time Updates**: Activity stats and visitor data refresh on component mount

### Integration Points

- **Existing Components**: Integrates with Header, Sidebar, and RightSidebar
- **Routing**: Replaces MainContent at the "/" route in App.jsx
- **API**: Extends existing api.js with new functions for stats, visitors, and suggestions
- **Styling**: Follows existing CSS patterns from App.css and Profile.css

## Components and Interfaces

### Home Component

**Purpose**: Main container for the homepage welcome feature

**Props**: None (uses localStorage for user context)

**State**:
- `user`: Current authenticated user object
- `stats`: Activity statistics object
- `profileViews`: Profile view count and start date
- `recentVisitors`: Array of recent visitor objects
- `fortune`: Daily fortune message string
- `suggestions`: Array of friend suggestion objects
- `statusText`: Current status input value
- `showEmojiPicker`: Boolean for emoji picker visibility

**Key Methods**:
- `fetchUserStats()`: Retrieves activity counts from database
- `fetchProfileViews()`: Gets total profile view count
- `fetchRecentVisitors()`: Retrieves last 5 unique visitors
- `generateFortune()`: Selects daily fortune message
- `fetchFriendSuggestions()`: Gets recommended users
- `handleStatusUpdate()`: Saves status to database
- `handleAddFriend(userId)`: Sends friend request

### WelcomeSection Component

**Purpose**: Displays personalized greeting and status update interface

**Props**:
- `userName`: String - User's display name
- `statusText`: String - Current status input value
- `onStatusChange`: Function - Handler for status text changes
- `onUpdate`: Function - Handler for update button click
- `onCancel`: Function - Handler for cancel button click
- `onEmojiClick`: Function - Handler for emoji picker toggle

**Rendering**:
```jsx
<div className="welcome-section">
  <h2>Welcome, {userName}</h2>
  <div className="status-update">
    <input type="text" value={statusText} onChange={onStatusChange} />
    <button onClick={onUpdate}>update</button>
    <button onClick={onCancel}>cancel</button>
    <button onClick={onEmojiClick}>😊</button>
  </div>
</div>
```

### ActivityStats Component

**Purpose**: Displays user activity counts with icons

**Props**:
- `stats`: Object containing:
  - `scraps`: Number
  - `photos`: Number
  - `photosOfMe`: Number
  - `fans`: Number
  - `messages`: Number

**Rendering**:
```jsx
<div className="activity-stats">
  <div className="stat">📝 scraps {stats.scraps}</div>
  <div className="stat">📷 photos {stats.photos}</div>
  <div className="stat">📸 photos of me {stats.photosOfMe}</div>
  <div className="stat">⭐ fans {stats.fans}</div>
  <div className="stat">✉️ messages {stats.messages}</div>
</div>
```

### ProfileAnalytics Component

**Purpose**: Shows profile views and recent visitors

**Props**:
- `viewCount`: Number - Total profile views
- `startDate`: String - Date tracking began (format: "Feb '06")
- `visitors`: Array of visitor objects with:
  - `id`: String
  - `name`: String
  - `image`: String
  - `visited_at`: String

**Rendering**:
```jsx
<div className="profile-analytics">
  <div className="profile-views">
    Profile views: Since {startDate}: {viewCount}
  </div>
  <div className="recent-visitors">
    Recent visitors: {visitors.map(v => v.name).join(', ')}
  </div>
</div>
```

### DailyFortune Component

**Purpose**: Displays a randomly selected daily fortune message

**Props**:
- `fortune`: String - The fortune message to display

**Fortune Pool**: Array of 50+ fortune messages including:
- "Exercise today"
- "A smile is the universal welcome"
- "Your creativity will lead to success"
- "Good things come to those who wait"
- etc.

### FriendSuggestions Component

**Purpose**: Carousel of recommended users to connect with

**Props**:
- `suggestions`: Array of user objects with:
  - `id`: String
  - `name`: String
  - `image`: String
- `onAddFriend`: Function - Handler for add friend button
- `onDismiss`: Function - Handler for dismissing a suggestion

**State**:
- `currentIndex`: Number - Current carousel position
- `dismissedIds`: Array - IDs of dismissed suggestions

**Key Methods**:
- `handleNext()`: Advances carousel
- `handlePrevious()`: Goes back in carousel
- `handleDismiss(id)`: Removes suggestion from view

## Data Models

### User Stats Object
```javascript
{
  scraps: Number,        // Count of scraps received
  photos: Number,        // Count of photos uploaded
  photosOfMe: Number,    // Count of photos tagged with user
  fans: Number,          // Count of users who marked as fan
  messages: Number       // Count of unread messages
}
```

### Profile View Object
```javascript
{
  count: Number,         // Total view count
  startDate: String,     // Format: "Feb '06"
  firstVisit: Date       // Timestamp of first recorded visit
}
```

### Visitor Object
```javascript
{
  id: String,           // User ID
  name: String,         // Display name
  image: String,        // Avatar URL
  visited_at: Date,     // Timestamp of visit
  city: String,         // Optional
  country: String       // Optional
}
```

### Friend Suggestion Object
```javascript
{
  id: String,           // User ID
  name: String,         // Display name
  image: String,        // Avatar URL
  mutualFriends: Number, // Count of mutual connections
  reason: String        // Why suggested (e.g., "mutual friends")
}
```

### Status Update Object
```javascript
{
  id: String,           // Status ID
  user_id: String,      // User who posted
  content: String,      // Status text
  created_at: Date      // Timestamp
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Welcome message displays user name

*For any* authenticated user with a name, rendering the welcome section should display "Welcome, [User's Name]" in the output
**Validates: Requirements 1.1**

### Property 2: Status input enables update button

*For any* non-empty text input in the status field, the update button should be enabled
**Validates: Requirements 2.2**

### Property 3: Status update persists and clears

*For any* valid status text, clicking the update button should save the status to the database and result in an empty input field
**Validates: Requirements 2.3**

### Property 4: Cancel clears without saving

*For any* text in the status input field, clicking cancel should clear the field without creating a database record
**Validates: Requirements 2.4**

### Property 5: All activity stats are displayed

*For any* user stats object, rendering the activity stats component should display all five statistics (scraps, photos, photos of me, fans, messages)
**Validates: Requirements 3.1**

### Property 6: Stats include icons

*For any* set of activity statistics, each displayed stat should have an associated icon in the rendered output
**Validates: Requirements 3.4**

### Property 7: Stat clicks navigate correctly

*For any* activity statistic, clicking on it should trigger navigation to the corresponding section
**Validates: Requirements 3.5**

### Property 8: Profile view count includes date

*For any* profile view data, the rendered output should contain both the view count and the start date in the format "Since [Month] '[YY]: [count]"
**Validates: Requirements 4.1, 4.3**

### Property 9: Profile view calculation is accurate

*For any* set of profile visit records, the calculated view count should equal the total number of records
**Validates: Requirements 4.2**

### Property 10: Recent visitors are displayed

*For any* list of recent visitors, rendering the component should display each visitor's name
**Validates: Requirements 5.1**

### Property 11: Visitor limit is enforced

*For any* set of profile visits with more than 5 unique visitors, the system should return exactly 5 visitors
**Validates: Requirements 5.2**

### Property 12: Visitor names are clickable

*For any* displayed visitor, the name should be rendered as a clickable link that navigates to that visitor's profile
**Validates: Requirements 5.3**

### Property 13: Visitor deduplication

*For any* set of profile visits containing multiple visits from the same user, that user should appear only once in the recent visitors list
**Validates: Requirements 5.5**

### Property 14: Fortune is always displayed

*For any* user viewing the homepage, the rendered output should contain "Today's fortune:" followed by a fortune message
**Validates: Requirements 6.1**

### Property 15: Fortune comes from predefined list

*For any* generated fortune, the message should be a member of the predefined fortune messages list
**Validates: Requirements 6.2**

### Property 16: Fortune is consistent within a day

*For any* user, viewing the homepage multiple times on the same day should return the same fortune message
**Validates: Requirements 6.3**

### Property 17: Suggestions exclude existing friends

*For any* set of friend suggestions, none of the suggested users should already be in the current user's friends list
**Validates: Requirements 7.2**

### Property 18: Suggestion cards are complete

*For any* friend suggestion, the rendered card should contain a profile picture, name, and "add as friend" button
**Validates: Requirements 7.3**

### Property 19: Add friend updates state

*For any* friend suggestion, clicking "add as friend" should send a friend request and change the button state to indicate the request was sent
**Validates: Requirements 7.4**

### Property 20: Dismissing removes suggestion

*For any* friend suggestion, clicking the close icon should remove that suggestion from the visible carousel
**Validates: Requirements 7.5**

### Property 21: Carousel navigation advances view

*For any* carousel with more than 4 suggestions, clicking the navigation arrow should change which suggestions are visible
**Validates: Requirements 7.6**

## Error Handling

### Authentication Errors

**Scenario**: User is not authenticated or session expired
**Handling**: 
- Redirect to login page
- Clear localStorage
- Display "Please log in to continue" message

**Scenario**: User data is incomplete or corrupted
**Handling**:
- Display generic welcome message without name
- Log error to console
- Attempt to fetch fresh user data from API

### API Errors

**Scenario**: Failed to fetch activity stats
**Handling**:
- Display zeros for all stats
- Show retry button
- Log error with details

**Scenario**: Failed to fetch profile visitors
**Handling**:
- Display "Unable to load visitors" message
- Continue loading other sections
- Retry on next page load

**Scenario**: Failed to fetch friend suggestions
**Handling**:
- Display "No suggestions available" message
- Hide carousel navigation
- Continue loading other sections

**Scenario**: Failed to save status update
**Handling**:
- Display error message to user
- Keep status text in input field
- Provide retry option

### Data Validation Errors

**Scenario**: Status text exceeds maximum length
**Handling**:
- Truncate text at character limit
- Display character count indicator
- Disable update button when over limit

**Scenario**: Invalid date format for profile views
**Handling**:
- Use fallback date format
- Log warning
- Display view count without date

**Scenario**: Missing or invalid user images
**Handling**:
- Use default avatar from api.DEFAULT_AVATAR
- Continue rendering other data
- No error message to user

### Network Errors

**Scenario**: Timeout or connection failure
**Handling**:
- Display "Connection error" message
- Provide manual refresh button
- Cache last successful data if available

## Testing Strategy

### Unit Testing

The implementation will use Vitest as the testing framework (already configured in the project). Unit tests will cover:

**Component Rendering**:
- Home component renders without crashing
- WelcomeSection displays correct user name
- ActivityStats displays all stat types
- ProfileAnalytics shows view count and visitors
- DailyFortune displays fortune message
- FriendSuggestions renders carousel

**User Interactions**:
- Status update button click saves data
- Cancel button clears input
- Emoji picker toggle shows/hides picker
- Add friend button sends request
- Dismiss button removes suggestion
- Carousel navigation changes view

**Edge Cases**:
- Empty visitor list shows appropriate message
- Zero stats display "0" not empty
- Missing user name shows generic welcome
- No suggestions shows empty state message
- Fewer than 4 suggestions hides navigation

**API Integration**:
- fetchUserStats returns correct data structure
- fetchProfileViews calculates count correctly
- fetchRecentVisitors limits to 5 results
- fetchFriendSuggestions excludes existing friends
- Status update creates database record

### Property-Based Testing

The implementation will use fast-check as the property-based testing library for JavaScript/React. Each property-based test will run a minimum of 100 iterations to ensure thorough coverage.

**Configuration**:
```javascript
import fc from 'fast-check';

// Run each property test 100 times
fc.assert(fc.property(...), { numRuns: 100 });
```

**Property Test Requirements**:
- Each test must be tagged with a comment referencing the design document property
- Tag format: `// Feature: homepage-welcome, Property {number}: {property_text}`
- Each correctness property must be implemented by a single property-based test
- Tests should generate random valid inputs to verify properties hold universally

**Property Tests to Implement**:

1. **Welcome Message Property** (Property 1)
   - Generate random user objects with names
   - Verify welcome message contains user name

2. **Status Button State Property** (Property 2)
   - Generate random non-empty strings
   - Verify update button is enabled

3. **Status Persistence Property** (Property 3)
   - Generate random status texts
   - Verify database record created and input cleared

4. **Cancel Behavior Property** (Property 4)
   - Generate random status texts
   - Verify no database record and input cleared

5. **Stats Display Property** (Property 5)
   - Generate random stats objects
   - Verify all five stats appear in output

6. **Stats Icons Property** (Property 6)
   - Generate random stats
   - Verify each stat has an icon

7. **Stats Navigation Property** (Property 7)
   - Generate random stat types
   - Verify click triggers correct navigation

8. **Profile View Format Property** (Property 8)
   - Generate random view counts and dates
   - Verify format matches "Since [Month] '[YY]: [count]"

9. **View Count Accuracy Property** (Property 9)
   - Generate random visit record arrays
   - Verify count equals array length

10. **Visitors Display Property** (Property 10)
    - Generate random visitor arrays
    - Verify all names appear in output

11. **Visitor Limit Property** (Property 11)
    - Generate arrays with >5 visitors
    - Verify exactly 5 returned

12. **Visitor Links Property** (Property 12)
    - Generate random visitors
    - Verify each name is a clickable link

13. **Visitor Deduplication Property** (Property 13)
    - Generate visits with duplicates
    - Verify each user appears once

14. **Fortune Display Property** (Property 14)
    - Generate random user contexts
    - Verify fortune label and message present

15. **Fortune Validity Property** (Property 15)
    - Generate random fortune selections
    - Verify fortune is in predefined list

16. **Fortune Consistency Property** (Property 16)
    - Generate same-day multiple views
    - Verify fortune remains same

17. **Suggestions Exclusion Property** (Property 17)
    - Generate suggestions and friend lists
    - Verify no overlap

18. **Suggestion Completeness Property** (Property 18)
    - Generate random suggestions
    - Verify image, name, button present

19. **Add Friend State Property** (Property 19)
    - Generate random suggestions
    - Verify request sent and button updated

20. **Dismiss Removal Property** (Property 20)
    - Generate random suggestions
    - Verify dismissed item removed

21. **Carousel Navigation Property** (Property 21)
    - Generate >4 suggestions
    - Verify navigation changes visible items

### Integration Testing

Integration tests will verify the complete flow from user interaction to database updates:

- User logs in → Homepage loads with correct data
- User updates status → Status saved and appears in feed
- User adds friend → Request created and button updates
- User navigates from stat → Correct page loads

### Test Data Generators

For property-based testing, we'll create generators for:

```javascript
// User generator
const userArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  image: fc.webUrl()
});

// Stats generator
const statsArb = fc.record({
  scraps: fc.nat(),
  photos: fc.nat(),
  photosOfMe: fc.nat(),
  fans: fc.nat(),
  messages: fc.nat()
});

// Visitor generator
const visitorArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1 }),
  image: fc.webUrl(),
  visited_at: fc.date()
});

// Fortune generator
const fortuneArb = fc.constantFrom(...FORTUNE_MESSAGES);

// Suggestion generator
const suggestionArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1 }),
  image: fc.webUrl(),
  mutualFriends: fc.nat({ max: 100 })
});
```

## Implementation Notes

### Database Schema Extensions

The implementation requires adding or modifying the following tables:

**status_updates** (new table):
```sql
CREATE TABLE status_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**profile_visits** (existing - verify structure):
```sql
-- Should already exist from ProfileVisitors feature
CREATE TABLE IF NOT EXISTS profile_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  visited_at TIMESTAMP DEFAULT NOW()
);
```

### API Extensions

Add to `src/backend/api.js`:

```javascript
// Fetch user activity statistics
export const fetchUserStats = async (userId) => {
  // Query counts from scraps, photos, messages, etc.
};

// Save status update
export const saveStatusUpdate = async (userId, content) => {
  // Insert into status_updates table
};

// Fetch friend suggestions
export const fetchFriendSuggestions = async (userId, limit = 10) => {
  // Query users not in friends list
  // Prioritize by mutual friends
};

// Get daily fortune
export const getDailyFortune = (userId, date) => {
  // Deterministic selection based on userId + date
};
```

### Fortune Messages

Store fortune messages in a constant array:

```javascript
const FORTUNE_MESSAGES = [
  "Exercise today",
  "A smile is the universal welcome",
  "Your creativity will lead to success",
  "Good things come to those who wait",
  "Adventure awaits you today",
  // ... 45+ more messages
];
```

### Styling Approach

Follow existing Orkut-style patterns:
- White content boxes with light blue headers
- 11px base font size
- Blue links (#0041d4)
- Subtle borders and rounded corners
- Responsive grid layouts

### Performance Considerations

- Lazy load friend suggestions (fetch on scroll)
- Cache fortune for the day in localStorage
- Debounce status input to prevent excessive re-renders
- Limit visitor queries to last 30 days
- Use React.memo for static components

### Accessibility

- Proper ARIA labels for interactive elements
- Keyboard navigation for carousel
- Alt text for all images
- Focus indicators for buttons
- Screen reader announcements for state changes
