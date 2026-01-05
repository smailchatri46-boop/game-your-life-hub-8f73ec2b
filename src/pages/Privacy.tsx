import { LandingNavbar } from "@/components/LandingNavbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Neyler</title>
        <meta name="description" content="Read Neyler's Privacy Policy to understand how we collect, use, and protect your personal information." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero flex flex-col">
        <LandingNavbar />
        
        <div className="flex-1 pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary-gradient shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-foreground/90 leading-relaxed">
                  At Neyler, we take your privacy seriously. This policy explains what information we collect, 
                  how we use it, and your rights regarding your personal data. We're committed to being 
                  transparent about our practices.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong>Account Information:</strong> Your email address and name when you sign up.</li>
                  <li><strong>Usage Data:</strong> Information about how you use Neyler, including habits tracked, goals set, and journal entries.</li>
                  <li><strong>Device Information:</strong> Basic information about your device and browser for a better experience.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">How We Use Your Data</h2>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5">
                  <li>To provide and improve the Neyler service</li>
                  <li>To personalize your experience and provide AI-powered insights</li>
                  <li>To communicate important updates about your account</li>
                  <li>To analyze usage patterns and improve our product</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Analytics & Cookies</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We use analytics tools to understand how people use Neyler, which helps us improve the app. 
                  We also use cookies for essential functionality like keeping you logged in and remembering 
                  your preferences. For more details, see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We use trusted third-party services to help run Neyler, including authentication providers, 
                  payment processors, and cloud hosting. These services are carefully selected and have their 
                  own privacy policies governing how they handle data.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Data Security</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We implement industry-standard security measures to protect your data, including encryption 
                  in transit and at rest. However, no method of transmission over the internet is 100% secure, 
                  so we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Account Deletion</h2>
                <p className="text-foreground/90 leading-relaxed">
                  You can delete your account and all associated data at any time from your account settings. 
                  Once deleted, your data cannot be recovered. If you need help, contact us at{" "}
                  <a href="mailto:support@neyler.com" className="text-primary hover:underline">support@neyler.com</a>.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your Rights</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Depending on your location, you may have rights to access, correct, or delete your personal 
                  data. You may also have the right to object to certain uses of your data. Contact us if 
                  you'd like to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We may update this Privacy Policy from time to time. We'll notify you of significant 
                  changes via email or through the app. Continued use of Neyler after changes means you 
                  accept the updated policy.
                </p>
              </section>

              <section className="pt-4 border-t border-border/30">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Contact Us</h2>
                <p className="text-foreground/90 leading-relaxed">
                  If you have questions about this Privacy Policy or how we handle your data, please reach 
                  out to us at{" "}
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
