import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../backend/api'

function Header() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('profile'))
    const userData = user?.result || user || {}
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState({ users: [], communities: [] })
    const [showDropdown, setShowDropdown] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    // Debounce logic
    React.useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true)
                try {
                    const [users, communities] = await Promise.all([
                        api.searchUsers(searchQuery),
                        api.searchCommunities(searchQuery)
                    ])
                    setSearchResults({ users: users || [], communities: communities || [] })
                    setShowDropdown(true)
                } catch (error) {
                    console.error('Search error:', error)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSearchResults({ users: [], communities: [] })
                setShowDropdown(false)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

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
            setShowDropdown(false)
        }
    }

    // Close dropdown when clicking outside (simple implementation)
    React.useEffect(() => {
        const handleClickOutside = () => setShowDropdown(false)
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

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
                    <form onSubmit={handleSearch} onClick={(e) => e.stopPropagation()} className="search-form">
                        <input
                            type="text"
                            placeholder="search orkut"
                            className="header-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                if (searchQuery.trim().length >= 2) setShowDropdown(true)
                            }}
                        />
                        {showDropdown && (
                            <div className="search-dropdown">
                                {isSearching ? (
                                    <div className="search-dropdown-loading">Searching...</div>
                                ) : (
                                    <>
                                        {(searchResults.users.length === 0 && searchResults.communities.length === 0) && (
                                            <div className="search-dropdown-empty">No results found</div>
                                        )}

                                        {searchResults.users.length > 0 && (
                                            <div className="search-section">
                                                <div className="search-section-title">People</div>
                                                {searchResults.users.map(user => (
                                                    <Link
                                                        key={user.id}
                                                        to={`/profile/${user.id}`}
                                                        className="search-result-item"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <img src={user.image || api.DEFAULT_AVATAR} alt={user.name} />
                                                        <span>{user.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {searchResults.communities.length > 0 && (
                                            <div className="search-section">
                                                <div className="search-section-title">Communities</div>
                                                {searchResults.communities.map(community => (
                                                    <Link
                                                        key={community.id}
                                                        to={`/community/${community.id}`}
                                                        className="search-result-item"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <img src={community.image || 'https://via.placeholder.com/30'} alt={community.name} />
                                                        <span>{community.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        <div
                                            className="search-view-all"
                                            onClick={() => {
                                                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                                                setShowDropdown(false)
                                            }}
                                        >
                                            View all results
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
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
