import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, User, Briefcase, Code, GraduationCap, Award, Languages } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const TechProfessional = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  const darken = (hex: string) => {
    const r = Math.max(0, parseInt(hex.slice(1,3),16) - 30);
    const g = Math.max(0, parseInt(hex.slice(3,5),16) - 30);
    const b = Math.max(0, parseInt(hex.slice(5,7),16) - 30);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="flex min-h-[297mm]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", color: '#E8E8E8' }}>
      {/* Dark sidebar */}
      <div className="w-[78mm] p-7" style={{ backgroundColor: '#1A1D23' }}>
        {vis.personal && (
          <div className="mb-8 text-center">
            {content.personal.photo_url && (
              <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden" style={{ boxShadow: `0 0 0 2px #1A1D23, 0 0 0 4px ${accentColor}` }}>
                <img src={content.personal.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-[18px] font-bold tracking-tight text-white">{content.personal.name || 'Your Name'}</h1>
            <p className="text-[10px] mt-1 font-medium tracking-wider" style={{ color: accentColor }}>{content.personal.title}</p>
          </div>
        )}

        {vis.personal && (
          <div className="mb-7 space-y-2.5 text-[9px]">
            <div className="text-[8px] font-bold uppercase tracking-[0.3em] mb-3 pb-1.5 border-b" style={{ color: accentColor, borderColor: accentColor + '40' }}>
              {'// '}Contact
            </div>
            {content.personal.email && <div className="flex items-center gap-2 text-gray-400"><Mail size={10} style={{ color: accentColor }} />{content.personal.email}</div>}
            {content.personal.phone && <div className="flex items-center gap-2 text-gray-400"><Phone size={10} style={{ color: accentColor }} />{content.personal.phone}</div>}
            {content.personal.location && <div className="flex items-center gap-2 text-gray-400"><MapPin size={10} style={{ color: accentColor }} />{content.personal.location}</div>}
          </div>
        )}

        {vis.skills && content.skills.length > 0 && (
          <div className="mb-7">
            <div className="text-[8px] font-bold uppercase tracking-[0.3em] mb-3 pb-1.5 border-b" style={{ color: accentColor, borderColor: accentColor + '40' }}>
              {'// '}Tech Stack
            </div>
            <div className="space-y-1.5">
              {content.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: accentColor }} />
                  <span className="text-[9px] text-gray-300">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {vis.languages && content.languages.length > 0 && (
          <div className="mb-7">
            <div className="text-[8px] font-bold uppercase tracking-[0.3em] mb-3 pb-1.5 border-b" style={{ color: accentColor, borderColor: accentColor + '40' }}>
              {'// '}Languages
            </div>
            {content.languages.map(l => (
              <div key={l.id} className="mb-2">
                <div className="text-[9px] text-gray-300">{l.language}</div>
                <div className="text-[8px] text-gray-500">{l.proficiency}</div>
              </div>
            ))}
          </div>
        )}

        {vis.links && content.links.length > 0 && (
          <div>
            <div className="text-[8px] font-bold uppercase tracking-[0.3em] mb-3 pb-1.5 border-b" style={{ color: accentColor, borderColor: accentColor + '40' }}>
              {'// '}Links
            </div>
            {content.links.map(l => <div key={l.id} className="text-[9px] mb-1.5 text-gray-400 break-all"><span style={{ color: accentColor }}>{l.label}:</span> {l.url}</div>)}
          </div>
        )}
      </div>

      {/* Main content — light */}
      <div className="flex-1 p-9 bg-white" style={{ color: '#2D2D2D', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {vis.summary && content.summary && (
          <section className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3 pb-1.5 flex items-center gap-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
              <User size={11} />About
            </h2>
            <p className="text-gray-600 leading-[1.8] text-[11px]">{content.summary}</p>
          </section>
        )}

        {vis.experience && content.experience.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-1.5 flex items-center gap-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
              <Briefcase size={11} />Experience
            </h2>
            {content.experience.map(exp => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <strong className="text-[12px]">{exp.role}</strong>
                  <span className="text-[8px] px-2 py-0.5 rounded font-mono" style={{ backgroundColor: accentColor + '15', color: accentColor }}>{exp.start_date} → {exp.current ? 'Present' : exp.end_date}</span>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: accentColor }}>{exp.company}</div>
                <ul className="mt-2 space-y-1">{exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="text-gray-600 flex gap-2 text-[10.5px]">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-300" />
                    {b}
                  </li>
                ))}</ul>
              </div>
            ))}
          </section>
        )}

        {vis.projects && content.projects.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 pb-1.5 flex items-center gap-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
              <Code size={11} />Projects
            </h2>
            {content.projects.map(p => (
              <div key={p.id} className="mb-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <strong className="text-[11px]">{p.name}</strong>
                  {p.url && <Globe size={9} className="text-gray-400" />}
                </div>
                <p className="text-gray-600 mt-1 text-[10px]">{p.description}</p>
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.technologies.map((t, i) => <span key={i} className="px-1.5 py-0.5 rounded text-[8px] font-mono" style={{ backgroundColor: accentColor + '15', color: accentColor }}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {vis.education && content.education.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3 pb-1.5 flex items-center gap-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
              <GraduationCap size={11} />Education
            </h2>
            {content.education.map(edu => (
              <div key={edu.id} className="mb-2 flex justify-between">
                <div><strong className="text-[11px]">{edu.degree}{edu.field && ` — ${edu.field}`}</strong><div className="text-gray-500 text-[10px]">{edu.institution}</div></div>
                <span className="text-[9px] text-gray-400">{edu.start_date} — {edu.end_date}</span>
              </div>
            ))}
          </section>
        )}

        {vis.certifications && content.certifications.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3 pb-1.5 flex items-center gap-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
              <Award size={11} />Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.certifications.map(c => <span key={c.id} className="px-2.5 py-1 rounded-md text-[9px] border" style={{ borderColor: accentColor + '30' }}><strong>{c.name}</strong> · {c.issuer}</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
