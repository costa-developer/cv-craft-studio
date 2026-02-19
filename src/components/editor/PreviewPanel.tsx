import { CVContent, TemplateName } from '@/types/cv';
import { ModernMinimal } from '@/components/templates/ModernMinimal';
import { CorporateExecutive } from '@/components/templates/CorporateExecutive';
import { TechProfessional } from '@/components/templates/TechProfessional';
import { CreativeClean } from '@/components/templates/CreativeClean';
import { CompactProfessional } from '@/components/templates/CompactProfessional';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreviewPanelProps {
  content: CVContent;
  template: TemplateName;
  accentColor: string;
}

const templates: Record<TemplateName, React.FC<{ content: CVContent; accentColor: string }>> = {
  'modern-minimal': ModernMinimal,
  'corporate-executive': CorporateExecutive,
  'tech-professional': TechProfessional,
  'creative-clean': CreativeClean,
  'compact-professional': CompactProfessional,
};

export const PreviewPanel = ({ content, template, accentColor }: PreviewPanelProps) => {
  const TemplateComponent = templates[template] || ModernMinimal;
  const isMobile = useIsMobile();

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-3 md:p-6 flex justify-center">
      <div
        className="bg-white shadow-xl rounded-sm"
        style={{
          width: '210mm',
          minHeight: '297mm',
          transform: `scale(${isMobile ? 0.45 : 0.7})`,
          transformOrigin: 'top center',
        }}
      >
        <TemplateComponent content={content} accentColor={accentColor} />
      </div>
    </div>
  );
};
