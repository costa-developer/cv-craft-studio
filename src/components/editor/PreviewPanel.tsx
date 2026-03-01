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
        style={{
          width: '210mm',
          transform: `scale(${isMobile ? 0.45 : 0.7})`,
          transformOrigin: 'top center',
        }}
      >
        {/* 
          The template content flows naturally. We use CSS columns simulation:
          each "page" is 297mm tall. Content overflows into visual pages via
          a repeating background that draws page boundaries.
        */}
        <div
          className="bg-white shadow-xl relative"
          style={{
            width: '210mm',
            minHeight: '297mm',
            /* A4 page visual separator via repeating gradient */
            backgroundImage: 'linear-gradient(to bottom, white calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)',
            backgroundSize: '100% 297mm',
            backgroundRepeat: 'repeat-y',
            /* Simulated page shadow every 297mm */
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
          }}
        >
          <TemplateComponent content={content} accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
};
