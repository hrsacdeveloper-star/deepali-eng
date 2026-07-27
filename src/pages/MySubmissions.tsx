import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { FileEdit, Trash2, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { FadeIn } from '@/components/ui/fade-in';

interface Submission {
  id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  payload: any;
}

const MySubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        toast.error('Please verify your email to access your submissions');
        navigate('/');
        return;
      }
      fetchSubmissions(session.user.id);
    };
    init();
  }, [navigate]);

  const fetchSubmissions = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      toast.success('Submission deleted successfully');
      fetchSubmissions(session.user.id);
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'read': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'archived': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default: return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Pending Review';
      case 'read': return 'In Progress';
      case 'archived': return 'Completed';
      default: return 'Pending';
    }
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'rfq': return 'Quote Request';
      case 'contact': return 'General Inquiry';
      case 'job_application': return 'Job Application';
      default: return type.toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Page Header */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-white py-12 border-b">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary uppercase">My Submissions</h1>
            <p className="text-muted-foreground text-pretty">
              View and manage your requests, quotes, and applications.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-12 flex-1">
        <div className="container">
          {submissions.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed rounded-none">
              <h3 className="text-xl font-bold mb-2">No submissions found</h3>
              <p className="text-muted-foreground mb-6">You haven't submitted any requests or applications yet.</p>
              <Button asChild className="rounded-none bg-primary uppercase tracking-widest text-xs font-bold px-8">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub) => (
                <Card key={sub.id} className="rounded-none border-border shadow-sm flex flex-col bg-white">
                  <CardHeader className="pb-4 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1">
                        {getTypeDisplay(sub.type)}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {getStatusIcon(sub.status)}
                        <span>{getStatusText(sub.status)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold line-clamp-1">
                      {sub.type === 'rfq' && sub.payload?.product_required ? sub.payload.product_required : 'Inquiry'}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Submitted on {new Date(sub.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-6 text-sm">
                      {sub.type === 'rfq' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium text-right">{sub.payload?.quantity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span className="font-medium text-right truncate max-w-[150px]">{sub.payload?.timeline || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-none w-full text-xs font-bold uppercase tracking-widest"
                        onClick={() => navigate(sub.type === 'rfq' ? `/request-quote?id=${sub.id}` : `/contact?id=${sub.id}`)}
                      >
                        <FileEdit className="h-3 w-3 mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-none w-full text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(sub.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default MySubmissions;