import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Profile.css'

function Profile() {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentUser] = useState(JSON.parse(localStorage.getItem('profile')))
    const [requestSent, setRequestSent] = useState(false)

    useEffect(() => {
        const getUserData = async () => {
            const currentUserId = currentUser?.result?.id || currentUser?.id
            // Determine which user ID to fetch: URL param or current user
            const targetUserId = id || currentUserId

            console.log('Profile component - targetUserId:', targetUserId)

            if (targetUserId) {
                try {
                    const userData = await api.fetchUser(targetUserId)
                    console.log('Profile component - fetched userData:', userData)

                    if (userData) {
                        setProfile(userData)
                    } else {
                        // Only fallback to localStorage if we are looking for our own profile
                        if (!id) {
                            console.log('Profile component - API returned null, using localStorage')
                            setProfile(currentUser?.result || currentUser)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error)
                    if (!id) {
                        setProfile(currentUser?.result || currentUser)
                    }
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        getUserData()
    }, [id, currentUser])

    const handleAddFriend = async () => {
        const currentUserId = currentUser?.result?.id || currentUser?.id
        if (!currentUserId) return

        try {
            await api.sendFriendRequest(currentUserId, profile.id)
            setRequestSent(true)
            alert('Friend request sent!')
        } catch (error) {
            console.error('Error sending friend request:', error)
            alert('Failed to send friend request')
        }
    }

    if (loading) return <div>Loading...</div>
    if (!currentUser && !id) return <div className="profile-login-msg">Please login to view profile</div>

    // Use fetched profile or fallback to localStorage user data (only if own profile)
    const displayProfile = profile || (!id ? (currentUser?.result || currentUser) : {}) || {}
    console.log('Profile component - displayProfile:', displayProfile)

    // More lenient check - show profile if we have at least an id
    if (!displayProfile.id && !displayProfile.name && !displayProfile.email) {
        console.error('Profile component - No valid profile data found')
        return <div>Profile data not available.</div>
    }

    // Use actual friends and communities data from profile
    const friends = displayProfile.friends || []
    const communities = displayProfile.communities || []

    const currentUserId = currentUser?.result?.id || currentUser?.id
    const isOwnProfile = !id || (currentUserId === displayProfile.id)

    return (
        <div className="profile-container">
            <div className="profile-header-section">
                <h2>Profile</h2>
                {isOwnProfile && (
                    <Link to="/profile/edit" className="edit-profile-btn">edit profile</Link>
                )}
            </div>

            <div className="profile-top-section">
                <div className="profile-image-box">
                    <img src={displayProfile.image || api.DEFAULT_AVATAR} alt={displayProfile.name} className="profile-main-image" />
                    <div className="profile-actions-list">
                        {!isOwnProfile && (
                            <button
                                className={`action-btn ${requestSent ? 'disabled' : ''}`}
                                onClick={handleAddFriend}
                                disabled={requestSent}
                            >
                                {requestSent ? 'request sent' : 'add as friend'}
                            </button>
                        )}
                        <button className="action-btn">write scrap</button>
                        <button className="action-btn">give testimonial</button>
                        <button className="action-btn">forward to friend</button>
                        <button className="action-btn">add to favorites</button>
                        <button className="action-btn">block user</button>
                    </div>
                </div>

                <div className="profile-info-box">
                    <div className="profile-name-header">
                        <h3>{displayProfile.name}</h3>
                        <span className="online-status">online now!</span>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">scraps <span className="stat-count">{displayProfile.scraps_count || 0}</span></div>
                        <div className="stat-item">photos <span className="stat-count">{displayProfile.photos_count || 0}</span></div>
                        <div className="stat-item">videos <span className="stat-count">{displayProfile.videos_count || 0}</span></div>
                        <div className="stat-item">fans <span className="stat-count">{displayProfile.fans_count || 0}</span></div>
                    </div>

                    <div className="profile-details-grid">
                        <div className="detail-row">
                            <span className="detail-label">trusty:</span>
                            <span className="detail-value">{displayProfile.trusty_count || 0}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">cool:</span>
                            <span className="detail-value">{displayProfile.cool_count || 0}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">sexy:</span>
                            <span className="detail-value">{displayProfile.sexy_count || 0}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">birthday:</span>
                            <span className="detail-value">{displayProfile.birth_date || 'Not set'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">gender:</span>
                            <span className="detail-value">{displayProfile.gender || 'Not set'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">country:</span>
                            <span className="detail-value">{displayProfile.country || 'Not set'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Me Section - Personal Details */}
            {(displayProfile.about || displayProfile.relationship_status || displayProfile.interests) && (
                <div className="profile-about-section">
                    <div className="box-header">
                        <h4>about me</h4>
                    </div>
                    <div className="about-content">
                        {displayProfile.about && (
                            <div className="about-item">
                                <span className="about-label">About Me:</span>
                                <p className="about-text">{displayProfile.about}</p>
                            </div>
                        )}
                        {displayProfile.relationship_status && (
                            <div className="about-item">
                                <span className="about-label">Relationship Status:</span>
                                <p className="about-text">{displayProfile.relationship_status}</p>
                            </div>
                        )}
                        {displayProfile.interests && (
                            <div className="about-item">
                                <span className="about-label">Interests:</span>
                                <p className="about-text">{displayProfile.interests}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="profile-bottom-section">
                {/* Friends Box */}
                <div className="profile-friends-box">
                    <div className="box-header">
                        <h4>friends ({friends.length})</h4>
                        <a href="/friends" className="view-all">view all</a>
                    </div>
                    <div className="friends-grid">
                        {friends.length > 0 ? (
                            friends.map(friend => (
                                <div key={friend.id} className="friend-item">
                                    <img src={friend.image} alt={friend.name} />
                                    <span>{friend.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No friends yet. Start connecting with people!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Communities Box */}
                <div className="profile-communities-box">
                    <div className="box-header">
                        <h4>communities ({communities.length})</h4>
                        <a href="/communities" className="view-all">view all</a>
                    </div>
                    <div className="communities-list">
                        {communities.length > 0 ? (
                            communities.map(community => (
                                <div key={community.id} className="community-item">
                                    <img src={community.image} alt={community.name} />
                                    <span>{community.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No communities yet. Join or create one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
