import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Login.css'
import "xp.css/dist/XP.css"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [demoLoading, setDemoLoading] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to get current user from API
                const user = await api.getCurrentUser()
                if (user) {
                    // User is already authenticated, redirect to home
                    navigate('/')
                }
            } catch (err) {
                // User is not authenticated, continue showing login page
                console.log('User not authenticated, showing login page')
            } finally {
                setCheckingAuth(false)
            }
        }

        checkAuth()
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await api.signIn({ email, password })
            const user = await api.getCurrentUser()
            localStorage.setItem('profile', JSON.stringify(user))
            // Force reload to ensure profile is fetched correctly
            window.location.href = '/'
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    const handleDemoLogin = async () => {
        setError('')
        setDemoLoading(true)
        try {
            await api.signInDemo()
            const user = await api.getCurrentUser()
            localStorage.setItem('profile', JSON.stringify(user))

            // Show welcome message for demo user
            if (user.email === 'sam7075938131@gmail.com') {
                localStorage.setItem('demoWelcome', 'true')
            }

            // Force reload to ensure profile is fetched correctly
            window.location.href = '/'
        } catch (err) {
            setError('Demo login failed. Please try again.')
        } finally {
            setDemoLoading(false)
        }
    }

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className="login-container">
                <div className="login-content">
                    <div className="loading-message">
                        Checking authentication...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="login-container">
            <div className="login-content">
                {/* Left Column: Logo and Description */}
                <div className="login-left">
                    <div className="login-logo-container">
                        <span className="orkut-logo-text">orkut</span>
                    </div>
                    <div className="login-description">
                        <p>
                            <span className="highlight-pink">Connect</span> with friends and family using scraps and instant messaging.
                        </p>
                        <p>
                            <span className="highlight-pink">Meet</span> new people through friends of friends and communities.
                        </p>
                        <p>
                            <span className="highlight-pink">Share</span> your videos, photos, and passions all in one place.
                        </p>
                    </div>
                </div>

                {/* Right Column: Login Form */}
                <div className="login-right">
                    <div className="login-box">
                        <h3 className="login-heading">Sign In</h3>
                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>e-mail:</label>
                                <input
                                    className="xp-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="input-hint">e.g., pat@example.com</div>
                            </div>

                            <div className="form-group">
                                <label>password:</label>
                                <input
                                    className="xp-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <div className="login-error">{error}</div>}

                            <div className="form-check xp-check">
                                <div className="field-row align-center">
                                    <input type="checkbox" id="remember" className="xp-checkbox" />
                                    <label htmlFor="remember">
                                        Remind me on this computer.
                                        <div className="note">Do not use on public computers [?]</div>
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="xp-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'entering...' : 'Sign In'}
                                </button>

                                {/* Demo Login Button */}
                                <button
                                    type="button"
                                    className="xp-btn demo-btn"
                                    onClick={handleDemoLogin}
                                    disabled={demoLoading}
                                >
                                    {demoLoading ? 'entering...' : 'Try Demo'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="signup-box">
                        <p>Not a member yet?</p>
                        <Link to="/register" className="join-now-link">ENTER NOW!</Link>
                    </div>
                </div>

            </div>

            <div className="login-footer">
                <span>© 2025 Orkut Nostalgia</span>
                <a href="#">About Orkut</a>
                <a href="#">Security Center</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Contact</a>
            </div>
        </div>
    )
}

export default Login