import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FadeIn } from '@/components/ui/fade-in';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const MOCK_FAQS: FAQ[] = [
  {
    id: '1',
    category: 'Products',
    question: 'What materials do you use for your industrial components?',
    answer: 'We primarily use high-grade carbon steel, stainless steel, and specialized alloys depending on the specific application requirements. All our materials are sourced from certified suppliers and undergo rigorous quality testing before manufacturing.'
  },
  {
    id: '2',
    category: 'Quality',
    question: 'Are your products internationally certified?',
    answer: 'Yes, all our manufacturing processes and final products comply with international standards including ISO 9001, ASME, ASTM, and API. We provide comprehensive material test certificates with every delivery.'
  },
  {
    id: '3',
    category: 'Shipping',
    question: 'Do you offer international shipping and export?',
    answer: 'Absolutely. We export our engineering components to over 30 countries worldwide. Our logistics team ensures secure packaging and handles all necessary customs documentation for seamless international delivery.'
  },
  {
    id: '4',
    category: 'Customization',
    question: 'Can you manufacture custom parts based on our technical drawings?',
    answer: 'Yes, our state-of-the-art facility is equipped to handle custom manufacturing. Our engineering team can work directly from your CAD drawings or technical specifications to produce highly precise custom components.'
  }
];

const FAQs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await supabase.from('faqs').select('*').order('order_index');
        if (data && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs(MOCK_FAQS);
        }
      } catch (error) {
        console.error('Error fetching faqs:', error);
        setFaqs(MOCK_FAQS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFaqs();
  }, []);

  // Group by category if needed, here simple list
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Find quick answers to common queries about our products, manufacturing capabilities, and export procedures.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.length > 0 ? faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-bold text-lg py-4 hover:no-underline hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 text-pretty">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              )) : (
                <div className="text-center py-12 text-muted-foreground">
                  No FAQs available at the moment.
                </div>
              )}
            </Accordion>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default FAQs;
