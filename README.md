# Orkut Clone - A Nostalgic Social Media Recreation

A full-stack clone of the classic Orkut social media platform that was popular in Brazil and India during the late 2000s and early 2010s. This project recreates the iconic interface and features of Orkut using modern React technology.


## 🎨 Features

This Orkut clone includes the following classic features:

### ✅ Implemented Features

- **Home Page** - Classic Orkut homepage with welcome message and status updates
- **Friend Suggestions** - Orkut's signature friend recommendation system
- **Friends List** - View all your friends with online status indicators
- **Scrapbook** - Leave and view scraps (messages) on profiles
- **Communities** - Browse, create, and join communities
- **Photo Albums** - Upload and organize photos in albums
- **Testimonials** - Write and receive testimonials with ratings
- **Profile Management** - View and edit profile information
- **Status Updates** - Share what's on your mind
- **Online Status** - See who's online, away, busy, or offline

### 🎨 Design Features

- **Authentic Orkut Styling** - Exact replica of the classic blue header and pink logo
- **Responsive Layout** - Three-column layout (sidebar, main content, friends panel)
- **Classic Color Scheme** - Original Orkut blue (#5e82c5) and pink (#ed2590)
- **Unsplash Integration** - High-quality images from Unsplash
- **Smooth Animations** - Hover effects and transitions
- **Status Indicators** - Green (online), Orange (away), Red (busy), Gray (offline)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Orkut
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
Orkut/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Top navigation bar
│   │   ├── Sidebar.jsx             # Left sidebar with profile
│   │   ├── MainContent.jsx         # Main content area
│   │   ├── RightSidebar.jsx        # Friends list sidebar
│   │   ├── Scrapbook.jsx           # Scrapbook page
│   │   ├── Scrapbook.css
│   │   ├── Communities.jsx         # Communities page
│   │   ├── Communities.css
│   │   ├── Photos.jsx              # Photo albums page
│   │   ├── Photos.css
│   │   ├── Testimonials.jsx        # Testimonials page
│   │   └── Testimonials.css
│   ├── App.jsx                     # Main app component with routing
│   ├── App.css                     # Main styling
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Entry point
├── package.json
└── README.md
```

## 🎯 Usage

### Navigation

- **Home** - View your profile summary and friend suggestions
- **Profile** - View and edit your profile
- **Scrapbook** - Read and write scraps
- **Friends** - Manage your friends list
- **Communities** - Browse and join communities

### Features Guide

#### Adding Friends
1. View friend suggestions on the homepage
2. Click "add as friend" button
3. Friend will be added to your friends list

#### Creating Communities
1. Navigate to Communities page
2. Click "Create Community" button
3. Fill in community details
4. Click "Create" to publish

#### Uploading Photos
1. Go to Photos page
2. Click "Upload Photos" button
3. Select an album
4. Choose photos to upload

#### Writing Testimonials
1. Visit Testimonials page
2. Click "Write Testimonial" button
3. Write your message and rate the person
4. Submit the testimonial

## 🛠️ Technologies Used

- **React** - Frontend framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties
- **Unsplash** - High-quality images

## 🎨 Color Palette

The classic Orkut color scheme:

- **Primary Blue**: `#5e82c5` - Header and buttons
- **Pink Logo**: `#ed2590` - Orkut branding
- **Light Blue**: `#d6dff7` - Backgrounds
- **Border Blue**: `#c3d9ff` - Borders and dividers
- **Link Blue**: `#0063dc` - Links and interactive elements

## 📱 Responsive Design

The application is responsive and adapts to different screen sizes:

- **Desktop** (1024px+): Full three-column layout
- **Tablet** (768px-1023px): Simplified layout
- **Mobile** (<768px): Single column, mobile-optimized

## 🔮 Future Enhancements

Potential features to add:

- [ ] User authentication and login
- [ ] Backend API integration
- [ ] Real-time messaging
- [ ] Community forums
- [ ] Event creation and management
- [ ] Video uploads
- [ ] Advanced search functionality
- [ ] Privacy settings
- [ ] Notifications system
- [ ] Mobile app version

## 📝 License

This project is created for educational and nostalgic purposes only. Orkut was a trademark of Google Inc.

## 🙏 Acknowledgments

- Original Orkut design by Google
- Images from Unsplash
- Inspired by the memories of millions of Orkut users from Brazil and India

## 👥 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and nostalgia for the golden age of social media**
