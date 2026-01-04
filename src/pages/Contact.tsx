import { LandingNavbar } from "@/components/LandingNavbar";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Neyler</title>
        <meta name="description" content="Get in touch with the Neyler team. We're happy to hear from you about questions, feedback, or partnership ideas." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero">
        <LandingNavbar />
        
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            
            {/* Intro paragraph */}
            <p className="text-muted-foreground text-lg mb-8">
              This page is still simple for now — but we're always here to help.
            </p>
            
            {/* Main content */}
            <div className="space-y-6 text-foreground/80">
              <p className="text-base md:text-lg leading-relaxed">
                We're happy to hear from you. If you have questions, feedback, or partnership ideas, feel free to reach out.
              </p>
              
              <p className="text-base md:text-lg leading-relaxed">
                You can contact us at:{" "}
                <a 
                  href="mailto:support@neyler.com" 
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  support@neyler.com
                </a>
              </p>
              
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                We usually respond within a few business days.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/50 mt-auto">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <img src="/neyler-logo.png" alt="Neyler" className="h-6" />
            <p className="text-sm text-muted-foreground">© 2025 Neyler. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}