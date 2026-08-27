import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
    // On initialise depuis le localStorage pour rester connecté après un refresh
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));

    const login = useCallback(async (pseudo: string, password: string) => {
        // /api/auth/login attend du form-urlencoded (OAuth2PasswordRequestForm)
        const body = new URLSearchParams();
        body.append('username', pseudo);
        body.append('password', password);

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => null);
            throw new Error(err?.detail || 'Identifiants incorrects');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        setToken(data.access_token);
    }, []);

    const register = useCallback(async (pseudo: string, password: string) => {
        // /api/auth/register attend du JSON (modèle Pydantic UserCreate)
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, password }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => null);
            throw new Error(err?.detail || "Échec de l'inscription");
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        setToken(null);
    }, []);

    return { token, isAuthenticated: !!token, login, register, logout };
};
