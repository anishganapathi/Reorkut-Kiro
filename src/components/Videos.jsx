import React, { useState, useEffect } from 'react'
import * as api from '../backend/api'
import '../css/Videos.css'

function Videos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newVideo, setNewVideo] = useState({ title: '', url: '' })
    const [playingVideo, setPlayingVideo] = useState(null)

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

    const getVideoId = (url) => {
        if (!url) return null
        try {
            const urlObj = new URL(url)
            if (urlObj.hostname.includes('youtube.com')) {
                if (urlObj.pathname.startsWith('/embed/')) {
                    return urlObj.pathname.split('/')[2]
                }
                return urlObj.searchParams.get('v')
            } else if (urlObj.hostname.includes('youtu.be')) {
                return urlObj.pathname.slice(1)
            }
        } catch (e) {
            // Fallback for simple string parsing if URL construction fails
            if (url.includes('v=')) {
                return url.split('v=')[1].split('&')[0]
            } else if (url.includes('youtu.be/')) {
                return url.split('youtu.be/')[1].split('?')[0]
            } else if (url.includes('/embed/')) {
                return url.split('/embed/')[1].split('?')[0]
            }
        }
        return null
    }

    const handleAddVideo = async (e) => {
        e.preventDefault()
        if (!newVideo.title || !newVideo.url) {
            alert('Please fill in all fields')
            return
        }

        try {
            const videoId = getVideoId(newVideo.url)

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
                                    <button
                                        onClick={() => setPlayingVideo(video)}
                                        className="watch-btn"
                                    >
                                        Watch
                                    </button>
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

            {playingVideo && (
                <div className="video-modal-overlay" onClick={() => setPlayingVideo(null)}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="video-modal-close" onClick={() => setPlayingVideo(null)}>×</button>
                        <div className="video-player-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${getVideoId(playingVideo.url)}?autoplay=1`}
                                title={playingVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h3 style={{ marginTop: '15px', marginBottom: '0', fontSize: '16px' }}>{playingVideo.title}</h3>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Videos
