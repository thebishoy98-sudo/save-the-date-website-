import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendSmsInviteBody {
  invite_token: string;
  guest_name: string;
  phone: string;
  invite_language?: "en" | "es" | null;
  reserved_seats?: number | null;
  invite_url: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFromNumber = Deno.env.get("TWILIO_FROM_NUMBER");
    const twilioMessagingServiceSid = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!twilioAccountSid || !twilioAuthToken) {
      return new Response(JSON.stringify({ error: "Missing Twilio account secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!twilioFromNumber && !twilioMessagingServiceSid) {
      return new Response(
        JSON.stringify({ error: "Set TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase service role config" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as SendSmsInviteBody;
    if (!body.invite_token || !body.guest_name || !body.phone || !body.invite_url) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const language = body.invite_language ?? "en";
    const seats = body.reserved_seats ?? 1;
    const seatsText = seats === 1 ? "1 lugar reservado para ti." : `${seats} lugares reservados para ti y tus invitados.`;
    const heart = "\u2764\uFE0F";
    const text =
      language === "es"
        ? `Hola ${body.guest_name} ${heart}

Estamos contando los dias para nuestra boda y nos encantaria que fueras parte de este momento tan especial.

Tenemos ${seatsText}

Todos los detalles estan disponibles aqui:
${body.invite_url}

Por favor haznos saber si planeas asistir antes del 15/03/2026.

M\u00E1s adelamte, cerca de la fecha de la boda, te contactaremos para re-confirmar.`
        : `Hello ${body.guest_name} ${heart}

We are counting down the days to our wedding and would love for you to be part of this special moment.

We have reserved ${seats} seat(s) for you.

All the details are available here:
${body.invite_url}

Please let us know if you are planning to attend by 3/15/2026.

We will follow up later for a final confirmation closer to the wedding date.`;

    const params = new URLSearchParams();
    params.set("To", body.phone);
    if (twilioFromNumber) {
      params.set("From", twilioFromNumber);
    } else if (twilioMessagingServiceSid) {
      params.set("MessagingServiceSid", twilioMessagingServiceSid);
    }
    params.set("Body", text);

    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const twilioPayload = await twilioResponse.json().catch(() => ({}));
    if (!twilioResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Twilio send failed",
          details: twilioPayload,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { error: updateError } = await supabase
      .from("sms_invites")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("invite_token", body.invite_token);

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: "SMS sent but failed to update invite status",
          details: updateError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sid: twilioPayload.sid ?? null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
