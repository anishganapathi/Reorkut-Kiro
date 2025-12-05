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
    const [showAIStyles, setShowAIStyles] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [selectedStyle, setSelectedStyle] = useState('')
    const [aiGeneratedImages, setAiGeneratedImages] = useState({})

    // AI Style options
    const aiStyles = [
        { id: 'hollywood', name: "80's Hollywood", image: '/ai-profile-styles/hollywood.jpg' },
        { id: 'vaporwave', name: 'Vaporwave Style', image: '/ai-profile-styles/vaporwave.jpg' },
        { id: 'anime', name: 'Anime', image: '/ai-profile-styles/anime.jpg' },
        { id: 'sketch', name: 'Sketch', image: '/ai-profile-styles/sketch.jpg' }
    ]

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
            const file = e.target.files[0]
            setImageFile(file)
            setShowAIStyles(false)
            setSelectedStyle('')
            setAiGeneratedImages({})
        }
    }

    const handleAIStyleTransfer = async (styleId) => {
        if (!imageFile) {
            alert('Please select an image first!')
            return
        }

        setAiLoading(true)
        setSelectedStyle(styleId)

        try {
            console.log('Applying AI style:', styleId);

            // Check if we already generated this style
            if (aiGeneratedImages[styleId]) {
                setFormData({ ...formData, image: aiGeneratedImages[styleId] })
                setAiLoading(false)
                return
            }

            // Call the backend API
            const result = await api.applyAIStyleTransfer(imageFile, styleId);

            if (result.success && result.imageUrl) {
                console.log('API: AI Response Success. Image URL length:', result.imageUrl.length);
                // result.imageUrl is base64 string from backend
                const blobUrl = URL.createObjectURL(api.base64ToBlob(result.imageUrl));
                console.log('API: Blob URL created:', blobUrl);

                // Store the AI-generated image
                const updatedAiImages = {
                    ...aiGeneratedImages,
                    [styleId]: blobUrl
                };
                setAiGeneratedImages(updatedAiImages);

                // Update form with AI-generated image
                setFormData({ ...formData, image: blobUrl });
                console.log('AI style applied successfully');
            } else {
                throw new Error('AI processing failed');
            }
        } catch (error) {
            console.error("AI Style Transfer Error:", error);
            alert(`Failed to apply AI style: ${error.message}`);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const userId = user.result?.id || user.id
            console.log('Updating profile for user:', userId)

            let imageUrl = formData.image;

            // If we have an AI-generated image
            if (selectedStyle && aiGeneratedImages[selectedStyle]) {
                console.log('Processing AI-generated image for profile...');

                // Option 1: If you want to save the AI image to your server first
                const result = await api.applyAIStyleTransferAndSave(
                    imageFile,
                    selectedStyle,
                    userId
                );

                if (result.success && result.imageUrl) {
                    imageUrl = result.imageUrl;
                    console.log('AI image saved to server:', imageUrl);
                } else {
                    // Option 2: Use the blob URL directly (temporary)
                    console.warn('Using temporary AI image URL');
                }
            } else if (imageFile && !selectedStyle) {
                // Original image upload
                console.log('Uploading original profile image...');
                imageUrl = await api.uploadProfileImage(imageFile, userId);
                console.log('Image uploaded successfully:', imageUrl);
            }

            const updatedData = {
                name: formData.name,
                about: formData.about,
                relationship_status: formData.relationship_status,
                interests: formData.interests,
                image: imageUrl
            }

            console.log('Updating user with data:', updatedData);

            const updatedUser = await api.updateUser(userId, updatedData);
            console.log('User updated successfully:', updatedUser);

            // Update local storage
            const newProfile = {
                ...user,
                result: {
                    ...user.result,
                    ...updatedUser,
                    image: imageUrl
                }
            };
            localStorage.setItem('profile', JSON.stringify(newProfile));
            console.log('Local storage updated');

            alert('Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(`Failed to update profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Clean up blob URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(aiGeneratedImages).forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [aiGeneratedImages]);

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
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={aiLoading}
                            />

                            {imageFile && (
                                <div className="image-preview">
                                    <p>Selected Image Preview:</p>
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Selected"
                                        className="selected-image-preview"
                                    />
                                </div>
                            )}

                            {formData.image && !imageFile && !selectedStyle && (
                                <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
                                    Current: <a href={formData.image} target="_blank" rel="noopener noreferrer">View Image</a>
                                </div>
                            )}

                            {imageFile && (
                                <div className="ai-style-section">
                                    <button
                                        type="button"
                                        className="btn-ai-toggle"
                                        onClick={() => setShowAIStyles(!showAIStyles)}
                                        disabled={aiLoading}
                                    >
                                        {showAIStyles ? 'Hide AI Styles' : '🎨 Apply AI Style Transfer'}
                                    </button>

                                    {showAIStyles && (
                                        <div className="ai-styles-grid">
                                            <p className="ai-styles-title">Orkut-Style AI Themes:</p>
                                            <div className="styles-container">
                                                {aiStyles.map(style => (
                                                    <div
                                                        key={style.id}
                                                        className={`style-option ${selectedStyle === style.id ? 'selected' : ''}`}
                                                        onClick={() => !aiLoading && handleAIStyleTransfer(style.id)}
                                                    >
                                                        <img
                                                            src={style.image}
                                                            alt={style.name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/150?text=Style+Image';
                                                            }}
                                                        />
                                                        <span>{style.name}</span>
                                                        {aiLoading && selectedStyle === style.id && (
                                                            <div className="ai-loading">
                                                                <div className="spinner"></div>
                                                                Processing...
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="ai-note">
                                                <small>Note: AI processing may take 10-30 seconds</small>
                                            </p>
                                        </div>
                                    )}

                                    {selectedStyle && aiGeneratedImages[selectedStyle] && (
                                        <div className="ai-preview">
                                            <p>🎨 AI-Generated Preview ({aiStyles.find(s => s.id === selectedStyle)?.name}):</p>
                                            <img
                                                src={aiGeneratedImages[selectedStyle]}
                                                alt={`AI ${selectedStyle}`}
                                                className="ai-preview-image"
                                            />
                                            <button
                                                type="button"
                                                className="btn-use-this"
                                                onClick={() => {
                                                    // Already set as formData.image
                                                    alert('This image will be used for your profile!');
                                                }}
                                            >
                                                ✅ Use This Image
                                            </button>
                                        </div>
                                    )}
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
                    <button type="submit" className="btn-submit" disabled={loading || aiLoading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <Link to="/profile" className="btn-cancel">Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default EditProfile