import React, { useState, useEffect } from 'react';
import { FadeIn } from '@/components/ui/fade-in';
import { Award, FileText, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
import { supabase } from '@/db/supabase';

interface Certificate {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const Certifications = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (data) setCertificates(data);
    };
    fetchCertificates();
  }, []);
  return (
    <>
      <SEO 
        title="Engineering Certifications | ISO 9001:2015 Certified | Deepali Engineering"
        description="Explore Deepali Engineering's official certifications, including ISO 9001:2015 Quality Management System, EN 10204 Material Test Certification, and more."
        url="/certifications"
        keywords="ISO 9001:2015 Certified, Engineering Certifications, Quality Management System, Material Test Certification, Manufacturer Certifications"
      />
    <div className="bg-white pb-20">
      <section className="bg-secondary text-white py-16">
        <div className="container">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Certifications</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Recognized for compliance, safety, and rigorous quality management protocols.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <FadeIn>
            <div className="mb-12">
              <h2 className="text-3xl font-black text-secondary mb-4">Official Certifications</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.length > 0 ? certificates.map((cert) => (
                <Card key={cert.id} className="rounded-none border-border overflow-hidden flex flex-col h-full">
                  <div className="h-56 bg-muted flex items-center justify-center border-b border-border relative">
                    <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-secondary mb-2">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {cert.description}
                    </p>
                    <Button variant="outline" className="w-full rounded-none group mt-auto" asChild>
                      <Link to="/contact">
                        <Download className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> View Certificate
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )) : (
                <>
                  <Card className="rounded-none border-border overflow-hidden flex flex-col h-full">
                    <div className="h-56 bg-muted flex items-center justify-center border-b border-border relative">
                      <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1c2a4a01-727c-48d2-9bf4-d6c53c9caf1b.jpg" alt="ISO 9001:2015" className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-secondary mb-2">ISO 9001:2015</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Quality Management System certification ensuring consistent product and service quality.
                      </p>
                      <Button variant="outline" className="w-full rounded-none group mt-auto" asChild>
                        <Link to="/contact">
                          <Download className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> View Certificate
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-none border-border overflow-hidden flex flex-col h-full">
                    <div className="h-56 bg-muted flex items-center justify-center border-b border-border relative">
                      <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1ce718c7-ea26-4007-b92a-8e0a0b5b013d.jpg" alt="EN 10204 3.1 / 3.2" className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-secondary mb-2">EN 10204 3.1 / 3.2</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Material test certificates for raw material traceability and compliance.
                      </p>
                      <Button variant="outline" className="w-full rounded-none group mt-auto" asChild>
                        <Link to="/contact">
                          <Download className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" /> View Certificate
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
    </>
  );
};

export default Certifications;
