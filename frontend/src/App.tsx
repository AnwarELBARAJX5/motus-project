import { useAuth } from './services/useAuth';
import { Game } from './components/Game';
import { AuthForm } from './components/AuthForm';

function App() {
  const { isAuthenticated, login, register, logout } = useAuth();

  return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-20">
        <h1 className="text-5xl font-bold mb-12 tracking-widest text-blue-400">
          MOTUS
        </h1>

        {isAuthenticated ? (
            <Game onLogout={logout} />
        ) : (
            <AuthForm onLogin={login} onRegister={register} />
        )}
      </div>
  );
}

export default App;
