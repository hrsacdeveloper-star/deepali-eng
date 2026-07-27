import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Download, ChevronRight } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import { FadeIn } from '@/components/ui/fade-in';
import { SEO } from '@/components/seo/SEO';

interface ProductDetails {
  id: string;
  name: string;
  slug: string;
  full_description: string;
  technical_parameters: any;
  applications: string;
  image_url: string;
  category_id: string;
}

const MOCK_PRODUCTS: ProductDetails[] = [
  {
    id: '1',
    name: 'Materials & Piping',
    slug: 'materials-piping',
    full_description: 'Constant and reliable supplier of pipe, sheet, rolled profiles, elbows, fittings, flanges, studs, assemblies and fittings used in the petrochemical, energetic, petroleum, chemical and naval industries. Our materials and piping components meet the highest industry standards for durability and performance.',
    technical_parameters: { "Material": "Carbon Steel, Stainless Steel", "Standard": "ASTM, ASME, API", "Size": "1/2\" to 48\"" },
    applications: "Petrochemical, Power Generation, Naval Industries",
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0ac6928d-52fe-4918-9121-2deab1d9df49.jpg',
    category_id: '1'
  },
  {
    id: '2',
    name: 'Power & Energy Systems',
    slug: 'power-energy',
    full_description: 'High-quality energy transfer solutions and pipeline systems engineered to withstand extreme conditions in power generation plants and facilities. Built for extreme pressures and high temperatures.',
    technical_parameters: { "Pressure Rating": "Up to 2500 lbs", "Temperature": "Up to 600°C", "Testing": "Hydrostatic, NDT" },
    applications: "Power Plants, Nuclear Facilities, Renewable Energy",
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_d93f9b5a-d954-4e54-8e2f-6c77c1292373.jpg',
    category_id: '2'
  },
  {
    id: '3',
    name: 'Petroleum Refinery Components',
    slug: 'petroleum-refinery',
    full_description: 'Precision engineered components providing strong connections and safe operations for various industrial piping networks and oil refinery systems.',
    technical_parameters: { "Corrosion Resistance": "High", "Type": "Heavy Duty", "Certification": "ISO 9001" },
    applications: "Oil & Gas, Offshore Platforms, Refineries",
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_995eb554-c2af-4e90-9183-26e2b85e8af2.jpg',
    category_id: '3'
  },
  {
    id: '4',
    name: 'Automotive Manufacturing Parts',
    slug: 'automotive-manufacturing',
    full_description: 'Durable and highly precise automotive manufacturing parts ensuring optimal performance and seamless integration in modern assembly lines.',
    technical_parameters: { "Tolerance": "±0.01mm", "Surface Finish": "Polished, Coated", "Durability": "Extended Lifecycle" },
    applications: "Automotive Assembly, Heavy Machinery",
    image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7311a97b-51a7-4d6a-9a14-f0d2b9cfa9e8.jpg',
    category_id: '4'
  }
];

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (data) {
          setProduct(data);
        } else {
          const mockMatch = MOCK_PRODUCTS.find(p => p.slug === slug);
          if (mockMatch) {
            setProduct(mockMatch);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        const mockMatch = MOCK_PRODUCTS.find(p => p.slug === slug);
        if (mockMatch) {
          setProduct(mockMatch);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]);

  const handleRequiresAuth = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      setIsAuthOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Button asChild><Link to="/products">Return to Products</Link></Button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${product.name} | Deepali Engineering`}
        description={product.full_description.substring(0, 160)}
        url={`/products/${product.slug}`}
        keywords={`${product.name}, Deepali Engineering, Precision Parts, Manufacturing`}
        image={product.image_url}
      />
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Breadcrumb Area */}
      <div className="bg-muted py-6">
        <div className="container">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-primary">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/products">← Return to Products</Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="bg-muted/10 rounded-none p-4 aspect-square flex items-center justify-center relative overflow-hidden border">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain relative z-10" 
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{product.name}</h1>
                <div className="w-16 h-1 bg-primary mb-6"></div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-pretty">
                  <p>{product.full_description || "Detailed description coming soon."}</p>
                </div>
              </div>

              {product.applications && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground border-b pb-2">Applications</h3>
                  <p className="text-muted-foreground text-sm text-pretty">{product.applications}</p>
                </div>
              )}

              {product.technical_parameters && (
                 <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground border-b pb-2">Technical Specifications</h3>
                  <div className="w-full overflow-hidden rounded-md border">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y">
                        {Object.entries(product.technical_parameters).map(([key, value], idx) => (
                          <tr key={idx} className="hover:bg-muted/50">
                            <th className="px-4 py-3 font-medium text-foreground bg-muted/30 w-1/3 whitespace-nowrap">{key}</th>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                 </div>
              )}

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleRequiresAuth} asChild={!!session} className="rounded-none bg-secondary text-white hover:bg-secondary/90 uppercase tracking-widest text-xs font-bold">
                  {session ? <Link to="/request-quote">Request Quote</Link> : <span>Request Quote</span>}
                </Button>
                <Button size="lg" variant="outline" onClick={handleRequiresAuth} className="gap-2 rounded-none uppercase tracking-widest text-xs font-bold border-border">
                  <Download className="h-4 w-4" />
                  Download Catalogue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </div>
    </>
  );
};

export default ProductDetails;
