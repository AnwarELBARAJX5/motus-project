// src/components/Cell.tsx
import React from 'react';
import { LetterStatus } from '../services/gameLogic';

interface CellProps {
    value: string;
    status: LetterStatus;
}

export const Cell: React.FC<CellProps> = ({ value, status }) => {
    const baseClasses = "flex items-center justify-center w-12 h-12 text-2xl font-bold uppercase transition-all duration-300";

    const statusClasses = {
        correct: "bg-red-600 text-white border-2 border-red-700", // Carré rouge
        present: "bg-yellow-500 text-white rounded-full border-2 border-yellow-600", // Cercle jaune
        absent: "bg-blue-600 text-white border-2 border-blue-700", // Fond bleu[cite: 3]
        empty: "bg-transparent border-2 border-gray-400 text-black"
    };

    return (
        <div className={`${baseClasses} ${statusClasses[status]}`}>
            {value}
        </div>
    );
};