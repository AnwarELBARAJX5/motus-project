import React, { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

interface LeaderboardEntry {
    rank: number;
    pseudo: string;
    score: number;
}

interface LeaderboardProps {
    // Change de valeur pour forcer un rechargement (ex: après une partie)
    refreshKey?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ refreshKey }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const fetchLeaderboard = useCallback(async () => {
        setStatus('loading');
        try {
            const res = await fetch(`${API_URL}/api/game/leaderboard`);
            if (!res.ok) throw new Error('Erreur de chargement');
            setEntries(await res.json());
            setStatus('ready');
        } catch {
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard, refreshKey]);

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-80">
            <h2 className="text-xl font-bold text-center text-blue-400 mb-4 tracking-wide">
                Classement
            </h2>

            {status === 'loading' && (
                <p className="text-gray-400 text-center text-sm animate-pulse">Chargement…</p>
            )}
            {status === 'error' && (
                <p className="text-red-400 text-center text-sm">Classement indisponible</p>
            )}
            {status === 'ready' && entries.length === 0 && (
                <p className="text-gray-400 text-center text-sm">Aucun score pour le moment.</p>
            )}

            {status === 'ready' && entries.length > 0 && (
                <ul className="flex flex-col gap-1">
                    {entries.map(entry => (
                        <li
                            key={`${entry.rank}-${entry.pseudo}`}
                            className="flex items-center justify-between px-3 py-2 rounded bg-gray-700/50"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-8 text-center font-bold text-gray-400">{entry.rank}</span>
                                <span className="font-medium">{entry.pseudo}</span>
                            </span>
                            <span className="font-bold text-blue-300">{entry.score}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
