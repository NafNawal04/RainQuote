/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessionId] = useState(() => {
    const existingSessionId = localStorage.getItem(`chat_session_${user?.id}`);
    if (existingSessionId) {
      return existingSessionId;
    }
    const newSessionId = `chat_${user?.id}_${Date.now()}`;
    localStorage.setItem(`chat_session_${user?.id}`, newSessionId);
    return newSessionId;
  });

  useEffect(() => {
    if (user && sessionId) {
      loadChatHistory();
    }
  }, [user, sessionId]);

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, [user]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:8081/api/chat/history/${sessionId}`,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        setMessages(response.data.history || []);
      }
    } catch (error) {
      setError('Failed to load chat history');
      console.error('Chat history error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(`chat_session_${user?.id}`);
    }
  }, [user]);

  const handleError = (error, defaultMessage) => {
    console.error('Chat error:', error);
    const errorMessage = error.response?.data?.message || defaultMessage;
    setError(errorMessage);
    
    if (error.response?.status === 401) {
      navigate('/login');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const ChatIcon = ({ size = 24, color = "currentColor" }) => (
    <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:8081/api/chat/ask',
        {
          question: input,
          sessionId
        },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        setMessages(prev => [...prev, 
          { role: 'user', content: input },
          { role: 'assistant', content: response.data.answer }
        ]);

        if (response.data.suggestion) {
          const shouldNavigate = window.confirm('Would you like to see some relevant quotes?');
          if (shouldNavigate) {
            navigate(`${response.data.suggestion}?session=${sessionId}`);
          }
        }
      }
    } catch (error) {
      handleError(error, 'Failed to send message');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <button 
        className="chat-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <ChatIcon size={20} color="#007bff" />
      </button>

      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span>AI Assistant</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="close-button"
          >
          X
          </button>
        </div>

        <div className="chat-messages">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`message-container ${msg.role === 'user' ? 'user-message-container' : 'assistant-message-container'}`}
              data-testid={`message-${idx}`}
            >
              <div className={`message ${msg.role}`}>
                {msg.content}
              </div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-container assistant-message-container">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="cta-button secondary">
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;