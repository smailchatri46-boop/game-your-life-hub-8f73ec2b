import { LandingNavbar } from "@/components/LandingNavbar";
import { Helmet } from "react-helmet-async";
import { Mail } from "lucide-react";
import neylerLogo from "@/assets/neyler-logo.png";
import { toast } from "sonner";

export default function Contact() {
  const email = "support@neyler.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copied to clipboard", {
        className: "glass-card !bg-card/90 !backdrop-blur-xl !border-white/50 !text-muted-foreground !text-sm !font-medium",
        duration: 2000,
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast("Email copied to clipboard", {
        className: "glass-card !bg-card/90 !backdrop-blur-xl !border-white/50 !text-muted-foreground !text-sm !font-medium",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Neyler</title>
        <meta name="description" content="Get in touch with the Neyler team. We're happy to hear from you about questions, feedback, or partnership ideas." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero flex flex-col">
        <LandingNavbar />
        
        {/* Main content - grows to push footer down */}
        <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
          <div className="max-w-xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary-gradient shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            
            {/* Intro paragraph */}
            <p className="text-muted-foreground text-lg mb-10">
              We're always here to help.
            </p>
            
            {/* Main content card */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-5">
              <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                We're happy to hear from you. If you have questions, feedback, partnership ideas, or are facing any issues with the app, feel free to reach out.
              </p>
              
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-2">You can contact us at:</p>
                <button 
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 text-primary text-lg font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  {email}
                </button>
              </div>
              
              <p className="text-muted-foreground text-sm">
                We usually respond within a few hours.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer - sticks to bottom */}
        <footer className="py-6 px-4 border-t border-border/30">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src={neylerLogo} alt="Neyler" className="h-6" />
            <p className="text-sm text-muted-foreground">© 2025 Neyler. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}