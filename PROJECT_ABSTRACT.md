# Reorkut | Bringing Back the Social Web's Golden Era

![Reorkut Banner Image](path/to/banner_image.png)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Replicate](https://img.shields.io/badge/Replicate-000000?style=for-the-badge&logo=replicate&logoColor=white)](https://replicate.com/)

---

## Executive Summary

Reorkut is a fully functional clone of Orkut, reimagined with today’s technologies. It is a blend of nostalgia and technical exploration, designed to revive the iconic experience of one of the earliest platforms that made the internet feel personal, friendly, and community-driven.

This project includes profiles, scraps, communities, testimonials, friend systems, real-time interactions, customizable themes, and a clean modern UI. It brings back the classic social experience in a fresh, responsive, and scalable form.

---

## Inspiration

Orkut was one of the earliest platforms that made the internet feel personal, friendly, and community-driven. We wanted to revive that iconic experience while showing how modern full-stack engineering can recreate a legacy platform from scratch. This project is not just a clone; it's a tribute to the era of genuine social connection.

---

## What Makes Reorkut Special

*   **Pixel-Perfect Nostalgia**: A responsive UI that faithfully recreates the original Orkut look and feel.
*   **Modern Core**: Built with React and Node.js for performance and scalability.
*   **AI-Enhanced**: Integrated with Replicate and Google Gemini for modern features like AI style transfer and content generation.
*   **Real-Time Interactions**: Seamless updates for scraps and messages.

---

## Screenshots

![Login Page](path/to/login_screenshot.png)
*The classic login experience.*

![Profile Page](path/to/profile_screenshot.png)
*User profiles with scraps, testimonials, and friends.*

![Communities](path/to/communities_screenshot.png)
*Vibrant communities and discussions.*

---

## How we built it

We rebuilt Orkut end-to-end using modern frameworks and best practices.

1.  **Frontend**: A responsive, pixel-perfect UI recreates the original look and feel using **React** and **Vite**.
2.  **Backend**: A scalable **Node.js** and **Express** backend handles authentication, posts, communities, messaging, and user interactions.
3.  **Real-time**: Implemented features to ensure seamless updates across the platform.
4.  **Database**: A clean **Supabase (PostgreSQL)** database structure supports user relationships and content management.
5.  **AI Integration**: Leveraged **Replicate** for image processing and **Gemini** for text generation.

Every component from profile pages to community discussions was redesigned and re-engineered from scratch.

---

## Architecture

![Architecture Diagram](https://i.postimg.cc/Xqmfb7j2/ARCH-drawio.png)

The system accepts requests via the Client (React App), which communicates with the Node.js/Express Server. The server manages authentication and data via Supabase, handles file storage with Cloudinary/Local storage, and delegates AI tasks to Replicate/Gemini APIs.

---

## Challenges we ran into

1.  **Nostalgic vs. Modern**: Re-creating the exact nostalgic UI while modernizing responsiveness.
2.  **Complex Relationships**: Managing complex user relationship models like scraps, testimonials, and communities.
3.  **Real-Time**: Ensuring real-time interactions without compromising performance.
4.  **Design Balance**: Balancing “retro design” with modern usability and accessibility.

---

## Accomplishments that we're proud of

1.  Successfully rebuilt a beloved platform from the ground up.
2.  Achieved a visually accurate and highly functional Orkut experience.
3.  Implemented a clean, scalable architecture that can grow like a real social network.
4.  Delivered a nostalgia-driven product that still feels modern and smooth.

---

## What we learned

We explored the complexities of social media engineering, from designing data models for interconnected users to implementing real-time communication features. We gained deeper insight into UI cloning, state management, and building large-scale, interactive applications.

---

## What's next for Orkut

**Bringing back the social web’s golden era.**

We plan to expand the experience with modern enhancements like better privacy controls, mobile apps, smarter content recommendations, and cloud scalability. The vision is to evolve this revival into a platform that honors Orkut’s legacy while embracing the future of social networking.

---

## Core Steps: Setup & Installation

Clone the Reorkut repo from GitHub:

```bash
git clone https://github.com/anishganapathi/reorkut.git
cd reorkut
```

### 1. Environment Setup

Create a `.env` file in the root directory and add the following keys:

```env
# AI & Media
REPLICATE_API_TOKEN=your_replicate_token
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database (Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

1.  Create a new project on **Supabase**.
2.  Navigate to the **SQL Editor** in your Supabase dashboard.
3.  Copy the contents of `DATABASE.sql` from this repository.
4.  Paste it into the SQL Editor and run it to set up all tables, RLS policies, and storage buckets.

### 3. Server Setup

The Node.js server handles AI processing and file uploads.

1.  Install server dependencies:
    ```bash
    npm install
    ```
2.  Start the backend server:
    ```bash
    node server.js
    ```
    *The server will run on http://localhost:5000*

### 4. Frontend App Setup

The configuration is built with Vite for fast development.

1.  Open a new terminal window.
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open http://localhost:5173 to view the app.

---

## License

MIT License - Open-sourced project.

## Acknowledgments

*   **Google**: For the original Orkut platform inspiration.
*   **Open Source Community**: For the tools and libraries that made this possible.
