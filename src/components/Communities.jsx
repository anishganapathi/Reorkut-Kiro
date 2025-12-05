import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Communities.css'

function Communities() {
    const navigate = useNavigate()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [myCommunities, setMyCommunities] = useState([])
    const [exploreCommunities, setExploreCommunities] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        category: 'General',
        description: '',
        type: 'Public',
        location: '',
        image: ''
    })

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

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

    useEffect(() => {
        fetchData()
    }, [userId])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [myComms, allComms] = await Promise.all([
                userId ? api.fetchUserCommunities(userId) : Promise.resolve([]),
                api.fetchCommunities()
            ])
            setMyCommunities(myComms || [])

            // Filter out my communities from explore list
            const myIds = new Set((myComms || []).map(c => c.id))
            const others = (allComms || []).filter(c => !myIds.has(c.id))
            setExploreCommunities(others)
        } catch (error) {
            console.error('Error fetching communities:', error)
        } finally {
            setLoading(false)
        }
    }

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

        try {
            const newCommunity = await api.createCommunity({
                ...formData,
                owner_id: userId,
                created_at: new Date().toISOString()
            })

            // Auto-join the creator
            await api.joinCommunity(userId, newCommunity.id)

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

            // Refresh lists
            fetchData()

            // Navigate to the new community
            if (newCommunity?.id) {
                navigate(`/communities/${newCommunity.id}`)
            }
        } catch (error) {
            console.error('Error creating community:', error)
            alert('Failed to create community. Please try again.')
        }
    }

    return (
        <div className="communities-container">
            <div className="communities-header">
                <div className="communities-title-bar">
                    <h2 className="communities-title">Communities</h2>
                    <a
                        href="#"
                        className="create-community-btn"
                        onClick={(e) => {
                            e.preventDefault()
                            if (!userId) {
                                alert('Please login to create a community')
                                return
                            }
                            setShowCreateModal(true)
                        }}
                    >
                        Create Community
                    </a>
                </div>

                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading communities...</div>
                ) : (
                    <>
                        {/* My Communities Section */}
                        {myCommunities.length > 0 && (
                            <div className="communities-section">
                                <h3 className="section-title" style={{ marginTop: '0', marginBottom: '15px', color: '#6d84b4', borderBottom: '1px solid #dfe6ef', paddingBottom: '5px' }}>My Communities</h3>
                                <div className="communities-grid">
                                    {myCommunities.map((community) => (
                                        <div key={community.id} className="community-card">
                                            <img
                                                src={community.image || 'https://via.placeholder.com/150'}
                                                alt={community.name}
                                                className="community-image"
                                            />
                                            <div className="community-info">
                                                <a href="#" className="community-name" onClick={(e) => { e.preventDefault(); navigate(`/communities/${community.id}`) }}>{community.name}</a>
                                                <div className="community-category">{community.category}</div>
                                                <div className="community-actions">
                                                    <button className="community-btn" onClick={() => navigate(`/communities/${community.id}`)}>Visit</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Explore Section */}
                        <div className="communities-section" style={{ marginTop: '30px' }}>
                            <h3 className="section-title" style={{ marginTop: '0', marginBottom: '15px', color: '#6d84b4', borderBottom: '1px solid #dfe6ef', paddingBottom: '5px' }}>
                                {myCommunities.length > 0 ? 'Explore Communities' : 'All Communities'}
                            </h3>
                            {exploreCommunities.length === 0 ? (
                                <div style={{ padding: '20px', color: '#666' }}>No other communities found. Create one!</div>
                            ) : (
                                <div className="communities-grid">
                                    {exploreCommunities.map((community) => (
                                        <div key={community.id} className="community-card">
                                            <img
                                                src={community.image || 'https://via.placeholder.com/150'}
                                                alt={community.name}
                                                className="community-image"
                                            />
                                            <div className="community-info">
                                                <a href="#" className="community-name" onClick={(e) => { e.preventDefault(); navigate(`/communities/${community.id}`) }}>{community.name}</a>
                                                <div className="community-category">{community.category}</div>
                                                <div className="community-actions">
                                                    <button className="community-btn" onClick={() => navigate(`/communities/${community.id}`)}>View</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
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
