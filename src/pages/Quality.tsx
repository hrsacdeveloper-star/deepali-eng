import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ShieldCheck, Microscope, BadgeCheck, Globe, Factory, Cpu, Users, Settings, ChevronRight, Quote, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FadeIn } from '@/components/ui/fade-in';
import { SEO } from '@/components/seo/SEO';

interface Certificate {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

const QUALITY_PILLARS = [
  {
    icon: BadgeCheck,
    title: 'Company Commitment',
    description: 'Since inception, quality has been the foundational pillar of Deepali Engineering. Our leadership treats every order as a commitment to reliability, embedding zero-defect thinking into every process.'
  },
  {
    icon: Cpu,
    title: 'Technology Integration',
    description: 'We continuously adopt the latest CNC machining centers, CMM inspection systems, and advanced manufacturing software to maintain precision, repeatability, and traceability.'
  },
  {
    icon: Microscope,
    title: 'In-house Quality Control',
    description: 'From incoming material verification and in-process dimensional checks to final pre-dispatch inspection, every stage is governed by documented procedures and trained inspectors.'
  },
  {
    icon: Globe,
    title: 'Global Standards Compliance',
    description: 'Our products are engineered to meet international standards and client-specific specifications, enabling us to deliver best-in-class components to customers worldwide.'
  }
];

const PROCESS_STEPS = [
  'Incoming raw material inspection and mill-test review',
  'First-off inspection and in-process dimensional verification',
  'Non-destructive testing (NDT) and metallurgical checks',
  'Final inspection against drawing and specification',
  'Protective packaging and pre-dispatch audit'
];

const PRODUCT_CATALOG_HIGHLIGHTS = [
  { title: 'Jigs & Fixtures', spec: 'Repeatability ±0.02 mm, hardened wear surfaces' },
  { title: 'Elbows & Flanges', spec: 'ANSI/DIN/BS standards, pressure-rated' },
  { title: 'Machine Spares', spec: 'OEM geometry restoration, cast & machined' },
  { title: 'Industrial Tools', spec: 'High-speed steel & carbide grades' },
  { title: 'Critical Spares', spec: 'Emergency reverse-engineering available' }
];

const TESTIMONIALS = [
  {
    quote: 'Deepali Engineering consistently delivers flanges and spares that meet our exacting tolerances. Their quality documentation makes audits straightforward.',
    author: 'Procurement Manager',
    company: 'Leading Energy OEM'
  },
  {
    quote: 'The team turned around a critical machine spare in record time without compromising on inspection standards. A reliable manufacturing partner.',
    author: 'Plant Head',
    company: 'Automotive Tier-1 Supplier'
  },
  {
    quote: 'Their commitment to material traceability and dimensional accuracy has made them our preferred supplier for jigs and fixtures.',
    author: 'Quality Director',
    company: 'Industrial Equipment Manufacturer'
  }
];

const CUSTOMIZATION_STEPS = [
  {
    title: 'Requirement Review',
    description: 'Share your drawing, sample, or specification for a detailed feasibility and costing review.'
  },
  {
    title: 'Design for Manufacture',
    description: 'Our engineers suggest material, tolerance, and process optimizations to balance cost and performance.'
  },
  {
    title: 'Prototype & Approval',
    description: 'First article inspection and customer approval before volume production begins.'
  },
  {
    title: 'Volume Production',
    description: 'Scheduled production with in-process QC, packing, and on-time dispatch.'
  }
];

const Quality: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await supabase.from('certificates').select('*').order('order_index');
        if (data) setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);

  return (
    <>
      <SEO 
        title="Quality Assurance | ISO 9001:2015 Certified Manufacturer | Deepali Engineering"
        description="Discover Deepali Engineering's quality assurance practices, ISO 9001:2015 certified manufacturing processes, systematic inspection, and continuous improvement."
        url="/quality"
        keywords="Quality Assurance, ISO 9001:2015 Certified Manufacturer, Manufacturing Quality, Quality Management System, Quality Inspection"
      />
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Executive Summary / Page Header */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">Quality Assurance</h1>
              <div className="w-16 h-1 bg-primary"></div>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Quality is not a checkpoint at Deepali Engineering — it is the foundation of our operations. From raw material selection to final dispatch, every component is produced under a disciplined Quality Management System designed for zero-defect delivery to discerning clients around the world.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Zero-Defect Mindset</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Factory className="h-5 w-5 text-primary" />
                  <span>In-House Testing</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Global Standards</span>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              <img 
                src="/images/Smart Automation_ Opportunities And Improvements.jpg" 
                alt="Quality assurance laboratory" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quality Assurance Framework */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Quality Assurance Framework</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              A structured, four-pillar approach that governs how we design, produce, inspect, and deliver every precision component.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUALITY_PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <FadeIn key={pillar.title} direction="up" delay={index * 0.1}>
                  <Card className="h-full border border-border rounded-none hover:border-primary transition-colors">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{pillar.description}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-house Quality Control Process */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right" className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">In-House Quality Control</h2>
              <div className="w-16 h-1 bg-primary"></div>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Our dedicated inspection labs are equipped with advanced metrology instruments, ensuring every dimension, tolerance, and surface finish meets exact specifications before a part leaves our facility.
              </p>
              <ul className="space-y-4">
                {PROCESS_STEPS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn direction="left" className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_995eb554-c2af-4e90-9183-26e2b85e8af2.jpg" alt="Quality Inspection" className="w-full h-full object-cover" />
                </div>
                <Card className="bg-primary text-primary-foreground border-none rounded-none">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="w-10 h-10 mb-3 opacity-80" />
                    <h3 className="text-lg font-bold">Zero Defect Policy</h3>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-secondary text-secondary-foreground border-none rounded-none">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Microscope className="w-10 h-10 mb-3 text-primary" />
                    <h3 className="text-lg font-bold">Advanced Metrology</h3>
                  </CardContent>
                </Card>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src="/images/main.png" alt="Testing Equipment" className="w-full h-full object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Product Catalog Overview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Product Catalog Overview</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              Representative product lines backed by detailed technical specifications, material certificates, and application guidance.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_CATALOG_HIGHLIGHTS.map((item, index) => (
              <FadeIn key={item.title} direction="up" delay={index * 0.1}>
                <Card className="h-full border border-border rounded-none hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.spec}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
            <FadeIn direction="up" delay={0.5}>
              <Card className="h-full bg-secondary text-secondary-foreground border-none rounded-none">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <h3 className="text-lg font-bold mb-2">Download Full Catalog</h3>
                  <p className="text-sm text-white/80 mb-4">Access complete specifications, material grades, and performance data.</p>
                  <Button asChild variant="ghost" className="rounded-none border border-white/60 text-white hover:bg-white/10 self-start">
                    <Link to="/downloads">View Downloads</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Certifications Gallery */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Quality Certifications</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              Our operations comply with stringent international standards, demonstrating our commitment to consistent quality and continuous improvement.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {certificates.map((cert) => (
                <div key={cert.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] shrink-0 snap-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden border-none shadow-sm cursor-pointer hover:shadow-md transition-all group rounded-none">
                      <div className="aspect-[3/4] bg-white overflow-hidden p-4">
                        <img 
                          src={cert.image_url} 
                          alt={cert.name} 
                          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <CardContent className="p-4 text-center border-t">
                        <h3 className="font-bold text-foreground">{cert.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cert.description}</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl w-full p-1 bg-white rounded-none">
                    <img src={cert.image_url} alt={cert.name} className="w-full h-auto object-contain max-h-[80vh]" />
                  </DialogContent>
                </Dialog>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Client Testimonials</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              Feedback from partners who rely on our quality framework every day.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <FadeIn key={index} direction="up" delay={index * 0.1}>
                <Card className="h-full border border-border rounded-none">
                  <CardContent className="p-8 flex flex-col h-full">
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                      {testimonial.quote}
                    </p>
                    <div>
                      <p className="font-bold text-foreground text-sm">{testimonial.author}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Services */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right" className="aspect-[4/3] bg-muted overflow-hidden order-2 lg:order-1">
              <img 
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7311a97b-51a7-4d6a-9a14-f0d2b9cfa9e8.jpg" 
                alt="Custom engineering and manufacturing" 
                className="w-full h-full object-cover" 
              />
            </FadeIn>
            <FadeIn direction="left" className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Customization Services</h2>
              <div className="w-16 h-1 bg-primary"></div>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Standard catalog items are only the beginning. We specialize in client-specific components engineered from drawings, samples, or performance requirements.
              </p>
              <div className="space-y-4">
                {CUSTOMIZATION_STEPS.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <FadeIn direction="up" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">Contact & Support</h2>
              <div className="w-16 h-1 bg-primary"></div>
              <p className="text-white/80 text-pretty leading-relaxed">
                Our technical and commercial teams are ready to answer your quality, specification, and quotation questions. Reach out for material certificates, inspection reports, or a tailored quality plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild className="rounded-none px-8 py-6 h-auto uppercase text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/contact">
                    <Mail className="mr-2 h-4 w-4" /> Contact Us
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-none border border-white/60 text-white hover:bg-white/10 px-8 py-6 h-auto uppercase text-xs font-bold tracking-wider">
                  <Link to="/rfq">
                    <Phone className="mr-2 h-4 w-4" /> Request a Quote
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10 rounded-none">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Technical Sales</h3>
                  <p className="text-white/70 text-sm">Discuss material, tolerances, and application requirements.</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 rounded-none">
                <CardContent className="p-6">
                  <Settings className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">After-Sales Support</h3>
                  <p className="text-white/70 text-sm">Field feedback, replacement guidance, and quality reviews.</p>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
    </>
  );
};

export default Quality;
