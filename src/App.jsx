import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Home from './components/Home'
import MainContent from './components/MainContent'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Scrapbook from './components/Scrapbook'
import Photos from './components/Photos'
import Communities from './components/Communities'
import CommunityDetails from './components/CommunityDetails'
import Friends from './components/Friends'
import Testimonials from './components/Testimonials'
import Videos from './components/Videos'
import Messages from './components/Messages'
import SearchResults from './components/SearchResults'
import FriendRequests from './components/FriendRequests'
import ProfileVisitors from './components/ProfileVisitors'
import Settings from './components/Settings'
import Login from './components/Login'
import Register from './components/Register'
import './css/index.css'
import './css/App.css'
import './css/Home.css'
import './css/Login.css'
import './css/Profile.css'
import './css/Scrapbook.css'
import './css/Communities.css'
import './css/CommunityDetails.css'
import './css/Friends.css'
import './css/FriendRequests.css'
import './css/ProfileVisitors.css'
import './css/Settings.css'
import './css/Photos.css'
import './css/Videos.css'
import './css/Messages.css'
import './css/SearchResults.css'
import './css/Feed.css'
import './css/Testimonials.css'
import './css/Responsive.css'

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    // Handle public routes (Login/Register) separately
    if (location.pathname === '/login') {
        return <Login />;
    }
    if (location.pathname === '/register') {
        return <Register />;
    }

    // Redirect unauthenticated users to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Protected App Layout
    return (
        <div className="app-container">
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content-area">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                        <Route path="/scrapbook" element={<Scrapbook />} />
                        <Route path="/photos" element={<Photos />} />
                        <Route path="/videos" element={<Videos />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/friend-requests" element={<FriendRequests />} />
                        <Route path="/profile-visitors" element={<ProfileVisitors />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/communities" element={<Communities />} />
                        <Route path="/communities/:id" element={<CommunityDetails />} />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/testimonials" element={<Testimonials />} />
                        {/* Fallback for unknown routes */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <RightSidebar />
            </div>
        </div>
    )
}

export default App
