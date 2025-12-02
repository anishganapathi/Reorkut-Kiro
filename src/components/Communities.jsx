import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Communities.css'

function Communities() {
    const navigate = useNavigate()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: 'General',
        description: '',
        type: 'Public',
        location: '',
        image: ''
    })
    const [loading, setLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    // Static community data matching the screenshot
    const communities = [
        {
            id: 1,
            name: 'I Love San Francisco',
            category: 'Cities & Neighborhoods',
            members: '15,234 members',
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
        },
        {
            id: 2,
            name: 'Photography Lovers',
            category: 'Hobbies & Crafts',
            members: '45,678 members',
            image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
        },
        {
            id: 3,
            name: 'Tech Enthusiasts',
            category: 'Technology',
            members: '23,456 members',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        },
        {
            id: 4,
            name: 'Coffee Addicts',
            category: 'Food & Drink',
            members: '12,890 members',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        },
        {
            id: 5,
            name: 'Travel Junkies',
            category: 'Travel',
            members: '34,567 members',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        },
        {
            id: 6,
            name: 'Music Lovers',
            category: 'Music',
            members: '56,789 members',
            image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
        },
    ]

    const categories = [
        'General',
        'Cities & Neighborhoods',
        'Hobbies & Crafts',
        'Technology',
        'Food & Drink',
        'Travel',
        'Music',
        'Sports',
        'Entertainment',
        'Education',
        'Business',
        'Health & Wellness'
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateCommunity = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            alert('Please enter a community name')
            return
        }

        if (!formData.description.trim()) {
            alert('Please enter a description')
            return
        }

        setLoading(true)
        try {
            const newCommunity = await api.createCommunity({
                ...formData,
                owner_id: userId,
                created_at: new Date().toISOString()
            })

            alert('Community created successfully!')
            setShowCreateModal(false)
            setFormData({
                name: '',
                category: 'General',
                description: '',
                type: 'Public',
                location: '',
                image: ''
            })

            // Navigate to the new community
            if (newCommunity?.id) {
                navigate(`/communities/${newCommunity.id}`)
            }
        } catch (error) {
            console.error('Error creating community:', error)
            alert('Failed to create community. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="communities-container">
            <div className="communities-header">
                <div className="communities-title-bar">
                    <h2 className="communities-title">My Communities</h2>
                    <a
                        href="#"
                        className="create-community-btn"
                        onClick={(e) => {
                            e.preventDefault()
                            setShowCreateModal(true)
                        }}
                    >
                        Create Community
                    </a>
                </div>

                <div className="communities-grid">
                    {communities.map((community) => (
                        <div key={community.id} className="community-card">
                            <img
                                src={community.image}
                                alt={community.name}
                                className="community-image"
                            />
                            <div className="community-info">
                                <a href="#" className="community-name" onClick={(e) => { e.preventDefault(); navigate(`/communities/${community.id}`) }}>{community.name}</a>
                                <div className="community-category">{community.category}</div>
                                <div className="community-members">{community.members}</div>
                                <div className="community-actions">
                                    <button className="community-btn" onClick={() => navigate(`/communities/${community.id}`)}>Visit</button>
                                    <button className="community-btn community-btn-leave">Leave</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Community Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Community</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateCommunity} className="create-community-form">
                            <div className="form-group">
                                <label>Community Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter community name"
                                    maxLength="100"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your community..."
                                    rows="4"
                                    maxLength="500"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                    <option value="Moderated">Moderated</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., San Francisco, CA or Global"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Community'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Communities
