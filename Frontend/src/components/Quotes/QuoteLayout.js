import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Quotes.css';

const QuoteLayout = ({ title, fetchQuotes }) => {
    const [quotes, setQuotes] = useState([]);
    const [savedQuotes, setSavedQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

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

    const loadQuotes = useCallback(async () => {
        try {
            const fetchedQuotes = await fetchQuotes();
            setQuotes(fetchedQuotes);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchQuotes]);

    useEffect(() => {
        loadQuotes();
        const saved = JSON.parse(localStorage.getItem(`saved_${title}`) || '[]');
        setSavedQuotes(saved);
    }, [title, loadQuotes]);

    const handleSaveQuote = (quote) => {
        const isAlreadySaved = savedQuotes.some(
            savedQuote => savedQuote.text === quote.text && savedQuote.author === quote.author
        );
        
        if (!isAlreadySaved) {
            const newSavedQuotes = [...savedQuotes, quote];
            setSavedQuotes(newSavedQuotes);
            localStorage.setItem(`saved_${title}`, JSON.stringify(newSavedQuotes));
        }
    };

    const handleRemoveQuote = (index) => {
        const newSavedQuotes = savedQuotes.filter((_, i) => i !== index);
        setSavedQuotes(newSavedQuotes);
        localStorage.setItem(`saved_${title}`, JSON.stringify(newSavedQuotes));
    };

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
            <>
                <nav className="navbar">
                    <h1 className="navbar-brand">Rain Quote </h1>
                    <div className="navbar-actions">
                        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </nav>
                <div className="quotes-layout">
                    <div className="quotes-main">
                        <div className="loading">Loading quotes...</div>
                    </div>
                </div>
            </>
        );
    }

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
            
            <div className="quotes-layout">
                <div className="quotes-main">
                    <div className="quotes-header">
                        <button className="back-button" onClick={() => navigate('/dashboard')}>
                            ← Back to Dashboard
                        </button>
                        <h1>{title}</h1>
                    </div>
                    
                    {quotes.map((quote, index) => (
                        <div key={index} className="quote-card">
                            <p className="quote-text">"{quote.text}"</p>
                            <p className="quote-author">— {quote.author || 'Unknown'}</p>
                            <button 
                                className="save-button"
                                onClick={() => handleSaveQuote(quote)}
                                title="Save Quote"
                            >
                                ♥
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="quotes-sidebar">
                    <h2 className="saved-quotes-title">Saved Quotes</h2>
                    {savedQuotes.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            No saved quotes yet. Click the heart icon to save quotes!
                        </p>
                    ) : (
                        savedQuotes.map((quote, index) => (
                            <div key={index} className="saved-quote">
                                <p className="quote-text">"{quote.text}"</p>
                                <p className="quote-author">— {quote.author || 'Unknown'}</p>
                                <button 
                                    className="remove-saved"
                                    onClick={() => handleRemoveQuote(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default QuoteLayout;