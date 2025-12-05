# Technology Stack

## Frontend

- **React 19.2.0**: UI framework with functional components and hooks
- **React Router DOM 7.9.6**: Client-side routing
- **Vite 7.2.4**: Build tool and development server
- **CSS3**: Component-scoped stylesheets with custom properties

## Backend & Services

- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS) policies
  - Storage buckets (for avatars)
  - Real-time capabilities
- **Google Generative AI**: AI service integration
- **Hugging Face Inference**: ML model integration
- **Axios**: HTTP client for API requests

## Development Tools

- **@vitejs/plugin-react**: React support for Vite
- **ES Modules**: Modern JavaScript module system

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Required environment variables (stored in `.env`):
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Database

PostgreSQL via Supabase with schema defined in `SCHEMA.sql`. Key tables include:
- `profiles`: User profile data
- `scraps`: Scrapbook messages
- `communities`: Community data
- `friendships`: Friend relationships
- `friend_requests`: Pending friend requests
- `testimonials`: User testimonials
- `messages`: Private messages
- `videos`: Video uploads
- `profile_visits`: Profile visitor tracking
- `community_members`: Community membership

Storage bucket `avatars` is used for profile images.
