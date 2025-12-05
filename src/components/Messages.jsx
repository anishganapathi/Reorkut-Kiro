import React, { useState, useEffect } from 'react'
import * as api from '../backend/api'
import '../css/Messages.css'

function Messages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCompose, setShowCompose] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [newMessage, setNewMessage] = useState({ receiverId: '', subject: '', content: '' })
    const [activeTab, setActiveTab] = useState('inbox') // 'inbox' or 'sent'

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.id || user?.id

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const data = await api.fetchMessages(userId)
            setMessages(data || [])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.receiverId || !newMessage.subject || !newMessage.content) {
            alert('Please fill in all fields')
            return
        }

        try {
            await api.sendMessage({
                senderId: userId,
                receiverId: newMessage.receiverId,
                subject: newMessage.subject,
                content: newMessage.content
            })

            setNewMessage({ receiverId: '', subject: '', content: '' })
            setShowCompose(false)
            fetchMessages()
            alert('Message sent successfully!')
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message')
        }
    }

    const handleViewMessage = async (message) => {
        setSelectedMessage(message)
        if (!message.is_read && message.receiver_id === userId) {
            try {
                await api.markMessageAsRead(message.id)
                fetchMessages()
            } catch (error) {
                console.error('Error marking message as read:', error)
            }
        }
    }

    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            await api.deleteMessage(messageId)
            setSelectedMessage(null)
            fetchMessages()
            alert('Message deleted successfully!')
        } catch (error) {
            console.error('Error deleting message:', error)
            alert('Failed to delete message')
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        })
    }

    const inbox = messages.filter(m => m.receiver_id === userId)
    const sent = messages.filter(m => m.sender_id === userId)
    const unreadCount = inbox.filter(m => !m.is_read).length

    return (
        <div className="messages-container">
            <div className="messages-header">
                <h2 className="messages-title">Messages ({unreadCount} unread)</h2>
                <button
                    className="compose-btn"
                    onClick={() => setShowCompose(!showCompose)}
                >
                    {showCompose ? 'Cancel' : 'Compose'}
                </button>
            </div>

            {showCompose && (
                <div className="compose-form">
                    <h3>New Message</h3>
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Receiver ID (for demo)"
                            value={newMessage.receiverId}
                            onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
                            className="message-input"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={newMessage.subject}
                            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                            className="message-input"
                        />
                        <textarea
                            placeholder="Message"
                            value={newMessage.content}
                            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                            className="message-textarea"
                            rows="5"
                        />
                        <button type="submit" className="send-btn">Send Message</button>
                    </form>
                </div>
            )}

            <div className="messages-content">
                <div className="messages-list">
                    <div className="messages-tabs">
                        <div
                            className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('inbox')
                                setSelectedMessage(null)
                            }}
                        >
                            Inbox ({inbox.length})
                        </div>
                        <div
                            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('sent')
                                setSelectedMessage(null)
                            }}
                        >
                            Sent ({sent.length})
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading messages...</div>
                    ) : (activeTab === 'inbox' ? inbox : sent).length === 0 ? (
                        <div className="empty-state">
                            {activeTab === 'inbox' ? 'No messages in your inbox' : 'No sent messages'}
                        </div>
                    ) : (
                        <div className="message-items">
                            {(activeTab === 'inbox' ? inbox : sent).map((message) => (
                                <div
                                    key={message.id}
                                    className={`message-item ${!message.is_read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                                    onClick={() => handleViewMessage(message)}
                                >
                                    <div className="message-sender">
                                        {activeTab === 'inbox'
                                            ? (message.sender?.name || 'Unknown')
                                            : (message.receiver?.name || 'Unknown')
                                        }
                                    </div>
                                    <div className="message-subject">{message.subject}</div>
                                    <div className="message-date">{formatDate(message.created_at)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedMessage && (
                    <div className="message-viewer">
                        <div className="message-viewer-header">
                            <h3>{selectedMessage.subject}</h3>
                            <button
                                className="delete-msg-btn"
                                onClick={() => handleDeleteMessage(selectedMessage.id)}
                            >
                                Delete
                            </button>
                        </div>
                        <div className="message-meta">
                            <strong>From:</strong> {selectedMessage.sender?.name || 'Unknown'}<br />
                            <strong>Date:</strong> {formatDate(selectedMessage.created_at)}
                        </div>
                        <div className="message-body">
                            {selectedMessage.content}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Messages
