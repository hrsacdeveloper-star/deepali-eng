import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last Updated: July 2026</p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-16 md:py-24">
        <div className="container max-w-3xl prose prose-slate dark:prose-invert text-muted-foreground text-pretty">
          <p>
            Welcome to the Deepali Engineering website. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>

          <h3 className="text-foreground mt-8">1. Acceptance of Terms</h3>
          <p>
            The content of the pages of this website is for your general information and use only. It is subject to change without notice. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.
          </p>

          <h3 className="text-foreground mt-8">2. Intellectual Property</h3>
          <p>
            This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, graphics, and product images. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
          </p>

          <h3 className="text-foreground mt-8">3. Product Information and Quotations</h3>
          <p>
            While we strive to ensure that product descriptions, technical parameters, and images are accurate, errors may occur. The information provided does not constitute a legally binding offer. Official quotations provided through our RFQ process will contain specific, binding terms regarding price, specifications, and delivery for each individual order.
          </p>

          <h3 className="text-foreground mt-8">4. User Accounts</h3>
          <p>
            Certain features of this website (such as requesting quotes or downloading catalogues) may require you to authenticate using an email OTP. You are responsible for maintaining the confidentiality of your account access and ensuring that the email address provided is accurate and belongs to you.
          </p>

          <h3 className="text-foreground mt-8">5. External Links</h3>
          <p>
            From time to time, this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
          </p>

          <h3 className="text-foreground mt-8">6. Limitation of Liability</h3>
          <p>
            In no event will Deepali Engineering be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>

          <h3 className="text-foreground mt-8">7. Governing Law</h3>
          <p>
            Your use of this website and any dispute arising out of such use of the website is subject to the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default Terms;
