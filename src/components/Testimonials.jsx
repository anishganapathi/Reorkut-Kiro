import React, { useState, useEffect } from 'react'
import * as api from '../backend/api'
import '../css/Testimonials.css'

function Testimonials() {
    const [testimonials, setTestimonials] = useState([])
    const [pendingTestimonials, setPendingTestimonials] = useState([])
    const [showWriteForm, setShowWriteForm] = useState(false)
    const [testimonialText, setTestimonialText] = useState('')
    const [ratings, setRatings] = useState({
        reliable: 5,
        cool: 5,
        trustworthy: 5
    })
    const [loading, setLoading] = useState(true)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        fetchTestimonials()
        fetchPendingTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            // Fetch approved testimonials
            const data = await api.fetchTestimonials(userId)
            setTestimonials(data || [])
        } catch (error) {
            console.error('Error fetching testimonials:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPendingTestimonials = async () => {
        try {
            const data = await api.fetchPendingTestimonials(userId)
            setPendingTestimonials(data || [])
        } catch (error) {
            console.error('Error fetching pending testimonials:', error)
        }
    }

    const handleSubmitTestimonial = async () => {
        if (!testimonialText.trim()) {
            alert('Please write a testimonial message')
            return
        }

        try {
            await api.writeTestimonial({
                authorId: userId,
                userId: userId, // In real app, this would be the profile being viewed
                content: testimonialText,
                ratings: ratings
            })

            setTestimonialText('')
            setRatings({ reliable: 5, cool: 5, trustworthy: 5 })
            setShowWriteForm(false)
            alert('Testimonial submitted! Waiting for approval.')
        } catch (error) {
            console.error('Error submitting testimonial:', error)
            alert('Failed to submit testimonial')
        }
    }

    const handleApprove = async (testimonialId) => {
        try {
            await api.approveTestimonial(testimonialId)
            alert('Testimonial approved!')
            fetchTestimonials()
            fetchPendingTestimonials()
        } catch (error) {
            console.error('Error approving testimonial:', error)
            alert('Failed to approve testimonial')
        }
    }

    const handleReject = async (testimonialId) => {
        try {
            await api.rejectTestimonial(testimonialId)
            alert('Testimonial rejected')
            fetchPendingTestimonials()
        } catch (error) {
            console.error('Error rejecting testimonial:', error)
            alert('Failed to reject testimonial')
        }
    }

    return (
        <div className="testimonials-container">
            <div className="testimonials-header">
                <h2 className="testimonials-title">Testimonials</h2>
                <button
                    className="write-testimonial-btn"
                    onClick={() => setShowWriteForm(!showWriteForm)}
                >
                    {showWriteForm ? 'Cancel' : 'Write Testimonial'}
                </button>
            </div>

            {showWriteForm && (
                <div className="write-testimonial-form">
                    <h3>Write a Testimonial</h3>
                    <textarea
                        className="testimonial-textarea"
                        placeholder="Write something nice about this person..."
                        rows="6"
                        value={testimonialText}
                        onChange={(e) => setTestimonialText(e.target.value)}
                    />
                    <div className="rating-section">
                        <div className="rating-item">
                            <label>Reliable:</label>
                            <select
                                className="rating-select"
                                value={ratings.reliable}
                                onChange={(e) => setRatings({ ...ratings, reliable: parseInt(e.target.value) })}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div className="rating-item">
                            <label>Cool:</label>
                            <select
                                className="rating-select"
                                value={ratings.cool}
                                onChange={(e) => setRatings({ ...ratings, cool: parseInt(e.target.value) })}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div className="rating-item">
                            <label>Trustworthy:</label>
                            <select
                                className="rating-select"
                                value={ratings.trustworthy}
                                onChange={(e) => setRatings({ ...ratings, trustworthy: parseInt(e.target.value) })}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="submit-testimonial-btn"
                        onClick={handleSubmitTestimonial}
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Pending Testimonials Section */}
            {pendingTestimonials.length > 0 && (
                <div className="pending-testimonials-section">
                    <h3 className="section-title">Pending Approval ({pendingTestimonials.length})</h3>
                    {pendingTestimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-item pending">
                            <img
                                src={testimonial.author?.image || 'https://via.placeholder.com/60'}
                                alt={testimonial.author?.name}
                                className="testimonial-avatar"
                            />
                            <div className="testimonial-content">
                                <div className="testimonial-header">
                                    <span className="testimonial-from">{testimonial.author?.name || 'Unknown'}</span>
                                    <span className="testimonial-date">
                                        {new Date(testimonial.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="testimonial-message">{testimonial.content}</div>
                                <div className="testimonial-actions">
                                    <button
                                        className="approve-btn"
                                        onClick={() => handleApprove(testimonial.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => handleReject(testimonial.id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Approved Testimonials */}
            <div className="testimonials-list">
                <p className="testimonials-count">{testimonials.length} testimonials</p>
                {loading ? (
                    <div className="loading">Loading testimonials...</div>
                ) : testimonials.length === 0 ? (
                    <div className="empty-state">No testimonials yet</div>
                ) : (
                    testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-item">
                            <img
                                src={testimonial.author?.image || 'https://via.placeholder.com/60'}
                                alt={testimonial.author?.name}
                                className="testimonial-avatar"
                            />
                            <div className="testimonial-content">
                                <div className="testimonial-header">
                                    <span className="testimonial-from">{testimonial.author?.name || 'Unknown'}</span>
                                    <span className="testimonial-date">
                                        {new Date(testimonial.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="testimonial-message">{testimonial.content}</div>
                                {testimonial.ratings && (
                                    <div className="testimonial-ratings">
                                        <span className="rating-badge">Reliable: {testimonial.ratings.reliable}/5</span>
                                        <span className="rating-badge">Cool: {testimonial.ratings.cool}/5</span>
                                        <span className="rating-badge">Trustworthy: {testimonial.ratings.trustworthy}/5</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Testimonials
