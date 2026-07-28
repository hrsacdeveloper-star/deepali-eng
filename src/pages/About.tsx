import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Award, Globe, Users, Target, ShieldCheck, Handshake, Settings } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface AboutSection {
  id: string;
  title: string;
  content: string;
  image_url: string;
  secondary_image_url?: string;
  is_active: boolean;
}

interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  is_active: boolean;
}

interface LeadershipTeam {
  id: string;
  name: string;
  role: string;
  order_index: number;
}

interface OperationsTeam {
  id: string;
  name: string;
  role: string;
  order_index: number;
}

const About: React.FC = () => {
  const [leadership, setLeadership] = useState<LeadershipTeam[]>([]);
  const [operations, setOperations] = useState<OperationsTeam[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadershipRes, opsRes, partnersRes, aboutRes, valuesRes] = await Promise.all([
          supabase.from('leadership_team').select('*').order('order_index'),
          supabase.from('operations_team').select('*').order('order_index'),
          supabase.from('global_partners').select('*').order('order_index'),
          supabase.from('about_us_sections').select('*').eq('is_active', true).order('order_index'),
          supabase.from('core_values').select('*').eq('is_active', true).order('order_index')
        ]);
        
        if (leadershipRes.data) setLeadership(leadershipRes.data);
        if (opsRes.data) setOperations(opsRes.data);
        if (partnersRes.data) setPartners(partnersRes.data);
        if (aboutRes.data) setAboutSections(aboutRes.data);
        if (valuesRes.data) setCoreValues(valuesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <SEO 
        title="About Deepali Engineering | Precision Engineering Company in Pune"
        description="Learn about Deepali Engineering, a Pune-based precision engineering company established in 2005, specializing in precision components, jigs & fixtures, machine spare parts, and industrial manufacturing solutions."
        url="/about"
        keywords="About Deepali Engineering, Precision Engineering Company Pune, Precision Components Manufacturer, Engineering Company in Pune, ISO 9001:2015 Certified Manufacturer"
      />
      <div className="flex flex-col min-w-0">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0d8d4398-c58c-4a45-8669-e722ec34d8ca.jpg" 
            className="w-full h-full object-cover opacity-20" 
            alt="Manufacturing Facility" 
          />
        </div>
        <div className="container relative z-10">
          <FadeIn direction="up" className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
              Engineering <br />
              <span className="text-primary">Excellence</span> Since 2005
            </h1>
            <p className="text-lg md:text-xl text-white/80 text-pretty max-w-2xl leading-relaxed">
              A legacy of precision, quality, and commitment to delivering world-class industrial components to global markets. We build the parts that build the world.
            </p>
          </FadeIn>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container">
          <FadeIn direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-border">
              {[
                { label: 'Years Experience', value: '20+' },
                { label: 'Global Clients', value: '500+' },
                { label: 'Products', value: '1000+' },
                { label: 'Certifications', value: 'ISO 9001' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center px-4">
                  <p className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
      {/* Company Overview */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">About Deepali Engineering</h1>
            <p className="text-muted-foreground text-lg">A legacy of precision, quality, and commitment to engineering excellence since our establishment.</p>
          </FadeIn>

          {aboutSections.length > 0 ? aboutSections.map((section, idx) => (
            <div key={section.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${idx > 0 ? 'mt-24' : ''}`}>
              <FadeIn direction={idx % 2 === 0 ? "right" : "left"} className={`space-y-6 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-4">{section.title}</h2>
                  <div className="w-16 h-1 bg-primary"></div>
                </div>
                <div className="space-y-4 text-muted-foreground text-base leading-relaxed text-justify whitespace-pre-line">
                  {section.content}
                </div>
              </FadeIn>
              <FadeIn direction={idx % 2 === 0 ? "left" : "right"} className={`${idx % 2 !== 0 ? 'lg:order-1' : ''} grid grid-cols-2 gap-4 h-full`}>
                <div className="aspect-[3/4] rounded-none overflow-hidden bg-muted w-full">
                  <img src={section.image_url} alt={section.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="aspect-[3/4] rounded-none overflow-hidden bg-muted w-full mt-8 md:mt-12">
                  <img src={section.secondary_image_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0ac6928d-52fe-4918-9121-2deab1d9df49.jpg'} alt={`${section.title} Details`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </FadeIn>
            </div>
          )) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <FadeIn direction="right" className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-widest mb-4">Our Story</h2>
                  <div className="w-16 h-1 bg-secondary"></div>
                </div>
                <div className="space-y-6 text-muted-foreground text-base leading-relaxed text-pretty">
                  <p>
                    Deepali Engineering was established with a clear vision: to manufacture and supply world-class engineering components that meet the stringent demands of global industries. Over the years, we have grown from a modest workshop into a sprawling manufacturing facility equipped with state-of-the-art CNC machinery and testing equipment.
                  </p>
                  <p>
                    Our specialization lies in the production of precision-engineered couplings, flanges, pipe fittings, and custom forgings. Every product that leaves our facility is a testament to our unwavering commitment to quality and dimensional accuracy.
                  </p>
                  <p>
                    Today, we are proud to be a trusted partner to some of the world's most demanding sectors, including Oil & Gas, Power Generation, Chemical Processing, and Maritime industries across over 50 countries.
                  </p>
                </div>
                <ul className="space-y-4 pt-4">
                  {[
                    'State-of-the-art manufacturing facility',
                    'Stringent quality control processes',
                    'Global export capabilities',
                    'Customized engineering solutions'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" />
                      <span className="font-semibold text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn direction="left" className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-none overflow-hidden bg-muted">
                  <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9d8e42f5-8212-4d92-a70b-62f57f773445.jpg" alt="Our Facility" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="aspect-[3/4] rounded-none overflow-hidden bg-muted mt-12">
                  <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_662f018b-69e5-4d6f-9fec-85c9e456bcbe.jpg" alt="Our Engineering Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </section>
      {/* Vision & Mission */}
      <section className="py-20 md:py-32 bg-[#d6c4af26] bg-none">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <FadeIn direction="up">
              <Card className="rounded-none border-border shadow-sm bg-white hover:border-primary transition-colors group h-full">
                <CardContent className="p-10 md:p-12 space-y-6">
                  <Target className="h-12 w-12 text-primary mb-6" />
                  <h3 className="text-2xl font-black text-secondary uppercase tracking-widest">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    To be globally recognized as the most reliable and innovative manufacturer of engineering components, setting the industry benchmark for precision, durability, and customer satisfaction.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <Card className="rounded-none border-border shadow-sm bg-white hover:border-primary transition-colors group h-full">
                <CardContent className="p-10 md:p-12 space-y-6">
                  <ShieldCheck className="h-12 w-12 text-primary mb-6" />
                  <h3 className="text-2xl font-black text-secondary uppercase tracking-widest">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    We strive to deliver zero-defect products through continuous technological advancement, rigorous quality control, and an empowered workforce, ensuring we exceed our clients' expectations on every order.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
      {/* Core Values */}
      <section className="py-12 md:py-16 bg-secondary text-white">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-2xl mx-auto space-y-4 mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-white">Core Values</h2>
            <div className="w-12 h-1 bg-primary mx-auto"></div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.length > 0 ? coreValues.map((value, i) => {
              const IconMap: Record<string, any> = {
                'Award': Award,
                'Users': Users,
                'Globe': Globe,
                'Target': Target,
                'ShieldCheck': ShieldCheck
              };
              const Icon = IconMap[value.icon_name] || Award;
              
              return (
                <FadeIn key={value.id} delay={i * 0.1} direction="up">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-widest">{value.title}</h3>
                    <p className="text-white/70 text-sm text-pretty leading-relaxed max-w-sm">{value.description}</p>
                  </div>
                </FadeIn>
              );
            }) : [
              { 
                icon: Award,
                title: 'Quality First', 
                desc: 'Uncompromising dedication to precision and durability in every component we manufacture.' 
              },
              { 
                icon: Users,
                title: 'Customer Centric', 
                desc: 'Building long-term partnerships through transparency, timely delivery, and tailored solutions.' 
              },
              { 
                icon: Globe,
                title: 'Global Standards', 
                desc: 'Investing in cutting-edge machinery and training to stay ahead of international industry demands.' 
              }
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <FadeIn key={i} delay={i * 0.1} direction="up">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-widest">{value.title}</h3>
                    <p className="text-white/70 text-sm text-pretty leading-relaxed max-w-sm">{value.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
      {/* Global Partners */}
      {partners.length > 0 && (
        <section className="py-16 md:py-24 bg-white border-b border-border">
          <div className="container">
            <FadeIn direction="up" className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-primary uppercase">GLOBAL PARTNERSHIPS</h2>
              <div className="w-16 h-1 bg-secondary mx-auto"></div>
              <p className="text-muted-foreground mt-4">We operate on an international scale, collaborating and partnering with some of the world's most renowned engineering and manufacturing giants.</p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, i) => (
                <FadeIn key={partner.id} delay={i * 0.1} direction="up" className="h-full">
                  <Card className="rounded-none border border-border shadow-none h-full hover:border-primary transition-colors flex items-center p-6">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-muted/50 rounded-full p-2">
                        {partner.image_url ? (
                          <img src={partner.image_url} alt={`${partner.name} logo`} className="w-full h-full object-contain" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06 7.06l-4.35 4.35a1 1 0 0 1-1.41 0L11 17"/><path d="m4 10 2 2a1 1 0 1 0 3-3"/><path d="m7 7 2.5 2.5a1 1 0 1 0 3-3L8.62 2.62a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06 7.06L6 11.41a1 1 0 0 1-1.41 0L4 10"/></svg>
                        )}
                      </div>
                      <h4 className="font-bold text-secondary text-sm leading-tight">{partner.name}</h4>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Organization Structure */}
      {(leadership.length > 0 || operations.length > 0) && (
        <section className="py-20 md:py-32 bg-white">
          <div className="container">
            <FadeIn direction="up" className="mb-16 md:mb-24">
              <div className="flex items-center gap-4 mb-4">
                <Settings className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-secondary">Organization Structure</h2>
              </div>
              <div className="h-[2px] bg-primary w-24 ml-12 md:ml-14"></div>
            </FadeIn>
            
            <FadeIn direction="up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full mx-auto bg-white">
                
                {/* Leadership Team */}
                <Card className="rounded-none border-border shadow-none">
                  <CardContent className="p-8 md:p-10">
                    <h3 className="text-2xl font-bold text-secondary mb-6 pb-4 border-b border-border/50">Leadership Team</h3>
                    <div className="flex flex-col">
                      {leadership.map((member, idx) => (
                        <div key={member.id} className={`flex justify-between items-center py-4 ${idx !== leadership.length - 1 ? 'border-b border-border/30' : ''}`}>
                          <span className="font-bold text-secondary text-lg">{member.name}</span>
                          <span className="text-primary text-right text-sm">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Expert Operations Team */}
                <Card className="rounded-none border-border shadow-none">
                  <CardContent className="p-8 md:p-10">
                    <h3 className="text-2xl font-bold text-secondary mb-6 pb-4 border-b border-border/50">Expert Operations Team</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                      {operations.map((member) => (
                        <div key={member.id} className="flex flex-col">
                          <span className="text-secondary text-lg mb-1">{member.name}</span>
                          <span className="text-muted-foreground text-sm">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
    </>
  );
};

export default About;