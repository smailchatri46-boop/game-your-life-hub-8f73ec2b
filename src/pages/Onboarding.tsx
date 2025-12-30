import { Helmet } from "react-helmet-async";
import { OnboardingFlow } from "@/components/onboarding";

export default function Onboarding() {
  return (
    <>
      <Helmet>
        <title>Welcome to Locked | Start Your Journey</title>
        <meta
          name="description"
          content="Get started with Locked - your personal space for building habits, tracking goals, and becoming the best version of yourself."
        />
      </Helmet>
      <OnboardingFlow />
    </>
  );
}
