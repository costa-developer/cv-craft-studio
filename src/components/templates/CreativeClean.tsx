import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const CreativeClean = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  const lighten = (hex: string, amt: number) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${amt})`;
  };

  return (
    <div style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif", color: '#2D2D2D' }} className="text-[11px]">
      {/* Asymmetric header with large first name */}
      {vis.personal && (
        <header className="p-10 pb-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/3 translate-x-1/3" style={{ backgroundColor: lighten(accentColor, 0.15) }} />
          <div className="absolute bottom-0 right-20 w-20 h-20 rounded-full translate-y-1/2" style={{ backgroundColor: lighten(accentColor, 0.08) }} />
          <div className="relative">
            <div className="flex items-end gap-6">
              {content.personal.photo_url && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img src={content.personal.photo_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-[36px] font-black leading-none tracking-tight" style={{ color: accentColor }}>
                  {(content.personal.name || 'Your Name').split(' ')[0]}
                </h1>
                <h1 className="text-[36px] font-light leading-none tracking-tight text-gray-800">
                  {(content.personal.name || 'Your Name').split(' ').slice(1).join(' ')}
                </h1>
                <p className="text-[13px] text-gray-500 mt-2 tracking-wide">{content.personal.title}</p>
              </div>
            </div>
            <div className="flex gap-5 mt-5 text-[9px] text-gray-400">
              {content.personal.email && <span className="flex items-center gap-1"><Mail size={9} />{content.personal.email}</span>}
              {content.personal.phone && <span className="flex items-center gap-1"><Phone size={9} />{content.personal.phone}</span>}
              {content.personal.location && <span className="flex items-center gap-1"><MapPin size={9} />{content.personal.location}</span>}
            </div>
          </div>
        </header>
      )}

      <div className="px-10 pb-10">
        {vis.summary && content.summary && (
          <section className="mb-8 py-5 px-6 rounded-xl" style={{ backgroundColor: lighten(accentColor, 0.08) }}>
            <p className="text-gray-600 leading-[1.9] text-[11px] italic">{content.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-[1fr_180px] gap-10">
          <div className="space-y-7">
            {vis.experience && content.experience.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-5 flex items-center gap-3" style={{ color: accentColor }}>
                  <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: accentColor }} />
                  Experience
                </h2>
                {content.experience.map(exp => (
                  <div key={exp.id} className="mb-5 relative pl-5">
                    <div className="absolute left-0 top-1 bottom-0 w-[2px] rounded-full" style={{ backgroundColor: lighten(accentColor, 0.25) }} />
                    <div className="absolute left-[-3px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    <div className="flex justify-between items-baseline">
                      <strong className="text-[12px]">{exp.role}</strong>
                      <span className="text-[8px] text-gray-400 tracking-wider">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</span>
                    </div>
                    <div className="text-[10px] font-semibold mt-0.5" style={{ color: accentColor }}>{exp.company}</div>
                    <ul className="mt-2 space-y-1">{exp.bullets.filter(Boolean).map((b, i) => <li key={i} className="text-gray-600 text-[10px] leading-relaxed">{b}</li>)}</ul>
                  </div>
                ))}
              </section>
            )}

            {vis.projects && content.projects.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3" style={{ color: accentColor }}>
                  <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: accentColor }} />
                  Projects
                </h2>
                {content.projects.map(p => (
                  <div key={p.id} className="mb-3">
                    <div className="flex items-center gap-1.5"><strong className="text-[11px]">{p.name}</strong>{p.url && <ExternalLink size={8} className="text-gray-400" />}</div>
                    <p className="text-gray-600 mt-0.5 text-[10px]">{p.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {vis.skills && content.skills.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>Skills</h2>
                <div className="space-y-1.5">
                  {content.skills.map((s, i) => (
                    <div key={i} className="text-[10px] py-1 px-2.5 rounded-lg" style={{ backgroundColor: lighten(accentColor, 0.08) }}>{s}</div>
                  ))}
                </div>
              </section>
            )}

            {vis.education && content.education.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>Education</h2>
                {content.education.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <strong className="text-[10px] leading-tight block">{edu.degree}</strong>
                    <div className="text-gray-500 text-[9px]">{edu.institution}</div>
                    <div className="text-gray-400 text-[8px]">{edu.start_date} — {edu.end_date}</div>
                  </div>
                ))}
              </section>
            )}

            {vis.languages && content.languages.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>Languages</h2>
                {content.languages.map(l => <div key={l.id} className="text-[9px] mb-1.5"><strong>{l.language}</strong> <span className="text-gray-400">{l.proficiency}</span></div>)}
              </section>
            )}

            {vis.certifications && content.certifications.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>Certs</h2>
                {content.certifications.map(c => <div key={c.id} className="text-[9px] mb-1.5"><strong>{c.name}</strong><div className="text-gray-400">{c.issuer}</div></div>)}
              </section>
            )}

            {vis.links && content.links.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>Links</h2>
                {content.links.map(l => <div key={l.id} className="text-[9px] mb-1.5 break-all"><strong>{l.label}</strong><div className="text-gray-400">{l.url}</div></div>)}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
