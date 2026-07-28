import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Settings, Wrench, Cog, Factory, Shield, Leaf, Ruler, Hammer, Award, Users, Zap } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { SEO } from '@/components/seo/SEO';

interface Product {
  id: string;
  name: string;
  slug: string;
  brief_description: string;
  image_url: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Materials & Piping',
    slug: 'materials-piping',
    brief_description: 'Constant and reliable supplier of pipe, sheet, rolled profiles, elbows, fittings, flanges, studs, assemblies and fittings used in the petrochemical, energetic, petroleum, chemical and naval industries.',
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0ac6928d-52fe-4918-9121-2deab1d9df49.jpg',
    category_id: '1'
  },
  {
    id: '2',
    name: 'Power & Energy Systems',
    slug: 'power-energy',
    brief_description: 'High-quality energy transfer solutions and pipeline systems engineered to withstand extreme conditions in power generation plants and facilities.',
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_d93f9b5a-d954-4e54-8e2f-6c77c1292373.jpg',
    category_id: '2'
  },
  {
    id: '3',
    name: 'Petroleum Refinery Components',
    slug: 'petroleum-refinery',
    brief_description: 'Precision engineered components providing strong connections and safe operations for various industrial piping networks and oil refinery systems.',
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_995eb554-c2af-4e90-9183-26e2b85e8af2.jpg',
    category_id: '3'
  },
  {
    id: '4',
    name: 'Automotive Manufacturing Parts',
    slug: 'automotive-manufacturing',
    brief_description: 'Durable and highly precise automotive manufacturing parts ensuring optimal performance and seamless integration in modern assembly lines.',
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7311a97b-51a7-4d6a-9a14-f0d2b9cfa9e8.jpg',
    category_id: '4'
  }
];

const PRODUCT_CATEGORIES = [
  {
    icon: Settings,
    title: 'Jigs & Fixtures',
    description: 'Precision-engineered workholding and assembly aids that reduce setup time, improve repeatability, and ensure consistent output across batch production.'
  },
  {
    icon: Factory,
    title: 'Elbows and Flanges',
    description: 'High-integrity piping connections manufactured to ANSI, DIN, and client-specific standards for petrochemical, oil & gas, and process industries.'
  },
  {
    icon: Cog,
    title: 'Machine Spares',
    description: 'Cast and precision-machined replacement components that restore original equipment performance and extend the service life of industrial machinery.'
  },
  {
    icon: Wrench,
    title: 'Industrial Machine Tools',
    description: 'Robust cutting, forming, and finishing tools designed for demanding production environments and high material removal rates.'
  },
  {
    icon: Hammer,
    title: 'Critical Spare Parts',
    description: 'Emergency and planned-replacement parts for industrial machinery, engineered to exact OEM geometry and metallurgical specifications.'
  }
];

const FEATURES = [
  {
    icon: Zap,
    title: 'High Efficiency & Low Power Consumption',
    description: 'Components are designed to minimize frictional losses and optimize energy transfer, helping clients reduce operating costs.'
  },
  {
    icon: Ruler,
    title: 'Accurate Dimensional Tolerances',
    description: 'Advanced CNC machining and inspection protocols ensure every part meets tight geometric tolerances for flawless assembly.'
  },
  {
    icon: Shield,
    title: 'Durability & Robust Construction',
    description: 'Selected grades of steel, cast iron, and exotic alloys are combined with heat treatment to withstand shock, fatigue, and corrosion.'
  },
  {
    icon: Award,
    title: 'Extended Service Life',
    description: 'Surface finishing, protective coatings, and material traceability extend maintenance intervals and total cost of ownership.'
  },
  {
    icon: Users,
    title: 'Customization to Client Specifications',
    description: 'From prototype to volume production, we adapt geometry, material, coating, and packaging to your exact drawings and standards.'
  }
];

