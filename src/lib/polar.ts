// Polar.sh checkout links configuration
export const POLAR_CHECKOUT_LINKS = {
  pro: {
    monthly: "https://buy.polar.sh/polar_cl_NMrTh0g35Jq1G0RZSuCBj1gYXvIBFtD6mZtRm4fpUlo",
    yearly: "https://buy.polar.sh/polar_cl_5HTlnlMy3HRWvlS2HjqG7uewttgISwKi5WCHH10DNQu",
  },
} as const;

export type PlanType = "pro";
export type BillingPeriod = "monthly" | "yearly";

export function getCheckoutLink(plan: PlanType, period: BillingPeriod): string {
  return POLAR_CHECKOUT_LINKS[plan][period];
}
