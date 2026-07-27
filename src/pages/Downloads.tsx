import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import { FadeIn } from '@/components/ui/fade-in';

interface DownloadItem {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: string;
  category: string;
}

const Downloads: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const { data } = await supabase.from('downloads').select('*').order('order_index');
        if (data) setDownloads(data);
      } catch (error) {
        console.error('Error fetching downloads:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDownloads();
  }, []);

  const handleDownload = (e: React.MouseEvent, url: string) => {
    if (!session) {
      e.preventDefault();
      setIsAuthOpen(true);
    } else {
      // Logic to actually trigger download or open PDF in new tab
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Page Header */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Downloads</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Access our product catalogues, technical brochures, and company profiles.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloads.length > 0 ? downloads.map((item) => (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="font-bold text-foreground line-clamp-2">{item.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span className="px-2 py-1 rounded bg-muted uppercase">{item.file_type || 'PDF'}</span>
                        {item.file_size && <span>{item.file_size}</span>}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-between mt-2 group"
                        onClick={(e) => handleDownload(e, item.file_url)}
                      >
                        Download
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                // Dummy data if empty
                [
                  { title: "Deepali Engineering Corporate Profile 2026", type: "PDF", size: "4.2 MB" },
                  { title: "Precision Couplings Technical Catalogue", type: "PDF", size: "8.5 MB" },
                  { title: "Industrial Flanges Spec Sheet", type: "PDF", size: "3.1 MB" },
                  { title: "Pipe Fittings Product Guide", type: "PDF", size: "5.7 MB" }
                ].map((item, i) => (
                  <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="font-bold text-foreground line-clamp-2">{item.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <span className="px-2 py-1 rounded bg-muted uppercase">{item.type}</span>
                          <span>{item.size}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-between mt-2 group"
                          onClick={(e) => handleDownload(e, "#")}
                        >
                          Download
                          <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </motion.section>

      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
  );
};

export default Downloads;
