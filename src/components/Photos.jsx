import { useState, useEffect } from 'react'
import '../css/Photos.css'
import {
    fetchPhotoAlbums,
    createPhotoAlbum,
    deletePhotoAlbum,
    fetchAlbumPhotos,
    uploadPhotos,
    deletePhoto,
    getCurrentUser
} from '../backend/api'
import { validatePhotoFile, validateAlbumName } from '../utils/validation'

function Photos() {
    const [albums, setAlbums] = useState([])
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    const [albumPhotos, setAlbumPhotos] = useState([])
    const [showUploadForm, setShowUploadForm] = useState(false)
    const [showCreateAlbum, setShowCreateAlbum] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedAlbumId, setSelectedAlbumId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [newAlbumName, setNewAlbumName] = useState('')
    const [newAlbumDescription, setNewAlbumDescription] = useState('')

    const [currentUser, setCurrentUser] = useState(null)
    const [checkingUser, setCheckingUser] = useState(true)
    const userId = currentUser?.id

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await getCurrentUser()
                if (user) {
                    setCurrentUser(user)
                    loadAlbums(user.id)
                }
            } catch (err) {
                console.error('Error checking user session:', err)
            } finally {
                setCheckingUser(false)
            }
        }
        checkUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadAlbums = async (id) => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchPhotoAlbums(id || userId)
            setAlbums(data)
        } catch (err) {
            console.error('Error loading albums:', err)
            setError('Unable to load photo albums. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAlbum = async (e) => {
        e.preventDefault()

        // Validate album name
        const validation = validateAlbumName(newAlbumName)
        if (!validation.isValid) {
            setError(validation.error)
            return
        }

        try {
            setLoading(true)
            setError(null)
            const newAlbum = await createPhotoAlbum({
                userId: userId,
                name: newAlbumName,
                description: newAlbumDescription
            })

            // Add to albums list
            setAlbums([newAlbum, ...albums])

            setNewAlbumName('')
            setNewAlbumDescription('')
            setShowCreateAlbum(false)

            // Navigate to the new album view
            setSelectedAlbum(newAlbum)
            setAlbumPhotos([])
        } catch (err) {
            console.error('Error creating album:', err)
            setError('Failed to create album. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAlbum = async (albumId, e) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this album and all its photos?')) {
            return
        }

        try {
            setLoading(true)
            setError(null)
            await deletePhotoAlbum(albumId)
            setAlbums(albums.filter(a => a.id !== albumId))
            if (selectedAlbum?.id === albumId) {
                setSelectedAlbum(null)
            }
        } catch (err) {
            console.error('Error deleting album:', err)
            setError('Unable to delete album. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectAlbum = async (album) => {
        try {
            setLoading(true)
            setError(null)
            setSelectedAlbum(album)

            const photos = await fetchAlbumPhotos(album.id)
            setAlbumPhotos(photos)
        } catch (err) {
            console.error('Error loading photos:', err)
            setError('Unable to load photos. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)

        // Validate each file
        const validFiles = []
        const errors = []

        for (const file of files) {
            const validation = validatePhotoFile(file)
            if (validation.isValid) {
                validFiles.push(file)
            } else {
                errors.push(`${file.name}: ${validation.error}`)
            }
        }

        if (errors.length > 0) {
            setError(errors.join('\n'))
        } else {
            setError(null)
        }

        setSelectedFiles(validFiles)
    }

    const handleUploadPhotos = async (e) => {
        e.preventDefault()
        if (!selectedAlbumId || selectedFiles.length === 0) {
            setError('Please select an album and at least one photo')
            return
        }

        try {
            setUploading(true)
            setError(null)
            await uploadPhotos({
                albumId: selectedAlbumId,
                userId: userId,
                files: selectedFiles
            })

            // Refresh albums to update photo counts
            await loadAlbums()

            // If viewing the album, refresh photos immediately
            if (selectedAlbum?.id === selectedAlbumId) {
                const photos = await fetchAlbumPhotos(selectedAlbumId)
                setAlbumPhotos(photos)
            }

            setSelectedFiles([])
            setSelectedAlbumId('')
            setShowUploadForm(false)
        } catch (err) {
            console.error('Error uploading photos:', err)
            setError('Upload failed. Please check your connection and try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDeletePhoto = async (photoId) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) {
            return
        }

        try {
            setLoading(true)
            setError(null)
            await deletePhoto(photoId)
            setAlbumPhotos(albumPhotos.filter(p => p.id !== photoId))

            // Refresh albums to update photo counts
            await loadAlbums()
        } catch (err) {
            console.error('Error deleting photo:', err)
            setError('Unable to delete photo. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!currentUser) {
        return (
            <div className="photos-container">
                <p>Please log in to view photos.</p>
            </div>
        )
    }

    return (
        <div className="photos-container">
            <div className="photos-header">
                <h2 className="photos-title">Photo Albums</h2>
                <div className="photos-actions">
                    <button
                        className="upload-photo-btn"
                        onClick={() => setShowCreateAlbum(!showCreateAlbum)}
                    >
                        {showCreateAlbum ? 'Cancel' : 'Create Album'}
                    </button>
                    <button
                        className="upload-photo-btn"
                        onClick={() => setShowUploadForm(!showUploadForm)}
                    >
                        {showUploadForm ? 'Cancel' : 'Upload Photos'}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{
                    background: '#ffebee',
                    border: '1px solid #ef5350',
                    borderRadius: '3px',
                    padding: '10px',
                    marginBottom: '15px',
                    color: '#c62828',
                    fontSize: '11px',
                    whiteSpace: 'pre-line'
                }}>
                    {error}
                </div>
            )}

            {showCreateAlbum && (
                <div className="upload-form">
                    <h3>Create New Album</h3>
                    <form onSubmit={handleCreateAlbum}>
                        <input
                            type="text"
                            className="album-select"
                            placeholder="Album name"
                            value={newAlbumName}
                            onChange={(e) => setNewAlbumName(e.target.value)}
                            required
                        />
                        <textarea
                            className="album-select"
                            placeholder="Description (optional)"
                            value={newAlbumDescription}
                            onChange={(e) => setNewAlbumDescription(e.target.value)}
                            rows="3"
                        />
                        <div className="upload-actions">
                            <button
                                type="submit"
                                className="submit-upload-btn"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Album'}
                            </button>
                            <button
                                type="button"
                                className="cancel-upload-btn"
                                onClick={() => {
                                    setShowCreateAlbum(false)
                                    setNewAlbumName('')
                                    setNewAlbumDescription('')
                                    setError(null)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showUploadForm && (
                <div className="upload-form">
                    <h3>Upload Photos</h3>
                    <form onSubmit={handleUploadPhotos}>
                        <select
                            className="album-select"
                            value={selectedAlbumId}
                            onChange={(e) => setSelectedAlbumId(e.target.value)}
                            required
                        >
                            <option value="">Select an album</option>
                            {albums.map(album => (
                                <option key={album.id} value={album.id}>
                                    {album.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            className="file-input"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            required
                        />
                        {selectedFiles.length > 0 && (
                            <p style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
                                {selectedFiles.length} file(s) selected
                            </p>
                        )}
                        <div className="upload-actions">
                            <button
                                type="submit"
                                className="submit-upload-btn"
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload Photos'}
                            </button>
                            <button
                                type="button"
                                className="cancel-upload-btn"
                                onClick={() => {
                                    setShowUploadForm(false)
                                    setSelectedFiles([])
                                    setSelectedAlbumId('')
                                    setError(null)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedAlbum ? (
                <div className="album-view">
                    <button className="back-btn" onClick={() => setSelectedAlbum(null)}>
                        ← Back to Albums
                    </button>
                    <h3 className="album-view-title">
                        {selectedAlbum.name} ({albumPhotos.length} photos)
                    </h3>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '11px' }}>
                            Loading photos...
                        </p>
                    ) : albumPhotos.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '11px' }}>
                            No photos in this album yet. Upload some photos to get started!
                        </p>
                    ) : (
                        <div className="photos-grid">
                            {albumPhotos.map(photo => (
                                <div key={photo.id} className="photo-item">
                                    <img
                                        src={photo.url}
                                        alt={photo.caption || 'Photo'}
                                        className="photo-image"
                                    />
                                    <button
                                        onClick={() => handleDeletePhoto(photo.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            border: '1px solid #ccc',
                                            borderRadius: '3px',
                                            padding: '3px 8px',
                                            fontSize: '10px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#c62828'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '11px' }}>
                            Loading albums...
                        </p>
                    ) : albums.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '11px' }}>
                            No albums yet. Create your first album to get started!
                        </p>
                    ) : (
                        <div className="albums-grid">
                            {albums.map(album => (
                                <div
                                    key={album.id}
                                    className="album-card"
                                    onClick={() => handleSelectAlbum(album)}
                                    style={{
                                        position: 'relative'
                                    }}
                                >
                                    {album.cover_image || album.coverImage ? (
                                        <img
                                            src={album.cover_image || album.coverImage}
                                            alt={album.name}
                                            className="album-cover"
                                        />
                                    ) : (
                                        <div
                                            className="album-cover"
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {album.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="album-info">
                                        <div className="album-name">{album.name}</div>
                                        <div className="album-count">
                                            {album.photo_count || album.photoCount} {(album.photo_count || album.photoCount) === 1 ? 'photo' : 'photos'}
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteAlbum(album.id, e)}
                                            style={{
                                                marginTop: '5px',
                                                padding: '2px 6px',
                                                fontSize: '9px',
                                                background: '#ffebee',
                                                border: '1px solid #ef5350',
                                                borderRadius: '2px',
                                                color: '#c62828',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Delete Album
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Photos
