import os

PAGE_DIR = '/workspace/app-d2lgq5dxewap/src/pages'

pages = [
    'ApplyJob.tsx', 'BlogDetails.tsx', 'Blog.tsx', 'Careers.tsx',
    'Downloads.tsx', 'FAQs.tsx', 'GalleryClients.tsx', 'Industries.tsx',
    'Infrastructure.tsx', 'Quality.tsx', 'RFQ.tsx', 'MySubmissions.tsx'
]

for page in pages:
    path = os.path.join(PAGE_DIR, page)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r') as f:
        content = f.read()
        
    if "import { motion } from 'framer-motion';" not in content:
        lines = content.split('\n')
        # put it right after import React
        for i, line in enumerate(lines):
            if line.startswith('import React'):
                lines.insert(i + 1, "import { motion } from 'framer-motion';")
                break
        
        with open(path, 'w') as f:
            f.write('\n'.join(lines))
        
print("Done")