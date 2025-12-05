import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/Home.css'
import ErrorBoundary from './ErrorBoundary'

// Demo data for posts
const demoPosts = [
    {
        id: 'post-1',
        author: {
            name: 'Gledyson Ferreira',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
            id: 'demo-user-1'
        },
        content: 'I miss Orkut so much! Does anyone else remember it? 😊',
        timestamp: 'November 30th ( one year ago )',
        likes: 24,
        comments: []
    },
    {
        id: 'post-2',
        author: {
            name: 'Maria Silva',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
            id: 'demo-user-2'
        },
        content: 'Good morning, everyone! How are you?',
        timestamp: 'November 29th ( one year ago )',
        likes: 15,
        comments: []
    },
    {
        id: 'post-3',
        author: {
            name: 'João Santos',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
            id: 'demo-user-3'
        },
        content: 'Finally back on Orkut! 🎉',
        timestamp: 'November 28th ( one year ago )',
        likes: 32,
        comments: []
    }
]

// Demo data for friend suggestions
const demoFriendSuggestions = [
    {
        id: 'suggest-1',
        name: 'Carlos Mendes',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
    },
    {
        id: 'suggest-2',
        name: 'Fernanda Costa',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    {
        id: 'suggest-3',
        name: 'Bruno Alves',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    }
]



// Post creation form component
const PostCreationForm = ({ postText, onPostChange, onPost, onCancel }) => (
    <div className="post-creation-form">
        <textarea
            placeholder="Say something to your friends or post a photo, video, or other link here."
            value={postText}
            onChange={onPostChange}
            rows="3"
        />
        <div className="post-actions">
            <button onClick={onPost} disabled={!postText.trim()}>post</button>
            {/* <button onClick={onCancel}>cancel</button> */}
        </div>
    </div>
)

// Lucky day fortune component
const LuckyDayFortune = () => (
    <div className="lucky-day-fortune">
        <div className="fortune-icon">
            <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Fortune" />
        </div>
        <div className="fortune-content">
            <h3>Your lucky day ( December 1st )</h3>
            <p>There's no better deal than life. You get it for nothing.</p>
        </div>
    </div>
)

// Post component
const Post = ({ post }) => (
    <div className="post-item">
        <div className="post-header">
            <img src={post.author.image} alt={post.author.name} className="post-author-avatar" />
            <div className="post-author-info">
                <Link to={`/profile/${post.author.id}`} className="post-author-name">
                    {post.author.name}
                </Link>
                <span className="post-timestamp"> - {post.timestamp}</span>
            </div>
        </div>
        <div className="post-content">
            {post.content}
        </div>
    </div>
)

// Friend suggestions component
const PeopleSuggestions = ({ suggestions, onDismiss }) => (
    <div className="people-suggestions">
        <h3>People you might know on Orkut</h3>
        <div className="suggestions-list">
            {suggestions.map(person => (
                <div key={person.id} className="suggestion-item">
                    <img src={person.image} alt={person.name} />
                    <div className="suggestion-info">
                        <Link to={`/profile/${person.id}`} className="suggestion-name">
                            {person.name}
                        </Link>
                        <Link to={`/profile/${person.id}`} className="suggestion-action">
                            to add
                        </Link>
                    </div>
                    <button className="suggestion-dismiss" onClick={() => onDismiss(person.id)}>×</button>
                </div>
            ))}
        </div>
    </div>
)



function Home() {
    const [user, setUser] = useState(null)
    const [postText, setPostText] = useState('')
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [posts, setPosts] = useState(demoPosts)
    const [suggestions, setSuggestions] = useState(demoFriendSuggestions)

    useEffect(() => {
        // Get user from localStorage
        const storedUser = JSON.parse(localStorage.getItem('profile'))
        setUser(storedUser)
    }, [])

    const handlePostChange = (e) => {
        setPostText(e.target.value)
    }

    const handlePost = async () => {
        if (!postText.trim()) return

        // Get current user info
        const currentUser = user?.result || user

        // Create new post with user's information
        const newPost = {
            id: `post-${Date.now()}`,
            author: {
                name: currentUser?.name || 'User',
                image: currentUser?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
                id: currentUser?.id || 'current-user'
            },
            content: postText,
            timestamp: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }) + ' ( just now )',
            likes: 0,
            comments: []
        }

        // Add new post to the beginning of the posts array
        setPosts([newPost, ...posts])
        setPostText('')
    }

    const handlePostCancel = () => {
        setPostText('')
    }

    const handleDismissSuggestion = (userId) => {
        setSuggestions(suggestions.filter(s => s.id !== userId))
    }

    return (
        <div className="home-container">
            {/* Post Creation Form */}
            <ErrorBoundary>
                <div className="content-box">
                    <div className="home-greeting">
                        Hello {user?.result?.name || user?.name || 'User'}
                    </div>
                    <PostCreationForm
                        postText={postText}
                        onPostChange={handlePostChange}
                        onPost={handlePost}
                        onCancel={handlePostCancel}
                    />
                </div>
            </ErrorBoundary>

            {/* Updates Filter */}
            <ErrorBoundary>
                <div className="updates-filter">
                    <div className="filter-left">
                        <span>Updates from: </span>
                        <select>
                            <option>all</option>
                            <option>friends</option>
                            <option>communities</option>
                        </select>
                    </div>
                    <div className="filter-right">
                        <span>Orkut Style: </span>
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                        >
                            ⊞
                        </button>
                        <button
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </ErrorBoundary>

            {/* Lucky Day Fortune */}
            <ErrorBoundary>
                <div className="content-box">
                    <LuckyDayFortune />
                </div>
            </ErrorBoundary>

            {/* Posts Feed */}
            <ErrorBoundary>
                <div className="content-box posts-feed-container">
                    <div className={`posts-feed ${viewMode}-view`}>
                        {posts.map(post => (
                            <Post key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </ErrorBoundary>

            {/* People Suggestions */}
            <ErrorBoundary>
                <div className="content-box">
                    <PeopleSuggestions
                        suggestions={suggestions}
                        onDismiss={handleDismissSuggestion}
                    />
                </div>
            </ErrorBoundary>
        </div>
    )
}

export default Home
