import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/ProfileVisitors.css'

function ProfileVisitors() {
    const [visitors, setVisitors] = useState([])
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        fetchVisitors()
    }, [])

    const fetchVisitors = async () => {
        try {
            const data = await api.fetchProfileVisitors(userId, 20) // Get last 20 visitors
            setVisitors(data || [])
        } catch (error) {
            console.error('Error fetching profile visitors:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatVisitTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="profile-visitors-container">
            <div className="visitors-header">
                <h2>Who Viewed My Profile</h2>
                <span className="visitors-count">({visitors.length} recent visitors)</span>
            </div>

            {loading ? (
                <div className="loading">Loading visitors...</div>
            ) : visitors.length === 0 ? (
                <div className="empty-state">
                    <p>No one has visited your profile yet.</p>
                    <p className="empty-hint">Share your profile link to get more visitors!</p>
                </div>
            ) : (
                <div className="visitors-grid">
                    {visitors.map((visitor) => (
                        <div key={visitor.id} className="visitor-card">
                            <Link to={`/profile/${visitor.visitor_id}`} className="visitor-link">
                                <img
                                    src={visitor.visitor?.image || 'https://via.placeholder.com/80'}
                                    alt={visitor.visitor?.name}
                                    className="visitor-avatar"
                                />
                                <div className="visitor-info">
                                    <div className="visitor-name">{visitor.visitor?.name || 'Unknown'}</div>
                                    <div className="visitor-location">
                                        {visitor.visitor?.city}, {visitor.visitor?.country}
                                    </div>
                                    <div className="visitor-time">
                                        {formatVisitTime(visitor.visited_at)}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfileVisitors
