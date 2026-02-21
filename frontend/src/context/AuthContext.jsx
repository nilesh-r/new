import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load, if a token exists, fetch the full user profile (including roles)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me')
                .then(res => {
                    if (res.data.success) {
                        setUser(res.data.data); // full User object including roles array
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.success) {
            const token = response.data.data.accessToken;
            localStorage.setItem('token', token);
            // After saving token, fetch full user profile with roles immediately
            const meRes = await api.get('/auth/me');
            if (meRes.data.success) {
                setUser(meRes.data.data);
            }
        } else {
            throw new Error(response.data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Helper: check if the logged-in user has a given role, e.g. 'ROLE_ADMIN'
    // UserDto.roles is a flat Set<RoleName> (plain strings like "ROLE_ADMIN")
    const hasRole = (roleName) => {
        if (!user?.roles) return false;
        // Handles both array of strings and array of objects
        return user.roles.includes(roleName) || user.roles.some(r => r === roleName || r?.name === roleName);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
