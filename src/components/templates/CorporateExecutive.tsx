import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const CorporateExecutive = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1A1A1A' }} className="text-[11px] leading-relaxed">
      {/* Bold header band */}
      {vis.personal && (
        <header className="px-10 py-8" style={{ backgroundColor: accentColor }}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[32px] font-bold text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                {content.personal.name || 'Your Name'}
              </h1>
              <p className="text-white/80 text-[14px] mt-1 font-light tracking-wide">{content.personal.title}</p>
            </div>
            <div className="text-right text-[10px] text-white/75 space-y-1">
              {content.personal.email && <div className="flex items-center justify-end gap-1.5"><Mail size={10} strokeWidth={1.5} />{content.personal.email}</div>}
              {content.personal.phone && <div className="flex items-center justify-end gap-1.5"><Phone size={10} strokeWidth={1.5} />{content.personal.phone}</div>}
              {content.personal.location && <div className="flex items-center justify-end gap-1.5"><MapPin size={10} strokeWidth={1.5} />{content.personal.location}</div>}
            </div>
          </div>
        </header>
      )}

      <div className="px-10 py-8">
        {vis.summary && content.summary && (
          <section className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Executive Summary</h2>
            <p className="text-gray-700 leading-[1.9] text-[11.5px]">{content.summary}</p>
          </section>
        )}

        {vis.experience && content.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: accentColor }}>Professional Experience</h2>
            {content.experience.map((exp, idx) => (
              <div key={exp.id} className="mb-6 relative">
                <div className="flex justify-between items-baseline mb-1">
                  <strong className="text-[13px]">{exp.role}</strong>
                  <span className="text-[9px] text-gray-400 font-medium tracking-wider uppercase">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</span>
                </div>
                <div className="text-[11px] font-semibold mb-2" style={{ color: accentColor }}>{exp.company}</div>
                <ul className="space-y-1 ml-0">{exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="flex gap-2 text-gray-600">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                    <span>{b}</span>
                  </li>
                ))}</ul>
                {idx < content.experience.length - 1 && <div className="mt-5 border-b border-gray-100" />}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {vis.education && content.education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Education</h2>
              {content.education.map(edu => (
                <div key={edu.id} className="mb-3">
                  <strong className="text-[11px]">{edu.degree}</strong>{edu.field && <span className="text-gray-500">, {edu.field}</span>}
                  <div className="text-gray-600 text-[10px]">{edu.institution}</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">{edu.start_date} — {edu.end_date}</div>
                </div>
              ))}
            </section>
          )}

          {vis.skills && content.skills.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Core Competencies</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {content.skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px]">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                    {s}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {vis.projects && content.projects.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>Key Projects</h2>
            {content.projects.map(p => (
              <div key={p.id} className="mb-3">
                <strong className="text-[11px]">{p.name}</strong>
                <p className="text-gray-600 text-[10px] mt-0.5">{p.description}</p>
              </div>
            ))}
          </section>
        )}

        {vis.certifications && content.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Certifications</h2>
            <div className="flex flex-wrap gap-3">
              {content.certifications.map(c => (
                <div key={c.id} className="px-3 py-1.5 rounded border text-[10px]" style={{ borderColor: accentColor + '40' }}>
                  <strong>{c.name}</strong> <span className="text-gray-500">— {c.issuer}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 flex gap-10">
          {vis.languages && content.languages.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Languages</h2>
              <div className="flex gap-4">{content.languages.map(l => <span key={l.id} className="text-[10px]">{l.language} <span className="text-gray-400">({l.proficiency})</span></span>)}</div>
            </section>
          )}
          {vis.links && content.links.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Links</h2>
              <div className="flex gap-4">{content.links.map(l => <span key={l.id} className="text-[10px]">{l.label}: <span className="text-gray-500">{l.url}</span></span>)}</div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
