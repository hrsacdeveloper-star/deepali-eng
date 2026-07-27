import os

PAGE_DIR = '/workspace/app-d2lgq5dxewap/src/pages'

pages = [
    'ApplyJob.tsx', 'BlogDetails.tsx', 'Blog.tsx', 'Careers.tsx',
    'Downloads.tsx', 'FAQs.tsx', 'GalleryClients.tsx', 'Industries.tsx',
    'Infrastructure.tsx', 'Quality.tsx', 'RFQ.tsx', 'MySubmissions.tsx'
]

import_statement = "import { FadeIn } from '@/components/ui/fade-in';\n"

for page in pages:
    path = os.path.join(PAGE_DIR, page)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r') as f:
        content = f.read()
        
    if 'FadeIn' in content:
        continue
        
    # add import after last import
    lines = content.split('\n')
    last_import = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import = i
            
    lines.insert(last_import + 1, import_statement.strip())
    content = '\n'.join(lines)
    
    # Simple regex replace:
    # replace `<div className="container">` with `<div className="container">\n<FadeIn direction="up">`
    # replace `</div>\n      </section>` with `</FadeIn>\n</div>\n      </section>`
    
    import re
    # Instead of regex, let's just do:
    # For every section, we find `<div className="container` and replace it. But we need to close it.
    # A safer approach: I will just use `framer-motion`'s `motion.section` instead of `section`.
    
    content = content.replace('import React', "import React from 'react';\nimport { motion } from 'framer-motion';")
    if 'import { motion }' not in content:
        lines.insert(last_import + 2, "import { motion } from 'framer-motion';")
        content = '\n'.join(lines)
        
    content = content.replace('<section', '<motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}')
    content = content.replace('</section>', '</motion.section>')
    
    with open(path, 'w') as f:
        f.write(content)
        
print("Done")
