const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPNotifyBody {
  name: string;
  email?: string | null;
  language: "en" | "es";
  attending: boolean;
  guest_count: number;
  plus_one_name?: string | null;
  phone?: string | null;
  arrival_airport?: string | null;
  hotel?: string | null;
  allergies_notes?: string | null;
  transport_needed?: boolean | null;
  kids_food_required?: boolean | null;
  bringing_children?: boolean | null;
  children_count?: number | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const to = Deno.env.get("RSVP_NOTIFY_TO");
    const from = Deno.env.get("RSVP_NOTIFY_FROM") ?? "RSVP Bot <onboarding@resend.dev>";

    if (!apiKey || !to) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY or RSVP_NOTIFY_TO secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as RSVPNotifyBody;
    const subject = `New RSVP: ${body.name} (${body.attending ? "Attending" : "Not attending"})`;

    const text = [
      `Name: ${body.name}`,
      `Attending: ${body.attending ? "Yes" : "No"}`,
      `Guests: ${body.guest_count}`,
      `Plus one: ${body.plus_one_name ?? "N/A"}`,
      `Language: ${body.language}`,
      `Email: ${body.email ?? "N/A"}`,
      `Phone: ${body.phone ?? "N/A"}`,
      `Airport: ${body.arrival_airport ?? "N/A"}`,
      `Hotel: ${body.hotel ?? "N/A"}`,
      `Transport needed: ${
        body.transport_needed === null || body.transport_needed === undefined
          ? "Not specified"
          : body.transport_needed
            ? "Yes"
            : "No"
      }`,
      `Kids food required: ${
        body.kids_food_required === null || body.kids_food_required === undefined
          ? "Not specified"
          : body.kids_food_required
            ? "Yes"
            : "No"
      }`,
      `Bringing children: ${
        body.bringing_children === null || body.bringing_children === undefined
          ? "Not specified"
          : body.bringing_children
            ? "Yes"
            : "No"
      }`,
      `Children count: ${
        body.children_count === null || body.children_count === undefined
          ? "Not specified"
          : body.children_count
      }`,
      `Notes: ${body.allergies_notes ?? "N/A"}`,
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
