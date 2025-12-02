import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/EditProfile.css'

function EditProfile() {
    const navigate = useNavigate()
    const [user] = useState(JSON.parse(localStorage.getItem('profile')))
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('general')
    const [imageFile, setImageFile] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        about: '',
        relationship_status: '',
        interests: '',
        image: ''
    })

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.result?.id || user?.id) {
                try {
                    const userId = user.result?.id || user.id
                    const data = await api.fetchUser(userId)
                    if (data) {
                        setFormData({
                            name: data.name || '',
                            about: data.about || '',
                            relationship_status: data.relationship_status || '',
                            interests: data.interests || '',
                            image: data.image || ''
                        })
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const userId = user.result?.id || user.id
            console.log('Updating profile for user:', userId)

            let imageUrl = formData.image

            if (imageFile) {
                console.log('Uploading new profile image...')
                imageUrl = await api.uploadProfileImage(imageFile, userId)
                console.log('Image uploaded successfully:', imageUrl)
            }

            const updatedData = {
                name: formData.name,
                about: formData.about,
                relationship_status: formData.relationship_status,
                interests: formData.interests,
                image: imageUrl
            }

            console.log('Updating user with data:', updatedData)

            const updatedUser = await api.updateUser(userId, updatedData)
            console.log('User updated successfully:', updatedUser)

            // Update local storage with the new image URL
            const newProfile = {
                ...user,
                result: {
                    ...user.result,
                    ...updatedUser,
                    image: imageUrl // Ensure image is included
                }
            }
            localStorage.setItem('profile', JSON.stringify(newProfile))
            console.log('Local storage updated')

            alert('Profile updated successfully!')
            navigate('/profile')
        } catch (error) {
            console.error("Error updating profile:", error)
            alert(`Failed to update profile: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="loading">Loading...</div>

    return (
        <div className="edit-profile-container">
            <div className="profile-header-section">
                <h2>Edit Profile</h2>
            </div>

            <div className="edit-profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </button>
                <button
                    className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    Personal
                </button>
            </div>

            <form onSubmit={handleSubmit} className="edit-profile-form">
                {activeTab === 'general' && (
                    <div className="tab-content">
                        <div className="form-group">
                            <label>Profile Picture:</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {formData.image && !imageFile && (
                                <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
                                    Current: <a href={formData.image} target="_blank" rel="noopener noreferrer">View Image</a>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Full Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {activeTab === 'personal' && (
                    <div className="tab-content">
                        <div className="form-group">
                            <label>About Me:</label>
                            <textarea name="about" value={formData.about} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Relationship Status:</label>
                            <select name="relationship_status" value={formData.relationship_status} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Single">Single</option>
                                <option value="In a relationship">In a relationship</option>
                                <option value="Married">Married</option>
                                <option value="It's complicated">It's complicated</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Interests:</label>
                            <textarea name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g., Music, Sports, Reading" />
                        </div>
                    </div>
                )}



                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <Link to="/profile" className="btn-cancel">Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default EditProfile
