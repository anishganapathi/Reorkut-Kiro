# Implementation Plan

- [ ] 1. Set up database schema and API functions
  - [ ] 1.1 Create status_updates table in database
    - Add migration SQL for status_updates table
    - Include user_id, content, created_at fields
    - _Requirements: 2.3_

  - [ ] 1.2 Verify profile_visits table exists
    - Check existing schema for profile_visits
    - Add if missing with visitor_id, profile_id, visited_at
    - _Requirements: 5.1, 5.2_

  - [ ] 1.3 Implement fetchUserStats API function
    - Query counts for scraps, photos, messages, fans
    - Return stats object with all counts
    - _Requirements: 3.1, 3.2_

  - [ ] 1.4 Implement saveStatusUpdate API function
    - Insert status into status_updates table
    - Return created status record
    - _Requirements: 2.3_

  - [ ] 1.5 Implement fetchFriendSuggestions API function
    - Query users not in current friends list
    - Limit results to specified count
    - Order by mutual friends or random
    - _Requirements: 7.2_

  - [ ] 1.6 Create getDailyFortune utility function
    - Define FORTUNE_MESSAGES constant array with 50+ messages
    - Implement deterministic selection based on userId + date
    - Return same fortune for same user on same day
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 2. Create Home component and basic structure
  - [ ] 2.1 Create Home.jsx component file
    - Set up component with user state from localStorage
    - Add useEffect for data fetching on mount
    - Create container structure matching Orkut style
    - _Requirements: 1.1, 1.3_

  - [ ] 2.2 Create Home.css stylesheet
    - Define styles for welcome section
    - Add styles for stats display
    - Include responsive layout rules
    - Follow existing Orkut color scheme and patterns
    - _Requirements: All_

  - [ ] 2.3 Update App.jsx routing
    - Import Home component
    - Replace MainContent with Home at "/" route
    - Ensure authentication check still works
    - _Requirements: 1.1_

  - [ ] 2.4 Write property test for welcome message display
    - **Property 1: Welcome message displays user name**
    - **Validates: Requirements 1.1**

- [ ] 3. Implement WelcomeSection component
  - [ ] 3.1 Create WelcomeSection.jsx component
    - Display "Welcome, [User's Name]" heading
    - Add status input field with placeholder
    - Include update and cancel buttons
    - Add emoji picker button icon
    - _Requirements: 1.1, 2.1, 2.2_

  - [ ] 3.2 Implement status update functionality
    - Handle status text input changes
    - Enable/disable update button based on input
    - Save status to database on update click
    - Clear input field after successful save
    - _Requirements: 2.2, 2.3_

  - [ ] 3.3 Implement cancel functionality
    - Clear input field on cancel click
    - Do not save to database
    - _Requirements: 2.4_

  - [ ] 3.4 Add emoji picker integration
    - Install emoji-picker-react or similar library
    - Toggle emoji picker on icon click
    - Insert selected emoji into status input
    - _Requirements: 2.5_

  - [ ] 3.5 Write property test for status button state
    - **Property 2: Status input enables update button**
    - **Validates: Requirements 2.2**

  - [ ] 3.6 Write property test for status persistence
    - **Property 3: Status update persists and clears**
    - **Validates: Requirements 2.3**

  - [ ] 3.7 Write property test for cancel behavior
    - **Property 4: Cancel clears without saving**
    - **Validates: Requirements 2.4**

- [ ] 4. Implement ActivityStats component
  - [ ] 4.1 Create ActivityStats.jsx component
    - Display scraps count with icon
    - Display photos count with icon
    - Display photos of me count with icon
    - Display fans count with icon
    - Display messages count with icon
    - Make each stat clickable for navigation
    - _Requirements: 3.1, 3.4, 3.5_

  - [ ] 4.2 Fetch and display user statistics
    - Call fetchUserStats API on component mount
    - Handle loading state
    - Display zeros for missing stats
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 4.3 Implement stat click navigation
    - Add onClick handlers for each stat
    - Navigate to corresponding section (scrapbook, photos, messages, etc.)
    - _Requirements: 3.5_

  - [ ] 4.4 Write property test for stats display
    - **Property 5: All activity stats are displayed**
    - **Validates: Requirements 3.1**

  - [ ] 4.5 Write property test for stats icons
    - **Property 6: Stats include icons**
    - **Validates: Requirements 3.4**

  - [ ] 4.6 Write property test for stats navigation
    - **Property 7: Stat clicks navigate correctly**
    - **Validates: Requirements 3.5**

