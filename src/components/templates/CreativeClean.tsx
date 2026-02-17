import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const CreativeClean = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  return (
    <div className="font-sans text-[11px]" style={{ color: '#333' }}>
      {vis.personal && (
        <header className="p-10 pb-6" style={{ backgroundColor: accentColor + '15' }}>
          <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{content.personal.name || 'Your Name'}</h1>
          <p className="text-sm text-gray-600 mt-1">{content.personal.title}</p>
          <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
            {content.personal.email && <span className="flex items-center gap-1"><Mail size={10} />{content.personal.email}</span>}
            {content.personal.phone && <span className="flex items-center gap-1"><Phone size={10} />{content.personal.phone}</span>}
            {content.personal.location && <span className="flex items-center gap-1"><MapPin size={10} />{content.personal.location}</span>}
          </div>
        </header>
      )}

      <div className="px-10 py-6">
        {vis.summary && content.summary && (
          <section className="mb-6 pl-4" style={{ borderLeft: `3px solid ${accentColor}` }}>
            <p className="text-gray-700 italic leading-relaxed">{content.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            {vis.experience && content.experience.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                  <div className="w-6 h-0.5" style={{ backgroundColor: accentColor }} /> Experience
                </h2>
                {content.experience.map(exp => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between"><strong>{exp.role}</strong><span className="text-[10px] text-gray-500">{exp.start_date} – {exp.current ? 'Present' : exp.end_date}</span></div>
                    <div className="text-gray-600 italic">{exp.company}</div>
                    <ul className="list-disc ml-4 mt-1 space-y-0.5">{exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
                  </div>
                ))}
              </section>
            )}

            {vis.projects && content.projects.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                  <div className="w-6 h-0.5" style={{ backgroundColor: accentColor }} /> Projects
                </h2>
                {content.projects.map(p => <div key={p.id} className="mb-3"><strong>{p.name}</strong><p className="text-gray-700 mt-0.5">{p.description}</p></div>)}
              </section>
            )}
          </div>

          <div className="space-y-6">
            {vis.skills && content.skills.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Skills</h2>
                <div className="space-y-1">{content.skills.map((s, i) => <div key={i} className="text-[10px] py-0.5">{s}</div>)}</div>
              </section>
            )}

            {vis.education && content.education.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2>
                {content.education.map(edu => <div key={edu.id} className="mb-2 text-[10px]"><strong>{edu.degree}</strong><div className="text-gray-600">{edu.institution}</div></div>)}
              </section>
            )}

            {vis.languages && content.languages.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Languages</h2>
                {content.languages.map(l => <div key={l.id} className="text-[10px] mb-1">{l.language} — {l.proficiency}</div>)}
              </section>
            )}

            {vis.certifications && content.certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Certifications</h2>
                {content.certifications.map(c => <div key={c.id} className="text-[10px] mb-1">{c.name}</div>)}
              </section>
            )}

            {vis.links && content.links.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Links</h2>
                {content.links.map(l => <div key={l.id} className="text-[10px] mb-1 break-all">{l.label}: {l.url}</div>)}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
