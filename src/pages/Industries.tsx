import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/ui/fade-in';
import { SEO } from '@/components/seo/SEO';

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

const Industries: React.FC = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const { data } = await supabase.from('industries').select('*').order('order_index');
        if (data) setIndustries(data);
      } catch (error) {
        console.error('Error fetching industries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIndustries();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Industries We Serve | Precision Engineering Solutions | Deepali Engineering"
        description="Discover the industries served by Deepali Engineering, providing precision engineering components, jigs & fixtures, machine spare parts, and custom manufacturing solutions."
        url="/industries"
        keywords="Industries Served, Precision Engineering Solutions, Construction Equipment Industry, Heavy Engineering, Industrial Manufacturing"
      />
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Page Header */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Industries We Serve</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Delivering specialized engineering solutions across critical global sectors.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-16 md:space-y-32">
            {industries.map((industry, index) => (
              <FadeIn direction={index % 2 === 0 ? "right" : "left"}>
                <div key={industry.id} id={industry.slug} className={`flex flex-col gap-8 md:gap-16 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                <div className="w-full md:w-1/2 aspect-[4/3] rounded-lg overflow-hidden bg-muted shrink-0 shadow-md">
                  <img 
                    src={industry.image_url} 
                    alt={industry.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">{industry.name}</h2>
                  <div className="w-16 h-1 bg-primary"></div>
                  <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
                    {industry.description}
                  </p>
                  <p className="text-muted-foreground text-pretty">
                    Our precision components are engineered to withstand the extreme conditions and stringent requirements unique to the {industry.name} sector. We supply high-grade materials and meticulously machined parts that ensure uninterrupted operations and long-term reliability.
                  </p>
                  <div className="pt-4">
                    <Button variant="outline" asChild>
                      <Link to={`/products?category=all`}>View Related Products</Link>
                    </Button>
                  </div>
                </div>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Industries;
