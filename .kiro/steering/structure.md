# Project Structure

## Directory Organization

```
/
├── src/
│   ├── components/          # React components (one per feature/page)
│   ├── css/                 # Component-specific stylesheets
│   ├── backend/             # Backend integration layer
│   ├── App.jsx              # Main app with routing and auth logic
│   └── main.jsx             # React entry point
├── public/                  # Static assets
├── .kiro/                   # Kiro configuration and specs
├── SCHEMA.sql               # Database schema definition
└── package.json             # Dependencies and scripts
```

## Component Architecture

- **Layout Components**: `Header`, `Sidebar`, `RightSidebar` - persistent UI elements
- **Page Components**: Each major feature has its own component (e.g., `Home`, `Profile`, `Communities`)
- **Component-CSS Pairing**: Each component has a corresponding CSS file in `src/css/`
- **Routing**: All routes defined in `App.jsx` using React Router
- **Authentication Flow**: Public routes (`/login`, `/register`) vs protected routes (everything else)

## Backend Layer (`src/backend/`)

- **client.js**: Supabase client initialization
- **api.js**: All API functions organized by feature (auth, users, scraps, messages, friends, testimonials, communities, etc.)
- **aiService.js**: AI/ML service integrations

## Styling Conventions

- Component-specific CSS files named after components (e.g., `Home.css` for `Home.jsx`)
- Global styles in `index.css` and `style.css`
- Responsive styles in `Responsive.css`
- Classic Orkut color palette:
  - Primary Blue: `#5e82c5`
  - Pink Logo: `#ed2590`
  - Light Blue: `#d6dff7`
  - Border Blue: `#c3d9ff`
  - Link Blue: `#0063dc`

## State Management

- Local state with React hooks (`useState`, `useEffect`)
- User profile stored in `localStorage` as `'profile'` key
- Authentication state checked via Supabase client

## Import Conventions

- CSS imports in `App.jsx` (centralized)
- Component imports use relative paths
- Backend API functions imported from `src/backend/api.js`
- Supabase client imported from `src/backend/client.js`
