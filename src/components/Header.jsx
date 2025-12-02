import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../backend/api'

function Header() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('profile'))
    const userData = user?.result || user || {}
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = async (e) => {
        // Prevent any default behavior or event bubbling
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        try {
            await api.signOut()
            localStorage.removeItem('profile')
            // Force full reload to clear state
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout error:', error)
            // Even if API fails, clear local storage and redirect
            localStorage.removeItem('profile')
            window.location.href = '/login'
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <div className="header-container">
            <div className="header-content">
                <div className="header-left">
                    <Link to="/" className="header-logo">
                        orkut<sup className="logo-tm">TM</sup>
                    </Link>
                    <div className="header-links">
                        <Link to="/">home</Link>
                        <Link to="/profile">profile</Link>
                        <Link to="/scrapbook">scrapbook</Link>
                        <Link to="/communities">communities</Link>
                    </div>
                </div>

                <div className="header-center">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="search orkut"
                            className="header-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="header-right">
                    <div className="user-info">
                        <span className="online-dot"></span>
                        <span className="user-email">{userData.email || 'user@example.com'}</span>
                    </div>
                    <span className="separator">|</span>
                    <Link to="/settings" className="header-action">settings</Link>
                    <span className="separator">|</span>
                    <button type="button" onClick={handleLogout} className="header-action logout-btn">logout</button>
                </div>
            </div>
        </div>
    )
}

export default Header
