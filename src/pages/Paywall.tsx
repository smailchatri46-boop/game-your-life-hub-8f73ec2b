import { Helmet } from "react-helmet-async";
import { PaywallStep } from "@/components/onboarding/steps/PaywallStep";

export default function Paywall() {
  return (
    <>
      <Helmet>
        <title>Upgrade to Pro | Neyler</title>
        <meta
          name="description"
          content="Unlock unlimited habits, goals, AI coaching and more with Neyler Pro."
        />
      </Helmet>
      <PaywallStep commitmentName="" />
    </>
  );
}
