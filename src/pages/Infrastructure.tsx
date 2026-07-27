import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';

interface Machine {
  id: string;
  name: string;
  description: string;
  image_url: string;
  specifications: any;
}

const Infrastructure: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const { data } = await supabase.from('machines').select('*').order('order_index');
        if (data) setMachines(data);
      } catch (error) {
        console.error('Error fetching machines:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMachines();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Page Header */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Infrastructure & Facilities</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              State-of-the-art manufacturing plant equipped with advanced CNC technology.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Facility Overview */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Manufacturing Excellence</h2>
              <div className="w-16 h-1 bg-primary"></div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-pretty">
                <p>
                  Our sprawling manufacturing facility spans over 50,000 square feet, thoughtfully designed to optimize workflow from raw material intake to final dispatch. The entire plant operates under strict 5S and lean manufacturing principles.
                </p>
                <p>
                  We continuously invest in upgrading our technology, ensuring our production capabilities remain at the forefront of the engineering sector. Our temperature-controlled environment and dedicated inspection labs guarantee the highest precision in every batch.
                </p>
              </div>
            </div>
            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted shadow-lg">
              <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_83e7260e-ad37-47bf-b786-32440113fee1.jpg" alt="Modern Warehouse Facility" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Machinery Gallery */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Machinery</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              A glimpse into the advanced equipment that powers our precision engineering.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {machines.map((machine) => (
                <Card key={machine.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img src={machine.image_url} alt={machine.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{machine.name}</h3>
                    <p className="text-muted-foreground text-sm text-pretty mb-4">{machine.description}</p>
                    
                    {machine.specifications && Object.keys(machine.specifications).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="text-sm font-semibold mb-2">Key Specs:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(machine.specifications).slice(0, 3).map(([k, v], i) => (
                            <li key={i} className="flex justify-between">
                              <span className="font-medium">{k}:</span>
                              <span>{v as string}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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

export default Infrastructure;
