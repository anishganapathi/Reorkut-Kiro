import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/RightSidebar.css'

function RightSidebar() {
    const [friends, setFriends] = useState([])
    const [communities, setCommunities] = useState([])
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Fetch real friends data
            const friendsData = await api.fetchFriends(userId)
            setFriends(friendsData?.slice(0, 8) || []) // Show first 8 friends

            // Fetch real communities data
            const communitiesData = await api.fetchUserCommunities(userId)
            setCommunities(communitiesData?.slice(0, 3) || []) // Show first 3 communities
        } catch (error) {
            console.error('Error fetching sidebar data:', error)
            // Keep empty arrays on error
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="right-sidebar-container">
                <div className="right-sidebar-box">
                    <div className="loading-sidebar">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="right-sidebar-container">
            {/* Friends Box */}
            <div className="right-sidebar-box">
                <div className="right-sidebar-header">
                    <div>
                        <span className="right-sidebar-title">my friends </span>
                        <span className="right-sidebar-count">({friends.length})</span>
                    </div>
                    <Link to="/friends" className="right-sidebar-link">view all</Link>
                </div>
                <div className="right-sidebar-content">
                    {friends.length === 0 ? (
                        <div className="empty-sidebar">No friends yet</div>
                    ) : (
                        <div className="friends-grid-sidebar">
                            {friends.map((friend) => (
                                <div key={friend.id} className="friend-item-sidebar">
                                    <Link to={`/profile/${friend.id}`}>
                                        <img
                                            src={friend.image || api.DEFAULT_AVATAR}
                                            alt={friend.name}
                                            className="friend-avatar-sidebar"
                                            onError={(e) => { e.target.onerror = null; e.target.src = api.DEFAULT_AVATAR }}
                                        />
                                    </Link>
                                    <Link to={`/profile/${friend.id}`} className="friend-name-sidebar">
                                        {friend.name}
                                    </Link>
                                    <div className="friend-mutual-sidebar">
                                        {friend.mutual_friends ? `(${friend.mutual_friends})` : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="sidebar-actions">
                    <Link to="/friends" className="right-sidebar-link">view all</Link>
                    <span className="right-sidebar-link">|</span>
                    <Link to="/friend-requests" className="right-sidebar-link">manage</Link>
                </div>
            </div>

            {/* Communities Box */}
            <div className="right-sidebar-box">
                <div className="right-sidebar-header">
                    <div>
                        <span className="right-sidebar-title">my communities </span>
                        <span className="right-sidebar-count">({communities.length})</span>
                    </div>
                    <Link to="/communities" className="right-sidebar-link">view all</Link>
                </div>
                <div className="right-sidebar-content">
                    {communities.length === 0 ? (
                        <div className="empty-sidebar">No communities yet</div>
                    ) : (
                        <div className="communities-grid-sidebar">
                            {communities.map((community) => (
                                <div key={community.id} className="community-item-sidebar">
                                    <Link to={`/communities/${community.id}`}>
                                        <img
                                            src={community.image || 'https://via.placeholder.com/60'}
                                            alt={community.name}
                                            className="community-image-sidebar"
                                        />
                                    </Link>
                                    <Link to={`/communities/${community.id}`} className="community-name-sidebar">
                                        {community.name}
                                    </Link>
                                    <div className="community-members-sidebar">
                                        ({community.members_count || 0})
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="sidebar-actions">
                    <Link to="/communities" className="right-sidebar-link">view all</Link>
                    <span className="right-sidebar-link">|</span>
                    <Link to="/communities" className="right-sidebar-link">manage</Link>
                </div>
            </div>
        </div>
    )
}

export default RightSidebar
