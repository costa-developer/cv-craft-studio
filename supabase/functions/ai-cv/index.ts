import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, ...payload } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "summary") {
      systemPrompt = "You are a professional resume writer. Generate a concise, impactful professional summary (3-4 sentences) based on the candidate's experience and skills. Use third person, present tense. Focus on key achievements and value proposition.";
      const exp = (payload.experience || []).map((e: any) => `${e.role} at ${e.company}`).join(", ");
      const skills = (payload.skills || []).join(", ");
      userPrompt = `Generate a professional summary for ${payload.personal?.name || 'the candidate'} with title "${payload.personal?.title || ''}". Experience: ${exp}. Skills: ${skills}.`;
    } else if (type === "bullet") {
      systemPrompt = "You are a professional resume writer. Improve the given bullet point to be more impactful. Use strong action verbs, include metrics where possible, and focus on achievements rather than responsibilities. Return ONLY the improved bullet point text, nothing else.";
      userPrompt = `Improve this resume bullet point for a ${payload.role} at ${payload.company}: "${payload.bullet}"`;
    } else if (type === "strength") {
      systemPrompt = "You are a resume analyst. Analyze the given CV content and return a JSON object with 'score' (0-100) and 'suggestions' (array of 3-5 improvement suggestions). Be specific and actionable.";
      userPrompt = `Analyze this CV: ${JSON.stringify(payload.content)}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (type === "strength") {
      // Use tool calling for structured output
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "score_resume",
              description: "Return resume score and suggestions",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score 0-100" },
                  suggestions: { type: "array", items: { type: "string" }, description: "3-5 improvement suggestions" },
                },
                required: ["score", "suggestions"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "score_resume" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits depleted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      const result = toolCall ? JSON.parse(toolCall.function.arguments) : { score: 0, suggestions: ["Unable to analyze"] };
      return new Response(JSON.stringify({ result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } else {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits depleted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } catch (e) {
    console.error("ai-cv error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
