import { useState, useEffect, useCallback } from 'react';
import { LetterStatus, evaluateGuess } from './gameLogic';

interface GameState {
    solution: string;
    guesses: string[];
    currentGuess: string;
    evaluations: LetterStatus[][];
    status: 'playing' | 'won' | 'lost' | 'loading';
}

export const useMotusGame = (wordLength: number = 6) => {
    const [gameState, setGameState] = useState<GameState>({
        solution: '',
        guesses: [],
        currentGuess: '',
        evaluations: [],
        status: 'loading'
    });

    const MAX_ATTEMPTS = 6;
    const API_URL = import.meta.env.VITE_API_URL;


    const initGame = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/game/generate-word/${wordLength}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erreur de génération');

            const data = await response.json();
            setGameState(prev => ({ ...prev, solution: data.word, status: 'playing' }));
        } catch (error) {
            console.error('Échec de la connexion API');
        }
    }, [wordLength, API_URL]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const submitFinalScore = async (score: number) => {
        const token = localStorage.getItem('access_token');
        await fetch(`${API_URL}/api/game/submit-score?score=${score}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    // Gestion des frappes clavier
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState.status !== 'playing') return;

        if (e.key === 'Enter') {
            if (gameState.currentGuess.length !== wordLength) return;

            const newEvaluation = evaluateGuess(gameState.currentGuess, gameState.solution);
            const newGuesses = [...gameState.guesses, gameState.currentGuess];
            const newEvaluations = [...gameState.evaluations, newEvaluation];

            const isWin = gameState.currentGuess === gameState.solution;
            const isLoss = newGuesses.length >= MAX_ATTEMPTS && !isWin;
            setGameState(prev => ({
                ...prev,
                guesses: newGuesses,
                evaluations: newEvaluations,
                currentGuess: '',
                status: isWin ? 'won' : isLoss ? 'lost' : 'playing'
            }));

            if (isWin || isLoss) {
                const finalScore = isWin ? (MAX_ATTEMPTS - newGuesses.length + 1) * 100 : 0;
                submitFinalScore(finalScore);
            }
            return;
        }

        if (e.key === 'Backspace') {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess.slice(0, -1)
            }));
            return;
        }

        if (/^[a-zA-Z]$/.test(e.key) && gameState.currentGuess.length < wordLength) {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess + e.key.toUpperCase()
            }));
        }
    }, [gameState, wordLength]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return { gameState, initGame };
};