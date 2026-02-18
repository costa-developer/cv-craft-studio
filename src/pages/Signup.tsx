import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Briefcase, Code, Palette, Stethoscope, Scale, GraduationCap, TrendingUp, Wrench, ChevronRight, ChevronLeft } from 'lucide-react';

const FIELDS = [
  { value: 'Software Engineering', icon: Code, color: '#3B82F6' },
  { value: 'Marketing & Sales', icon: TrendingUp, color: '#F59E0B' },
  { value: 'Design & Creative', icon: Palette, color: '#EC4899' },
  { value: 'Healthcare', icon: Stethoscope, color: '#10B981' },
  { value: 'Finance & Accounting', icon: Briefcase, color: '#6366F1' },
  { value: 'Legal', icon: Scale, color: '#8B5CF6' },
  { value: 'Education', icon: GraduationCap, color: '#F97316' },
  { value: 'Engineering & Manufacturing', icon: Wrench, color: '#64748B' },
];

const Signup = () => {
  const [step, setStep] = useState<'info' | 'field'>('info');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!displayName.trim()) { toast.error('Please enter your name'); return; }
    setStep('field');
  };

  const handleSignup = async () => {
    if (!selectedField) { toast.error('Please select your field'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      // Store field in localStorage for dashboard to pick up
      localStorage.setItem('cvcraft_onboarding_field', selectedField);
      localStorage.setItem('cvcraft_onboarding_name', displayName);
      toast.success('Account created! Generating your CV...');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-display text-xl font-semibold">CVCraft</span>
          </Link>
          <CardTitle className="font-display text-2xl">
            {step === 'info' ? 'Create your account' : 'What\'s your field?'}
          </CardTitle>
          <CardDescription>
            {step === 'info' ? 'Start building professional CVs today' : 'We\'ll generate a tailored CV to get you started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'info' ? (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {FIELDS.map(f => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setSelectedField(f.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm font-medium transition-all hover:scale-[1.02] ${
                      selectedField === f.value 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: f.color + '15' }}>
                      <f.icon size={18} style={{ color: f.color }} />
                    </div>
                    <span className="text-xs leading-tight">{f.value}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('info')} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={handleSignup} disabled={!selectedField || loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
