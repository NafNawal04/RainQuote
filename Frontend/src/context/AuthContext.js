import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/auth', {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                email,
                password
            }, { withCredentials: true });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', {
                username,
                email,
                password
            }, { withCredentials: true });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8081/api/auth/logout', {}, { withCredentials: true });
            setUser(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Logout failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
