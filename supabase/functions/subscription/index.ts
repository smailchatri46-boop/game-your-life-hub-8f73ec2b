// Subscription management edge function with JWT authentication

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Helper to create unauthorized response
function unauthorizedResponse(message = "Unauthorized") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Authenticate user from JWT token using getClaims for secure validation
async function authenticateUser(req: Request): Promise<{
  user: { id: string; email?: string } | null;
  error: string | null;
  supabase: SupabaseClient | null;
}> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid authorization header", supabase: null };
  }

  const token = authHeader.replace("Bearer ", "");
  
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  // Use getClaims for secure JWT validation
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  
  if (claimsError || !claimsData?.claims) {
    console.error("Auth error:", claimsError);
    return { user: null, error: "Invalid token", supabase: null };
  }

  const claims = claimsData.claims;
  const userId = claims.sub as string;
  const email = claims.email as string | undefined;

  if (!userId) {
    return { user: null, error: "Invalid token claims", supabase: null };
  }

  return { user: { id: userId, email }, error: null, supabase };
}

// Get subscription from Polar by email
async function getSubscriptionFromPolar(email: string): Promise<SubscriptionInfo> {
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

// Sync subscription data to database using service role
async function syncSubscriptionToDatabase(
  userId: string,
  subscription: SubscriptionInfo
) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  // Use service role client for insert/upsert operations
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await adminClient
    .from("subscriptions")
    .upsert({
      user_id: userId,
      polar_customer_id: subscription.customerId,
      polar_subscription_id: subscription.subscriptionId,
      plan: subscription.plan,
      status: subscription.isActive ? "active" : "inactive",
      current_period_end: subscription.currentPeriodEnd,
      cancel_at_period_end: subscription.cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    });

  if (error) {
    console.error("Failed to sync subscription to database:", error);
  }
}

// Cancel subscription with ownership verification
async function cancelSubscription(
  userId: string,
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  if (!POLAR_ACCESS_TOKEN) {
    return { success: false, error: "POLAR_ACCESS_TOKEN not configured" };
  }

  // Use service role to verify ownership
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Verify ownership - check that this user owns this subscription
  const { data: dbSubscription, error: dbError } = await adminClient
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("polar_subscription_id", subscriptionId)
    .single();

  if (dbError || !dbSubscription) {
    console.error("Subscription ownership verification failed:", dbError);
    return { success: false, error: "Subscription not found or unauthorized" };
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

// Apply discount with ownership verification
async function applyDiscount(
  userId: string,
  subscriptionId: string,
  discountCode: string
): Promise<{ success: boolean; error?: string }> {
  const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  if (!POLAR_ACCESS_TOKEN) {
    return { success: false, error: "POLAR_ACCESS_TOKEN not configured" };
  }

  // Use service role to verify ownership
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Verify ownership - check that this user owns this subscription
  const { data: dbSubscription, error: dbError } = await adminClient
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("polar_subscription_id", subscriptionId)
    .single();

  if (dbError || !dbSubscription) {
    console.error("Subscription ownership verification failed:", dbError);
    return { success: false, error: "Subscription not found or unauthorized" };
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
    // Authenticate user for all requests
    const { user, error: authError } = await authenticateUser(req);
    
    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return unauthorizedResponse(authError || "Authentication required");
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (req.method === "GET" && action === "status") {
      // Get subscription status for authenticated user
      if (!user.email) {
        return new Response(
          JSON.stringify({ error: "User email not available" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const subscription = await getSubscriptionFromPolar(user.email);
      
      // Sync to database
      await syncSubscriptionToDatabase(user.id, subscription);
      
      return new Response(
        JSON.stringify(subscription),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { action: postAction, subscriptionId, discountCode } = body;

      if (postAction === "cancel" && subscriptionId) {
        // Cancel with ownership verification
        const result = await cancelSubscription(user.id, subscriptionId);
        return new Response(
          JSON.stringify(result),
          { 
            status: result.success ? 200 : 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      if (postAction === "apply-discount" && subscriptionId && discountCode) {
        // Apply discount with ownership verification
        const result = await applyDiscount(user.id, subscriptionId, discountCode);
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
