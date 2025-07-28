import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    const quoteCategories = [
        {
            id: 1,
            title: 'Motivational Quotes',
            description: 'Get inspired with powerful motivational quotes to fuel your ambition',
            path: '/quotes/motivational'
        },
        {
            id: 2,
            title: 'Funny Quotes',
            description: 'Brighten your day with humorous quotes and witty observations',
            path: '/quotes/funny'
        },
        {
            id: 3,
            title: 'Romantic Quotes',
            description: 'Express your feelings with beautiful romantic quotes',
            path: '/quotes/romantic'
        },
        {
            id: 4,
            title: 'Faith Quotes',
            description: 'Elevate your spirit with the words of faith',
            path: '/quotes/faith'
        }
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <nav className="navbar">
                <h1 className="navbar-brand">Rain Quote</h1>
                <div className="navbar-actions">
                    <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </nav>
            
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>Welcome, {user?.username}!</h1>
                    <p className="dashboard-subtitle">Discover and save your favorite quotes</p>
                </header>
                
                <div className="categories-grid">
                    {quoteCategories.map(category => (
                        <Link to={category.path} key={category.id} className="category-card">
                            <h2>{category.title}</h2>
                            <p>{category.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;