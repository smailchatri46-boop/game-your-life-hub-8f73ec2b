import { LandingNavbar } from "@/components/LandingNavbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Cookie } from "lucide-react";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Neyler</title>
        <meta name="description" content="Learn about how Neyler uses cookies to improve your experience and how you can control them." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero flex flex-col">
        <LandingNavbar />
        
        <div className="flex-1 pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary-gradient shadow-lg">
                <Cookie className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Cookie Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">What Are Cookies?</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Cookies are small text files that websites store on your device when you visit them. 
                  They help websites remember information about your visit, like your preferences and 
                  login status, making your next visit easier and the site more useful to you.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">How We Use Cookies</h2>
                <p className="text-foreground/90 leading-relaxed mb-4">
                  Neyler uses cookies to provide a better experience. Here's what we use them for:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies are necessary for the website to function properly. They enable core 
                      features like user authentication, keeping you logged in, and remembering your 
                      preferences. You can't opt out of these as they're essential for the service to work.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies help us understand how visitors interact with Neyler by collecting 
                      anonymous information about page visits, time spent on pages, and any errors 
                      encountered. This helps us improve the app and fix issues.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                    <h3 className="font-semibold text-foreground mb-2">Preference Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies remember your choices and preferences, like your display settings 
                      or language, to provide a more personalized experience when you return to Neyler.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Third-Party Cookies</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Some features and services on Neyler may set cookies from third parties, such as 
                  authentication providers or analytics services. These cookies are governed by the 
                  respective third parties' privacy policies.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Managing Cookies</h2>
                <p className="text-foreground/90 leading-relaxed mb-3">
                  Most web browsers allow you to control cookies through their settings. Here's how you 
                  can manage cookies in popular browsers:
                </p>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                  <li><strong>Firefox:</strong> Settings → Privacy <span className="font-inter">&</span> Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies</li>
                </ul>
                <p className="text-foreground/90 leading-relaxed mt-3">
                  Please note that blocking some cookies may affect your experience on Neyler and prevent 
                  certain features from working properly.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Cookie Duration</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Some cookies are "session cookies" that are deleted when you close your browser. Others 
                  are "persistent cookies" that remain on your device for a set period or until you delete 
                  them. We use both types depending on the purpose.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Updates to This Policy</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. Please revisit this page 
                  periodically to stay informed.
                </p>
              </section>

              <section className="pt-4 border-t border-border/30">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">More Information</h2>
                <p className="text-foreground/90 leading-relaxed">
                  For more information about how we handle your data, please see our{" "}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. 
                  If you have questions about our use of cookies, contact us at{" "}
                  <a href="mailto:support@neyler.com" className="text-primary hover:underline">support@neyler.com</a>.
                </p>
              </section>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
