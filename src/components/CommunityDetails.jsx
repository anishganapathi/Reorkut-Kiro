import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/CommunityDetails.css'

function CommunityDetails() {
    const { id } = useParams()
    const [community, setCommunity] = useState(null)
    const [isMember, setIsMember] = useState(false)
    const [loading, setLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    // Mock data - in a real app this would come from an API
    const communitiesData = [
        {
            id: 1,
            name: 'I Love San Francisco',
            category: 'Cities & Neighborhoods',
            members: '15,234',
            description: 'A community for everyone who loves the City by the Bay! Share your favorite spots, events, and memories of San Francisco.',
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
            owner: 'SF Native',
            created: 'Jan 20, 2004',
            type: 'Public',
            location: 'San Francisco, CA, US'
        },
        {
            id: 2,
            name: 'Photography Lovers',
            category: 'Hobbies & Crafts',
            members: '45,678',
            description: 'Discuss cameras, lenses, techniques, and share your best shots. All skill levels welcome!',
            image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
            owner: 'ShutterBug',
            created: 'Feb 15, 2004',
            type: 'Public',
            location: 'Global'
        },
        {
            id: 3,
            name: 'Tech Enthusiasts',
            category: 'Technology',
            members: '23,456',
            description: 'Latest gadgets, coding, AI, and everything tech. Join the discussion on the future of technology.',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
            owner: 'GeekSquad',
            created: 'Mar 10, 2004',
            type: 'Public',
            location: 'Silicon Valley, CA, US'
        },
        {
            id: 4,
            name: 'Coffee Addicts',
            category: 'Food & Drink',
            members: '12,890',
            description: 'Can\'t start your day without a cup of joe? This is the place for you. Discuss beans, brewing methods, and cafes.',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            owner: 'BaristaBob',
            created: 'Apr 05, 2004',
            type: 'Public',
            location: 'Seattle, WA, US'
        },
        {
            id: 5,
            name: 'Travel Junkies',
            category: 'Travel',
            members: '34,567',
            description: 'Share your travel stories, tips, and photos. Where are you going next?',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
            owner: 'Wanderlust',
            created: 'May 20, 2004',
            type: 'Public',
            location: 'Global'
        },
        {
            id: 6,
            name: 'Music Lovers',
            category: 'Music',
            members: '56,789',
            description: 'Rock, Pop, Jazz, Classical... whatever you listen to, let\'s talk about it. Share playlists and concert experiences.',
            image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
            owner: 'MelodyMaker',
            created: 'Jun 12, 2004',
            type: 'Public',
            location: 'London, UK'
        },
    ]

    const mockTopics = [
        { id: 101, title: 'Best place for weekend brunch?', author: 'Alice', replies: 42, lastPost: 'Today' },
        { id: 102, title: 'Anyone going to the meetup?', author: 'Bob', replies: 15, lastPost: 'Yesterday' },
        { id: 103, title: 'Hidden gems in the city', author: 'Charlie', replies: 89, lastPost: '2 days ago' },
        { id: 104, title: 'New member introduction', author: 'Dave', replies: 5, lastPost: '3 days ago' },
    ]

    const mockMembers = [
        { id: 1, name: 'Alice', image: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Bob', image: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, name: 'Charlie', image: 'https://i.pravatar.cc/150?u=3' },
        { id: 4, name: 'Dave', image: 'https://i.pravatar.cc/150?u=4' },
        { id: 5, name: 'Eve', image: 'https://i.pravatar.cc/150?u=5' },
        { id: 6, name: 'Frank', image: 'https://i.pravatar.cc/150?u=6' },
        { id: 7, name: 'Grace', image: 'https://i.pravatar.cc/150?u=7' },
        { id: 8, name: 'Heidi', image: 'https://i.pravatar.cc/150?u=8' },
    ]

    useEffect(() => {
        const found = communitiesData.find(c => c.id === parseInt(id))
        setCommunity(found)
    }, [id])

    const handleJoinLeave = async () => {
        if (!userId) {
            alert('Please login to join communities')
            return
        }

        setLoading(true)
        try {
            if (isMember) {
                await api.leaveCommunity(userId, parseInt(id))
                setIsMember(false)
                alert('Successfully left the community')
            } else {
                await api.joinCommunity(userId, parseInt(id))
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

    if (!community) {
        return <div className="loading">Loading community...</div>
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
