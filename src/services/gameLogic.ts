// src/services/gameLogic.ts
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export const evaluateGuess = (guess: string, solution: string): LetterStatus[] => {
    const result: LetterStatus[] = Array(guess.length).fill('absent');
    const solutionChars = solution.split('');

    // Passe 1 : Lettres bien placées
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === solution[i]) {
            result[i] = 'correct';
            solutionChars[i] = null;
        }
    }

    // Passe 2 : Lettres mal placées
    for (let i = 0; i < guess.length; i++) {
        if (result[i] !== 'correct' && solutionChars.includes(guess[i])) {
            result[i] = 'present';
            solutionChars[solutionChars.indexOf(guess[i])] = null;
        }
    }

    return result;
};