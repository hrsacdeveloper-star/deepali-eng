import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FadeIn } from '@/components/ui/fade-in';
import { SEO } from '@/components/seo/SEO';

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

interface Client {
  id: string;
  name: string;
  logo_url: string;
}

const GalleryClients: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, clientsRes] = await Promise.all([
          supabase.from('gallery').select('*').order('order_index'),
          supabase.from('clients').select('*').order('order_index')
        ]);
        
        if (galleryRes.data) setGallery(galleryRes.data);
        if (clientsRes.data) setClients(clientsRes.data);
      } catch (error) {
        console.error('Error fetching gallery/clients:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <SEO 
        title="Gallery & Clients | Deepali Engineering"
        description="Explore Deepali Engineering's gallery and discover the global partners and clients who trust our precision engineering solutions."
        url="/gallery-clients"
        keywords="Deepali Engineering Gallery, Clients, Global Partners, Manufacturing Gallery"
      />
      <div className="flex flex-col w-full overflow-x-hidden">
      {/* Page Header */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Gallery & Clients</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Visual showcase of our capabilities and the global partners who trust them.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Clients Section */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Global Partners</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              We are proud to supply precision components to industry leaders worldwide.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="aspect-[3/2] flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 bg-secondary/30 rounded-md">
                  {/* Using name as fallback if no real logo URL exists in seed */}
                  <span className="font-bold text-muted-foreground text-center">{client.name}</span>
                </div>
              ))}
              {/* Add dummy clients if none exist to show layout */}
              {clients.length === 0 && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/2] flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 bg-secondary/30 rounded-md">
                  <span className="font-bold text-muted-foreground text-center">Partner {i+1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Visual Tour</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.length > 0 ? gallery.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-muted shadow-sm">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground font-medium p-4 bg-background/90 backdrop-blur rounded-md transform translate-y-4 group-hover:translate-y-0 duration-300">
                        View Image
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-1 bg-black/95 border-none">
                  <img src={item.image_url} alt={item.title} className="w-full h-auto object-contain max-h-[85vh]" />
                </DialogContent>
              </Dialog>
            )) : (
              // Fallback gallery images
              [
                "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9d8e42f5-8212-4d92-a70b-62f57f773445.jpg",
                "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0d8d4398-c58c-4a45-8669-e722ec34d8ca.jpg",
                "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_83e7260e-ad37-47bf-b786-32440113fee1.jpg",
                "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_a2c36066-c2bf-4fad-9be2-748045c981bf.jpg",
                "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1755b145-1e1b-4c68-b292-e01cc3dc1932.jpg",
                "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_995eb554-c2af-4e90-9183-26e2b85e8af2.jpg"
              ].map((url, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <div className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer bg-muted shadow-sm">
                      <img src={url} alt={`Gallery image ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground font-medium p-4 bg-background/90 backdrop-blur rounded-md transform translate-y-4 group-hover:translate-y-0 duration-300">
                          View Image
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full p-1 bg-black/95 border-none">
                    <img src={url} alt={`Gallery image ${i+1}`} className="w-full h-auto object-contain max-h-[85vh]" />
                  </DialogContent>
                </Dialog>
              ))
            )}
          </div>
        </div>
      </motion.section>
    </div>
    </>
  );
};

export default GalleryClients;