- [ ] 5. Implement ProfileAnalytics component
  - [ ] 5.1 Create ProfileAnalytics.jsx component
    - Display profile views count with start date
    - Display recent visitors list
    - Format date as "Since [Month] '[YY]"
    - _Requirements: 4.1, 4.3, 5.1_

  - [ ] 5.2 Implement profile views display
    - Fetch total profile visit count
    - Calculate start date from first visit
    - Format and display "Profile views: Since [date]: [count]"
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 5.3 Implement recent visitors display
    - Fetch last 5 unique visitors using fetchProfileVisitors
    - Display visitor names as clickable links
    - Handle empty visitor list with message
    - Deduplicate multiple visits from same user
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 5.4 Write property test for profile view format
    - **Property 8: Profile view count includes date**
    - **Validates: Requirements 4.1, 4.3**

  - [ ] 5.5 Write property test for view count accuracy
    - **Property 9: Profile view calculation is accurate**
    - **Validates: Requirements 4.2**

  - [ ] 5.6 Write property test for visitors display
    - **Property 10: Recent visitors are displayed**
    - **Validates: Requirements 5.1**

  - [ ] 5.7 Write property test for visitor limit
    - **Property 11: Visitor limit is enforced**
    - **Validates: Requirements 5.2**

  - [ ] 5.8 Write property test for visitor links
    - **Property 12: Visitor names are clickable**
    - **Validates: Requirements 5.3**

  - [ ] 5.9 Write property test for visitor deduplication
    - **Property 13: Visitor deduplication**
    - **Validates: Requirements 5.5**

- [ ] 6. Implement DailyFortune component
  - [ ] 6.1 Create DailyFortune.jsx component
    - Display "Today's fortune:" label
    - Show fortune message from getDailyFortune
    - Style to match Orkut aesthetic
    - _Requirements: 6.1_

  - [ ] 6.2 Integrate fortune generation
    - Call getDailyFortune with userId and current date
    - Cache fortune in component state
    - Ensure same fortune shown for same day
    - _Requirements: 6.2, 6.3_

  - [ ] 6.3 Write property test for fortune display
    - **Property 14: Fortune is always displayed**
    - **Validates: Requirements 6.1**

  - [ ] 6.4 Write property test for fortune validity
    - **Property 15: Fortune comes from predefined list**
    - **Validates: Requirements 6.2**

  - [ ] 6.5 Write property test for fortune consistency
    - **Property 16: Fortune is consistent within a day**
    - **Validates: Requirements 6.3**

- [ ] 7. Implement FriendSuggestions component
  - [ ] 7.1 Create FriendSuggestions.jsx component
    - Display "friend suggestions by orkut" heading
    - Create carousel container for suggestions
    - Add navigation arrows for scrolling
    - _Requirements: 7.1_

  - [ ] 7.2 Implement suggestion cards
    - Display user profile picture
    - Show user name
    - Add "add as friend" button
    - Include close/dismiss icon
    - _Requirements: 7.3, 7.5_

  - [ ] 7.3 Fetch and filter friend suggestions
    - Call fetchFriendSuggestions API
    - Ensure no existing friends in suggestions
    - Handle empty suggestions with message
    - _Requirements: 7.2, 7.8_

  - [ ] 7.4 Implement add friend functionality
    - Send friend request on button click
    - Update button state to "request sent"
    - Disable button after click
    - _Requirements: 7.4_

  - [ ] 7.5 Implement dismiss functionality
    - Remove suggestion from carousel on close click
    - Update visible suggestions
    - _Requirements: 7.5_

  - [ ] 7.6 Implement carousel navigation
    - Add left/right arrow click handlers
    - Scroll to show next/previous suggestions
    - Hide arrows when fewer than 4 suggestions
    - Show 4 suggestions at a time
    - _Requirements: 7.6, 7.7_

  - [ ] 7.7 Write property test for suggestions exclusion
    - **Property 17: Suggestions exclude existing friends**
    - **Validates: Requirements 7.2**

  - [ ] 7.8 Write property test for suggestion completeness
    - **Property 18: Suggestion cards are complete**
    - **Validates: Requirements 7.3**

  - [ ] 7.9 Write property test for add friend state
    - **Property 19: Add friend updates state**
    - **Validates: Requirements 7.4**

  - [ ] 7.10 Write property test for dismiss removal
    - **Property 20: Dismissing removes suggestion**
    - **Validates: Requirements 7.5**

  - [ ] 7.11 Write property test for carousel navigation
    - **Property 21: Carousel navigation advances view**
    - **Validates: Requirements 7.6**

- [ ] 8. Integrate all components in Home
  - [x] 8.1 Compose Home component layout
    - Add WelcomeSection at top
    - Add ActivityStats below welcome
    - Add ProfileAnalytics section
    - Add DailyFortune section
    - Add FriendSuggestions at bottom
    - Apply proper spacing and styling
    - _Requirements: All_

  - [x] 8.2 Implement data fetching orchestration
    - Fetch all data on Home component mount
    - Handle loading states for each section
    - Handle errors gracefully
    - Show partial content if some fetches fail
    - _Requirements: All_

  - [x] 8.3 Add error boundaries
    - Wrap sections in error boundaries
    - Display fallback UI for failed sections
    - Log errors to console
    - _Requirements: All_

- [ ] 9. Add responsive styling and polish
  - [ ] 9.1 Implement mobile responsive layout
    - Stack sections vertically on mobile
    - Adjust font sizes for readability
    - Make carousel touch-friendly
    - Test on various screen sizes
    - _Requirements: All_

  - [ ] 9.2 Add loading states
    - Show skeleton loaders for each section
    - Display loading indicators during data fetch
    - Ensure smooth transitions
    - _Requirements: All_

  - [ ] 9.3 Enhance accessibility
    - Add ARIA labels to interactive elements
    - Ensure keyboard navigation works
    - Add alt text to all images
    - Test with screen reader
    - _Requirements: All_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
