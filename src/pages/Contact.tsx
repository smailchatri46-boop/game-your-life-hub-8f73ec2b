import { LandingNavbar } from "@/components/LandingNavbar";
import { Helmet } from "react-helmet-async";
import { Mail } from "lucide-react";
import neylerLogo from "@/assets/neyler-logo.png";

export default function Contact() {
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
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            
            {/* Intro paragraph */}
            <p className="text-muted-foreground text-lg mb-10">
              This page is still simple for now — but we're always here to help.
            </p>
            
            {/* Main content card */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-5">
              <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                We're happy to hear from you. If you have questions, feedback, or partnership ideas, feel free to reach out.
              </p>
              
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-2">You can contact us at:</p>
                <a 
                  href="mailto:support@neyler.com" 
                  className="inline-flex items-center gap-2 text-primary text-lg font-semibold hover:opacity-80 transition-opacity"
                >
                  <Mail className="w-5 h-5" />
                  support@neyler.com
                </a>
              </div>
              
              <p className="text-muted-foreground text-sm">
                We usually respond within a few business days.
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