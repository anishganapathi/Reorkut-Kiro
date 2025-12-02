import React, { useState } from 'react'
import '../css/Feed.css'

function Feed() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Debbie',
            authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            content: 'Just got back from an amazing trip to San Francisco! The Golden Gate Bridge was breathtaking 🌉',
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
            likes: 12,
            comments: 3,
            time: '2 hours ago'
        },
        {
            id: 2,
            author: 'Ryan Hayward',
            authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            content: 'New coffee shop in town! Best latte I\'ve ever had ☕',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
            likes: 8,
            comments: 2,
            time: '4 hours ago'
        },
        {
            id: 3,
            author: 'Christos',
            authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            content: 'Weekend vibes! 🎉 Anyone up for a beach party?',
            image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
            likes: 24,
            comments: 7,
            time: '6 hours ago'
        },
        {
            id: 4,
            author: 'Linda',
            authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            content: 'Just joined a new photography community! Check out my latest shots 📸',
            image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
            likes: 15,
            comments: 5,
            time: '8 hours ago'
        }
    ])

    const [newPost, setNewPost] = useState('')
    const [likedPosts, setLikedPosts] = useState([])

    const handleLike = (postId) => {
        if (likedPosts.includes(postId)) {
            setLikedPosts(likedPosts.filter(id => id !== postId))
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: post.likes - 1 } : post
            ))
        } else {
            setLikedPosts([...likedPosts, postId])
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            ))
        }
    }

    const handleCreatePost = () => {
        if (newPost.trim()) {
            const post = {
                id: posts.length + 1,
                author: 'Jason Folds',
                authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                content: newPost,
                likes: 0,
                comments: 0,
                time: 'Just now'
            }
            setPosts([post, ...posts])
            setNewPost('')
        }
    }

    return (
        <div className="feed-container">
            <div className="create-post">
                <h3>What's on your mind?</h3>
                <textarea
                    className="post-textarea"
                    placeholder="Share something with your friends..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows="3"
                />
                <button className="post-btn" onClick={handleCreatePost}>
                    Post
                </button>
            </div>

            <div className="feed-posts">
                {posts.map((post) => (
                    <div key={post.id} className="feed-post">
                        <div className="post-header">
                            <img src={post.authorImage} alt={post.author} className="post-avatar" />
                            <div className="post-author-info">
                                <span className="post-author">{post.author}</span>
                                <span className="post-time">{post.time}</span>
                            </div>
                        </div>
                        <div className="post-content">
                            <p>{post.content}</p>
                            {post.image && (
                                <img src={post.image} alt="Post" className="post-image" />
                            )}
                        </div>
                        <div className="post-actions">
                            <button
                                className={`action-btn ${likedPosts.includes(post.id) ? 'liked' : ''}`}
                                onClick={() => handleLike(post.id)}
                            >
                                ❤️ {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                            </button>
                            <button className="action-btn">
                                💬 {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
                            </button>
                            <button className="action-btn">
                                🔗 Share
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Feed
