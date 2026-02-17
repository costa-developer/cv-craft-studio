import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CVContent, TemplateName } from '@/types/cv';
import { ModernMinimal } from '@/components/templates/ModernMinimal';
import { CorporateExecutive } from '@/components/templates/CorporateExecutive';
import { TechProfessional } from '@/components/templates/TechProfessional';
import { CreativeClean } from '@/components/templates/CreativeClean';
import { CompactProfessional } from '@/components/templates/CompactProfessional';

const templates: Record<TemplateName, React.FC<{ content: CVContent; accentColor: string }>> = {
  'modern-minimal': ModernMinimal,
  'corporate-executive': CorporateExecutive,
  'tech-professional': TechProfessional,
  'creative-clean': CreativeClean,
  'compact-professional': CompactProfessional,
};

const PublicCV = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('cvs').select('*').eq('public_slug', slug).eq('is_public', true).single();
      setCv(data);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!cv) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">CV not found or not public.</div>;

  const Template = templates[(cv.template as TemplateName)] || ModernMinimal;
  const content = cv.content as CVContent;

  return (
    <div className="min-h-screen bg-muted/30 flex justify-center py-8 px-4">
      <div className="w-[210mm] bg-white shadow-xl">
        <Template content={content} accentColor={cv.accent_color} />
      </div>
    </div>
  );
};

export default PublicCV;
