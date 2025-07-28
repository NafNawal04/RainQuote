import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme preference on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const features = [
        {
            icon: '📚',
            title: 'Diverse Categories',
            description: 'Explore motivational, funny, romantic, and inspirational quotes from various sources'
        },
        {
            icon: '💾',
            title: 'Save Favorites',
            description: 'Keep your favorite quotes organized and easily accessible whenever you need inspiration'
        },
        {
            icon: '🎨',
            title: 'Clean Interface',
            description: 'Enjoy a minimalist, distraction-free experience designed for focus and clarity'
        },
        {
            icon: '🌙',
            title: 'Dark Mode',
            description: 'Switch between light and dark themes for comfortable reading at any time'
        }
    ];

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-brand">Rain Quote</Link>
                <div className="navbar-actions">
                    <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <Link to="/login" className="nav-link">Sign In</Link>
                    <Link to="/register" className="get-started-button">
                        Get Started
                    </Link>
                </div>
            </nav>

            <div className="landing-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover Inspiration in Every Quote
                        </h1>
                        <p className="hero-subtitle">
                            Find, save, and share meaningful quotes that resonate with your journey. 
                            From motivation to humor, explore thousands of carefully curated quotes.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="cta-button secondary">
                                Start Exploring
                            </Link>
                            <Link to="/login" className="cta-button secondary">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="features-container">
                        <h2 className="section-title">Why Choose Rain Quote?</h2>
                        <div className="features-grid">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Get Inspired?</h2>
                        <p className="cta-subtitle">
                            Join thousands of users who find daily inspiration through our curated collection of quotes.
                        </p>
                        <Link to="/register" className="cta-button primary large">
                            Create Your Account
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; 2024 Rain Quote. All rights reserved.</p>
                        <div className="footer-links">
                            <Link to="/login">Sign In</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Landing;