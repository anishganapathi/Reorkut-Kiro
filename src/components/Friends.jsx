import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Friends.css'

function Friends() {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        const getFriends = async () => {
            if (userId) {
                try {
                    const data = await api.fetchFriends(userId)
                    setFriends(data || [])
                } catch (error) {
                    console.error('Error fetching friends:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        getFriends()
    }, [userId])

    if (loading) return <div className="loading">Loading friends...</div>

    return (
        <div className="friends-container">
            <div className="friends-header">
                <h2 className="friends-title">My Friends ({friends.length})</h2>

                {friends.length === 0 ? (
                    <div className="empty-state">No friends yet. Search for people to add them!</div>
                ) : (
                    <div className="friends-grid">
                        {friends.map((friend) => (
                            <div key={friend.id} className="friend-card">
                                <img
                                    src={friend.image || api.DEFAULT_AVATAR}
                                    alt={friend.name}
                                    className="friend-avatar"
                                />
                                <Link to={`/profile/${friend.id}`} className="friend-name">{friend.name}</Link>
                                <div className="friend-mutual">
                                    {friend.city && friend.country ? `${friend.city}, ${friend.country}` : (friend.country || '')}
                                </div>
                                <div className="friend-actions">
                                    <Link to={`/messages?to=${friend.id}`} className="friend-btn">Send Message</Link>
                                    <Link to={`/profile/${friend.id}`} className="friend-btn">View Profile</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Friends
