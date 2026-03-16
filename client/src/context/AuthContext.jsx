/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

// This line creates the "Storage Box" for your token
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // This line creates a piece of state to hold the token
    const [token, setToken] = useState(localStorage.getItem('token'));

    // This effect runs every time the token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};