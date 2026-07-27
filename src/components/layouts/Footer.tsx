import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';

const Footer: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*').limit(1).single();
        if (data) setSiteSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="relative mt-auto bg-[#0a0a0a] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_70a713d6-73bf-40a2-97f7-227d6344fae3.jpg" 
          alt="Footer background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src="https://miaoda-edit-image.s3cdn.medo.dev/d2lgq5dxewap/IMG-d2z4mbvpflkw.png" alt="Deepali Engineering Logo" className="h-16 w-auto object-contain" />
            <p className="text-sm text-white/70 leading-relaxed">
              {siteSettings?.about_text || 'A professional industrial manufacturing company manufacturing engineering components for export and domestic markets.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/infrastructure" className="hover:text-primary transition-colors">Infrastructure</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Products</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/products" className="hover:text-primary transition-colors">Couplings</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Flanges</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Pipe Fittings</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Forgings</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Capital City, MIDC Chakan, Phase IV, Pune 410501</li>
              <li>+91 9822767451</li>
              <li>deepaliengg@yahoo.com</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between text-sm text-white/50">
          <p>© {new Date().getFullYear()} Deepali Engineering. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0 text-white/70">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
