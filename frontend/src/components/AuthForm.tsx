import React, { useState } from 'react';

interface AuthFormProps {
    onLogin: (pseudo: string, password: string) => Promise<void>;
    onRegister: (pseudo: string, password: string) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                await onLogin(pseudo, password);
                // En cas de succès, App bascule automatiquement vers le jeu
            } else {
                await onRegister(pseudo, password);
                setInfo('Compte créé ! Connecte-toi pour jouer.');
                setMode('login');
                setPassword('');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(prev => (prev === 'login' ? 'register' : 'login'));
        setError(null);
        setInfo(null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-80 flex flex-col gap-4"
        >
            <h2 className="text-2xl font-bold text-center text-blue-400">
                {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h2>

            <input
                type="text"
                placeholder="Pseudo"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                required
                autoComplete="username"
                className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-400"
            />

            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-400"
            />

            {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            {info && (
                <p className="text-green-400 text-sm text-center">{info}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>

            <button
                type="button"
                onClick={switchMode}
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
            >
                {mode === 'login'
                    ? "Pas encore de compte ? S'inscrire"
                    : 'Déjà un compte ? Se connecter'}
            </button>
        </form>
    );
};
