import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const CompactProfessional = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  return (
    <div className="p-8 font-sans text-[10px] leading-snug" style={{ color: '#333' }}>
      {vis.personal && (
        <header className="mb-4 pb-2 border-b" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{content.personal.name || 'Your Name'}</h1>
              <p className="text-xs" style={{ color: accentColor }}>{content.personal.title}</p>
            </div>
            <div className="text-right text-[9px] text-gray-600 space-y-0.5">
              {content.personal.email && <div>{content.personal.email}</div>}
              {content.personal.phone && <div>{content.personal.phone}</div>}
              {content.personal.location && <div>{content.personal.location}</div>}
            </div>
          </div>
        </header>
      )}

      {vis.summary && content.summary && (
        <section className="mb-3">
          <p className="text-gray-700">{content.summary}</p>
        </section>
      )}

      {vis.skills && content.skills.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Skills</h2>
          <p className="text-gray-700">{content.skills.join(' · ')}</p>
        </section>
      )}

      {vis.experience && content.experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Experience</h2>
          {content.experience.map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between"><span><strong>{exp.role}</strong> at {exp.company}</span><span className="text-[9px] text-gray-500">{exp.start_date} – {exp.current ? 'Present' : exp.end_date}</span></div>
              <ul className="list-disc ml-4 space-y-0">{exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </section>
      )}

      {vis.projects && content.projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Projects</h2>
          {content.projects.map(p => <div key={p.id} className="mb-1"><strong>{p.name}</strong> — {p.description}</div>)}
        </section>
      )}

      {vis.education && content.education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Education</h2>
          {content.education.map(edu => <div key={edu.id} className="mb-1"><strong>{edu.degree} {edu.field && `— ${edu.field}`}</strong>, {edu.institution} ({edu.start_date} – {edu.end_date})</div>)}
        </section>
      )}

      <div className="grid grid-cols-2 gap-4">
        {vis.certifications && content.certifications.length > 0 && (
          <section>
            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Certifications</h2>
            {content.certifications.map(c => <div key={c.id} className="mb-0.5">{c.name} — {c.issuer}</div>)}
          </section>
        )}
        {vis.languages && content.languages.length > 0 && (
          <section>
            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Languages</h2>
            {content.languages.map(l => <div key={l.id} className="mb-0.5">{l.language} ({l.proficiency})</div>)}
          </section>
        )}
      </div>

      {vis.links && content.links.length > 0 && (
        <section className="mt-2">
          <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Links</h2>
          <div className="flex flex-wrap gap-3">{content.links.map(l => <span key={l.id}>{l.label}: {l.url}</span>)}</div>
        </section>
      )}
    </div>
  );
};
