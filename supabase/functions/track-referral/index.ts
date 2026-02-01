import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ENDORSELY_API_URL = "https://app.endorsely.com/api/public/refer";
const ORGANIZATION_ID = "b6603ddd-9a20-453a-ad37-2b1d95f16810";

interface TrackReferralRequest {
  referralId: string;
  email?: string;
  amount: number; // in dollars, will be converted to cents
  name?: string;
  customerId?: string;
}

// Helper to create unauthorized response
function unauthorizedResponse(message = "Unauthorized") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Authenticate user from JWT token
async function authenticateUser(req: Request): Promise<{
  user: { id: string; email?: string } | null;
  error: string | null;
}> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid authorization header" };
  }

  const token = authHeader.replace("Bearer ", "");
  
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data?.user) {
    console.error("Auth error:", error);
    return { user: null, error: "Invalid token" };
  }

  return { user: data.user, error: null };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user - only authenticated users can track referrals
    const { user, error: authError } = await authenticateUser(req);
    
    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return unauthorizedResponse(authError || "Authentication required");
    }

    const apiSecret = Deno.env.get("ENDORSELY_API_SECRET");
    
    if (!apiSecret) {
      console.error("ENDORSELY_API_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Affiliate tracking not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: TrackReferralRequest = await req.json();
    const { referralId, amount, name, customerId } = body;

    // Use the authenticated user's email instead of accepting it from the request
    const email = user.email;

    if (!referralId) {
      console.log("No referral ID provided, skipping tracking");
      return new Response(
        JSON.stringify({ success: true, message: "No referral to track" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate amount is a reasonable subscription price
    if (typeof amount !== 'number' || amount <= 0 || amount > 1000) {
      console.error("Invalid amount provided:", amount);
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Tracking referral for user ${user.id}: referralId=${referralId}, amount=$${amount}, email=${email || "not provided"}`);

    // Call Endorsely API to track the referral
    const response = await fetch(ENDORSELY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiSecret}`,
      },
      body: JSON.stringify({
        referralId,
        organizationId: ORGANIZATION_ID,
        email: email || undefined,
        amount: Math.round(amount * 100), // Convert to cents
        name: name || undefined,
        // Use authenticated user's ID as customerId for better tracking
        customerId: customerId || user.id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Endorsely API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to track referral", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    console.log("Referral tracked successfully for user", user.id, ":", result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error tracking referral:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
