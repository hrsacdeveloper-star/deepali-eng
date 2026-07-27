import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Sitemap: React.FC = () => {
  const sections = [
    {
      title: 'Company',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact' },
      ]
    },
    {
      title: 'Products & Capabilities',
      links: [
        { name: 'All Products', path: '/products' },
        { name: 'Infrastructure', path: '/infrastructure' },
        { name: 'Quality Assurance', path: '/quality' },
        { name: 'Industries We Serve', path: '/industries' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Downloads & Catalogues', path: '/downloads' },
        { name: 'Insights & Blog', path: '/blog' },
        { name: 'Gallery & Clients', path: '/gallery' },
        { name: 'FAQs', path: '/faqs' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms & Conditions', path: '/terms' },
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Sitemap</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Overview of all pages on the Deepali Engineering website.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground border-b pb-2">{section.title}</h2>
                <ul className="space-y-3 text-muted-foreground">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link to={link.path} className="flex items-center hover:text-primary transition-colors">
                        <ChevronRight className="h-4 w-4 mr-2 text-primary/50" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Sitemap;
