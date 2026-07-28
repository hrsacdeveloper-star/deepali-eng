import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/seo/SEO';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy | Deepali Engineering"
        description="Read Deepali Engineering's privacy policy to understand how we collect, use, and protect your personal information on our website."
        url="/privacy-policy"
        keywords="Privacy Policy Deepali Engineering, Data Protection, Customer Privacy"
      />
      <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: July 2026</p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container max-w-3xl prose prose-slate dark:prose-invert text-muted-foreground text-pretty">
          <p>
            At Deepali Engineering, we are committed to protecting the privacy and security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us through our website.
          </p>

          <h3 className="text-foreground mt-8">Information We Collect</h3>
          <p>
            We may collect personal information such as your name, email address, phone number, company name, and job title when you interact with our website through:
          </p>
          <ul>
            <li>Requesting a quote (RFQ)</li>
            <li>Submitting a contact form</li>
            <li>Applying for a job</li>
            <li>Downloading catalogues or brochures</li>
            <li>Subscribing to our newsletter</li>
          </ul>

          <h3 className="text-foreground mt-8">How We Use Your Information</h3>
          <p>
            The information we collect is used to:
          </p>
          <ul>
            <li>Respond to your inquiries and provide requested quotations</li>
            <li>Process job applications</li>
            <li>Send periodic newsletters and company updates (only if you have opted in)</li>
            <li>Improve our website functionality and user experience</li>
            <li>Maintain security and prevent fraud</li>
          </ul>

          <h3 className="text-foreground mt-8">Data Security and Retention</h3>
          <p>
            We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely in our database systems and is retained only for as long as necessary to fulfill the purposes outlined in this policy.
          </p>

          <h3 className="text-foreground mt-8">Third-Party Disclosure</h3>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>

          <h3 className="text-foreground mt-8">Cookies</h3>
          <p>
            Our website uses minimal cookies to enhance your browsing experience, such as maintaining your authentication state. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies via your browser settings.
          </p>

          <h3 className="text-foreground mt-8">Contact Us</h3>
          <p>
            If you have any questions regarding this Privacy Policy, please contact us at privacy@deepaliengineering.com.
          </p>
        </div>
      </motion.section>
    </div>
    </>
  );
};

export default PrivacyPolicy;
