import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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
  onboardingComplete: boolean | null;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  clearNewUserFlag: () => void;
  setOnboardingComplete: (complete: boolean) => void;
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

// Check localStorage first (instant)
function getLocalOnboardingStatus(): boolean | null {
  const complete = localStorage.getItem("locked_onboarding_complete") === "true";
  const skipped = localStorage.getItem("locked_onboarding_skipped") === "true";
  if (complete || skipped) return true;
  return null; // Unknown - need to check DB
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [onboardingComplete, setOnboardingCompleteState] = useState<boolean | null>(null);

  // Fast onboarding check - localStorage first, then DB
  const checkOnboardingStatus = useCallback(async (userId: string) => {
    // Instant check from localStorage
    const localStatus = getLocalOnboardingStatus();
    if (localStatus === true) {
      setOnboardingCompleteState(true);
      setIsNewUser(false);
      return;
    }

    // DB check (only if localStorage doesn't have status)
    try {
      const { data, error } = await supabase
        .from("onboarding_data")
        .select("completed")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking onboarding:", error);
        setOnboardingCompleteState(false);
        setIsNewUser(true);
        return;
      }

      const complete = data?.completed ?? false;
      if (complete) {
        localStorage.setItem("locked_onboarding_complete", "true");
      }
      setOnboardingCompleteState(complete);
      setIsNewUser(!complete);
    } catch (error) {
      console.error("Error checking onboarding:", error);
      setOnboardingCompleteState(false);
      setIsNewUser(true);
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
          // Check localStorage immediately (synchronous)
          const localStatus = getLocalOnboardingStatus();
          if (localStatus === true) {
            setOnboardingCompleteState(true);
            setIsNewUser(false);
            setLoading(false);
          } else {
            // Defer DB check to avoid deadlock
            setTimeout(() => {
              checkOnboardingStatus(session.user.id);
            }, 0);
            setLoading(false);
          }
        } else {
          setOnboardingCompleteState(null);
          setIsNewUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const mappedUser = mapSupabaseUser(session?.user ?? null);
      setUser(mappedUser);

      if (session?.user) {
        // Check localStorage immediately
        const localStatus = getLocalOnboardingStatus();
        if (localStatus === true) {
          setOnboardingCompleteState(true);
          setIsNewUser(false);
          setLoading(false);
        } else {
          setTimeout(() => {
            checkOnboardingStatus(session.user.id);
          }, 0);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkOnboardingStatus]);

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

        // Manually redirect to the OAuth URL
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
      setOnboardingCompleteState(null);
      // Clear cached onboarding status
      localStorage.removeItem("locked_onboarding_complete");
      localStorage.removeItem("locked_onboarding_skipped");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const clearNewUserFlag = useCallback(() => {
    setIsNewUser(false);
  }, []);

  const setOnboardingComplete = useCallback((complete: boolean) => {
    setOnboardingCompleteState(complete);
    if (complete) {
      localStorage.setItem("locked_onboarding_complete", "true");
      setIsNewUser(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isNewUser, 
      onboardingComplete,
      signInWithGoogle, 
      signOut, 
      clearNewUserFlag,
      setOnboardingComplete
    }}>
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
