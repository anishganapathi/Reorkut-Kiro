import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Settings.css'

function Settings() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('profile'))
    const userData = user?.result || user || {}

    const [activeTab, setActiveTab] = useState('account')
    const [settings, setSettings] = useState({
        emailNotifications: true,
        scrapNotifications: true,
        friendRequestNotifications: true,
        profileVisibility: 'public',
        whoCanMessage: 'friends',
        whoCanViewScraps: 'everyone'
    })

    const handleSaveSettings = () => {
        // In a real app, save to database
        localStorage.setItem('userSettings', JSON.stringify(settings))
        alert('Settings saved successfully!')
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return
        }

        if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            return
        }

        try {
            // In a real app, call delete account API
            await api.signOut()
            localStorage.clear()
            alert('Account deleted successfully')
            navigate('/login')
        } catch (error) {
            console.error('Error deleting account:', error)
            alert('Failed to delete account')
        }
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>Settings</h2>
            </div>

            <div className="settings-content">
                <div className="settings-tabs">
                    <button
                        className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        Account
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        Privacy
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        Notifications
                    </button>
                </div>

                <div className="settings-panel">
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h3>Account Information</h3>
                            <div className="setting-item">
                                <label>Email:</label>
                                <span>{userData.email}</span>
                            </div>
                            <div className="setting-item">
                                <label>Name:</label>
                                <span>{userData.name}</span>
                            </div>
                            <div className="setting-item">
                                <label>Member since:</label>
                                <span>{new Date(userData.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>

                            <h3 style={{ marginTop: '30px' }}>Danger Zone</h3>
                            <div className="danger-zone">
                                <p>Once you delete your account, there is no going back. Please be certain.</p>
                                <button className="delete-account-btn" onClick={handleDeleteAccount}>
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="settings-section">
                            <h3>Privacy Settings</h3>

                            <div className="setting-item">
                                <label>Profile Visibility:</label>
                                <select
                                    value={settings.profileVisibility}
                                    onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                                >
                                    <option value="public">Public</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>

                            <div className="setting-item">
                                <label>Who can send me messages:</label>
                                <select
                                    value={settings.whoCanMessage}
                                    onChange={(e) => setSettings({ ...settings, whoCanMessage: e.target.value })}
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="none">No One</option>
                                </select>
                            </div>

                            <div className="setting-item">
                                <label>Who can view my scraps:</label>
                                <select
                                    value={settings.whoCanViewScraps}
                                    onChange={(e) => setSettings({ ...settings, whoCanViewScraps: e.target.value })}
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="me">Only Me</option>
                                </select>
                            </div>

                            <button className="save-btn" onClick={handleSaveSettings}>
                                Save Privacy Settings
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>Notification Preferences</h3>

                            <div className="setting-item checkbox-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                    />
                                    Email notifications
                                </label>
                            </div>

                            <div className="setting-item checkbox-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings.scrapNotifications}
                                        onChange={(e) => setSettings({ ...settings, scrapNotifications: e.target.checked })}
                                    />
                                    Notify me when someone posts a scrap
                                </label>
                            </div>

                            <div className="setting-item checkbox-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings.friendRequestNotifications}
                                        onChange={(e) => setSettings({ ...settings, friendRequestNotifications: e.target.checked })}
                                    />
                                    Notify me of friend requests
                                </label>
                            </div>

                            <button className="save-btn" onClick={handleSaveSettings}>
                                Save Notification Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
