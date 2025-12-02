import React, { useState, useEffect } from 'react'
import * as api from '../backend/api'
import { generateAIScrap, generateScrapSuggestions } from '../backend/aiService'
import '../css/Scrapbook.css'

function Scrapbook() {
    const [scrapText, setScrapText] = useState('')
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [scraps, setScraps] = useState([])
    const [loadingScraps, setLoadingScraps] = useState(true)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userName = user?.result?.name || user?.name || 'Friend'
    const userId = user?.result?.id || user?.id

    // Fetch scraps on component mount
    useEffect(() => {
        fetchUserScraps()
    }, [])

    const fetchUserScraps = async () => {
        try {
            setLoadingScraps(true)
            const data = await api.fetchScraps(userId)
            setScraps(data || [])
        } catch (error) {
            console.error('Error fetching scraps:', error)
        } finally {
            setLoadingScraps(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!scrapText.trim()) {
            alert('Please write a message before posting!')
            return
        }

        if (!userId) {
            alert('You must be logged in to post scraps!')
            return
        }

        setLoading(true)
        try {
            // Post the scrap
            await api.postScrap({
                senderId: userId,
                receiverId: userId, // Posting to own scrapbook for demo
                content: scrapText
            })

            // Refresh scraps list
            await fetchUserScraps()

            // Clear the form
            setScrapText('')
            setShowSuggestions(false)

            alert('Scrap posted successfully!')
        } catch (error) {
            console.error('Error posting scrap:', error)

            // Check for foreign key violation (missing profile)
            if (error.message && (error.message.includes('foreign key constraint') || error.message.includes('scraps_sender_id_fkey'))) {
                alert('CRITICAL ERROR: Your user profile is missing from the database.\n\nPlease delete your account in Supabase and register again to fix this.')
            } else {
                alert(`Failed to post scrap: ${error.message || 'Please try again.'}`)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateAI = async () => {
        setLoading(true)
        setShowSuggestions(false)
        try {
            const previousMessages = scraps.map(s => s.content)
            const newSuggestions = await generateScrapSuggestions({
                senderName: userName,
                receiverName: 'Friend',
                style: 'nostalgic',
                topic: '',
                previousScraps: previousMessages
            }, 3)

            setSuggestions(newSuggestions)
            setShowSuggestions(true)
        } catch (error) {
            console.error('Error generating scraps:', error)
            alert(`Failed to generate AI scraps: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleUseSuggestion = (suggestion) => {
        setScrapText(suggestion)
        setShowSuggestions(false)
    }

    const handleDeleteScrap = async (scrapId) => {
        if (!confirm('Are you sure you want to delete this scrap?')) {
            return
        }

        try {
            await api.deleteScrap(scrapId)
            await fetchUserScraps()
            alert('Scrap deleted successfully!')
        } catch (error) {
            console.error('Error deleting scrap:', error)
            alert('Failed to delete scrap. Please try again.')
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }
        return date.toLocaleDateString('en-US', options).replace(',', ' at')
    }

    return (
        <div className="scrapbook-container">
            <div className="scrapbook-header">
                <h2 className="scrapbook-title">Scrapbook</h2>

                <div className="scrap-form">
                    <div className="scrap-form-title">Leave a scrap</div>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="scrap-textarea"
                            placeholder="Write your message here..."
                            value={scrapText}
                            onChange={(e) => setScrapText(e.target.value)}
                            disabled={loading}
                        />

                        {/* AI Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="ai-suggestions">
                                <div className="ai-suggestions-title">✨ AI Generated Scraps (Click to use):</div>
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="ai-suggestion-item"
                                        onClick={() => handleUseSuggestion(suggestion)}
                                    >
                                        <div className="ai-suggestion-number">{index + 1}</div>
                                        <div className="ai-suggestion-text">{suggestion}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="scrap-form-buttons">
                            <button type="submit" className="scrap-btn" disabled={loading}>
                                {loading ? 'Posting...' : 'Post Scrap'}
                            </button>
                            <button
                                type="button"
                                className="scrap-btn scrap-btn-cancel"
                                onClick={() => {
                                    setScrapText('')
                                    setShowSuggestions(false)
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="scrap-btn scrap-btn-ai"
                                onClick={handleGenerateAI}
                                disabled={loading}
                            >
                                {loading ? '✨ Generating...' : '✨ AI Generate'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="scraps-list-title">
                    Scraps ({scraps.length})
                </div>

                {loadingScraps ? (
                    <div className="loading">Loading scraps...</div>
                ) : scraps.length === 0 ? (
                    <div className="empty-state">No scraps yet. Be the first to leave one!</div>
                ) : (
                    scraps.map((scrap) => (
                        <div key={scrap.id} className="scrap-item">
                            <img
                                src={scrap.sender?.image || 'https://i.pravatar.cc/50'}
                                alt={scrap.sender?.name || 'User'}
                                className="scrap-avatar"
                            />
                            <div className="scrap-content">
                                <div className="scrap-header-info">
                                    <a href="#" className="scrap-author">
                                        {scrap.sender?.name || 'Anonymous'}
                                    </a>
                                    <span className="scrap-date">
                                        {formatDate(scrap.created_at)}
                                    </span>
                                </div>
                                <div className="scrap-message">{scrap.content}</div>
                                <div className="scrap-actions">
                                    <a href="#" className="scrap-action-link">Reply</a>
                                    <a
                                        href="#"
                                        className="scrap-action-link"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDeleteScrap(scrap.id)
                                        }}
                                    >
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Scrapbook
