import React, { useState, useEffect } from 'react';
import { FadeIn } from '@/components/ui/fade-in';
import { Microscope, Search, Ruler, Settings2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEO } from '@/components/seo/SEO';
import { supabase } from '@/db/supabase';

interface TestingProcedure {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  is_active: boolean;
}

const TestingProcedures = () => {
  const [procedures, setProcedures] = useState<TestingProcedure[]>([]);

  useEffect(() => {
    const fetchProcedures = async () => {
      const { data, error } = await supabase
        .from('testing_procedures')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (data && !error) {
        setProcedures(data);
      }
    };
    fetchProcedures();
  }, []);

  const steps = procedures.length > 0 ? procedures : [
    { title: 'Incoming Material', description: 'Raw material inspection and Mill Test Certificate (MTC) review before production begins.', icon_name: 'Search', id: '1', is_active: true },
    { title: 'In-Process Verification', description: 'First-off inspection and continuous dimensional checks during machining processes.', icon_name: 'Settings2', id: '2', is_active: true },
    { title: 'Non-Destructive Testing', description: 'NDT and metallurgical checks to ensure internal integrity of critical components.', icon_name: 'Microscope', id: '3', is_active: true },
    { title: 'Final Inspection', description: 'Comprehensive CMM measurement against drawing and client specifications.', icon_name: 'Ruler', id: '4', is_active: true },
  ];

  return (
    <>
      <SEO 
        title="Testing Procedures | Precision Component Quality Inspection | Deepali Engineering"
        description="Learn about Deepali Engineering's testing procedures, quality inspection methods, dimensional verification, and manufacturing quality control processes."
        url="/testing-procedures"
        keywords="Testing Procedures, Quality Inspection, Precision Components Testing, Dimensional Verification, Quality Control"
      />
    <div className="bg-white pb-20">
      <section className="bg-secondary text-white py-16">
        <div className="container">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Testing Procedures</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Rigorous inspection protocols from raw material receipt to final dispatch.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9cf251c2-857c-41a6-959a-9a2d9a1d3d28.jpg" 
                  alt="Quality Laboratory" 
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-black text-secondary mb-6">Inspection Workflow</h2>
                <div className="h-1 w-20 bg-primary mb-8"></div>
                <div className="space-y-6">
                  {steps.map((step, i) => {
                    const IconMap: Record<string, any> = {
                      'Search': Search,
                      'Settings2': Settings2,
                      'Microscope': Microscope,
                      'Ruler': Ruler
                    };
                    const Icon = IconMap[step.icon_name] || Microscope;
                    
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1 bg-primary/10 p-3 rounded-none text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-secondary">{step.title}</h3>
                          <p className="text-muted-foreground mt-1">{step.description || (step as any).desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-8 md:p-12 border border-border">
              <h3 className="text-2xl font-bold text-secondary mb-6 text-center">Testing Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-none border-border shadow-none">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-primary mb-2">Dimensional Accuracy</h4>
                    <p className="text-sm text-muted-foreground">Digital height gauges and CMM verification to ±0.02 mm repeatability.</p>
                  </CardContent>
                </Card>
                <Card className="rounded-none border-border shadow-none">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-primary mb-2">Surface & Corrosion</h4>
                    <p className="text-sm text-muted-foreground">Coating thickness and surface roughness (Ra) verification.</p>
                  </CardContent>
                </Card>
                <Card className="rounded-none border-border shadow-none">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-primary mb-2">Material Integrity</h4>
                    <p className="text-sm text-muted-foreground">Hardness testing and chemical composition validation.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
    </>
  );
};

export default TestingProcedures;
