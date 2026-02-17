import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const ModernMinimal = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  return (
    <div className="p-10 font-sans text-[11px] leading-relaxed" style={{ color: '#333' }}>
      {vis.personal && (
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: accentColor }}>{content.personal.name || 'Your Name'}</h1>
          <p className="text-sm text-gray-600 mt-1">{content.personal.title}</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-500">
            {content.personal.email && <span className="flex items-center gap-1"><Mail size={10} />{content.personal.email}</span>}
            {content.personal.phone && <span className="flex items-center gap-1"><Phone size={10} />{content.personal.phone}</span>}
            {content.personal.location && <span className="flex items-center gap-1"><MapPin size={10} />{content.personal.location}</span>}
          </div>
        </header>
      )}

      {vis.summary && content.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Profile</h2>
          <p className="text-gray-700">{content.summary}</p>
        </section>
      )}

      {vis.experience && content.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Experience</h2>
          {content.experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between"><strong>{exp.role}</strong><span className="text-gray-500 text-[10px]">{exp.start_date} – {exp.current ? 'Present' : exp.end_date}</span></div>
              <div className="text-gray-600 italic">{exp.company}</div>
              <ul className="list-disc ml-4 mt-1 space-y-0.5">{exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </section>
      )}

      {vis.skills && content.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Skills</h2>
          <div className="flex flex-wrap gap-1.5">{content.skills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded text-[10px]" style={{ backgroundColor: accentColor + '20', color: accentColor }}>{s}</span>)}</div>
        </section>
      )}

      {vis.projects && content.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Projects</h2>
          {content.projects.map(p => (
            <div key={p.id} className="mb-3"><strong>{p.name}</strong>{p.url && <span className="text-[10px] text-gray-500 ml-2">{p.url}</span>}<p className="text-gray-700 mt-0.5">{p.description}</p></div>
          ))}
        </section>
      )}

      {vis.education && content.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Education</h2>
          {content.education.map(edu => (
            <div key={edu.id} className="mb-2"><div className="flex justify-between"><strong>{edu.degree} {edu.field && `in ${edu.field}`}</strong><span className="text-[10px] text-gray-500">{edu.start_date} – {edu.end_date}</span></div><div className="text-gray-600">{edu.institution}</div></div>
          ))}
        </section>
      )}

      {vis.certifications && content.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Certifications</h2>
          {content.certifications.map(c => <div key={c.id} className="mb-1"><strong>{c.name}</strong> — {c.issuer} <span className="text-gray-500 text-[10px]">{c.date}</span></div>)}
        </section>
      )}

      {vis.languages && content.languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Languages</h2>
          <div className="flex flex-wrap gap-3">{content.languages.map(l => <span key={l.id}><strong>{l.language}</strong> — {l.proficiency}</span>)}</div>
        </section>
      )}

      {vis.links && content.links.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: accentColor, color: accentColor }}>Links</h2>
          <div className="flex flex-wrap gap-4">{content.links.map(l => <span key={l.id} className="text-[10px]"><strong>{l.label}:</strong> {l.url}</span>)}</div>
        </section>
      )}
    </div>
  );
};
