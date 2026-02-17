import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const CorporateExecutive = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  return (
    <div className="p-10 font-sans text-[11px] leading-relaxed" style={{ color: '#222' }}>
      {vis.personal && (
        <header className="mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold">{content.personal.name || 'Your Name'}</h1>
              <p className="text-sm mt-1" style={{ color: accentColor }}>{content.personal.title}</p>
            </div>
            <div className="text-right text-[10px] text-gray-600 space-y-0.5">
              {content.personal.email && <div>{content.personal.email}</div>}
              {content.personal.phone && <div>{content.personal.phone}</div>}
              {content.personal.location && <div>{content.personal.location}</div>}
            </div>
          </div>
        </header>
      )}

      {vis.summary && content.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed">{content.summary}</p>
        </section>
      )}

      {vis.experience && content.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Professional Experience</h2>
          {content.experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline"><strong className="text-sm">{exp.role}</strong><span className="text-[10px] text-gray-500">{exp.start_date} – {exp.current ? 'Present' : exp.end_date}</span></div>
              <div className="text-gray-600 font-medium">{exp.company}</div>
              <ul className="list-disc ml-4 mt-1.5 space-y-0.5">{exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {vis.education && content.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Education</h2>
            {content.education.map(edu => (
              <div key={edu.id} className="mb-2"><strong>{edu.degree}</strong>{edu.field && `, ${edu.field}`}<div className="text-gray-600">{edu.institution}</div><div className="text-[10px] text-gray-500">{edu.start_date} – {edu.end_date}</div></div>
            ))}
          </section>
        )}

        {vis.skills && content.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Core Competencies</h2>
            <div className="flex flex-wrap gap-1.5">{content.skills.map((s, i) => <span key={i} className="px-2 py-0.5 border rounded text-[10px]" style={{ borderColor: accentColor }}>{s}</span>)}</div>
          </section>
        )}
      </div>

      {vis.projects && content.projects.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Key Projects</h2>
          {content.projects.map(p => <div key={p.id} className="mb-2"><strong>{p.name}</strong><p className="text-gray-700">{p.description}</p></div>)}
        </section>
      )}

      {vis.certifications && content.certifications.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Certifications</h2>
          {content.certifications.map(c => <div key={c.id} className="mb-1"><strong>{c.name}</strong> — {c.issuer}</div>)}
        </section>
      )}

      {vis.languages && content.languages.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Languages</h2>
          <div className="flex gap-4">{content.languages.map(l => <span key={l.id}>{l.language} ({l.proficiency})</span>)}</div>
        </section>
      )}
    </div>
  );
};
