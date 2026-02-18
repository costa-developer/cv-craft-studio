import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CV, CVContent, TEMPLATE_LABELS, TemplateName, DEFAULT_CV_CONTENT } from '@/types/cv';
import { toast } from 'sonner';
import { Plus, Edit, Copy, Trash2, Download, Share2, LogOut, FileText, MoreVertical, Shield, Crown, Loader2, Sparkles } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, profile, isAdmin, signOut, checkSubscription } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const onboardingChecked = useRef(false);
  const navigate = useNavigate();

  const fetchCVs = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (error) toast.error('Failed to load CVs');
    else setCvs((data as any[])?.map(d => ({ ...d, content: d.content as unknown as CVContent })) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCVs(); }, [user]);

  // Auto-generate AI prefilled CV for new signups
  useEffect(() => {
    if (!user || onboardingChecked.current || loading) return;
    onboardingChecked.current = true;
    const field = localStorage.getItem('cvcraft_onboarding_field');
    const name = localStorage.getItem('cvcraft_onboarding_name');
    if (!field) return;
    localStorage.removeItem('cvcraft_onboarding_field');
    localStorage.removeItem('cvcraft_onboarding_name');
    
    (async () => {
      setGenerating(true);
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-cv-content', {
          body: { field, name: name || 'Alex Johnson' },
        });
        if (aiError) throw aiError;
        
        const content = {
          ...DEFAULT_CV_CONTENT,
          ...aiData.content,
          section_order: DEFAULT_CV_CONTENT.section_order,
          section_visibility: DEFAULT_CV_CONTENT.section_visibility,
        };
        
        const { data: cvData, error: cvError } = await supabase
          .from('cvs')
          .insert({ user_id: user.id, title: `${field} CV`, content: content as any })
          .select()
          .single();
        
        if (cvError) throw cvError;
        toast.success('Your AI-generated CV is ready! 🎉');
        navigate(`/editor/${(cvData as any).id}`);
      } catch (e) {
        console.error('Onboarding CV generation failed:', e);
        toast.error('Could not generate CV automatically. Create one manually!');
        setGenerating(false);
        fetchCVs();
      }
    })();
  }, [user, loading]);

  const createCV = async () => {
    if (!user) return;
    if (profile?.subscription_status === 'free' && cvs.length >= 1) {
      toast.error('Free plan allows only 1 CV. Upgrade to Pro!');
      return;
    }
    const { data, error } = await supabase
      .from('cvs')
      .insert({ user_id: user.id, title: 'Untitled CV' })
      .select()
      .single();
    if (error) toast.error('Failed to create CV');
    else navigate(`/editor/${(data as any).id}`);
  };

  const duplicateCV = async (cv: CV) => {
    if (!user) return;
    const { error } = await supabase
      .from('cvs')
      .insert({ user_id: user.id, title: `${cv.title} (Copy)`, template: cv.template, accent_color: cv.accent_color, content: cv.content as any });
    if (error) toast.error('Failed to duplicate');
    else { toast.success('CV duplicated'); fetchCVs(); }
  };

  const deleteCV = async (id: string) => {
    const { error } = await supabase.from('cvs').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('CV deleted'); fetchCVs(); }
  };

  const togglePublic = async (cv: CV) => {
    const slug = cv.is_public ? null : cv.id.slice(0, 8);
    const { error } = await supabase.from('cvs').update({ is_public: !cv.is_public, public_slug: slug } as any).eq('id', cv.id);
    if (error) toast.error('Failed to update sharing');
    else { toast.success(cv.is_public ? 'Sharing disabled' : 'Public link created'); fetchCVs(); }
  };

  const downloadPDF = async (cv: CV) => {
    toast.info('Generating PDF...');
    try {
      const res = await supabase.functions.invoke('generate-pdf', {
        body: { cvId: cv.id },
      });
      if (res.error) throw res.error;
      // The function returns HTML, open it in a new tab for printing
      const blob = new Blob([res.data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch { toast.error('PDF generation failed'); }
  };

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch { toast.error('Failed to start checkout'); }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch { toast.error('Failed to open subscription management'); }
  };

  // Check for upgrade success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === 'true') {
      toast.success('Welcome to Pro! 🎉');
      checkSubscription();
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-display text-xl font-semibold">CVCraft</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin"><Shield className="h-4 w-4 mr-1" /> Admin</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">{profile?.display_name}</span>
            <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">My CVs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {profile?.subscription_status === 'free' ? 'Free Plan · 1 CV' : 'Pro Plan · Unlimited CVs'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.subscription_status === 'free' ? (
              <Button variant="outline" onClick={handleUpgrade}><Crown className="h-4 w-4 mr-1" /> Upgrade to Pro</Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleManageSubscription}>Manage Subscription</Button>
            )}
            <Button onClick={createCV}><Plus className="h-4 w-4 mr-1" /> New CV</Button>
          </div>
        </div>

        {generating ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <Sparkles className="h-5 w-5 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Generating your CV with AI...</h3>
              <p className="text-sm text-muted-foreground mt-1">Crafting a professional CV tailored to your field</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : cvs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold mb-2">No CVs yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first professional CV</p>
              <Button onClick={createCV}><Plus className="h-4 w-4 mr-1" /> Create CV</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv, i) => (
              <motion.div key={cv.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="group hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/editor/${cv.id}`)}>
                  <CardContent className="p-5">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4 flex items-center justify-center group-hover:bg-accent/40 transition-colors overflow-hidden">
                      <FileText className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{cv.title}</h3>
                        <p className="text-xs text-muted-foreground">{TEMPLATE_LABELS[cv.template as TemplateName] ?? cv.template}</p>
                        <p className="text-xs text-muted-foreground mt-1">Edited {new Date(cv.updated_at).toLocaleDateString()}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => navigate(`/editor/${cv.id}`)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateCV(cv)}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadPDF(cv)}><Download className="h-4 w-4 mr-2" /> Download PDF</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePublic(cv)}><Share2 className="h-4 w-4 mr-2" /> {cv.is_public ? 'Disable Sharing' : 'Share'}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteCV(cv.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
