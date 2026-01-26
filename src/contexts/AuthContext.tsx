import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

// User type matching Firebase User structure
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

// Convert Firebase User to our User type
const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    user_metadata: {
      full_name: firebaseUser.displayName || undefined,
      avatar_url: firebaseUser.photoURL || undefined,
    },
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured()) {
      console.warn("Firebase Auth not configured");
      setLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const mappedUser = mapFirebaseUser(firebaseUser);
      setUser(mappedUser);
      
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setSession({
          user: mappedUser!,
          access_token: token,
        });
      } else {
        setSession(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    if (!auth || !isFirebaseConfigured()) {
      return { error: new Error("Firebase Auth not configured. Please add your Firebase credentials.") };
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
      return { error: null };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!auth) return;
    
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
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