const VENDOR_PARTNERS = [
  'Certified steel mills and foundries for traceable raw material',
  'Specialized forging partners for complex geometries',
  'Approved heat-treatment vendors for metallurgical consistency',
  'Tier-1 coating and surface-treatment suppliers',
  'Logistics partners with industrial freight expertise'
];

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*').eq('is_active', true).order('order_index'),
          supabase.from('product_categories').select('*').order('order_index')
        ]);
        
        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
        
        if (categoriesRes.data) setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const activeCategoryId = categoryFilter 
    ? categories.find(c => c.slug === categoryFilter)?.id 
    : null;

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategoryId ? product.category_id === activeCategoryId : true;
    return matchesCategory;
  });

  // Ensure MOCK_PRODUCTS is updated with Home page Product Range items if we're using mock data
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);

  const getBlockStyle = (index: number) => {
    const styles = [
      { bg: 'bg-white', text: 'text-secondary', desc: 'text-muted-foreground', imgOrder: 'order-1 md:order-1', textOrder: 'order-2 md:order-2', btnVariant: 'outline' as const, btnClass: 'border-primary text-primary hover:bg-primary hover:text-white' }, 
      { bg: 'bg-secondary', text: 'text-white', desc: 'text-white/70', imgOrder: 'order-1 md:order-2', textOrder: 'order-2 md:order-1', btnVariant: 'ghost' as const, btnClass: 'border border-white/60 text-white hover:bg-white/10 hover:text-white' }, 
      { bg: 'bg-primary', text: 'text-white', desc: 'text-white/80', imgOrder: 'order-1 md:order-2', textOrder: 'order-2 md:order-1', btnVariant: 'ghost' as const, btnClass: 'border border-white/60 text-white hover:bg-white/10 hover:text-white' }, 
      { bg: 'bg-white', text: 'text-secondary', desc: 'text-muted-foreground', imgOrder: 'order-1 md:order-2', textOrder: 'order-2 md:order-1', btnVariant: 'outline' as const, btnClass: 'border-secondary text-secondary hover:bg-secondary hover:text-white' }, 
    ];
    return styles[index % styles.length];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Precision Engineering Products | Jigs & Fixtures & Machine Spare Parts | Deepali Engineering"
        description="Discover Deepali Engineering's precision engineering products, including jigs & fixtures, precision components, industrial flanges, wheel spacers, and machine spare parts."
        url="/products"
        keywords="Precision Engineering Products, Jigs & Fixtures Manufacturer, Machine Spare Parts, Precision Components, Industrial Flanges, Wheel Spacers"
      />
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Page Header */}
      <section className="bg-muted py-16 md:py-24 relative overflow-hidden">
        <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <FadeIn direction="up" className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">Our Products</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Precision-engineered industrial components built for performance, reliability, and long service life across global manufacturing sectors.
            </p>
          </FadeIn>
          <FadeIn direction="left" className="w-full md:w-1/3 aspect-video md:aspect-auto md:h-[200px] relative shrink-0">
             <img
               src="https://geowtajrlzxeyxdtjemh.supabase.co/storage/v1/object/public/images/home.jpg"
               className="w-full h-full object-cover rounded-lg shadow-sm"
               alt="Products Overview"
               data-editor-config="%7B%22defaultSrc%22%3A%22https%3A%2F%2Fmiaoda-edit-image.s3cdn.medo.dev%2Fd2lgq5dxewap%2FIMG-d3c46wfpz01s.jpg%22%7D" />
          </FadeIn>
        </div>
      </section>

      {/* Product Portfolio Overview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Product Portfolio Overview</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              A diversified manufacturing portfolio focused on high-precision engineering components for heavy industry, energy, automotive, and process-plant applications.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              return (
                <FadeIn key={category.title} direction="up" delay={index * 0.1}>
                  <Card className="h-full border border-border rounded-none hover:border-primary transition-colors">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{category.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{category.description}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Raw Material Sourcing */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right" className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Raw Material Sourcing</h2>
              <div className="w-16 h-1 bg-primary"></div>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Quality begins at the source. We partner with a vetted network of mills, foundries, and specialist suppliers who share our commitment to metallurgical integrity, dimensional consistency, and on-time delivery.
              </p>
              <ul className="space-y-4">
                {VENDOR_PARTNERS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn direction="left" className="aspect-[4/3] bg-muted overflow-hidden">
              <img 
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_995eb554-c2af-4e90-9183-26e2b85e8af2.jpg" 
                alt="Raw material inspection and sourcing" 
                className="w-full h-full object-cover" 
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Key Product Features & Benefits */}
      <section className="py-16 md:py-24">
        <div className="container">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Key Features & Benefits</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              Every component is engineered to deliver measurable operational advantages: lower energy use, tighter tolerances, longer life, and the flexibility to match your exact specification.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} direction="up" delay={index * 0.1} className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checkerboard Product Grid */}
      <section className="w-full pb-12 md:pb-24">
        <div className="container mb-12">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Featured Product Lines</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-muted-foreground text-pretty">
              Explore our core product families. Click any category to view detailed specifications and request a quotation.
            </p>
          </FadeIn>
        </div>
        {displayedProducts.length > 0 ? (<>
          <div className="flex flex-col w-full overflow-x-hidden">
            {displayedProducts.map((product, index) => {
              const style = getBlockStyle(index);
              return (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-2 w-full">
                  {/* Image Column */}
                  <FadeIn direction={index % 2 === 0 ? "left" : "right"} className={`aspect-[16/10] md:aspect-auto md:h-[500px] relative ${style.imgOrder}`}>
                    <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} />
                  </FadeIn>
                  
                  {/* Text Column */}
                  <FadeIn direction={index % 2 === 0 ? "right" : "left"} className={`${style.bg} flex flex-col justify-center p-8 md:p-24 aspect-[16/10] md:aspect-auto md:h-[500px] ${style.textOrder} relative z-10`}>
                    <h2 className={`text-2xl md:text-4xl font-bold ${style.text} mb-4 uppercase leading-tight`}>
                      {product.name}
                    </h2>
                    <p className={`${style.desc} mb-8 text-sm leading-relaxed max-w-md`}>
                      {product.brief_description}
                    </p>
                    <div>
                      <Button variant={style.btnVariant} asChild className={`rounded-none px-8 py-6 h-auto uppercase text-xs font-bold tracking-wider ${style.btnClass}`}>
                        <Link to={`/products/${product.slug}`}>
                          ABOUT PRODUCT
                        </Link>
                      </Button>
                    </div>
                  </FadeIn>
                </div>
              );
            })}
          </div>
          {!showAllProducts && filteredProducts.length > 4 && (
            <div className="flex justify-center mt-12">
              <Button size="lg" onClick={() => setShowAllProducts(true)} className="rounded-none px-8 py-6 h-auto uppercase tracking-wider font-bold">
                View More Products
              </Button>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-20 bg-muted/50 rounded-lg m-8">
            <h3 className="text-xl font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <FadeIn direction="up" className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">Need a Custom Solution?</h2>
              <p className="text-white/80 text-pretty">
                Our engineering team works with your drawings and specifications to deliver tailor-made components that integrate seamlessly into your operations.
              </p>
            </div>
            <Button asChild className="rounded-none px-8 py-6 h-auto uppercase text-xs font-bold tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              <Link to="/request-quote">
                Request a Quote <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
    </>
  );
};

export default Products;
