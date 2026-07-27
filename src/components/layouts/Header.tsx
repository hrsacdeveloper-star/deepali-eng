import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, Search, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'About Us', 
      path: '/about',
      dropdown: [
        { name: 'Certifications', path: '/certifications' },
        { name: 'Testing Procedures', path: '/testing-procedures' },
        { name: 'Tool Room', path: '/tool-room' }
      ]
    },
    { name: 'Products', path: '/products' },
    { name: 'Industries', path: '/industries' },
    { name: 'Quality', path: '/quality' },
    { name: 'Contact Us', path: '/contact' },
  ];
  
  if (user) {
    navLinks.push({ name: 'My Submissions', path: '/my-submissions' });
    navLinks.push({ name: 'Product Admin', path: '/admin/products' });
    navLinks.push({ name: 'Certificate Admin', path: '/admin/certificates' });
    navLinks.push({ name: 'Partners Admin', path: '/admin/partners' });
    navLinks.push({ name: 'Org Structure', path: '/admin/org-structure' });
    navLinks.push({ name: 'Site Settings', path: '/admin/settings' });
  }

  const isActive = (path: string, dropdown?: {path: string}[]) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (location.pathname.startsWith(path)) return true;
    if (dropdown && dropdown.some(d => location.pathname.startsWith(d.path))) return true;
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm border-b">
        {/* Top Bar - Contact Info & Quick Links */}
        <div className="hidden md:flex border-b relative">
          <div className="container flex justify-between items-center h-10 text-xs bg-[#fce3dc33] bg-none">
            <div className="flex items-center gap-6">
               <Link to="/about" className="hover:text-primary transition-colors text-muted-foreground">About Us</Link>
               <Link to="/faqs" className="hover:text-primary transition-colors text-muted-foreground">FAQs</Link>
               <Link to="/contact" className="hover:text-primary transition-colors text-muted-foreground">Help Desk</Link>
            </div>
            <div className="flex items-center gap-8 text-muted-foreground pr-40">
               <div className="flex items-center gap-2">
                 <Phone className="h-3 w-3 text-primary" />
                 <span><span className="font-semibold text-secondary">+91 9822767451</span><br/><span className="text-[10px]">Call Us</span></span>
               </div>
               <div className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 <span><span className="font-semibold text-secondary">09:00 AM - 06:00 PM</span><br/><span className="text-[10px]">Monday - Saturday</span></span>
               </div>
               <div className="flex items-center gap-2">
                 <MapPin className="h-3 w-3 text-primary" />
                 <span><span className="font-semibold text-secondary">MIDC Chakan, Phase IV</span><br/><span className="text-[10px]">Pune, Maharashtra</span></span>
               </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 h-10 flex items-center bg-primary px-4 md:px-8 cursor-pointer hover:bg-primary/90 transition-colors hidden md:flex" onClick={() => navigate('/request-quote')}>
             <span className="text-white text-xs font-bold uppercase tracking-wider">GET A QUOTE</span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="container flex items-center justify-between h-16 md:h-20 bg-[#ff000000] bg-none">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://miaoda-edit-image.s3cdn.medo.dev/d2lgq5dxewap/IMG-d2z4mbvpflkw.png"
              alt="Deepali Engineering Logo"
              className="h-12 md:h-16 w-auto object-contain"
              data-editor-config="%7B%22defaultSrc%22%3A%22https%3A%2F%2Fmiaoda-edit-image.s3cdn.medo.dev%2Fd2lgq5dxewap%2FIMG-d2z4mbvpflkw.png%22%7D" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center h-full">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group h-full flex items-center">
                <Link
                  to={link.path}
                  className={`px-5 py-2.5 mx-1 text-sm font-semibold transition-colors flex items-center gap-1 ${
                    isActive(link.path, link.dropdown) 
                      ? 'bg-primary text-white' 
                      : 'text-secondary hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronRight className="h-3 w-3 opacity-50 rotate-90 group-hover:-rotate-90 transition-transform" />}
                </Link>
                {link.dropdown && (
                  <div className="absolute left-0 top-[100%] hidden group-hover:block w-56 bg-white shadow-lg border-t-2 border-primary z-50">
                    <ul className="flex flex-col py-2">
                      {link.dropdown.map((dropLink) => (
                        <li key={dropLink.path}>
                          <Link
                            to={dropLink.path}
                            className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-muted/50 transition-colors"
                          >
                            {dropLink.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2 text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4 px-4 shadow-lg absolute w-full max-h-[80vh] overflow-y-auto z-50">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.path} className="flex flex-col">
                  <Link
                    to={link.path}
                    onClick={() => !link.dropdown && setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-none text-sm font-semibold flex justify-between items-center ${
                      isActive(link.path, link.dropdown) 
                        ? 'bg-primary text-white' 
                        : 'text-secondary hover:bg-muted'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-6 flex flex-col mt-1 border-l-2 border-muted ml-4">
                      {link.dropdown.map(dropLink => (
                        <Link
                          key={dropLink.path}
                          to={dropLink.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`px-4 py-2 rounded-none text-sm ${
                            isActive(dropLink.path) ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
                          }`}
                        >
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-2 border-t flex flex-col gap-3">
                <Button className="w-full rounded-none uppercase text-xs tracking-wider" onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}>
                  Contact Us
                </Button>
              </div>
            </nav>
          </div>
        )}</header>
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </>
  );
};

export default Header;
