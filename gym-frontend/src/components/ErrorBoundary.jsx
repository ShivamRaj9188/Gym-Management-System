import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <section className="card border-0 shadow-sm">
                    <div className="card-body p-4 text-center">
                        <h2 className="h3 mb-3">Something went wrong</h2>
                        <p className="text-muted mb-3">An unexpected error occurred. Please try refreshing the page.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                    </div>
                </section>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
