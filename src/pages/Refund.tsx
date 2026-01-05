import { LandingNavbar } from "@/components/LandingNavbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { CreditCard } from "lucide-react";

export default function Refund() {
  return (
    <>
      <Helmet>
        <title>Refund Policy | Neyler</title>
        <meta name="description" content="Understand Neyler's refund policy for subscriptions and how cancellations work." />
      </Helmet>
      
      <div className="min-h-screen gradient-hero flex flex-col">
        <LandingNavbar />
        
        <div className="flex-1 pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary-gradient shadow-lg">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Refund Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="glass-card p-8 md:p-10 rounded-2xl space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Our Policy</h2>
                <p className="text-foreground/90 leading-relaxed">
                  Neyler does not offer refunds on subscription payments. When you subscribe to a paid plan, 
                  you gain immediate access to premium features, and the subscription fee covers your access 
                  for the billing period.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Cancellations</h2>
                <p className="text-foreground/90 leading-relaxed">
                  You can cancel your subscription at any time from your account settings. When you cancel:
                </p>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5 mt-3">
                  <li>Your subscription will remain active until the end of your current billing period</li>
                  <li>You'll continue to have access to premium features until your subscription expires</li>
                  <li>No further charges will be made after cancellation</li>
                  <li>Your account will revert to the free plan once the paid period ends</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Why No Refunds?</h2>
                <p className="text-foreground/90 leading-relaxed">
                  As a digital service, once you access premium features, the value has been delivered. 
                  We also offer a free plan so you can try Neyler before committing to a paid subscription. 
                  This allows you to evaluate whether the premium features are right for you.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Exceptions</h2>
                <p className="text-foreground/90 leading-relaxed">
                  In rare cases, we may consider exceptions to this policy:
                </p>
                <ul className="text-foreground/90 leading-relaxed space-y-2 list-disc pl-5 mt-3">
                  <li>Where required by applicable law in your jurisdiction</li>
                  <li>In cases of accidental duplicate purchases</li>
                  <li>If there was a technical issue that prevented you from accessing the service entirely</li>
                </ul>
                <p className="text-foreground/90 leading-relaxed mt-3">
                  If you believe your situation qualifies for an exception, please contact us with details 
                  about your case.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">How to Cancel</h2>
                <p className="text-foreground/90 leading-relaxed">
                  To cancel your subscription:
                </p>
                <ol className="text-foreground/90 leading-relaxed space-y-2 list-decimal pl-5 mt-3">
                  <li>Log into your Neyler account</li>
                  <li>Go to Settings</li>
                  <li>Navigate to the subscription section</li>
                  <li>Click "Cancel Subscription"</li>
                  <li>Follow the confirmation steps</li>
                </ol>
              </section>

              <section className="pt-4 border-t border-border/30">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Questions?</h2>
                <p className="text-foreground/90 leading-relaxed">
                  If you have questions about this policy or need assistance with your subscription, 
                  please reach out to us at{" "}
                  <a href="mailto:support@neyler.com" className="text-primary hover:underline">support@neyler.com</a>. 
                  We're always happy to help.
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
