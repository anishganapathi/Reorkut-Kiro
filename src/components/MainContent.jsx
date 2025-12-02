import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/App.css'

function MainContent() {
    const [updates, setUpdates] = useState([
        { id: 1, user: 'Debbie', action: 'added new photos', time: 'today', icon: '📷' },
        { id: 2, user: 'Christos', action: 'added a video', time: 'yesterday', icon: '🎥' },
        { id: 3, user: 'Yan', action: 'updated profile', time: '2 days ago', icon: '👤' },
        { id: 4, user: 'Evan', action: 'joined a community', time: '3 days ago', icon: '👥' }
    ])

    return (
        <div className="main-content">
            {/* Updates Section */}
            <div className="content-box">
                <div className="box-header">
                    <h4>updates from your friends</h4>
                </div>
                <div className="box-content updates-list">
                    {updates.map(update => (
                        <div key={update.id} className="update-item">
                            <span className="update-icon">{update.icon}</span>
                            <div className="update-text">
                                <a href="#" className="user-link">{update.user}</a> {update.action} <span className="update-time">- {update.time}</span>
                            </div>
                        </div>
                    ))}
                    <div className="view-all-link">
                        <a href="#">view all updates</a>
                    </div>
                </div>
            </div>

            {/* What's New Section */}
            <div className="content-box">
                <div className="box-header">
                    <h4>what's new on orkut?</h4>
                </div>
                <div className="box-content whats-new-grid">
                    <div className="new-item">
                        <div className="new-icon">🔍</div>
                        <div className="new-details">
                            <a href="#" className="new-title">find friends</a>
                            <div className="new-desc">search for people you know</div>
                        </div>
                    </div>
                    <div className="new-item">
                        <div className="new-icon">👥</div>
                        <div className="new-details">
                            <a href="#" className="new-title">create community</a>
                            <div className="new-desc">start a new group</div>
                        </div>
                    </div>
                    <div className="new-item">
                        <div className="new-icon">📷</div>
                        <div className="new-details">
                            <a href="#" className="new-title">add photos</a>
                            <div className="new-desc">share your moments</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainContent
