import { useParams, Link } from 'react-router-dom';
import { useCVEditor } from '@/hooks/useCVEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_LABELS, TemplateName } from '@/types/cv';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const editor = useCVEditor(id);

  if (editor.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 h-14 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <Input
            value={editor.title}
            onChange={e => editor.updateTitle(e.target.value)}
            className="w-48 h-8 text-sm font-medium border-transparent hover:border-input focus:border-input"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={editor.template} onValueChange={editor.updateTemplate}>
            <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TEMPLATE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Accent</label>
            <input type="color" value={editor.accentColor} onChange={e => editor.updateAccentColor(e.target.value)} className="w-6 h-6 rounded border-none cursor-pointer" />
          </div>
          {editor.saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </div>

      {/* Split panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={45} minSize={30}>
            <EditorPanel editor={editor} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={35}>
            <PreviewPanel content={editor.content} template={editor.template as TemplateName} accentColor={editor.accentColor} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Editor;
