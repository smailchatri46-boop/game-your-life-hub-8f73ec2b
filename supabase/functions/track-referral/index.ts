import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiSecret = Deno.env.get("ENDORSELY_API_SECRET");
    
    if (!apiSecret) {
      console.error("ENDORSELY_API_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Affiliate tracking not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: TrackReferralRequest = await req.json();
    const { referralId, email, amount, name, customerId } = body;

    if (!referralId) {
      console.log("No referral ID provided, skipping tracking");
      return new Response(
        JSON.stringify({ success: true, message: "No referral to track" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Tracking referral: ${referralId}, amount: $${amount}, email: ${email || "not provided"}`);

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
        customerId: customerId || undefined,
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
    console.log("Referral tracked successfully:", result);

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
