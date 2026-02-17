export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photo_url: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export type SectionKey = 'personal' | 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'links' | 'languages';

export interface CVContent {
  personal: PersonalInfo;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  links: LinkItem[];
  languages: LanguageItem[];
  section_order: SectionKey[];
  section_visibility: Record<SectionKey, boolean>;
}

export interface CV {
  id: string;
  user_id: string;
  title: string;
  template: string;
  accent_color: string;
  content: CVContent;
  is_public: boolean;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
}

export type TemplateName = 'modern-minimal' | 'corporate-executive' | 'tech-professional' | 'creative-clean' | 'compact-professional';

export const TEMPLATE_LABELS: Record<TemplateName, string> = {
  'modern-minimal': 'Modern Minimal',
  'corporate-executive': 'Corporate Executive',
  'tech-professional': 'Tech Professional',
  'creative-clean': 'Creative Clean',
  'compact-professional': 'Compact Professional',
};

export const DEFAULT_CV_CONTENT: CVContent = {
  personal: { name: '', title: '', email: '', phone: '', location: '', photo_url: '' },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  links: [],
  languages: [],
  section_order: ['personal', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'links', 'languages'],
  section_visibility: { personal: true, summary: true, skills: true, experience: true, projects: true, education: true, certifications: true, links: true, languages: true },
};
