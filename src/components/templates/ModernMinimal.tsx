import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const ModernMinimal = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  const lighten = (hex: string, amt: number) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${amt})`;
  };

  return (
    <div className="p-12 font-sans text-[11px] leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", minHeight: '297mm' }}>
      {/* Header — elegant centered with subtle accent line */}
      {vis.personal && (
        <header className="text-center mb-10 relative">
          {content.personal.photo_url && (
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden" style={{ boxShadow: `0 0 0 2px white, 0 0 0 4px ${accentColor}` }}>
              <img src={content.personal.photo_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-[28px] font-light tracking-[0.15em] uppercase" style={{ color: '#1A1A1A', fontFamily: "'Inter', sans-serif" }}>
            {content.personal.name || 'Your Name'}
          </h1>
          <div className="w-12 h-[2px] mx-auto my-3" style={{ backgroundColor: accentColor }} />
          <p className="text-[13px] font-medium tracking-wider uppercase text-gray-500">{content.personal.title}</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-[10px] text-gray-500">
            {content.personal.email && <span className="flex items-center gap-1.5"><Mail size={10} strokeWidth={1.5} />{content.personal.email}</span>}
            {content.personal.phone && <span className="flex items-center gap-1.5"><Phone size={10} strokeWidth={1.5} />{content.personal.phone}</span>}
            {content.personal.location && <span className="flex items-center gap-1.5"><MapPin size={10} strokeWidth={1.5} />{content.personal.location}</span>}
          </div>
        </header>
      )}

      {vis.summary && content.summary && (
        <section className="mb-8 max-w-[85%] mx-auto text-center">
          <p className="text-gray-600 leading-[1.8] text-[11px]">{content.summary}</p>
        </section>
      )}

      {vis.experience && content.experience.length > 0 && (
        <section className="mb-8" style={{ breakInside: 'auto' }}>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}`, breakAfter: 'avoid' }}>Experience</h2>
          {content.experience.map(exp => (
            <div key={exp.id} className="mb-5 pl-4" style={{ borderLeft: `2px solid ${lighten(accentColor, 0.2)}`, breakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline">
                <strong className="text-[12px] text-gray-800">{exp.role}</strong>
                <span className="text-[9px] text-gray-400 font-medium tracking-wide">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</span>
              </div>
              <div className="text-gray-500 text-[10px] mt-0.5 tracking-wide">{exp.company}</div>
              <ul className="mt-2 space-y-1">{exp.bullets.filter(Boolean).map((b, i) => (
                <li key={i} className="text-gray-600 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full" style={{ '--tw-before-bg': accentColor } as any}>
                  <span className="before:bg-gray-400">{b}</span>
                </li>
              ))}</ul>
            </div>
          ))}
        </section>
      )}

      {vis.skills && content.skills.length > 0 && (
        <section className="mb-8" style={{ breakInside: 'avoid' }}>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}`, breakAfter: 'avoid' }}>Skills</h2>
          <div className="flex flex-wrap gap-2">{content.skills.map((s, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-[9px] font-medium tracking-wide" style={{ backgroundColor: lighten(accentColor, 0.1), color: accentColor }}>{s}</span>
          ))}</div>
        </section>
      )}

      {vis.projects && content.projects.length > 0 && (
        <section className="mb-8" style={{ breakInside: 'auto' }}>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}`, breakAfter: 'avoid' }}>Projects</h2>
          <div className="grid grid-cols-2 gap-4">
            {content.projects.map(p => (
              <div key={p.id} className="p-3 rounded-lg" style={{ backgroundColor: lighten(accentColor, 0.05), breakInside: 'avoid' }}>
                <div className="flex items-center gap-1.5">
                  <strong className="text-[11px]">{p.name}</strong>
                  {p.url && <ExternalLink size={8} className="text-gray-400" />}
                </div>
                <p className="text-gray-600 mt-1 text-[10px] leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {vis.education && content.education.length > 0 && (
        <section className="mb-8" style={{ breakInside: 'avoid' }}>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}`, breakAfter: 'avoid' }}>Education</h2>
          {content.education.map(edu => (
            <div key={edu.id} className="mb-3 flex justify-between">
              <div>
                <strong className="text-[11px]">{edu.degree}{edu.field && ` in ${edu.field}`}</strong>
                <div className="text-gray-500 text-[10px]">{edu.institution}</div>
              </div>
              <span className="text-[9px] text-gray-400">{edu.start_date} — {edu.end_date}</span>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-3 gap-6" style={{ breakInside: 'avoid' }}>
        {vis.certifications && content.certifications.length > 0 && (
          <section>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}`, breakAfter: 'avoid' }}>Certifications</h2>
            {content.certifications.map(c => <div key={c.id} className="mb-1.5 text-[10px]" style={{ breakInside: 'avoid' }}><strong>{c.name}</strong><div className="text-gray-500">{c.issuer}</div></div>)}
          </section>
        )}
        {vis.languages && content.languages.length > 0 && (
          <section>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}` }}>Languages</h2>
            {content.languages.map(l => <div key={l.id} className="mb-1.5 text-[10px]"><strong>{l.language}</strong> <span className="text-gray-500">· {l.proficiency}</span></div>)}
          </section>
        )}
        {vis.links && content.links.length > 0 && (
          <section>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 pb-2" style={{ color: accentColor, borderBottom: `1px solid ${lighten(accentColor, 0.3)}` }}>Links</h2>
            {content.links.map(l => <div key={l.id} className="text-[10px] mb-1.5"><strong>{l.label}</strong><div className="text-gray-500 break-all">{l.url}</div></div>)}
          </section>
        )}
      </div>
    </div>
  );
};
