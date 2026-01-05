// Polar.sh product IDs configuration
export const POLAR_PRODUCTS = {
  core: {
    monthly: "9100ba84-597c-40f6-b074-6aa3f2d7954d",
    yearly: "09435417-f2c2-4ac9-bade-620b859aec9e",
  },
  pro: {
    monthly: "7fd272e7-5f25-408b-adb3-4efe1239e9bd",
    yearly: "b1cdc800-3f05-4c32-b661-d8f92941bedf",
  },
} as const;

export type PlanType = "core" | "pro";
export type BillingPeriod = "monthly" | "yearly";

export function getProductId(plan: PlanType, period: BillingPeriod): string {
  return POLAR_PRODUCTS[plan][period];
}
