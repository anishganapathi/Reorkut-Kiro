import { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // Display fallback UI
            return (
                <div className="error-boundary-fallback">
                    {this.props.fallback || (
                        <div className="error-message">
                            Something went wrong in this section. Please try refreshing the page.
                        </div>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
