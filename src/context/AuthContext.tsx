import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DEV BYPASS: Clear loader if using placeholders for quick preview
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey || (typeof apiKey === 'string' && (apiKey.includes('your_api_key') || apiKey.includes('your-api-key')))) {
      setTimeout(() => {
        setLoading(false);
        setUser({ uid: 'mock_123', email: 'demo@postgen.ai' } as any);
      }, 500);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-800 font-semibold text-lg animate-pulse">
          Initializing Dashboard Shell...
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
