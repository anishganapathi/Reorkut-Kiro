# Product Overview

This is an Orkut clone - a nostalgic recreation of the classic social media platform that was popular in Brazil and India during the late 2000s and early 2010s. The project faithfully recreates the iconic interface and core features of Orkut using modern web technologies.

## Core Features

- **Social Networking**: Friend connections, friend requests, and friend suggestions
- **Scrapbook**: Leave and view scraps (messages) on user profiles
- **Communities**: Browse, create, join, and participate in communities
- **Media Sharing**: Photo albums and video uploads
- **Testimonials**: Write and receive testimonials with ratings
- **Messaging**: Private messaging between users
- **Profile Management**: View and edit user profiles with customizable information
- **Profile Visitors**: Track who has visited your profile
- **Search**: Find users and communities

## Design Philosophy

The application maintains the authentic Orkut aesthetic with:
- Classic blue header (#5e82c5) and pink logo (#ed2590)
- Three-column layout (sidebar, main content, friends panel)
- Original color scheme and visual styling
- Status indicators (online, away, busy, offline)
- Responsive design for desktop, tablet, and mobile

## Authentication

The app uses Supabase authentication with email/password. All routes except `/login` and `/register` require authentication. User data is stored in localStorage and checked on app load.
