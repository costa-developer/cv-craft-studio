import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const { cvId } = await req.json();
    if (!cvId) throw new Error("cvId required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: cv, error } = await supabase.from("cvs").select("*").eq("id", cvId).single();
    if (error || !cv) throw new Error("CV not found");

    // Check user subscription for watermark
    const { data: profile } = await supabase.from("profiles").select("subscription_status").eq("user_id", cv.user_id).single();
    const isFree = profile?.subscription_status !== "pro";

    const content = cv.content;
    const personal = content.personal || {};

    // Generate simple HTML for PDF
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body { font-family: 'Helvetica', sans-serif; margin: 40px; color: #333; font-size: 11px; line-height: 1.5; }
h1 { color: ${cv.accent_color}; margin: 0; font-size: 24px; }
h2 { color: ${cv.accent_color}; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid ${cv.accent_color}; padding-bottom: 3px; margin: 16px 0 8px; }
.subtitle { color: #666; font-size: 13px; }
.contact { color: #888; font-size: 10px; margin-top: 4px; }
.entry { margin-bottom: 10px; }
.entry-header { display: flex; justify-content: space-between; }
.entry-header strong { font-size: 11px; }
.date { color: #888; font-size: 10px; }
ul { margin: 4px 0; padding-left: 16px; }
.skills span { display: inline-block; padding: 2px 8px; margin: 2px; background: ${cv.accent_color}22; color: ${cv.accent_color}; border-radius: 3px; font-size: 10px; }
.watermark { position: fixed; bottom: 20px; right: 20px; color: #ccc; font-size: 14px; transform: rotate(-10deg); }
</style></head><body>
<h1>${personal.name || ''}</h1>
<div class="subtitle">${personal.title || ''}</div>
<div class="contact">${[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}</div>
${content.summary ? `<h2>Profile</h2><p>${content.summary}</p>` : ''}
${content.experience?.length ? `<h2>Experience</h2>${content.experience.map((e: any) => `<div class="entry"><div class="entry-header"><strong>${e.role} — ${e.company}</strong><span class="date">${e.start_date} – ${e.current ? 'Present' : e.end_date}</span></div><ul>${(e.bullets || []).filter(Boolean).map((b: string) => `<li>${b}</li>`).join('')}</ul></div>`).join('')}` : ''}
${content.skills?.length ? `<h2>Skills</h2><div class="skills">${content.skills.map((s: string) => `<span>${s}</span>`).join('')}</div>` : ''}
${content.education?.length ? `<h2>Education</h2>${content.education.map((e: any) => `<div class="entry"><div class="entry-header"><strong>${e.degree}${e.field ? ' in ' + e.field : ''}</strong><span class="date">${e.start_date} – ${e.end_date}</span></div><div>${e.institution}</div></div>`).join('')}` : ''}
${content.projects?.length ? `<h2>Projects</h2>${content.projects.map((p: any) => `<div class="entry"><strong>${p.name}</strong><p>${p.description}</p></div>`).join('')}` : ''}
${content.certifications?.length ? `<h2>Certifications</h2>${content.certifications.map((c: any) => `<div>${c.name} — ${c.issuer}</div>`).join('')}` : ''}
${content.languages?.length ? `<h2>Languages</h2><div>${content.languages.map((l: any) => `${l.language} (${l.proficiency})`).join(' · ')}</div>` : ''}
${isFree ? '<div class="watermark">Made with CVCraft</div>' : ''}
</body></html>`;

    // Return the HTML for client-side PDF generation as a fallback
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html" },
    });
  } catch (e) {
    console.error("generate-pdf error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
