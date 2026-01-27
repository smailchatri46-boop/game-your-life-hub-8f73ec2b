// Subscription management edge function

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const POLAR_API_BASE = "https://api.polar.sh/v1";

interface SubscriptionInfo {
  isActive: boolean;
  plan: "monthly" | "yearly" | null;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  status: string | null;
}

async function getSubscriptionByEmail(email: string): Promise<SubscriptionInfo> {
  const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
  
  if (!POLAR_ACCESS_TOKEN) {
    throw new Error("POLAR_ACCESS_TOKEN not configured");
  }

  // First, find the customer by email
  const customersResponse = await fetch(`${POLAR_API_BASE}/customers?email=${encodeURIComponent(email)}`, {
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!customersResponse.ok) {
    console.error("Failed to fetch customers:", await customersResponse.text());
    return {
      isActive: false,
      plan: null,
      customerId: null,
      subscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      status: null,
    };
  }

  const customersData = await customersResponse.json();
  const customers = customersData.items || [];
  
  if (customers.length === 0) {
    return {
      isActive: false,
      plan: null,
      customerId: null,
      subscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      status: null,
    };
  }

  const customer = customers[0];
  const customerId = customer.id;

  // Get subscriptions for this customer
  const subscriptionsResponse = await fetch(`${POLAR_API_BASE}/subscriptions?customer_id=${customerId}&active=true`, {
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!subscriptionsResponse.ok) {
    console.error("Failed to fetch subscriptions:", await subscriptionsResponse.text());
    return {
      isActive: false,
      plan: null,
      customerId,
      subscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      status: null,
    };
  }

  const subscriptionsData = await subscriptionsResponse.json();
  const subscriptions = subscriptionsData.items || [];

  // Find active subscription
  const activeSubscription = subscriptions.find(
    (sub: { status: string }) => sub.status === "active" || sub.status === "trialing"
  );

  if (!activeSubscription) {
    return {
      isActive: false,
      plan: null,
      customerId,
      subscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      status: null,
    };
  }

  // Determine plan type based on recurring interval
  const recurringInterval = activeSubscription.recurring_interval;
  const plan: "monthly" | "yearly" = recurringInterval === "year" ? "yearly" : "monthly";

  return {
    isActive: true,
    plan,
    customerId,
    subscriptionId: activeSubscription.id,
    currentPeriodEnd: activeSubscription.current_period_end,
    cancelAtPeriodEnd: activeSubscription.cancel_at_period_end || false,
    status: activeSubscription.status,
  };
}

async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
  
  if (!POLAR_ACCESS_TOKEN) {
    return { success: false, error: "POLAR_ACCESS_TOKEN not configured" };
  }

  const response = await fetch(`${POLAR_API_BASE}/subscriptions/${subscriptionId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to cancel subscription:", errorText);
    return { success: false, error: errorText };
  }

  return { success: true };
}

async function applyDiscount(subscriptionId: string, discountCode: string): Promise<{ success: boolean; error?: string }> {
  const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
  
  if (!POLAR_ACCESS_TOKEN) {
    return { success: false, error: "POLAR_ACCESS_TOKEN not configured" };
  }

  // Look up the discount by code first
  const discountLookupResponse = await fetch(`${POLAR_API_BASE}/discounts?query=${encodeURIComponent(discountCode)}`, {
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!discountLookupResponse.ok) {
    const errorText = await discountLookupResponse.text();
    console.error("Failed to lookup discount:", errorText);
    return { success: false, error: "Discount code not found" };
  }

  const discountsData = await discountLookupResponse.json();
  const discounts = discountsData.items || [];
  const discount = discounts.find((d: { code: string }) => d.code === discountCode);

  if (!discount) {
    return { success: false, error: "Discount code not found" };
  }

  // Apply discount to subscription
  const response = await fetch(`${POLAR_API_BASE}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      discount_id: discount.id,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to apply discount:", errorText);
    return { success: false, error: errorText };
  }

  return { success: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (req.method === "GET" && action === "status") {
      const email = url.searchParams.get("email");
      
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const subscription = await getSubscriptionByEmail(email);
      
      return new Response(
        JSON.stringify(subscription),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { action: postAction, subscriptionId, discountCode } = body;

      if (postAction === "cancel" && subscriptionId) {
        const result = await cancelSubscription(subscriptionId);
        return new Response(
          JSON.stringify(result),
          { 
            status: result.success ? 200 : 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      if (postAction === "apply-discount" && subscriptionId && discountCode) {
        const result = await applyDiscount(subscriptionId, discountCode);
        return new Response(
          JSON.stringify(result),
          { 
            status: result.success ? 200 : 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Subscription function error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
