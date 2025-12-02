import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/SearchResults.css'

function SearchResults() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''

    const [users, setUsers] = useState([])
    const [communities, setCommunities] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('users')
    const [currentUser, setCurrentUser] = useState(null)
    const [sentRequests, setSentRequests] = useState(new Set())

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await api.getCurrentUser()
                setCurrentUser(user)
            } catch (error) {
                console.error('Error fetching current user:', error)
            }
        }
        fetchUser()
    }, [])

    React.useEffect(() => {
        if (query) {
            performSearch()
        }
    }, [query])

    const performSearch = async () => {
        setLoading(true)
        try {
            const [usersData, communitiesData] = await Promise.all([
                api.searchUsers(query),
                api.searchCommunities(query)
            ])
            setUsers(usersData || [])
            setCommunities(communitiesData || [])
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddFriend = async (userId) => {
        if (!currentUser) {
            alert('Please login to add friends')
            return
        }
        if (currentUser.id === userId) {
            alert("You can't add yourself as a friend!")
            return
        }

        try {
            await api.sendFriendRequest(currentUser.id, userId)
            setSentRequests(prev => {
                const newSet = new Set(prev)
                newSet.add(userId)
                return newSet
            })
            alert('Friend request sent!')
        } catch (error) {
            console.error('Error sending friend request:', error)
            alert('Failed to send friend request. You might have already sent one.')
        }
    }

    return (
        <div className="search-results-container">
            <div className="search-header">
                <h2>Search Results for "{query}"</h2>
                <div className="search-tabs">
                    <button
                        className={`search-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        className={`search-tab ${activeTab === 'communities' ? 'active' : ''}`}
                        onClick={() => setActiveTab('communities')}
                    >
                        Communities ({communities.length})
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Searching...</div>
            ) : (
                <div className="search-results">
                    {activeTab === 'users' && (
                        <div className="users-results">
                            {users.length === 0 ? (
                                <div className="empty-state">No users found</div>
                            ) : (
                                users.map((user) => (
                                    <div key={user.id} className="user-result-card">
                                        <img
                                            src={user.image || api.DEFAULT_AVATAR}
                                            alt={user.name}
                                            className="user-result-image"
                                        />
                                        <div className="user-result-info">
                                            <Link to={`/profile/${user.id}`} className="user-result-name">
                                                {user.name}
                                            </Link>
                                            <div className="user-result-location">
                                                {user.city}, {user.country}
                                            </div>
                                        </div>
                                        <button
                                            className="add-friend-btn"
                                            onClick={() => handleAddFriend(user.id)}
                                            disabled={sentRequests.has(user.id) || (currentUser && currentUser.id === user.id)}
                                            style={{
                                                opacity: (sentRequests.has(user.id) || (currentUser && currentUser.id === user.id)) ? 0.6 : 1,
                                                cursor: (sentRequests.has(user.id) || (currentUser && currentUser.id === user.id)) ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {sentRequests.has(user.id) ? 'Request Sent' : 'Add Friend'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'communities' && (
                        <div className="communities-results">
                            {communities.length === 0 ? (
                                <div className="empty-state">No communities found</div>
                            ) : (
                                communities.map((community) => (
                                    <div key={community.id} className="community-result-card">
                                        <img
                                            src={community.image || 'https://via.placeholder.com/60'}
                                            alt={community.name}
                                            className="community-result-image"
                                        />
                                        <div className="community-result-info">
                                            <Link to={`/communities/${community.id}`} className="community-result-name">
                                                {community.name}
                                            </Link>
                                            <div className="community-result-meta">
                                                {community.category} • {community.members_count || 0} members
                                            </div>
                                        </div>
                                        <Link to={`/communities/${community.id}`} className="visit-btn">
                                            Visit
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchResults
