import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CV, CVContent, DEFAULT_CV_CONTENT, SectionKey } from '@/types/cv';
import { toast } from 'sonner';

export const useCVEditor = (cvId: string | undefined) => {
  const [cv, setCv] = useState<CV | null>(null);
  const [content, setContent] = useState<CVContent>(DEFAULT_CV_CONTENT);
  const [title, setTitle] = useState('Untitled CV');
  const [template, setTemplate] = useState('modern-minimal');
  const [accentColor, setAccentColor] = useState('#A0C878');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!cvId) return;
    (async () => {
      const { data, error } = await supabase.from('cvs').select('*').eq('id', cvId).single();
      if (error || !data) { toast.error('CV not found'); setLoading(false); return; }
      const d = data as any;
      setCv(d as CV);
      setContent(d.content as CVContent);
      setTitle(d.title);
      setTemplate(d.template);
      setAccentColor(d.accent_color);
      setLoading(false);
    })();
  }, [cvId]);

  const save = useCallback(async (updates: Partial<{ content: CVContent; title: string; template: string; accent_color: string }>) => {
    if (!cvId) return;
    setSaving(true);
    const payload: any = {};
    if (updates.content) payload.content = updates.content;
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.template) payload.template = updates.template;
    if (updates.accent_color) payload.accent_color = updates.accent_color;
    await supabase.from('cvs').update(payload).eq('id', cvId);
    setSaving(false);
  }, [cvId]);

  const autoSave = useCallback((updates: Partial<{ content: CVContent; title: string; template: string; accent_color: string }>) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => save(updates), 800);
  }, [save]);

  const updateContent = useCallback((patch: Partial<CVContent>) => {
    setContent(prev => {
      const next = { ...prev, ...patch };
      autoSave({ content: next });
      return next;
    });
  }, [autoSave]);

  const updateTitle = useCallback((t: string) => {
    setTitle(t);
    autoSave({ title: t });
  }, [autoSave]);

  const updateTemplate = useCallback((t: string) => {
    setTemplate(t);
    save({ template: t });
  }, [save]);

  const updateAccentColor = useCallback((c: string) => {
    setAccentColor(c);
    autoSave({ accent_color: c });
  }, [autoSave]);

  const reorderSections = useCallback((newOrder: SectionKey[]) => {
    updateContent({ section_order: newOrder });
  }, [updateContent]);

  const toggleSection = useCallback((key: SectionKey) => {
    setContent(prev => {
      const next = { ...prev, section_visibility: { ...prev.section_visibility, [key]: !prev.section_visibility[key] } };
      autoSave({ content: next });
      return next;
    });
  }, [autoSave]);

  return { cv, content, title, template, accentColor, loading, saving, updateContent, updateTitle, updateTemplate, updateAccentColor, reorderSections, toggleSection };
};
