import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/ui/fade-in';

interface Job {
  id: string;
  title: string;
  location: string;
  department: string;
  description: string;
}

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await supabase
          .from('careers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (data) setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Careers at Deepali</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Join a team of passionate engineers and professionals dedicated to manufacturing excellence.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Work With Us?</h2>
              <div className="w-16 h-1 bg-primary"></div>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We believe our people are our greatest asset. At Deepali Engineering, we offer a dynamic work environment that fosters continuous learning, innovation, and career growth. Whether you are an experienced CNC operator, a quality control specialist, or a fresh engineering graduate, we provide the platform to build a rewarding career.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                  <span className="text-foreground">Competitive compensation and benefits</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                  <span className="text-foreground">Continuous training and skill development</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                  <span className="text-foreground">Modern, safe, and collaborative work environment</span>
                </li>
              </ul>
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-sm">
              <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_662f018b-69e5-4d6f-9fec-85c9e456bcbe.jpg" alt="Our Team" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Current Openings</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid gap-6">
              {jobs.length > 0 ? jobs.map((job) => (
                <Card key={job.id} className="border hover:border-primary/50 transition-colors shadow-sm">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 text-pretty mt-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Button asChild>
                        <Link to={`/apply-job?role=${encodeURIComponent(job.title)}`}>
                          Apply Now <ChevronRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-16 bg-muted/50 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No current openings</h3>
                  <p className="text-muted-foreground">We are always looking for talent. Send your resume to hr@deepaliengineering.com</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Careers;
