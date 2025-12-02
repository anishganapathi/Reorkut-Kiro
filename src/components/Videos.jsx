import React, { useState, useEffect } from 'react'
import * as api from '../backend/api'
import '../css/Videos.css'

function Videos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newVideo, setNewVideo] = useState({ title: '', url: '' })

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const data = await api.fetchVideos(userId)
            setVideos(data || [])
        } catch (error) {
            console.error('Error fetching videos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddVideo = async (e) => {
        e.preventDefault()
        if (!newVideo.title || !newVideo.url) {
            alert('Please fill in all fields')
            return
        }

        try {
            // Extract video ID from YouTube URL
            let videoId = ''
            if (newVideo.url.includes('youtube.com') || newVideo.url.includes('youtu.be')) {
                const urlParams = new URLSearchParams(new URL(newVideo.url).search)
                videoId = urlParams.get('v') || newVideo.url.split('/').pop()
            }

            await api.uploadVideo({
                userId,
                title: newVideo.title,
                url: newVideo.url,
                thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
            })

            setNewVideo({ title: '', url: '' })
            setShowAddForm(false)
            fetchVideos()
            alert('Video added successfully!')
        } catch (error) {
            console.error('Error adding video:', error)
            alert('Failed to add video')
        }
    }

    const handleDeleteVideo = async (videoId) => {
        if (!confirm('Are you sure you want to delete this video?')) return

        try {
            await api.deleteVideo(videoId)
            fetchVideos()
            alert('Video deleted successfully!')
        } catch (error) {
            console.error('Error deleting video:', error)
            alert('Failed to delete video')
        }
    }

    return (
        <div className="videos-container">
            <div className="videos-header">
                <h2 className="videos-title">Videos</h2>
                <button
                    className="add-video-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : 'Add Video'}
                </button>
            </div>

            {showAddForm && (
                <div className="add-video-form">
                    <h3>Add New Video</h3>
                    <form onSubmit={handleAddVideo}>
                        <input
                            type="text"
                            placeholder="Video Title"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                            className="video-input"
                        />
                        <input
                            type="url"
                            placeholder="YouTube URL"
                            value={newVideo.url}
                            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                            className="video-input"
                        />
                        <button type="submit" className="submit-video-btn">Add Video</button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading videos...</div>
            ) : videos.length === 0 ? (
                <div className="empty-state">No videos yet. Add your first video!</div>
            ) : (
                <div className="videos-grid">
                    {videos.map((video) => (
                        <div key={video.id} className="video-card">
                            <div className="video-thumbnail">
                                {video.thumbnail ? (
                                    <img src={video.thumbnail} alt={video.title} />
                                ) : (
                                    <div className="no-thumbnail">No Preview</div>
                                )}
                            </div>
                            <div className="video-info">
                                <h4 className="video-title">{video.title}</h4>
                                <div className="video-actions">
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="watch-btn"
                                    >
                                        Watch
                                    </a>
                                    <button
                                        onClick={() => handleDeleteVideo(video.id)}
                                        className="delete-video-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Videos
