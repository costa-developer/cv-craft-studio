import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { field, name } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a professional resume writer. Generate realistic, complete CV content for a ${field} professional named "${name || 'Alex Johnson'}". 
Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "personal": { "name": string, "title": string, "email": string, "phone": string, "location": string, "photo_url": "" },
  "summary": string (3-4 sentences, third person),
  "skills": string[] (8-12 relevant skills),
  "experience": [{ "id": string, "company": string, "role": string, "start_date": string (e.g. "Jan 2022"), "end_date": string, "current": boolean, "bullets": string[] (2-3 impactful bullets with metrics) }] (2-3 experiences),
  "projects": [{ "id": string, "name": string, "description": string, "technologies": string[], "url": "" }] (1-2 projects),
  "education": [{ "id": string, "institution": string, "degree": string, "field": string, "start_date": string, "end_date": string }] (1-2 entries),
  "certifications": [{ "id": string, "name": string, "issuer": string, "date": string }] (1-2 certs relevant to field),
  "links": [{ "id": string, "label": string, "url": string }] (1-2 links like LinkedIn/portfolio),
  "languages": [{ "id": string, "language": string, "proficiency": string }] (2-3 languages)
}
Make it realistic and tailored to the ${field} industry. Use unique IDs like "exp-1", "edu-1", etc.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a complete, realistic CV for a ${field} professional named "${name || 'Alex Johnson'}". Return only the JSON object.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits depleted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const cvContent = JSON.parse(text);
    
    return new Response(JSON.stringify({ content: cvContent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-cv-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
