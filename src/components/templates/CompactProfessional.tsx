import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const CompactProfessional = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;

  return (
    <div className="p-8 text-[10px] leading-snug" style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: '#1A1A1A' }}>
      {/* Compact inline header */}
      {vis.personal && (
        <header className="mb-5">
          <div className="flex items-center gap-4">
            {content.personal.photo_url && (
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: accentColor }}>
                <img src={content.personal.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <h1 className="text-[20px] font-bold tracking-tight">{content.personal.name || 'Your Name'}</h1>
                <div className="flex gap-4 text-[8px] text-gray-500">
                  {content.personal.email && <span className="flex items-center gap-1"><Mail size={8} />{content.personal.email}</span>}
                  {content.personal.phone && <span className="flex items-center gap-1"><Phone size={8} />{content.personal.phone}</span>}
                  {content.personal.location && <span className="flex items-center gap-1"><MapPin size={8} />{content.personal.location}</span>}
                </div>
              </div>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: accentColor }}>{content.personal.title}</p>
            </div>
          </div>
          <div className="h-[2px] mt-3 rounded-full" style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}00)` }} />
        </header>
      )}

      {vis.summary && content.summary && (
        <section className="mb-4">
          <p className="text-gray-600 leading-relaxed text-[10px]">{content.summary}</p>
        </section>
      )}

      {/* Two-column dense layout */}
      <div className="grid grid-cols-[1fr_140px] gap-6">
        <div className="space-y-4">
          {vis.experience && content.experience.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Experience</h2>
              {content.experience.map(exp => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <span><strong className="text-[10.5px]">{exp.role}</strong> <span className="text-gray-400">·</span> <span className="text-gray-600">{exp.company}</span></span>
                    <span className="text-[8px] text-gray-400 flex-shrink-0 ml-2">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5">{exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-gray-600 flex gap-1.5">
                      <span className="text-gray-300 select-none">›</span>{b}
                    </li>
                  ))}</ul>
                </div>
              ))}
            </section>
          )}

          {vis.projects && content.projects.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Projects</h2>
              {content.projects.map(p => (
                <div key={p.id} className="mb-2">
                  <strong className="text-[10px]">{p.name}</strong>
                  <span className="text-gray-500"> — {p.description}</span>
                </div>
              ))}
            </section>
          )}

          {vis.education && content.education.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Education</h2>
              {content.education.map(edu => (
                <div key={edu.id} className="mb-1.5 flex justify-between">
                  <span><strong>{edu.degree}{edu.field && ` — ${edu.field}`}</strong>, {edu.institution}</span>
                  <span className="text-[8px] text-gray-400">{edu.start_date} — {edu.end_date}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Compact right column */}
        <div className="space-y-4">
          {vis.skills && content.skills.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Skills</h2>
              <div className="flex flex-wrap gap-1">
                {content.skills.map((s, i) => (
                  <span key={i} className="text-[8px] px-1.5 py-0.5 rounded" style={{ backgroundColor: accentColor + '12', color: accentColor }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {vis.certifications && content.certifications.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Certifications</h2>
              {content.certifications.map(c => <div key={c.id} className="mb-1 text-[9px]"><strong>{c.name}</strong><div className="text-gray-400 text-[8px]">{c.issuer}</div></div>)}
            </section>
          )}

          {vis.languages && content.languages.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Languages</h2>
              {content.languages.map(l => <div key={l.id} className="text-[9px] mb-0.5">{l.language} <span className="text-gray-400">({l.proficiency})</span></div>)}
            </section>
          )}

          {vis.links && content.links.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + '30' }}>Links</h2>
              {content.links.map(l => <div key={l.id} className="text-[8px] mb-1 break-all"><LinkIcon size={7} className="inline mr-1" />{l.label}: {l.url}</div>)}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
