import { useState, useRef } from 'react';
import { CVContent, SectionKey, ExperienceItem, ProjectItem, EducationItem, CertificationItem, LinkItem, LanguageItem } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, GripVertical, X, Sparkles, BarChart3, Camera, Loader2, Target, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EditorPanelProps {
  editor: {
    content: CVContent;
    updateContent: (patch: Partial<CVContent>) => void;
    toggleSection: (key: SectionKey) => void;
    reorderSections: (order: SectionKey[]) => void;
  };
}

const genId = () => crypto.randomUUID();

export const EditorPanel = ({ editor }: EditorPanelProps) => {
  const { content, updateContent, toggleSection } = editor;
  const { profile } = useAuth();
  const isPro = profile?.subscription_status === 'pro';
  const [skillInput, setSkillInput] = useState('');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [strengthScore, setStrengthScore] = useState<{ score: number; suggestions: string[] } | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [atsDialogOpen, setAtsDialogOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState<{ ats_match_score?: number; keywords_added?: string[] } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    
    setPhotoUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage.from('cv-photos').upload(path, file, { upsert: true });
    if (error) { toast.error('Upload failed'); setPhotoUploading(false); return; }
    
    const { data: urlData } = supabase.storage.from('cv-photos').getPublicUrl(path);
    updatePersonal('photo_url', urlData.publicUrl);
    toast.success('Photo uploaded!');
    setPhotoUploading(false);
  };

  const updatePersonal = (field: string, value: string) => {
    updateContent({ personal: { ...content.personal, [field]: value } });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    updateContent({ skills: [...content.skills, skillInput.trim()] });
    setSkillInput('');
  };

  const removeSkill = (i: number) => {
    updateContent({ skills: content.skills.filter((_, idx) => idx !== i) });
  };

  const addExperience = () => {
    const item: ExperienceItem = { id: genId(), company: '', role: '', start_date: '', end_date: '', current: false, bullets: [''] };
    updateContent({ experience: [...content.experience, item] });
  };

  const updateExperience = (id: string, patch: Partial<ExperienceItem>) => {
    updateContent({ experience: content.experience.map(e => e.id === id ? { ...e, ...patch } : e) });
  };

  const removeExperience = (id: string) => {
    updateContent({ experience: content.experience.filter(e => e.id !== id) });
  };

  const addProject = () => {
    updateContent({ projects: [...content.projects, { id: genId(), name: '', description: '', technologies: [], url: '' }] });
  };

  const updateProject = (id: string, patch: Partial<ProjectItem>) => {
    updateContent({ projects: content.projects.map(p => p.id === id ? { ...p, ...patch } : p) });
  };

  const removeProject = (id: string) => {
    updateContent({ projects: content.projects.filter(p => p.id !== id) });
  };

  const addEducation = () => {
    updateContent({ education: [...content.education, { id: genId(), institution: '', degree: '', field: '', start_date: '', end_date: '' }] });
  };

  const updateEducation = (id: string, patch: Partial<EducationItem>) => {
    updateContent({ education: content.education.map(e => e.id === id ? { ...e, ...patch } : e) });
  };

  const removeEducation = (id: string) => {
    updateContent({ education: content.education.filter(e => e.id !== id) });
  };

  const addCertification = () => {
    updateContent({ certifications: [...content.certifications, { id: genId(), name: '', issuer: '', date: '' }] });
  };

  const updateCertification = (id: string, patch: Partial<CertificationItem>) => {
    updateContent({ certifications: content.certifications.map(c => c.id === id ? { ...c, ...patch } : c) });
  };

  const removeCertification = (id: string) => {
    updateContent({ certifications: content.certifications.filter(c => c.id !== id) });
  };

  const addLink = () => {
    updateContent({ links: [...content.links, { id: genId(), label: '', url: '' }] });
  };

  const updateLink = (id: string, patch: Partial<LinkItem>) => {
    updateContent({ links: content.links.map(l => l.id === id ? { ...l, ...patch } : l) });
  };

  const removeLink = (id: string) => {
    updateContent({ links: content.links.filter(l => l.id !== id) });
  };

  const addLanguage = () => {
    updateContent({ languages: [...content.languages, { id: genId(), language: '', proficiency: 'Intermediate' }] });
  };

  const updateLanguage = (id: string, patch: Partial<LanguageItem>) => {
    updateContent({ languages: content.languages.map(l => l.id === id ? { ...l, ...patch } : l) });
  };

  const removeLanguage = (id: string) => {
    updateContent({ languages: content.languages.filter(l => l.id !== id) });
  };

  const generateSummary = async () => {
    if (!isPro) { toast.error('AI features require Pro plan'); return; }
    setAiLoading('summary');
    try {
      const { data, error } = await supabase.functions.invoke('ai-cv', {
        body: { type: 'summary', experience: content.experience, skills: content.skills, personal: content.personal },
      });
      if (error) throw error;
      updateContent({ summary: data.result });
      toast.success('Summary generated!');
    } catch { toast.error('Failed to generate summary'); }
    setAiLoading(null);
  };

  const improveBullet = async (expId: string, bulletIndex: number) => {
    if (!isPro) { toast.error('AI features require Pro plan'); return; }
    const exp = content.experience.find(e => e.id === expId);
    if (!exp) return;
    setAiLoading(`bullet-${expId}-${bulletIndex}`);
    try {
      const { data, error } = await supabase.functions.invoke('ai-cv', {
        body: { type: 'bullet', bullet: exp.bullets[bulletIndex], role: exp.role, company: exp.company },
      });
      if (error) throw error;
      const newBullets = [...exp.bullets];
      newBullets[bulletIndex] = data.result;
      updateExperience(expId, { bullets: newBullets });
      toast.success('Bullet improved!');
    } catch { toast.error('Failed to improve bullet'); }
    setAiLoading(null);
  };

  const getStrengthScore = async () => {
    if (!isPro) { toast.error('AI features require Pro plan'); return; }
    setAiLoading('strength');
    try {
      const { data, error } = await supabase.functions.invoke('ai-cv', {
        body: { type: 'strength', content },
      });
      if (error) throw error;
      setStrengthScore(data.result);
      toast.success('Score calculated!');
    } catch { toast.error('Failed to calculate score'); }
    setAiLoading(null);
  };

  const tailorForATS = async () => {
    if (!isPro) { toast.error('ATS Tailoring requires Pro plan'); return; }
    if (!jobDescription.trim() || jobDescription.trim().length < 20) { toast.error('Please paste a meaningful job description'); return; }
    setAiLoading('ats');
    try {
      const { data, error } = await supabase.functions.invoke('ats-tailor', {
        body: { jobDescription, currentCV: content },
      });
      if (error) throw error;
      const { ats_match_score, keywords_added, ...cvContent } = data.result;
      updateContent({
        personal: cvContent.personal || content.personal,
        summary: cvContent.summary || content.summary,
        skills: cvContent.skills || content.skills,
        experience: cvContent.experience || content.experience,
        projects: cvContent.projects || content.projects,
        education: cvContent.education || content.education,
        certifications: cvContent.certifications || content.certifications,
        links: cvContent.links || content.links,
        languages: cvContent.languages || content.languages,
      });
      setAtsResult({ ats_match_score, keywords_added });
      toast.success(`CV tailored! ATS Match: ${ats_match_score}%`);
    } catch { toast.error('Failed to tailor CV for ATS'); }
    setAiLoading(null);
  };

  const sectionLabels: Record<SectionKey, string> = {
    personal: 'Personal Info', summary: 'Professional Summary', skills: 'Skills',
    experience: 'Work Experience', projects: 'Projects', education: 'Education',
    certifications: 'Certifications', links: 'Links', languages: 'Languages',
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* AI Actions bar */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={generateSummary} disabled={aiLoading === 'summary'}>
          <Sparkles className="h-3 w-3 mr-1" /> {aiLoading === 'summary' ? 'Generating...' : 'AI Summary'}
        </Button>
        <Button size="sm" variant="outline" onClick={getStrengthScore} disabled={aiLoading === 'strength'}>
          <BarChart3 className="h-3 w-3 mr-1" /> {aiLoading === 'strength' ? 'Scoring...' : 'Strength Score'}
        </Button>
        <Button size="sm" variant="default" onClick={() => { setAtsDialogOpen(true); setAtsResult(null); }} disabled={!!aiLoading}>
          <Target className="h-3 w-3 mr-1" /> ATS Tailor
        </Button>
      </div>

      {/* ATS Result Banner */}
      {atsResult && (
        <Card className="border-primary/30 bg-primary/5"><CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-2xl font-bold ${(atsResult.ats_match_score ?? 0) >= 80 ? 'text-primary' : (atsResult.ats_match_score ?? 0) >= 50 ? 'text-yellow-600' : 'text-destructive'}`}>
              {atsResult.ats_match_score ?? 0}%
            </div>
            <span className="text-sm font-medium">ATS Match Score</span>
          </div>
          {atsResult.keywords_added && atsResult.keywords_added.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Keywords incorporated:</p>
              <div className="flex flex-wrap gap-1">
                {atsResult.keywords_added.map((kw, i) => (
                  <Badge key={i} variant="secondary" className="text-xs gap-1"><CheckCircle2 className="h-2.5 w-2.5" />{kw}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent></Card>
      )}

      {/* ATS Tailor Dialog */}
      <Dialog open={atsDialogOpen} onOpenChange={setAtsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> ATS-Optimized CV Tailoring</DialogTitle>
            <DialogDescription>Paste a job description and we'll automatically optimize your CV to match the role and pass ATS filters.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={10}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">Your existing experience stays intact — we optimize wording, keywords, and order for ATS compatibility.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAtsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAtsDialogOpen(false); tailorForATS(); }} disabled={aiLoading === 'ats' || jobDescription.trim().length < 20}>
              {aiLoading === 'ats' ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Tailoring...</> : <><Target className="h-4 w-4 mr-1" /> Tailor My CV</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {strengthScore && (
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-2xl font-bold ${strengthScore.score >= 80 ? 'text-primary' : strengthScore.score >= 50 ? 'text-yellow-600' : 'text-destructive'}`}>{strengthScore.score}/100</div>
            <span className="text-sm font-medium">Resume Strength</span>
          </div>
          <ul className="space-y-1">{strengthScore.suggestions.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}</ul>
        </CardContent></Card>
      )}

      {/* Section toggles */}
      <Card><CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Section Visibility</h3>
        <div className="grid grid-cols-2 gap-2">
          {content.section_order.map(key => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs">{sectionLabels[key]}</span>
              <Switch checked={content.section_visibility[key]} onCheckedChange={() => toggleSection(key)} />
            </div>
          ))}
        </div>
      </CardContent></Card>

      <Accordion type="multiple" defaultValue={['personal', 'summary', 'skills', 'experience']} className="space-y-2">
        {/* Personal Info */}
        {content.section_visibility.personal && (
          <AccordionItem value="personal" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Personal Info</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              {/* Photo upload */}
              <div className="flex items-center gap-4 mb-2">
                <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border group">
                  {content.personal.photo_url ? (
                    <img src={content.personal.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  )}
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    {photoUploading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Camera className="h-4 w-4 text-white" />}
                  </button>
                </div>
                <div className="flex-1">
                  <Button size="sm" variant="outline" onClick={() => photoInputRef.current?.click()} disabled={photoUploading}>
                    {photoUploading ? 'Uploading...' : content.personal.photo_url ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {content.personal.photo_url && (
                    <Button size="sm" variant="ghost" className="ml-2 text-destructive" onClick={() => updatePersonal('photo_url', '')}>Remove</Button>
                  )}
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label className="text-xs">Full Name</Label><Input value={content.personal.name} onChange={e => updatePersonal('name', e.target.value)} placeholder="John Doe" /></div>
                <div><Label className="text-xs">Job Title</Label><Input value={content.personal.title} onChange={e => updatePersonal('title', e.target.value)} placeholder="Software Developer" /></div>
                <div><Label className="text-xs">Email</Label><Input value={content.personal.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="john@example.com" /></div>
                <div><Label className="text-xs">Phone</Label><Input value={content.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+1 234 567 890" /></div>
                <div className="sm:col-span-2"><Label className="text-xs">Location</Label><Input value={content.personal.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="New York, NY" /></div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Summary */}
        {content.section_visibility.summary && (
          <AccordionItem value="summary" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Professional Summary</AccordionTrigger>
            <AccordionContent className="pb-4">
              <Textarea value={content.summary} onChange={e => updateContent({ summary: e.target.value })} placeholder="Write a brief professional summary..." rows={4} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Skills */}
        {content.section_visibility.skills && (
          <AccordionItem value="skills" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Skills</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <div className="flex gap-2">
                <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a skill..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <Button size="sm" onClick={addSkill}><Plus className="h-3 w-3" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.skills.map((s, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">{s}<button onClick={() => removeSkill(i)}><X className="h-3 w-3" /></button></Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Experience */}
        {content.section_visibility.experience && (
          <AccordionItem value="experience" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Work Experience</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {content.experience.map(exp => (
                <Card key={exp.id} className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <Input value={exp.company} onChange={e => updateExperience(exp.id, { company: e.target.value })} placeholder="Company" />
                      <Input value={exp.role} onChange={e => updateExperience(exp.id, { role: e.target.value })} placeholder="Role" />
                      <Input type="month" value={exp.start_date} onChange={e => updateExperience(exp.id, { start_date: e.target.value })} />
                      <Input type="month" value={exp.end_date} onChange={e => updateExperience(exp.id, { end_date: e.target.value })} placeholder="End date" disabled={exp.current} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={exp.current} onCheckedChange={c => updateExperience(exp.id, { current: c })} />
                    <span className="text-xs text-muted-foreground">Currently working here</span>
                  </div>
                  <div className="space-y-2">
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-1">
                        <Input value={b} onChange={e => { const bs = [...exp.bullets]; bs[bi] = e.target.value; updateExperience(exp.id, { bullets: bs }); }} placeholder="Achievement or responsibility..." />
                        <Button variant="ghost" size="icon" onClick={() => improveBullet(exp.id, bi)} disabled={aiLoading === `bullet-${exp.id}-${bi}`} title="AI Improve">
                          <Sparkles className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { const bs = exp.bullets.filter((_, i) => i !== bi); updateExperience(exp.id, { bullets: bs }); }}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => updateExperience(exp.id, { bullets: [...exp.bullets, ''] })}><Plus className="h-3 w-3 mr-1" /> Add Bullet</Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Experience</Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Projects */}
        {content.section_visibility.projects && (
          <AccordionItem value="projects" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Projects</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {content.projects.map(p => (
                <Card key={p.id} className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Input value={p.name} onChange={e => updateProject(p.id, { name: e.target.value })} placeholder="Project name" className="flex-1 mr-2" />
                    <Button variant="ghost" size="icon" onClick={() => removeProject(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <Textarea value={p.description} onChange={e => updateProject(p.id, { description: e.target.value })} placeholder="Project description" rows={2} />
                  <Input value={p.url} onChange={e => updateProject(p.id, { url: e.target.value })} placeholder="Project URL" />
                </Card>
              ))}
              <Button variant="outline" onClick={addProject} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Project</Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Education */}
        {content.section_visibility.education && (
          <AccordionItem value="education" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Education</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {content.education.map(edu => (
                <Card key={edu.id} className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <Input value={edu.institution} onChange={e => updateEducation(edu.id, { institution: e.target.value })} placeholder="Institution" />
                      <Input value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} placeholder="Degree" />
                      <Input value={edu.field} onChange={e => updateEducation(edu.id, { field: e.target.value })} placeholder="Field of study" />
                      <div className="flex gap-2">
                        <Input type="month" value={edu.start_date} onChange={e => updateEducation(edu.id, { start_date: e.target.value })} />
                        <Input type="month" value={edu.end_date} onChange={e => updateEducation(edu.id, { end_date: e.target.value })} />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addEducation} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Education</Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Certifications */}
        {content.section_visibility.certifications && (
          <AccordionItem value="certifications" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Certifications</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {content.certifications.map(cert => (
                <Card key={cert.id} className="p-3 flex gap-2 items-center">
                  <Input value={cert.name} onChange={e => updateCertification(cert.id, { name: e.target.value })} placeholder="Certification" className="flex-1" />
                  <Input value={cert.issuer} onChange={e => updateCertification(cert.id, { issuer: e.target.value })} placeholder="Issuer" className="flex-1" />
                  <Input type="month" value={cert.date} onChange={e => updateCertification(cert.id, { date: e.target.value })} className="w-32" />
                  <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </Card>
              ))}
              <Button variant="outline" onClick={addCertification} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Certification</Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Links */}
        {content.section_visibility.links && (
          <AccordionItem value="links" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Links</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {content.links.map(link => (
                <div key={link.id} className="flex gap-2">
                  <Input value={link.label} onChange={e => updateLink(link.id, { label: e.target.value })} placeholder="Label" className="w-32" />
                  <Input value={link.url} onChange={e => updateLink(link.id, { url: e.target.value })} placeholder="URL" className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addLink} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Languages */}
        {content.section_visibility.languages && (
          <AccordionItem value="languages" className="border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-semibold">Languages</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {content.languages.map(lang => (
                <div key={lang.id} className="flex gap-2">
                  <Input value={lang.language} onChange={e => updateLanguage(lang.id, { language: e.target.value })} placeholder="Language" className="flex-1" />
                  <Input value={lang.proficiency} onChange={e => updateLanguage(lang.id, { proficiency: e.target.value })} placeholder="Proficiency" className="w-32" />
                  <Button variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addLanguage} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Language</Button>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};
