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
        
    # fix the syntax error
    content = content.replace("import React from 'react';\nimport { motion } from 'framer-motion';, {", "import React, {")
    content = content.replace("import React from 'react';\nimport { motion } from 'framer-motion'; from", "import React from")
    
    with open(path, 'w') as f:
        f.write(content)
        
print("Done")