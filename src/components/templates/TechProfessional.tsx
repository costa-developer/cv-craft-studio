import { CVContent } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, User, Briefcase, Code, GraduationCap, Award, Languages } from 'lucide-react';

interface Props { content: CVContent; accentColor: string; }

export const TechProfessional = ({ content, accentColor }: Props) => {
  const vis = content.section_visibility;
  return (
    <div className="flex min-h-[297mm] font-sans text-[11px]" style={{ color: '#333' }}>
      {/* Left sidebar */}
      <div className="w-[75mm] p-6 text-white" style={{ backgroundColor: accentColor }}>
        {vis.personal && (
          <div className="mb-6 text-center">
            {content.personal.photo_url && (
              <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/30">
                <img src={content.personal.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-xl font-bold">{content.personal.name || 'Your Name'}</h1>
            <p className="text-white/80 text-xs mt-1">{content.personal.title}</p>
          </div>
        )}

        {vis.personal && (
          <div className="mb-6 space-y-2 text-[10px]">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 flex items-center gap-1.5"><User size={12} />Details</h3>
            {content.personal.email && <div className="flex items-center gap-1.5"><Mail size={10} />{content.personal.email}</div>}
            {content.personal.phone && <div className="flex items-center gap-1.5"><Phone size={10} />{content.personal.phone}</div>}
            {content.personal.location && <div className="flex items-center gap-1.5"><MapPin size={10} />{content.personal.location}</div>}
          </div>
        )}

        {vis.skills && content.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 flex items-center gap-1.5"><Code size={12} />Skills</h3>
            <div className="space-y-1.5">
              {content.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {vis.languages && content.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 flex items-center gap-1.5"><Languages size={12} />Languages</h3>
            {content.languages.map(l => (
              <div key={l.id} className="mb-1.5">
                <div className="text-[10px] font-medium">{l.language}</div>
                <div className="text-[9px] text-white/70">{l.proficiency}</div>
              </div>
            ))}
          </div>
        )}

        {vis.links && content.links.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2 flex items-center gap-1.5"><Globe size={12} />Links</h3>
            {content.links.map(l => <div key={l.id} className="text-[10px] mb-1 break-all">{l.label}: {l.url}</div>)}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {vis.summary && content.summary && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2 flex items-center gap-1.5" style={{ borderColor: accentColor, color: accentColor }}><User size={12} />Profile</h2>
            <p className="text-gray-700 leading-relaxed">{content.summary}</p>
          </section>
        )}

        {vis.experience && content.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2 flex items-center gap-1.5" style={{ borderColor: accentColor, color: accentColor }}><Briefcase size={12} />Employment History</h2>
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
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2 flex items-center gap-1.5" style={{ borderColor: accentColor, color: accentColor }}><Code size={12} />Featured Projects</h2>
            {content.projects.map(p => (
              <div key={p.id} className="mb-3"><strong>{p.name}</strong>{p.url && <span className="text-[10px] ml-2 text-gray-500">{p.url}</span>}<p className="text-gray-700 mt-0.5">{p.description}</p></div>
            ))}
          </section>
        )}

        {vis.education && content.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2 flex items-center gap-1.5" style={{ borderColor: accentColor, color: accentColor }}><GraduationCap size={12} />Education</h2>
            {content.education.map(edu => (
              <div key={edu.id} className="mb-2"><div className="flex justify-between"><strong>{edu.degree} {edu.field && `— ${edu.field}`}</strong><span className="text-[10px] text-gray-500">{edu.start_date} – {edu.end_date}</span></div><div className="text-gray-600">{edu.institution}</div></div>
            ))}
          </section>
        )}

        {vis.certifications && content.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2 flex items-center gap-1.5" style={{ borderColor: accentColor, color: accentColor }}><Award size={12} />Certifications</h2>
            {content.certifications.map(c => <div key={c.id} className="mb-1"><strong>{c.name}</strong> — {c.issuer}</div>)}
          </section>
        )}
      </div>
    </div>
  );
};
