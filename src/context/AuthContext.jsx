import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authAPI from '../services/authAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async ({ email, password }) => {
        try {
            const foundUser = await authAPI.login({ email, password });

            if (foundUser) {
                setUser(foundUser);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(foundUser));
                return { success: true, user: foundUser };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Đăng nhập thất bại, vui lòng thử lại'
            };
        }
    };


    const signup = async (userData) => {
        try {
            const newUser = await authAPI.signup(
                userData.name,
                userData.email,
                userData.password
            );

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.message || 'Đăng ký thất bại, vui lòng thử lại'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };


    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                signup,
                isAdmin,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};