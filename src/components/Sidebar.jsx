import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Sidebar.css'

function Sidebar() {
    const location = useLocation()
    const [user] = useState(JSON.parse(localStorage.getItem('profile')))
    const [counts, setCounts] = useState({
        friends: 0,
        requests: 0,
        scraps: 0,
        photos: 0,
        videos: 0,
        messages: 0,
        testimonials: 0
    })

    const userData = user?.result || user || {}
    const userId = userData.id

    useEffect(() => {
        const fetchCounts = async () => {
            if (!userId) return

            try {
                const [
                    friendsData,
                    requestsData,
                    videosData,
                    messagesData,
                    testimonialsData,
                    albumsData,
                    scrapsData
                ] = await Promise.all([
                    api.fetchFriends(userId),
                    api.fetchFriendRequests(userId),
                    api.fetchVideos(userId),
                    api.fetchMessages(userId),
                    api.fetchTestimonials(userId),
                    api.fetchPhotoAlbums(userId),
                    api.fetchScraps(userId)
                ])

                // Calculate total photos from albums
                const totalPhotos = albumsData?.reduce((acc, album) => acc + (album.photo_count || 0), 0) || 0

                setCounts({
                    friends: friendsData?.length || 0,
                    requests: requestsData?.length || 0,
                    scraps: scrapsData?.length || 0,
                    photos: totalPhotos,
                    videos: videosData?.length || 0,
                    messages: messagesData?.length || 0,
                    testimonials: testimonialsData?.length || 0
                })
            } catch (error) {
                console.error('Error fetching sidebar counts:', error)
            }
        }

        fetchCounts()
    }, [userId])

    const name = userData.name || userData.email || 'User'
    const locationText = userData.city && userData.country
        ? `${userData.city}, ${userData.country}`
        : userData.country || 'Earth'
    const image = userData.image || api.DEFAULT_AVATAR

    const isActive = (path) => location.pathname === path

    return (
        <div className="sidebar-container">
            <div className="content-box sidebar-profile-card">
                <div className="sidebar-image-frame">
                    <img src={image} alt={name} className="sidebar-image" />
                </div>

                <div className="sidebar-links-row">
                    <Link to="/profile/edit">edit profile</Link>
                    <Link to="/privacy">privacy</Link>
                </div>

                <div className="sidebar-user-info">
                    <div className="sidebar-name">{name}</div>
                    <div className="sidebar-location">{locationText}</div>
                </div>

                <div className="sidebar-menu">
                    <Link to="/scrapbook" className="sidebar-menu-item">
                        <span className="menu-icon">📝</span> scraps <span className="menu-count">({counts.scraps})</span>
                    </Link>
                    <Link to="/photos" className="sidebar-menu-item">
                        <span className="menu-icon">📷</span> photos <span className="menu-count">({counts.photos})</span>
                    </Link>
                    <Link to="/videos" className="sidebar-menu-item">
                        <span className="menu-icon">🎥</span> videos <span className="menu-count">({counts.videos})</span>
                    </Link>
                    <Link to="/messages" className="sidebar-menu-item">
                        <span className="menu-icon">✉️</span> messages <span className="menu-count">({counts.messages})</span>
                    </Link>
                    <Link to="/testimonials" className="sidebar-menu-item">
                        <span className="menu-icon">⭐</span> testimonials <span className="menu-count">({counts.testimonials})</span>
                    </Link>
                    <Link to="/friends" className="sidebar-menu-item">
                        <span className="menu-icon">👥</span> friends <span className="menu-count">({counts.friends})</span>
                    </Link>
                    <Link to="/friend-requests" className="sidebar-menu-item">
                        <span className="menu-icon">👋</span> friend requests <span className="menu-count">({counts.requests})</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
