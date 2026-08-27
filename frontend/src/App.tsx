import React from 'react';
import { useMotusGame } from './services/useMotusGame';
import { Grid } from './components/Grid';

function App() {
  const { gameState } = useMotusGame(6);

  return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-20">
        <h1 className="text-5xl font-bold mb-12 tracking-widest text-blue-400">
          MOTUS
        </h1>

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
            <div className="mt-8 p-4 bg-green-900/50 text-green-400 border border-green-500 rounded text-xl font-bold">
              Victoire ! Score enregistré.
            </div>
        )}
        {gameState.status === 'lost' && (
            <div className="mt-8 p-4 bg-red-900/50 text-red-400 border border-red-500 rounded text-xl font-bold">
              Défaite. Le mot était : {gameState.solution}
            </div>
        )}
      </div>
  );
}

export default App;