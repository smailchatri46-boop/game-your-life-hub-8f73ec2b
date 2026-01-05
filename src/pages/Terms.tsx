import { LandingNavbar } from "@/components/LandingNavbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Neyler</title>
        <meta name="description" content="Read Neyler's Terms of Service to understand the rules and guidelines for using our habit tracking and personal growth app." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero flex flex-col">
        <LandingNavbar />
        
        <div className="flex-1 pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary-gradient shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Welcome to Neyler</h2>
                <p className="text-foreground/90 leading-relaxed">
                  By using Neyler, you agree to these Terms of Service. Please read them carefully. If you 
                  don't agree with these terms, please don't use our service. We've tried to keep these 
                  terms clear and fair.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your Account</h2>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5">
                  <li>You're responsible for maintaining the security of your account credentials.</li>
                  <li>You must provide accurate information when creating your account.</li>
                  <li>You're responsible for all activity that occurs under your account.</li>
                  <li>You must be at least 13 years old to use Neyler.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Subscription <span className="font-inter">&</span> Billing</h2>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5">
                  <li>Neyler offers both free and paid subscription plans.</li>
                  <li>Paid subscriptions are billed on a recurring basis (monthly or annually).</li>
                  <li>Prices may change with reasonable notice; existing subscriptions continue at the current rate until renewal.</li>
                  <li>You can cancel your subscription at any time. Cancellation takes effect at the end of your current billing period.</li>
                  <li>We do not offer refunds on subscriptions. See our <a href="/refund" className="text-primary hover:underline">Refund Policy</a> for details.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Acceptable Use</h2>
                <p className="text-foreground/90 leading-relaxed mb-3">When using Neyler, you agree not to:</p>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Attempt to access other users' accounts or data</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Upload malicious content or attempt to harm our systems</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">AI Features Disclaimer</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Neyler includes AI-powered features designed to provide insights and suggestions to support 
                  your personal growth journey. These AI features are meant to assist and guide, not to replace 
                  professional advice. The AI may occasionally provide suggestions that aren't perfectly suited 
                  to your situation. Always use your own judgment, and seek professional help for health, 
                  mental wellness, or other serious matters.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your Content</h2>
                <p className="text-foreground/90 leading-relaxed">
                  You retain ownership of all content you create in Neyler (habits, goals, journal entries, etc.). 
                  By using our service, you grant us permission to store and process your content to provide 
                  the service. We won't share your personal content with third parties except as necessary 
                  to provide the service.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Neyler is provided "as is" without warranties of any kind. We do our best to provide a 
                  reliable service, but we can't guarantee uninterrupted access or that the service will 
                  meet all your needs. To the fullest extent permitted by law, we limit our liability for 
                  any damages arising from your use of Neyler.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Service Changes</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We're constantly working to improve Neyler. This means we may add, modify, or remove 
                  features over time. We'll do our best to communicate significant changes, but we reserve 
                  the right to modify the service as we see fit.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Account Termination</h2>
                <p className="text-foreground/90 leading-relaxed">
                  You can close your account at any time from your settings. We may also terminate or suspend 
                  accounts that violate these terms. Upon termination, your right to use the service ends, 
                  though some provisions of these terms continue to apply.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
                <p className="text-foreground/90 leading-relaxed">
                  We may update these Terms of Service from time to time. We'll notify you of significant 
                  changes via email or through the app. Continued use of Neyler after changes means you 
                  accept the updated terms.
                </p>
              </section>

              <section className="pt-4 border-t border-border/30">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Questions?</h2>
                <p className="text-foreground/90 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at{" "}
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
