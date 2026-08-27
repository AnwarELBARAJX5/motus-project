import React, { useState, useCallback, useMemo } from 'react';
import { useMotusGame } from '../services/useMotusGame';
import { Grid } from './Grid';
import { Leaderboard } from './Leaderboard';

interface GameProps {
    onLogout: () => void;
}

// Niveaux de difficulté : la longueur du mot (5 à 10 lettres)
const WORD_LENGTHS = [5, 6, 7, 8, 9, 10];

const LOSS_PHRASES = [
    "Pas de panique, ce sera pour la prochaine fois !",
    "Presque ! Retente ta chance.",
    "Ce mot était coriace… Rejoue pour te venger !",
    "Courage, la prochaine est la bonne !",
];

export const Game: React.FC<GameProps> = ({ onLogout }) => {
    // Longueur du mot = niveau de difficulté ; en changer relance une partie
    const [wordLength, setWordLength] = useState(6);

    // refreshKey change à chaque score envoyé → recharge le classement
    const [refreshKey, setRefreshKey] = useState(0);
    const handleScoreSubmitted = useCallback(() => setRefreshKey(k => k + 1), []);

    // Si le token est expiré/invalide (401), on déconnecte pour réafficher le login
    const { gameState, initGame } = useMotusGame(wordLength, onLogout, handleScoreSubmitted);

    // Phrase de consolation tirée au sort, mais stable pour une même partie
    const lossPhrase = useMemo(
        () => LOSS_PHRASES[Math.floor(Math.random() * LOSS_PHRASES.length)],
        [gameState.solution]
    );

    const isOver = gameState.status === 'won' || gameState.status === 'lost';

    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Colonne du jeu */}
            <div className="flex flex-col items-center">
                {/* Sélecteur de difficulté (longueur du mot) */}
                <div className="mb-6 flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-400">Difficulté (nombre de lettres)</span>
                    <div className="flex gap-2">
                        {WORD_LENGTHS.map(len => (
                            <button
                                key={len}
                                onClick={() => setWordLength(len)}
                                className={`w-9 h-9 rounded font-bold transition-colors ${
                                    len === wordLength
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {len}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                    {gameState.status === 'loading' ? (
                        <p className="text-gray-400 text-center animate-pulse">
                            Initialisation de la grille...
                        </p>
                    ) : (
                        <Grid
                            guesses={gameState.guesses}
                            currentGuess={gameState.currentGuess}
                            solution={gameState.solution}
                            evaluations={gameState.evaluations}
                        />
                    )}
                </div>

                {gameState.status === 'won' && (
                    <div className="mt-8 p-4 bg-green-900/50 text-green-400 border border-green-500 rounded text-center text-xl font-bold">
                        Victoire ! Score enregistré.
                    </div>
                )}

                {gameState.status === 'lost' && (
                    <div className="mt-8 p-4 bg-red-900/50 text-red-300 border border-red-500 rounded text-center">
                        <p className="text-lg">{lossPhrase}</p>
                        <p className="mt-2">
                            Le mot était :{' '}
                            <span className="font-bold tracking-widest text-red-400 text-xl">
                                {gameState.solution}
                            </span>
                        </p>
                    </div>
                )}

                {isOver && (
                    <button
                        onClick={initGame}
                        className="mt-6 px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold transition-colors"
                    >
                        Rejouer
                    </button>
                )}

                <button
                    onClick={onLogout}
                    className="mt-8 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                    Se déconnecter
                </button>
            </div>

            {/* Colonne du classement */}
            <Leaderboard refreshKey={refreshKey} />
        </div>
    );
};
