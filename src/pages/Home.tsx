import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
import { ArrowRight, ChevronRight, CheckCircle2, MapPin, Phone, Mail, FileText, Users, Settings, Target, Eye, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { FadeIn } from '@/components/ui/fade-in';

interface HomeSection {
  id: string;
  section_name: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
}

interface Industry {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
}

const Home: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [visionMission, setVisionMission] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Category | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [slidesRes, categoriesRes, industriesRes] = await Promise.all([
          supabase.from('hero_slides').select('*').eq('is_active', true).order('order_index'),
          supabase.from('product_categories').select('*').order('order_index'),
          supabase.from('industries').select('*').order('order_index')
        ]);
        
        if (slidesRes.data) setSlides(slidesRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (industriesRes.data) setIndustries(industriesRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentSlide = slides[0] || {
    title: 'OIL INDUSTRY',
    subtitle: 'Industry is ready to help you in making unique-looking and best website in a moment.',
    image_url: 'https://miaoda-conversation-file.s3cdn.medo.dev/user-awm3lxjnyu4g/app-d2lgq5dxewap/20260717/image.jpeg',
    button_text: 'READ MORE',
    button_link: '/about'
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center bg-secondary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_6c707773-8d1e-4d20-ad17-a6440a7feaa2.jpg" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        <div className="container relative z-10">
          <FadeIn direction="up" delay={0.2} className="max-w-2xl space-y-4 pt-20">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase">{"Trusted Manufacturing"}</h1>
            <p className="text-lg text-white/80 max-w-xl">
              Building High-Performance Industrial Components with Precision, Innovation, and Reliability.
            </p>
            <div className="pt-6">
              <Button variant="ghost" className="border border-white/60 text-white hover:bg-white/10 hover:text-white rounded-none px-8 py-6 text-xs uppercase tracking-widest font-bold" asChild>
                <Link to="/about">
                  READ MORE <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
      {/* Product Range Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container max-w-6xl">
          <FadeIn direction="up">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-primary uppercase tracking-widest">PRODUCT RANGE</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {categories.length > 0 ? (
               (showAllProducts ? categories : categories.slice(0, 6)).map((category, i) => (
                 <FadeIn key={category.id} delay={i * 0.1} direction="up" className="h-full">
                   <div onClick={() => setSelectedProduct(category)} className="cursor-pointer h-full">
                     <Card className="rounded-none border border-border shadow-none hover:border-primary transition-colors group flex items-center bg-white h-32">
                       <div className="w-2/5 h-full bg-muted overflow-hidden">
                           <img src={category.image_url} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       </div>
                       <CardContent className="p-6 w-3/5 flex flex-col justify-center h-full">
                         <h3 className="text-lg font-bold text-secondary mb-2 leading-tight">{category.name}</h3>
                         <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary flex items-center">
                           View <ChevronRight className="ml-1 h-3 w-3" />
                         </div>
                       </CardContent>
                     </Card>
                   </div>
                 </FadeIn>
               ))
             ) : null}
          </div>
          {categories.length > 6 && !showAllProducts && (
            <div className="flex justify-center mt-12">
              <Button size="lg" onClick={() => setShowAllProducts(true)} className="rounded-none px-8 py-6 h-auto uppercase tracking-wider font-bold">
                View More Products
              </Button>
            </div>
          )}
        </div>
      </section>
      {/* About & Features Block */}
      <section className="w-full relative pb-12 md:pb-16 bg-white pt-12 md:pt-0">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2">
             <div className="bg-primary text-white p-12 md:p-24 xl:px-32 flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase leading-tight">
                    DEEPALI ENGINEERING
                </h2>
                <p className="text-white/90 mb-4 text-sm leading-relaxed max-w-md text-justify">
                    Since 2005, we offer our customers top products at a high quality - very good price ratio. Constant and reliable supplier of pipe, sheet, rolled profiles, elbows, fittings, flanges, studs, assemblies and fittings.
                </p>
                <p className="text-white/90 text-sm leading-relaxed max-w-md">
                    Products used in the petrochemical, energetic, petroleum, chemical and naval industries.
                </p>
             </div>
             <div className="aspect-[16/10] md:aspect-auto md:h-auto min-h-[300px] md:min-h-[500px] relative">
                <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0d8d4398-c58c-4a45-8669-e722ec34d8ca.jpg" className="w-full h-full object-cover" alt="Company Building" />
             </div>
          </div>
        </FadeIn>
        
        {/* Overlapping feature cards */}
        <div className="container max-w-5xl md:-mt-16 relative z-10 hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.length > 0 ? stats.map((stat, i) => {
                  const IconMap: Record<string, any> = {
                    'Experience': Calendar,
                    'Team': Users,
                    'Equipment': Settings
                  };
                  const StatIcon = IconMap[stat.icon_name] || CheckCircle2;
                  return (
                    <FadeIn key={stat.id} delay={0.1 + (i * 0.1)}>
                      <Card className="rounded-none border border-border shadow-none bg-white h-full">
                         <CardContent className="p-6 flex items-center gap-4 h-24">
                            <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-primary text-primary">
                               <StatIcon className="h-6 w-6" />
                            </div>
                            <div>
                               <h4 className="font-bold text-secondary text-sm">{stat.title}</h4>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{stat.value}{stat.suffix}</p>
                            </div>
                         </CardContent>
                      </Card>
                    </FadeIn>
                  );
                }) : (
                  <>
                    <FadeIn delay={0.1}>
                      <Card className="rounded-none border border-border shadow-none bg-white h-full">
                         <CardContent className="p-6 flex items-center gap-4 h-24">
                            <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-primary text-primary">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            </div>
                            <div>
                               <h4 className="font-bold text-secondary text-sm">Experience</h4>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">25 years of activity</p>
                            </div>
                         </CardContent>
                      </Card>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                      <Card className="rounded-none border border-border shadow-none bg-white h-full">
                         <CardContent className="p-6 flex items-center gap-4 h-24">
                            <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-primary text-primary">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <div>
                               <h4 className="font-bold text-secondary text-sm">Team</h4>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">professionals in the industry</p>
                            </div>
                         </CardContent>
                      </Card>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                      <Card className="rounded-none border border-border shadow-none bg-white h-full">
                         <CardContent className="p-6 flex items-center gap-4 h-24">
                            <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-primary text-primary">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 11 4-4"/><path d="m11 18-4 4"/><path d="M3 3 21 21"/><path d="M10.6 10.6a2 2 0 0 1 2.8 0l2 2a2 2 0 0 1 0 2.8l-1.9 1.9a2 2 0 0 1-2.8 0l-2-2a2 2 0 0 1 0-2.8l1.9-1.9z"/></svg>
                            </div>
                            <div>
                               <h4 className="font-bold text-secondary text-sm">State of the art</h4>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">equipment</p>
                            </div>
                         </CardContent>
                      </Card>
                    </FadeIn>
                  </>
                )}
            </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
      <section className="py-16 md:py-24 bg-muted/30 border-b border-border">
        <div className="container max-w-6xl">
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-primary uppercase">Client Testimonials</h2>
              <div className="w-16 h-1 bg-secondary mx-auto"></div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <FadeIn key={testimonial.id} delay={i * 0.1} direction="up">
                <Card className="rounded-none border border-border shadow-sm bg-white h-full relative">
                  <CardContent className="p-8">
                    <div className="absolute top-6 right-6 text-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.99c1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty relative z-10 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="mt-auto relative z-10 border-t border-border pt-4">
                      <h4 className="font-bold text-secondary text-sm">{testimonial.client_name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{testimonial.client_company}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Top Partnerships */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container max-w-6xl">
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-primary uppercase">Top Partnerships</h2>
              <div className="w-16 h-1 bg-secondary mx-auto"></div>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                We are proud to collaborate with industry-leading international giants, supplying top-tier engineering components for their global operations.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                name: "JCB India Ltd",
                location: "Pune, India",
                description: "Deepali Engineering is a trusted supplier of precision heavy-machinery components for JCB's extensive operations.",
                logo: "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_ce6c4de7-9af5-4903-985e-2858e62e95ce.jpg"
              },
              {
                name: "Cummins India Ltd",
                location: "Baner Pune & USA",
                description: "Collaborating on advanced power generation components, ensuring absolute reliability for Cummins engines globally.",
                logo: "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_a091f07f-2b8a-4b89-9a70-5b500f717ae1.jpg"
              },
              {
                name: "Bosch Ltd",
                location: "Pune & USA",
                description: "Providing precision-engineered solutions that meet Bosch's rigorous international quality standards.",
                logo: "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7974424e-f820-4cc6-a2f0-1c546a153ee3.jpg"
              }
            ].map((partner, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="up" className="h-full">
                <div className="flex flex-col bg-muted/20 border border-border group hover:border-primary transition-colors h-full">
                  <div className="h-48 w-full border-b border-border bg-white flex items-center justify-center p-8 overflow-hidden">
                    <img src={partner.logo} alt={`${partner.name} logo`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 text-center flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-secondary uppercase tracking-widest mb-1">{partner.name}</h3>
                    <p className="text-xs font-bold text-primary mb-4 uppercase">{partner.location}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-8 md:py-10 bg-muted/20">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <FadeIn direction="right">
               <div>
                  <h2 className="font-black text-primary uppercase tracking-widest mb-6 text-[24px]">{"CERTIFICATIONS & AUTHORIZATIONS"}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md text-pretty mb-8">
                    Because we are a transparent company, which puts price on quality, we show you a series of certificates obtained.
                  </p>
                  
                  {faqs.length > 0 && (
                    <div className="mt-12">
                      <h2 className="font-black text-secondary uppercase tracking-widest mb-6 text-xl">{"FREQUENTLY ASKED QUESTIONS"}</h2>
                      <div className="space-y-4">
                        {faqs.slice(0, 3).map((faq, i) => (
                          <div key={faq.id} className="bg-white p-4 border border-border">
                            <h4 className="font-bold text-sm text-secondary mb-2">{faq.question}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
             </FadeIn>
             <div className="grid grid-cols-3 gap-4 lg:gap-6">
                {certificates.length > 0 ? certificates.map((cert) => (
                   <FadeIn key={cert.id} delay={0.1} direction="up" className="h-full">
                     <div className="bg-white border border-border p-2 aspect-[1/1.4] flex flex-col items-center justify-center shadow-sm h-full">
                        <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                     </div>
                   </FadeIn>
                )) : [
                  "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cdcab3dd-4062-4be2-9bae-78ced00b0c7f.jpg",
                  "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4ce6af48-1e5e-48b9-acd5-181a5f81c4a4.jpg",
                  "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_28c927d4-4949-4273-b8e2-5342477e8de5.jpg"
                ].map((certUrl, index) => (
                   <FadeIn key={index} delay={index * 0.1} direction="up" className="h-full">
                     <div className="bg-white border border-border p-2 aspect-[1/1.4] flex flex-col items-center justify-center shadow-sm h-full">
                        <img src={certUrl} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                     </div>
                   </FadeIn>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      {visionMission.length > 0 && (
        <section className="py-16 md:py-24 bg-[#faf8f5]">
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {visionMission.map((item, idx) => {
                const IconMap: Record<string, any> = { 'Eye': Target, 'Target': ShieldCheck }; // Using Target for vision, Shield for mission as per screenshot
                const Icon = idx === 0 ? Target : ShieldCheck; // Hardcoded based on order for exact match with screenshot
                
                return (
                  <FadeIn key={item.id} delay={idx * 0.1} direction={idx % 2 === 0 ? "right" : "left"}>
                    <Card className={`rounded-none shadow-none h-full bg-white transition-colors duration-300 ${idx === 1 ? 'border border-primary' : 'border border-border'}`}>
                      <CardContent className="p-8 md:p-12 flex flex-col text-left">
                        <div className="mb-6 text-primary">
                          <Icon className="h-10 w-10 stroke-[2.5px]" />
                        </div>
                        <h3 className="text-2xl font-black text-secondary uppercase tracking-widest mb-6">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-left text-pretty">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Personalized Offer CTA */}
      <section className="w-full bg-secondary text-white">
         <div className="grid grid-cols-1 lg:grid-cols-2">
            <FadeIn direction="none" className="aspect-[16/10] lg:aspect-auto lg:h-[400px] relative block">
               <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_faf079c6-5369-4762-a5cd-8526d63dd5c6.jpg" className="w-full h-full object-cover opacity-80" alt="Flanges" />
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary"></div>
            </FadeIn>
            <FadeIn direction="left" className="p-12 md:p-24 flex flex-col justify-center bg-secondary">
               <h2 className="font-black mb-8 uppercase text-white text-[25px] md:text-[25px]">{"DO YOU WANTA PERSONALIZED OFFERFOR YOUR BUSINESS?"}</h2>
               <div>
                 <Button className="rounded-none bg-primary text-white hover:bg-primary/90 px-12 py-6 text-xs font-bold uppercase tracking-widest" asChild>
                   <Link to="/contact">CONTACT US</Link>
                 </Button>
               </div>
            </FadeIn>
         </div>
      </section>
      {/* Company Info Box */}
      <section className="w-full bg-primary text-white py-12 border-t border-white/20">
         <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FadeIn delay={0.1} direction="up" className="h-full">
                 <div className="bg-white text-secondary p-6 flex items-start gap-4 rounded-sm shadow-sm h-full">
                    <div className="shrink-0 pt-1">
                       <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Company Address</h4>
                      <p className="text-xs text-muted-foreground leading-tight">Capital City, S.No. A7/2, Plot No. C-10 MIDC Chakan, Phase IV, Pune 410501, MH, India</p>
                    </div>
                 </div>
               </FadeIn>
               <FadeIn delay={0.2} direction="up" className="h-full">
                 <div className="bg-white text-secondary p-6 flex items-start gap-4 rounded-sm shadow-sm h-full">
                    <div className="shrink-0 pt-1">
                       <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">E-mail</h4>
                      <p className="text-xs text-muted-foreground leading-tight">deepaliengg@yahoo.com</p>
                    </div>
                 </div>
               </FadeIn>
               <FadeIn delay={0.3} direction="up" className="h-full">
                 <div className="bg-white text-secondary p-6 flex items-start gap-4 rounded-sm shadow-sm h-full">
                    <div className="shrink-0 pt-1">
                       <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Phone Numbers</h4>
                      <p className="text-xs text-muted-foreground leading-tight">Mobile: +91 9822767451</p>
                    </div>
                 </div>
               </FadeIn>
               <FadeIn delay={0.4} direction="up" className="h-full">
                 <div className="bg-white text-secondary p-6 flex items-start gap-4 rounded-sm shadow-sm h-full">
                    <div className="shrink-0 pt-1">
                       <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Office Hours</h4>
                      <p className="text-xs text-muted-foreground leading-tight">Mon to Sat - 09:00 - 18:00<br/>Sunday - Close</p>
                    </div>
                 </div>
               </FadeIn>
            </div>
         </div>
      </section>
      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl p-0 overflow-hidden rounded-none border-none gap-0">
          <DialogDescription className="sr-only">Product Details</DialogDescription>
          {selectedProduct && (
            <div className="flex flex-col md:flex-row w-full h-full">
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                <DialogHeader className="mb-6 space-y-0">
                  <DialogTitle className="text-2xl md:text-3xl font-black text-primary uppercase leading-tight">{selectedProduct.name}</DialogTitle>
                </DialogHeader>
                <div className="mb-8 overflow-y-auto max-h-[40vh] md:max-h-[50vh]">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedProduct.description || "This high-quality product is manufactured using state-of-the-art equipment to ensure durability, reliability, and excellent performance in industrial applications."}
                  </p>
                </div>
                <div className="mt-auto">
                  <Button className="rounded-none bg-secondary text-white hover:bg-secondary/90 uppercase tracking-widest text-xs font-bold w-full" asChild>
                    <Link to={`/products/${selectedProduct.slug}`}>
                      VIEW FULL DETAILS
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add missing icon
function Calendar(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
}

export default Home;