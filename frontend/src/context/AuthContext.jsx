import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token / get user profile
            api.get('/auth/me') // Assuming an endpoint exists or just decode token if stateless
                .then(res => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
            setLoading(false); // For now just stop loading
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        // ApiResponse structure: { success, message, data: { accessToken, tokenType } }
        if (response.data.success) {
            const token = response.data.data.accessToken;
            localStorage.setItem('token', token);
            setUser({ username }); // Role not returned in login, need to fetch 'me'
            // Trigger a fetch me or set user state
        } else {
            throw new Error(response.data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
