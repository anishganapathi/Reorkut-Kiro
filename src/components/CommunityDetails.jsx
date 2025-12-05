import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/CommunityDetails.css'

function CommunityDetails() {
    const { id } = useParams()
    const [community, setCommunity] = useState(null)
    const [isMember, setIsMember] = useState(false)
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    // Mock data for forum/members since we don't have full backend support yet
    const mockTopics = [
        { id: 101, title: 'Welcome to the community!', author: 'Admin', replies: 5, lastPost: 'Today' },
        { id: 102, title: 'General discussion', author: 'User1', replies: 12, lastPost: 'Yesterday' },
    ]

    const mockMembers = [
        { id: 1, name: 'Member 1', image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Member 2', image: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Member 3', image: 'https://via.placeholder.com/150' },
    ]

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            setLoading(true)
            try {
                if (!id) return;

                // Fetch community details
                const data = await api.fetchCommunity(id)
                setCommunity(data)

                // Check membership if user is logged in
                if (userId) {
                    const memberStatus = await api.checkMembership(userId, id)
                    setIsMember(memberStatus)
                }
            } catch (error) {
                console.error('Error fetching community details:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCommunityDetails()
    }, [id, userId])

    const handleJoinLeave = async () => {
        if (!userId) {
            alert('Please login to join communities')
            return
        }

        setLoading(true)
        try {
            if (isMember) {
                await api.leaveCommunity(userId, id)
                setIsMember(false)
                alert('Successfully left the community')
            } else {
                await api.joinCommunity(userId, id)
                setIsMember(true)
                alert('Successfully joined the community!')
            }
        } catch (error) {
            console.error('Error joining/leaving community:', error)
            alert('Failed to update membership. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Loading community...</div>
    }

    if (!community) {
        return <div className="loading">Community not found</div>
    }

    return (
        <div className="community-details-container">
            {/* Header Section */}
            <div className="community-header-section">
                <img src={community.image} alt={community.name} className="community-image-large" />
                <div className="community-header-info">
                    <h1 className="community-name-large">{community.name}</h1>

                    <div className="community-meta">
                        <span><strong>Category:</strong> {community.category}</span>
                        <span><strong>Type:</strong> {community.type}</span>
                    </div>

                    <div className="community-meta">
                        <span><strong>Owner:</strong> <a href="#" className="topic-author">{community.owner}</a></span>
                        <span><strong>Created:</strong> {community.created}</span>
                        <span><strong>Location:</strong> {community.location}</span>
                    </div>

                    <div className="community-description">
                        {community.description}
                    </div>

                    <div className="community-actions-bar">
                        <button
                            className="action-btn join-btn"
                            onClick={handleJoinLeave}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isMember ? 'unjoin' : 'join community')}
                        </button>
                        <button className="action-btn">invite friends</button>
                        <button className="action-btn">add to favorites</button>
                    </div>
                </div>
            </div>

            {/* Forum Section */}
            <div className="community-forum-section">
                <div className="section-header">
                    <span>Forum</span>
                    <a href="#" style={{ fontSize: '11px' }}>view all topics</a>
                </div>
                <table className="forum-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50%' }}>Topic</th>
                            <th style={{ width: '20%' }}>Author</th>
                            <th style={{ width: '10%' }}>Replies</th>
                            <th style={{ width: '20%' }}>Last Post</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTopics.map(topic => (
                            <tr key={topic.id}>
                                <td>
                                    <img src="https://img.icons8.com/silk/16/comments.png" alt="" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                    <a href="#" className="topic-link">{topic.title}</a>
                                </td>
                                <td><a href="#" className="topic-author">{topic.author}</a></td>
                                <td>{topic.replies}</td>
                                <td>{topic.lastPost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ padding: '10px', textAlign: 'right' }}>
                    <button className="action-btn">start new topic</button>
                </div>
            </div>

            {/* Members Section */}
            <div className="community-members-section">
                <div className="section-header">
                    <span>Members ({community.members})</span>
                    <a href="#" style={{ fontSize: '11px' }}>view all</a>
                </div>
                <div className="members-grid">
                    {mockMembers.map(member => (
                        <div key={member.id} className="member-thumbnail">
                            <img src={member.image} alt={member.name} className="member-img" />
                            <a href="#" className="member-name">{member.name}</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CommunityDetails
