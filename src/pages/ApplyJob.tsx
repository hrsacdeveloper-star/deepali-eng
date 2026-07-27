import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AuthModal from '@/components/auth/AuthModal';
import { FadeIn } from '@/components/ui/fade-in';

const ApplyJob: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || '';
  
  const [session, setSession] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: roleParam,
    coverLetter: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email as string }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email as string }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setIsAuthOpen(true);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('form_submissions')
        .insert([
          {
            type: 'job_application',
            payload: formData
          }
        ]);

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      setFormData({ name: '', email: session.user.email as string, phone: '', position: roleParam, coverLetter: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-12 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Job Application</h1>
            <p className="text-muted-foreground text-pretty">
              Fill out the form below to apply for a position at Deepali Engineering.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-12 md:py-20">
        <div className="container max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="position">Position Applied For</Label>
              <Input 
                id="position" 
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. CNC Operator" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  required 
                  readOnly={!!session}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter / Summary</Label>
              <Textarea 
                id="coverLetter" 
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Briefly describe your experience and why you are a good fit..." 
                className="min-h-[150px]"
                required 
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : session ? 'Submit Application' : 'Login to Submit Application'}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Note: Resume upload functionality will be provided via email after initial screening.
            </p>
          </form>
        </div>
      </motion.section>
      
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  );
};

export default ApplyJob;
