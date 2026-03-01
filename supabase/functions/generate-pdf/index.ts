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
    const { cvId, format = "pdf" } = await req.json();
    if (!cvId) throw new Error("cvId required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: cv, error } = await supabase.from("cvs").select("*").eq("id", cvId).single();
    if (error || !cv) throw new Error("CV not found");

    const { data: profile } = await supabase.from("profiles").select("subscription_status").eq("user_id", cv.user_id).single();
    const isFree = profile?.subscription_status !== "pro";

    const content = cv.content;
    const personal = content.personal || {};

    if (format === "docx") {
      const docHtml = generateDocxHtml(content, personal, cv.accent_color, isFree);
      return new Response(docHtml, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/vnd.ms-word",
          "Content-Disposition": `attachment; filename="${cv.title || 'CV'}.doc"`,
        },
      });
    }

    const html = generatePdfHtml(content, personal, cv.accent_color, isFree);
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

function generatePdfHtml(content: any, personal: any, accentColor: string, isFree: boolean) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 15mm 20mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; color: #333; font-size: 11px; line-height: 1.6; }

/* Let content flow naturally — browser handles page breaks */
.cv-content { padding: 0; }

/* Prevent sections from being split across pages */
.section { break-inside: avoid; page-break-inside: avoid; margin-bottom: 14px; }
.entry { break-inside: avoid; page-break-inside: avoid; margin-bottom: 12px; }

/* Allow experience section itself to break, but not individual entries */
.section-breakable { margin-bottom: 14px; }

