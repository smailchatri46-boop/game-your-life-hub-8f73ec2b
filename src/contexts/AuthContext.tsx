import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { hasCompletedOnboarding } from "@/services/supabase/onboarding";

interface AuthUser {
  id: string;
  email: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isNewUser: boolean | null;
  onboardingChecked: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  clearNewUserFlag: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert Supabase User to our AuthUser type
const mapSupabaseUser = (supabaseUser: User | null): AuthUser | null => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? null,
    user_metadata: {
      full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
      avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    },
  };
};

// Synchronous localStorage check - instant, no DB call needed
function hasCompletedOnboardingLocally(): boolean {
  return (
    localStorage.getItem("locked_onboarding_complete") === "true" ||
    localStorage.getItem("locked_onboarding_skipped") === "true"
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Check onboarding: localStorage first (instant), then DB only if needed
  const checkUserStatus = useCallback(async (userId: string) => {
    try {
      // Instant localStorage check - no network call
      if (hasCompletedOnboardingLocally()) {
        setIsNewUser(false);
        setOnboardingChecked(true);
        return;
      }

      // Only hit DB if localStorage doesn't have the answer
      const dbOnboardingComplete = await hasCompletedOnboarding(userId);
      
      if (dbOnboardingComplete) {
        // Sync localStorage so future checks are instant
        localStorage.setItem("locked_onboarding_complete", "true");
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      setIsNewUser(true);
    } finally {
      setOnboardingChecked(true);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const mappedUser = mapSupabaseUser(session?.user ?? null);
        setUser(mappedUser);

        if (session?.user) {
          // Call directly - no setTimeout delay
          checkUserStatus(session.user.id);
        } else {
          setIsNewUser(null);
          // No user => nothing to check; mark as resolved so guards can render
          setOnboardingChecked(true);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const mappedUser = mapSupabaseUser(session?.user ?? null);
      setUser(mappedUser);

      if (session?.user) {
        // Call directly - no setTimeout delay
        checkUserStatus(session.user.id);
      } else {
        // No user => nothing to check; mark as resolved so guards can render
        setOnboardingChecked(true);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkUserStatus]);


  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    try {
      // Detect if we're on a custom domain (not Lovable preview/editor/localhost)
      const isCustomDomain =
        !window.location.hostname.includes("lovable.app") &&
        !window.location.hostname.includes("lovableproject.com") &&
        !window.location.hostname.includes("localhost");

      // Store the current origin to ensure proper redirect after OAuth
      sessionStorage.setItem("auth_redirect_origin", window.location.origin);

      if (isCustomDomain) {
        // Bypass Lovable auth-bridge for custom domains by using Supabase directly
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/onboarding`,
            skipBrowserRedirect: true,
          },
        });

        if (error) {
          console.error("Google sign-in error:", error);
          return { error };
        }

        if (data?.url) {
          window.location.href = data.url;
        }
        return { error: null };
      } else {
        // For Lovable domains, use the managed auth flow
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });

        if (result.error) {
          return { error: result.error };
        }

        return { error: null };
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsNewUser(null);
      setOnboardingChecked(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const clearNewUserFlag = useCallback(() => {
    setIsNewUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, isNewUser, onboardingChecked, signInWithGoogle, signOut, clearNewUserFlag }}>
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
