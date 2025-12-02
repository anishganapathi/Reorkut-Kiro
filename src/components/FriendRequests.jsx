import React, { useState, useEffect } from 'react'
import * as api from '../backend/api'
import '../css/FriendRequests.css'

function FriendRequests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const data = await api.fetchFriendRequests(userId)
            setRequests(data || [])
        } catch (error) {
            console.error('Error fetching friend requests:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAccept = async (requestId) => {
        try {
            await api.acceptFriendRequest(requestId)
            alert('Friend request accepted!')
            fetchRequests()
        } catch (error) {
            console.error('Error accepting request:', error)
            alert('Failed to accept request')
        }
    }

    const handleReject = async (requestId) => {
        try {
            await api.rejectFriendRequest(requestId)
            alert('Friend request rejected')
            fetchRequests()
        } catch (error) {
            console.error('Error rejecting request:', error)
            alert('Failed to reject request')
        }
    }

    return (
        <div className="friend-requests-container">
            <div className="requests-header">
                <h2>Friend Requests</h2>
                <span className="requests-count">({requests.length} pending)</span>
            </div>

            {loading ? (
                <div className="loading">Loading requests...</div>
            ) : requests.length === 0 ? (
                <div className="empty-state">No pending friend requests</div>
            ) : (
                <div className="requests-list">
                    {requests.map((request) => (
                        <div key={request.id} className="request-card">
                            <img
                                src={request.sender?.image || api.DEFAULT_AVATAR}
                                alt={request.sender?.name}
                                className="request-avatar"
                            />
                            <div className="request-info">
                                <div className="request-name">{request.sender?.name || 'Unknown'}</div>
                                <div className="request-location">
                                    {request.sender?.city}, {request.sender?.country}
                                </div>
                                <div className="request-date">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="accept-btn"
                                    onClick={() => handleAccept(request.id)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="reject-btn"
                                    onClick={() => handleReject(request.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FriendRequests
