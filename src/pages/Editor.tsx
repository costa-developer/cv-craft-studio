import { useParams, Link } from 'react-router-dom';
import { useCVEditor } from '@/hooks/useCVEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_LABELS, TemplateName } from '@/types/cv';
import { ArrowLeft, Save, Loader2, Eye, PenTool, Download, FileText } from 'lucide-react';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const editor = useCVEditor(id);
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  if (editor.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!id) return;
    toast.info(`Generating ${format.toUpperCase()}...`);
    try {
      const res = await supabase.functions.invoke('generate-pdf', {
        body: { cvId: id, format },
      });
      if (res.error) throw res.error;
      if (format === 'docx') {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-word' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${editor.title || 'CV'}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([res.data], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch { toast.error(`${format.toUpperCase()} generation failed`); }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-3 md:px-4 h-14 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="flex-shrink-0" asChild><Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <Input
            value={editor.title}
            onChange={e => editor.updateTitle(e.target.value)}
            className="w-28 md:w-48 h-8 text-sm font-medium border-transparent hover:border-input focus:border-input"
          />
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Select value={editor.template} onValueChange={editor.updateTemplate}>
            <SelectTrigger className="w-28 md:w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TEMPLATE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden sm:flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Accent</label>
            <input type="color" value={editor.accentColor} onChange={e => editor.updateAccentColor(e.target.value)} className="w-6 h-6 rounded border-none cursor-pointer" />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => handleDownload('pdf')}><Download className="h-3 w-3 mr-1" /> PDF</Button>
            <Button size="sm" variant="outline" onClick={() => handleDownload('docx')}><FileText className="h-3 w-3 mr-1" /> DOCX</Button>
          </div>
          {editor.saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </div>

      {/* Mobile tab bar */}
      {isMobile && (
        <div className="flex border-b border-border bg-background">
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileTab === 'edit' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            <PenTool className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${mobileTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <>
            {mobileTab === 'edit' ? (
              <EditorPanel editor={editor} />
            ) : (
              <PreviewPanel content={editor.content} template={editor.template as TemplateName} accentColor={editor.accentColor} />
            )}
          </>
        ) : (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={45} minSize={30}>
              <EditorPanel editor={editor} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} minSize={35}>
              <PreviewPanel content={editor.content} template={editor.template as TemplateName} accentColor={editor.accentColor} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* Mobile download FAB */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 flex gap-2 z-50">
          <Button size="sm" className="rounded-full shadow-lg" onClick={() => handleDownload('pdf')}>
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button size="sm" variant="outline" className="rounded-full shadow-lg bg-background" onClick={() => handleDownload('docx')}>
            <FileText className="h-4 w-4 mr-1" /> DOCX
          </Button>
        </div>
      )}
    </div>
  );
};

export default Editor;