h1 { color: ${accentColor}; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.02em; }
h2 { color: ${accentColor}; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 600; border-bottom: 1.5px solid ${accentColor}; padding-bottom: 4px; margin: 14px 0 10px; break-after: avoid; page-break-after: avoid; }
.header { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
.photo { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid ${accentColor}; }
.subtitle { color: #666; font-size: 14px; font-weight: 500; }
.contact { color: #888; font-size: 10px; margin-top: 5px; }
.summary { color: #555; font-size: 11px; line-height: 1.7; margin-top: 6px; padding: 8px 0; }
.entry-header { display: flex; justify-content: space-between; align-items: baseline; }
.entry-header strong { font-size: 12px; color: #222; }
.company { font-size: 10.5px; color: #666; margin-top: 1px; }
.date { color: #999; font-size: 10px; white-space: nowrap; }
ul { margin: 4px 0; padding-left: 18px; }
li { margin-bottom: 2px; color: #444; }
.skills { display: flex; flex-wrap: wrap; gap: 5px; }
.skills span { display: inline-block; padding: 3px 10px; background: ${accentColor}18; color: ${accentColor}; border-radius: 4px; font-size: 10px; font-weight: 500; }
.watermark { position: fixed; bottom: 10mm; right: 15mm; color: #ddd; font-size: 12px; transform: rotate(-10deg); }
.edu-row { display: flex; justify-content: space-between; margin-bottom: 6px; break-inside: avoid; }
.cert-item { margin-bottom: 4px; break-inside: avoid; }
.lang-list { display: flex; gap: 12px; flex-wrap: wrap; }
.links-list a { color: ${accentColor}; text-decoration: none; font-size: 10px; }
.bottom-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.bottom-grid > section { break-inside: avoid; }

@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style></head><body>
<div class="cv-content">

${personal.name || personal.photo_url ? `
<div class="section">
<div class="header">
  ${personal.photo_url ? `<img src="${personal.photo_url}" class="photo" alt="" />` : ''}
  <div>
    <h1>${personal.name || ''}</h1>
    <div class="subtitle">${personal.title || ''}</div>
    <div class="contact">${[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}</div>
  </div>
</div>
</div>` : ''}

${content.summary ? `<div class="section"><div class="summary">${content.summary}</div></div>` : ''}

${content.experience?.length ? `<div class="section-breakable"><h2>Experience</h2>${content.experience.map((e: any) => `
<div class="entry">
  <div class="entry-header">
    <strong>${e.role}</strong>
    <span class="date">${e.start_date} – ${e.current ? 'Present' : e.end_date}</span>
  </div>
  <div class="company">${e.company}</div>
  <ul>${(e.bullets || []).filter(Boolean).map((b: string) => `<li>${b}</li>`).join('')}</ul>
</div>`).join('')}</div>` : ''}

${content.skills?.length ? `<div class="section"><h2>Skills</h2><div class="skills">${content.skills.map((s: string) => `<span>${s}</span>`).join('')}</div></div>` : ''}

${content.education?.length ? `<div class="section-breakable"><h2>Education</h2>${content.education.map((e: any) => `
<div class="edu-row">
  <div><strong>${e.degree}${e.field ? ' in ' + e.field : ''}</strong><br/><span style="color:#666;font-size:10px">${e.institution}</span></div>
  <span class="date">${e.start_date} – ${e.end_date}</span>
</div>`).join('')}</div>` : ''}

${content.projects?.length ? `<div class="section-breakable"><h2>Projects</h2>${content.projects.map((p: any) => `
<div class="entry">
  <strong>${p.name}</strong>
  <p style="color:#555;margin-top:2px">${p.description}</p>
  ${p.url ? `<a href="${p.url}" style="color:${accentColor};font-size:10px">${p.url}</a>` : ''}
</div>`).join('')}</div>` : ''}

${content.certifications?.length ? `<div class="section"><h2>Certifications</h2>${content.certifications.map((c: any) => `<div class="cert-item"><strong>${c.name}</strong> — <span style="color:#666">${c.issuer}</span></div>`).join('')}</div>` : ''}

${content.languages?.length ? `<div class="section"><h2>Languages</h2><div class="lang-list">${content.languages.map((l: any) => `<span>${l.language} <span style="color:#888">(${l.proficiency})</span></span>`).join('')}</div></div>` : ''}

${content.links?.length ? `<div class="section"><h2>Links</h2><div class="links-list">${content.links.map((l: any) => `<div><strong style="font-size:10px">${l.label}:</strong> <a href="${l.url}">${l.url}</a></div>`).join('')}</div></div>` : ''}

${isFree ? '<div class="watermark">Made with CVCraft</div>' : ''}
</div>
<script>window.onload = () => { window.print(); }</script>
</body></html>`;
}

function generateDocxHtml(content: any, personal: any, accentColor: string, isFree: boolean) {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
@page { size: A4; margin: 2cm; }
body { font-family: 'Calibri', sans-serif; color: #333; font-size: 11pt; line-height: 1.5; margin: 2cm; }
h1 { color: ${accentColor}; font-size: 22pt; margin: 0; }
h2 { color: ${accentColor}; font-size: 11pt; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid ${accentColor}; padding-bottom: 3px; margin: 14pt 0 8pt; page-break-after: avoid; }
table { width: 100%; border-collapse: collapse; }
td { vertical-align: top; padding: 2pt 0; }
.date { color: #888; font-size: 9pt; text-align: right; }
ul { margin: 3pt 0; padding-left: 14pt; }
.skill { display: inline; padding: 2pt 6pt; background: #f0f0f0; font-size: 9pt; margin-right: 4pt; }
.entry { page-break-inside: avoid; margin-bottom: 8pt; }
</style></head><body>
<h1>${personal.name || ''}</h1>
<p style="color:#666;font-size:13pt;margin:2pt 0">${personal.title || ''}</p>
<p style="color:#888;font-size:9pt">${[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}</p>

${content.summary ? `<h2>Profile</h2><p>${content.summary}</p>` : ''}

${content.experience?.length ? `<h2>Experience</h2>${content.experience.map((e: any) => `
<div class="entry">
<table><tr><td><b>${e.role} — ${e.company}</b></td><td class="date">${e.start_date} – ${e.current ? 'Present' : e.end_date}</td></tr></table>
<ul>${(e.bullets || []).filter(Boolean).map((b: string) => `<li>${b}</li>`).join('')}</ul>
</div>`).join('')}` : ''}

${content.skills?.length ? `<h2>Skills</h2><p>${content.skills.map((s: string) => `<span class="skill">${s}</span>`).join(' ')}</p>` : ''}

${content.education?.length ? `<h2>Education</h2>${content.education.map((e: any) => `
<div class="entry">
<table><tr><td><b>${e.degree}${e.field ? ' in ' + e.field : ''}</b> — ${e.institution}</td><td class="date">${e.start_date} – ${e.end_date}</td></tr></table>
</div>`).join('')}` : ''}

${content.projects?.length ? `<h2>Projects</h2>${content.projects.map((p: any) => `<div class="entry"><p><b>${p.name}</b><br/>${p.description}</p></div>`).join('')}` : ''}

${content.certifications?.length ? `<h2>Certifications</h2>${content.certifications.map((c: any) => `<div class="entry"><p><b>${c.name}</b> — ${c.issuer}</p></div>`).join('')}` : ''}

${content.languages?.length ? `<h2>Languages</h2><p>${content.languages.map((l: any) => `${l.language} (${l.proficiency})`).join(' · ')}</p>` : ''}

${isFree ? '<p style="color:#ccc;text-align:right;margin-top:20pt">Made with CVCraft</p>' : ''}
</body></html>`;
}
