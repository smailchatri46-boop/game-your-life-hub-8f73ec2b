import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { User, Bell, CreditCard, LogOut, ChevronRight } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
        
        {/* Profile Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              J
            </div>
            <div>
              <h2 className="font-semibold text-lg">John Doe</h2>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
          </div>
          <Button variant="secondary" className="w-full justify-between" size="lg">
            <span className="flex items-center gap-3">
              <User className="w-5 h-5" />
              Edit Profile
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </GlassCard>
        
        {/* Settings List */}
        <GlassCard className="divide-y divide-border/50">
          <button className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <span className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <span className="font-medium">Notifications</span>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <span className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="font-medium block">Subscription</span>
                <span className="text-sm text-muted-foreground">Free Plan • 8 days left</span>
              </div>
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </GlassCard>
        
        {/* Upgrade Card */}
        <GlassCard className="p-6 mt-6" glow>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">✨</span>
            <div>
              <h3 className="font-display text-lg font-semibold">Upgrade to Pro</h3>
              <p className="text-sm text-muted-foreground">Unlock AI coaching & unlimited features</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="gradient" className="flex-1">
              $14/month
            </Button>
            <Button variant="secondary" className="flex-1">
              $7/month (yearly)
            </Button>
          </div>
        </GlassCard>
        
        {/* Sign Out */}
        <Button 
          variant="ghost" 
          className="w-full mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          size="lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </main>
    </div>
  );
}
