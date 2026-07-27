import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // --- Parse client request ---
  let contents: unknown[];
  try {
    const body = await req.json();
    contents = body.contents;
    if (!Array.isArray(contents) || contents.length === 0) {
      throw new Error("Missing or empty contents array");
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Inject system context
  const systemContext = {
    role: "user",
    parts: [{
      text: `You are Deepali Assistant, an AI representative for Deepali Engineering. 
Deepali Engineering is a professional industrial manufacturing company producing engineering components for export and domestic markets. 
Key information:
- Established: 1995
- Location: Plot No. 1, Gat No. 341, Chintamani Industrial Estate, MIDC Bhosari, Pune - 411026
- Phone: +91 9922432890
- Email: deepaliengg.info@gmail.com
- Working Hours: Mon - Sat: 9:00 AM - 6:00 PM
- Products: precision-engineered couplings, flanges, pipe fittings, and custom forgings.
- Certifications: ISO 9001
- Industries served: Oil & Gas, Power Generation, Chemical Processing, Maritime across 50+ countries.
- Partners: Putzmeister, thyssenKrupp, JCB, Cummins, Bosch, Fiat, Regal Rexnord, Sames, Bauer.
Be helpful, concise, professional, and answer customer queries based ONLY on this information.`
    }]
  };
  
  // Add a dummy acknowledgment so the context is established without generating a response for it
  const systemAck = {
    role: "model",
    parts: [{ text: "Understood. I am Deepali Assistant." }]
  };

  // Add system instruction prompt
  const baseInstruction = `You are Deepali Assistant, an AI representative for Deepali Engineering. 
Deepali Engineering is a professional industrial manufacturing company producing engineering components for export and domestic markets. 
Key information:
- Established: 2005
- Location: Capital City, S.No. A7/2, Plot No. C-10 Opp. Mahindra & Mahindra Gate No.1 Talwade-Mahulunge Road, Village -Nighoje MIDC Chakan, Phase IV, Pune, Maharashtra 410501, India
- Phone: +91 9822767451
- Email: deepaliengg@yahoo.com
- Working Hours: Mon - Sat: 9:00 AM - 6:00 PM
- Products: precision-engineered couplings, flanges, pipe fittings, and custom forgings.
- Certifications: ISO 9001
- Industries served: Oil & Gas, Power Generation, Chemical Processing, Maritime across 50+ countries.
- Partners: Putzmeister, thyssenKrupp, JCB, Cummins, Bosch, Fiat, Regal Rexnord, Sames, Bauer.

CRITICAL INSTRUCTION: If the user asks "Tell me about Deepali Engineering", "Who are you", or asks for a brief description, you MUST provide a comprehensive overview based on the details above, highlighting that we are a premier manufacturer of precision engineering components established in 2005.

You must answer questions based ONLY on the provided knowledge base documents and the context above. If the answer is not in the knowledge base, politely say you don't know or ask the user to contact deepaliengg@yahoo.com. Keep answers professional, concise, and helpful. Do not mention that you are an AI or reading from a database.`;

  // Retrieve actual knowledge documents from DB if needed, but for now we use the system instructions
  contents = [
    { role: "user", parts: [{ text: baseInstruction }] },
    systemAck,
    ...contents
  ];

  // --- Inject platform key (never expose to client) ---
  const apiKey = Deno.env.get("INTEGRATIONS_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server configuration error: missing INTEGRATIONS_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // --- Call upstream (streaming) ---
  const upstream = await fetch(
    "https://app-d2lgq5dxewap-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ contents }),
    }
  );

  // Forward quota/balance errors verbatim
  if (upstream.status === 429 || upstream.status === 402) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Stream through directly
  return new Response(upstream.body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
