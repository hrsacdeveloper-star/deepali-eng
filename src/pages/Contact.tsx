import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MapPin, Phone, Mail } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FadeIn } from '@/components/ui/fade-in';
import { SEO } from '@/components/seo/SEO';

const Contact: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*').limit(1).single();
        if (data) setSiteSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

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
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
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
          subject: data.payload.subject || '',
          message: data.payload.message || ''
        });
        setIsEditing(true);
      }
    } catch (e: any) {
      toast.error('Failed to load submission data');
      navigate('/contact');
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
        toast.success('Message updated successfully!');
        navigate('/my-submissions');
      } else {
        const { error } = await supabase
          .from('form_submissions')
          .insert([
            {
              type: 'contact',
              user_id: session.user.id,
              payload: formData
            }
          ]);

        if (error) throw error;
        
        toast.success('Message sent successfully! We will contact you soon.');
        navigate('/my-submissions');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Deepali Engineering | Precision Engineering Company in Pune"
        description="Get in touch with Deepali Engineering for precision engineering components, jigs & fixtures, machine spare parts, industrial flanges, and customized manufacturing solutions in Pune."
        url="/contact"
        keywords="Contact Deepali Engineering, Engineering Company Contact Pune, Precision Components Manufacturer Contact, Manufacturing Company Pune, Contact Precision Engineering Company"
      />
    <div className="flex flex-col w-full overflow-x-hidden">
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <FadeIn direction="up" className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Contact Us</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Get in touch with our team for inquiries, support, or partnership opportunities.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Form */}
            <FadeIn direction="right" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Send us a Message</h2>
                <p className="text-muted-foreground text-sm">Fill out the form below and we will get back to you promptly.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" value={formData.subject} onChange={handleChange} className="rounded-none border-border" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    className="min-h-[150px] rounded-none border-border" 
                    required 
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto rounded-none uppercase tracking-widest text-xs font-bold" disabled={loading}>
                  {loading ? 'Submitting...' : session ? (isEditing ? 'Update Message' : 'Send Message') : 'Login to Send Message'}
                </Button>
              </form>
            </FadeIn>

            {/* Contact Info & Map */}
            <FadeIn direction="left" className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Corporate Office & Works</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Capital City, S.No. A7/2, Plot No. C-10<br />
                        Opp. Mahindra & Mahindra Gate No.1<br />
                        Talwade-Mahulunge Road, Village -Nighoje<br />
                        MIDC Chakan, Phase IV, Pune<br />
                        Maharashtra 410501, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-muted-foreground text-sm">
                        +91 9822767451<br />
                        Mon-Sat, 9:00 AM - 6:00 PM (IST)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground text-sm">
                        deepaliengg@yahoo.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Embed */}
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-muted">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{border: 0}} 
                  src="https://www.google.com/maps/embed/v1/place?key=REDACTED&q=Deepali+Engineering,Pune"
                  allowFullScreen
                ></iframe>
              </div>
            </FadeIn>
            
          </div>
        </div>
      </section>

      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
    </>
  );
};

export default Contact;
