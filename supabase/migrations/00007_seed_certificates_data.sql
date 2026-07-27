INSERT INTO certificates (id, name, image_url, description, order_index) VALUES
(gen_random_uuid(), 'ISO 9001:2015', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_23fe3c9f-84c6-4d94-a07a-42ccc98322f8.jpg', 'Quality Management System Certification', 1),
(gen_random_uuid(), 'API Spec Q1', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_74e540ad-c585-4f02-bc39-b5d224a9f73f.jpg', 'Quality Specification for Petroleum and Natural Gas', 2),
(gen_random_uuid(), 'ASME U Stamp', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_542b5e36-c54a-4c92-822a-a389d40cbeb5.jpg', 'Pressure Vessel Certification', 3),
(gen_random_uuid(), 'CE Marking', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3edf3618-f2a1-4ea0-a405-3d87674d7aa0.jpg', 'European Conformity Standards', 4)
ON CONFLICT DO NOTHING;