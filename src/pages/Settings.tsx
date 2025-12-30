import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/UpgradeModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { exportUserData, downloadTextFile } from "@/utils/exportChatData";
import { toast } from "sonner";
import { 
  User, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Shield,
  Smartphone,
  Trash2
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

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null; avatar_url: string | null }>({ 
    full_name: null, 
    email: null, 
    avatar_url: null 
  });
  const [exporting, setExporting] = useState(false);

  // For demo purposes - in real app this would come from subscription data
  const isPro = false;

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
          }
        });
    }
  }, [user, showEditProfile]);

  const displayName = profile.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile.email || user?.email || "";
  const avatarColor = profile.avatar_url || "from-primary to-accent";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement actual account deletion
    toast.success("Account deletion initiated");
  };

  const handleDownloadData = async () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (!user) return;
    
    setExporting(true);
    try {
      const data = await exportUserData(user.id);
      downloadTextFile(data, `locked-wellness-export-${new Date().toISOString().split('T')[0]}.txt`);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
        
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
            onClick={() => setShowUpgradeModal(true)}
            className="w-full p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors rounded-3xl"
          >
            <span className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="font-medium block text-foreground">Subscription</span>
                <span className="text-sm text-muted-foreground">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </span>
              </div>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>
        
        {/* Upgrade Card */}
        {!isPro && (
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
              onClick={() => setShowUpgradeModal(true)}
              className="w-full rounded-full text-primary-foreground font-medium"
              style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
            >
              View plans
            </Button>
          </GlassCard>
        )}

        {/* Download Data */}
        <Button
          variant="secondary"
          onClick={handleDownloadData}
          disabled={exporting}
          className="w-full rounded-full mb-6 h-12 bg-white hover:bg-white/90 text-foreground border-0"
        >
          {exporting ? "Exporting..." : "Download my data"}
        </Button>
        
        {/* Privacy & Security */}
        <GlassCard className="divide-y divide-border/30 mb-6">
          <div className="p-5 flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-sans font-semibold text-foreground">Privacy and Security</span>
          </div>
          
          <button className="w-full p-5 flex items-center justify-between opacity-50 cursor-not-allowed">
            <span className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-medium block text-foreground">Two-Factor Authentication</span>
                <span className="text-xs text-muted-foreground">Coming soon</span>
              </div>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button 
            onClick={() => setShowDeleteAccount(true)}
            className="w-full p-5 flex items-center justify-between hover:bg-destructive/5 transition-colors rounded-b-3xl"
          >
            <span className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <span className="font-medium text-destructive">Delete Account</span>
            </span>
            <ChevronRight className="w-5 h-5 text-destructive/50" />
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
      <UpgradeModal 
        open={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
      
      <EditProfileModal 
        open={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
      
      <DeleteAccountModal
        open={showDeleteAccount} 
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
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
    </div>
  );
}
