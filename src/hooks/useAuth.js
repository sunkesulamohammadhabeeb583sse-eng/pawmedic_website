import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';

export const useAuth = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return false;
        }

        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(userData);
        } catch (e) {
            setUser(null);
        }
        setLoading(false);
        return true;
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        checkAuth();
        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        checkAuth
    };
};
