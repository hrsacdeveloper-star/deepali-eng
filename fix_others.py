import os

PAGE_DIR = '/workspace/app-d2lgq5dxewap/src/pages'

pages = [
    'Terms.tsx', 'PrivacyPolicy.tsx', 'Sitemap.tsx', 'NotFound.tsx'
]

for page in pages:
    path = os.path.join(PAGE_DIR, page)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r') as f:
        content = f.read()
        
    if "import { motion } from 'framer-motion';" not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import '):
                lines.insert(i + 1, "import { motion } from 'framer-motion';")
                break
        content = '\n'.join(lines)
        
    content = content.replace('<section', '<motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}')
    content = content.replace('</section>', '</motion.section>')
    
    with open(path, 'w') as f:
        f.write(content)
        
print("Done")