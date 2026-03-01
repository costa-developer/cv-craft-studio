import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { jobDescription, currentCV } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (!jobDescription || jobDescription.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Please provide a meaningful job description (at least 20 characters)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume optimizer. Your job is to tailor an existing CV to perfectly match a job description while keeping the candidate's real experience intact.

Rules:
1. Extract keywords, skills, and qualifications from the job description
2. Rewrite the professional summary to directly address the job requirements
3. Reorder and enhance experience bullets to highlight relevant achievements
4. Add missing keywords from the job description into skills (only if the candidate plausibly has them based on their experience)
5. Optimize bullet points with strong action verbs and quantifiable metrics
6. Ensure the CV would score highly on ATS keyword matching
7. Keep all dates, company names, and educational institutions unchanged
8. Do NOT fabricate experience or qualifications the candidate doesn't have

Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "personal": { "name": string, "title": string (optimized for the job), "email": string, "phone": string, "location": string, "photo_url": string },
  "summary": string (3-4 sentences tailored to the job),
  "skills": string[] (reordered with most relevant first, add job-relevant ones),
  "experience": [{ "id": string, "company": string, "role": string, "start_date": string, "end_date": string, "current": boolean, "bullets": string[] (rewritten for ATS relevance) }],
  "projects": [{ "id": string, "name": string, "description": string (tailored), "technologies": string[], "url": string }],
  "education": [{ "id": string, "institution": string, "degree": string, "field": string, "start_date": string, "end_date": string }],
  "certifications": [{ "id": string, "name": string, "issuer": string, "date": string }],
  "links": [{ "id": string, "label": string, "url": string }],
  "languages": [{ "id": string, "language": string, "proficiency": string }],
  "ats_match_score": number (estimated ATS match percentage 0-100),
  "keywords_added": string[] (list of keywords from job description that were incorporated)
}`;

    const userPrompt = `Here is the job description:
---
${jobDescription.slice(0, 4000)}
---

Here is the candidate's current CV:
---
${JSON.stringify(currentCV)}
---

Tailor this CV to maximize ATS compatibility with the job description. Return only the JSON object.`;

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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const result = JSON.parse(text);
    
    return new Response(JSON.stringify({ result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ats-tailor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
