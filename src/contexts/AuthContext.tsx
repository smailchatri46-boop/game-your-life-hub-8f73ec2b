import { createContext, useContext, useState, ReactNode } from "react";

// Stub types - will be replaced with Firebase Auth types
interface User {
  id: string;
  email: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // Stub - will be replaced with Firebase Auth
  const signInWithGoogle = async () => {
    console.log("Firebase Auth not configured yet");
    return { error: new Error("Firebase Auth not configured") };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
