import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { PaywallModal } from "@/components/PaywallModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { CancellationFlow } from "@/components/CancellationFlow";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import { getProfile } from "@/services/firestore/profiles";
import { 
  User, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Shield,
  Smartphone
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppleEmoji } from "@/components/AppleEmoji";
import { SettingsChecklist } from "@/components/SettingsChecklist";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { subscription, cancelSubscription, applyDiscount } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showCancellationFlow, setShowCancellationFlow] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null; avatar_url: string | null }>({ 
    full_name: null, 
    email: null, 
    avatar_url: null 
  });
  
  const isSubscribed = subscription?.isActive;
  const isMonthlyPlan = subscription?.plan === "monthly";
  const isYearlyPlan = subscription?.plan === "yearly";

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const profileData = await getProfile(user.id);
        if (profileData) {
          setProfile({
            full_name: profileData.full_name,
            email: profileData.email,
            avatar_url: profileData.avatar_url,
          });
        }
      }
    };
    loadProfile();
  }, [user, showEditProfile]);

  const displayName = profile.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile.email || user?.email || "";
  const avatarColor = profile.avatar_url || "from-primary to-accent";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSubscriptionClick = () => {
    if (!isSubscribed) {
      setShowPaywall(true);
    } else {
      // For paid users, open the Polar customer portal to manage subscription
      window.open("https://polar.sh/neyler/portal", "_blank");
    }
  };

  const handleCancelSubscription = () => {
    setShowCancellationFlow(true);
  };

  const handleConfirmCancel = async () => {
    const result = await cancelSubscription();
    if (result.success) {
      toast.success("Subscription cancelled. You'll have access until the end of your billing period.");
      setShowCancellationFlow(false);
    } else {
      toast.error(result.error || "Failed to cancel subscription");
    }
  };

  const handleAcceptOffer = async () => {
    // Apply the Neyler3 discount code (50% off for 3 months)
    const result = await applyDiscount("Neyler3");
    if (result.success) {
      toast.success("50% discount applied for 3 months!");
      setShowCancellationFlow(false);
    } else {
      toast.error(result.error || "Failed to apply discount");
    }
  };

  const handlePauseSubscription = async () => {
    // Note: Polar doesn't have native pause functionality
    // We'll redirect to the portal for now
    toast.info("Redirecting to subscription portal...");
    window.open("https://polar.sh/neyler/portal", "_blank");
    setShowCancellationFlow(false);
  };

  const getPlanDisplayName = () => {
    if (!isSubscribed) return "Free Plan";
    if (isYearlyPlan) return "Pro Plan (Yearly)";
    if (isMonthlyPlan) return "Pro Plan (Monthly)";
    return "Pro Plan";
  };

  return (
    <>
      
      <main className="pt-28 pb-12 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
        
        {/* Getting Started Checklist */}
        <SettingsChecklist />
        
        {/* Profile Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {initial}
            </div>
            <div>
              <h2 className="font-sans italic text-lg text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{displayEmail}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowEditProfile(true)}
            className="w-full p-4 flex items-center justify-between rounded-2xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
          >
            <span className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Edit Profile</span>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>
        
        {/* Subscription Card */}
        <GlassCard className="mb-6">
          <button 
            onClick={handleSubscriptionClick}
            className="w-full p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors rounded-3xl"
          >
            <span className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="font-medium block text-foreground">Subscription</span>
                <span className="text-sm text-muted-foreground">
                  {getPlanDisplayName()}
                </span>
              </div>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* Cancel Subscription - only show for paid users */}
          {isSubscribed && (
            <div className="px-5 pb-5">
              <Button 
                variant="ghost"
                onClick={handleCancelSubscription}
                className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl"
              >
                Cancel Subscription
              </Button>
            </div>
          )}
        </GlassCard>
        
        {/* Upgrade Card - only show for free users */}
        {!isSubscribed && (
          <GlassCard className="p-6 mb-6" glow>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <AppleEmoji emoji="💰" className="text-2xl" />
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground">Unlock AI coaching & premium features</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPaywall(true)}
              className="w-full rounded-full text-primary-foreground font-medium"
              style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
            >
              View plans
            </Button>
          </GlassCard>
        )}

        {/* Privacy & Security */}
        <GlassCard className="divide-y divide-border/30 mb-6">
          <div className="p-5 flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-sans font-semibold text-foreground">Privacy and Security</span>
          </div>
          
          <button className="w-full p-5 flex items-center justify-between opacity-50 cursor-not-allowed rounded-b-3xl">
            <span className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-medium block text-foreground">Two-Factor Authentication</span>
                <span className="text-xs text-muted-foreground">Coming soon</span>
              </div>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>
        
        {/* Sign Out */}
        <Button 
          variant="ghost" 
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl"
          size="lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </main>

      {/* Modals */}
      <PaywallModal 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        limitType="habits"
        limitMessage="Upgrade your plan to unlock all features"
      />
      
      <EditProfileModal 
        open={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />

      {/* Cancellation Flow */}
      <CancellationFlow
        open={showCancellationFlow}
        onClose={() => setShowCancellationFlow(false)}
        onConfirmCancel={handleConfirmCancel}
        onAcceptOffer={handleAcceptOffer}
        onPauseSubscription={handlePauseSubscription}
        isYearlyPlan={isYearlyPlan}
      />

      {/* Sign Out Confirmation */}
      <AlertDialog open={showSignOutConfirm} onOpenChange={setShowSignOutConfirm}>
        <AlertDialogContent className="rounded-3xl border-border/20 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="flex-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
