import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AuthModal from '@/components/auth/AuthModal';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FadeIn } from '@/components/ui/fade-in';

const RFQ: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    company: '',
    product_required: '',
    quantity: '',
    timeline: '',
    specifications: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        if (editId) {
          fetchSubmission(editId, session.user.id);
        } else {
          fetchUserProfile(session.user.id, session.user.email as string);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user && !editId) {
        fetchUserProfile(session.user.id, session.user.email as string);
      }
    });

    return () => subscription.unsubscribe();
  }, [editId]);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setFormData(prev => ({
          ...prev,
          email,
          name: data.name || '',
          phone: data.contact_number || '',
          designation: data.designation || ''
        }));
      } else {
        setFormData(prev => ({ ...prev, email }));
      }
    } catch (e) {
      setFormData(prev => ({ ...prev, email }));
    }
  };

  const fetchSubmission = async (id: string, userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      if (data && data.payload) {
        setFormData({
          name: data.payload.name || '',
          email: data.payload.email || '',
          phone: data.payload.phone || '',
          designation: data.payload.designation || '',
          company: data.payload.company || '',
          product_required: data.payload.product_required || '',
          quantity: data.payload.quantity || '',
          timeline: data.payload.timeline || '',
          specifications: data.payload.specifications || ''
        });
        setIsEditing(true);
      }
    } catch (e: any) {
      toast.error('Failed to load submission data');
      navigate('/request-quote');
    } finally {
      setLoading(false);
    }
  };

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
      if (isEditing && editId) {
        const { error } = await supabase
          .from('form_submissions')
          .update({
            payload: formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editId)
          .eq('user_id', session.user.id);

        if (error) throw error;
        toast.success('Quote Request updated successfully!');
        navigate('/my-submissions');
      } else {
        const { error } = await supabase
          .from('form_submissions')
          .insert([
            {
              type: 'rfq',
              user_id: session.user.id,
              payload: formData
            }
          ]);

        if (error) throw error;
        
        toast.success('Quote Request submitted successfully! Our sales team will contact you shortly.');
        navigate('/my-submissions');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-12 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 uppercase">
              {isEditing ? 'Edit Quote Request' : 'Request a Quote'}
            </h1>
            <p className="text-muted-foreground text-pretty">
              {isEditing 
                ? 'Update your project requirements below to receive a revised quotation.'
                : 'Provide your project requirements below, and our engineering team will get back to you with a customized quotation.'}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-12 md:py-20">
        <div className="container max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 md:p-10 rounded-none border border-border shadow-none">
            
            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2 uppercase tracking-widest text-primary">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} className="rounded-none border-border" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} className="rounded-none border-border" required readOnly={!!session} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="rounded-none border-border" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" value={formData.designation} onChange={handleChange} className="rounded-none border-border" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input id="company" value={formData.company} onChange={handleChange} className="rounded-none border-border" required />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2 uppercase tracking-widest text-primary mt-8">Project Requirements</h3>
              <div className="space-y-2">
                <Label htmlFor="product_required">Product Category / Type *</Label>
                <Input id="product_required" placeholder="e.g. Stainless Steel Flanges, Custom Forgings" value={formData.product_required} onChange={handleChange} className="rounded-none border-border" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Estimated Quantity *</Label>
                  <Input id="quantity" placeholder="e.g. 500 pcs, 10 Tons" value={formData.quantity} onChange={handleChange} className="rounded-none border-border" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Delivery Timeline</Label>
                  <Input id="timeline" placeholder="e.g. Within 4 weeks, Q3 2026" value={formData.timeline} onChange={handleChange} className="rounded-none border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications">Technical Specifications / Additional Notes *</Label>
                <Textarea 
                  id="specifications" 
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="Please describe material grade, dimensions, tolerances, or any specific standard requirements..." 
                  className="min-h-[150px] rounded-none border-border"
                  required 
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-none bg-primary uppercase tracking-widest text-xs font-bold" disabled={loading}>
              {loading ? 'Submitting...' : session ? (isEditing ? 'Update Quote Request' : 'Submit Quote Request') : 'Verify Email to Submit'}
            </Button>
            
          </form>
        </div>
      </motion.section>
      
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  );
};

export default RFQ;
