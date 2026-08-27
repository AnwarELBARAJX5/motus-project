// src/components/Grid.tsx
import React from 'react';
import { Cell } from './Cell';
import type { LetterStatus } from '../services/gameLogic';
interface GridProps {
    guesses: string[];
    currentGuess: string;
    solution: string;
    evaluations: LetterStatus[][];
}

export const Grid: React.FC<GridProps> = ({ guesses, currentGuess, solution, evaluations }) => {
    const MAX_ATTEMPTS = 6;
    const WORD_LENGTH = solution.length;
    // La ligne de saisie n'est affichée que tant qu'il reste des essais
    const showCurrentRow = guesses.length < MAX_ATTEMPTS;
    // Nombre de lignes vides restantes (jamais négatif, sinon Array() lève un RangeError)
    const emptyRowCount = Math.max(0, MAX_ATTEMPTS - guesses.length - (showCurrentRow ? 1 : 0));
    const empties = Array.from(Array(emptyRowCount));

    return (
        <div className="grid gap-2">
            {guesses.map((guess, i) => (
                <div key={i} className="flex gap-2">
                    {guess.split('').map((letter, j) => (
                        <Cell key={j} value={letter} status={evaluations[i][j]} />
                    ))}
                </div>
            ))}

            {showCurrentRow && (
                <div className="flex gap-2">
                    {Array.from(Array(WORD_LENGTH)).map((_, i) => {
                        // Affichage de la première lettre par défaut[cite: 3]
                        const isFirstLetter = guesses.length === 0 && i === 0;
                        const value = isFirstLetter ? solution[0] : (currentGuess[i] || '');
                        return <Cell key={i} value={value} status="empty" />;
                    })}
                </div>
            )}

            {empties.map((_, i) => (
                <div key={`empty-${i}`} className="flex gap-2">
                    {Array.from(Array(WORD_LENGTH)).map((_, j) => (
                        <Cell key={j} value="" status="empty" />
                    ))}
                </div>
            ))}
        </div>
    );
};