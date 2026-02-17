import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, Flag } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [profilesRes, flagsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('feature_flags').select('*').order('key'),
      ]);
      setUsers((profilesRes.data as any[]) ?? []);
      setFlags((flagsRes.data as any[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const toggleFlag = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from('feature_flags').update({ enabled } as any).eq('id', id);
    if (error) toast.error('Failed to update flag');
    else {
      setFlags(flags.map(f => f.id === id ? { ...f, enabled } : f));
      toast.success('Flag updated');
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="font-display text-xl font-semibold">Admin Panel</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Users ({users.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.display_name || '—'}</TableCell>
                    <TableCell><span className={`px-2 py-0.5 rounded text-xs ${u.subscription_status === 'pro' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>{u.subscription_status}</span></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Flag className="h-5 w-5" /> Feature Flags</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flags.map(f => (
                <div key={f.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div><p className="font-medium text-sm">{f.description || f.key}</p><p className="text-xs text-muted-foreground">{f.key}</p></div>
                  <Switch checked={f.enabled} onCheckedChange={v => toggleFlag(f.id, v)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
