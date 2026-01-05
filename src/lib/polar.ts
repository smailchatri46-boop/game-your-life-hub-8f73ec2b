// Polar.sh product IDs configuration
export const POLAR_PRODUCTS = {
  core: {
    monthly: "9100ba84-597c-40f6-b074-6aa3f2d7954d",
    yearly: "09435417-f2c2-4ac9-bade-620b859aec9e", // TODO: User needs to provide correct Pro yearly ID - this is currently Core yearly
  },
  pro: {
    monthly: "7fd272e7-5f25-408b-adb3-4efe1239e9bd",
    yearly: "09435417-f2c2-4ac9-bade-620b859aec9e", // TODO: Same ID as Core yearly - user needs to provide correct Pro yearly ID
  },
} as const;

export type PlanType = "core" | "pro";
export type BillingPeriod = "monthly" | "yearly";

export function getProductId(plan: PlanType, period: BillingPeriod): string {
  return POLAR_PRODUCTS[plan][period];
}
