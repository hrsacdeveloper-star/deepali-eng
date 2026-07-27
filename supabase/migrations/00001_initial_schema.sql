-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. site_settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  about_text TEXT,
  vision_text TEXT,
  mission_text TEXT,
  infrastructure_text TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  map_embed_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  footer_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. hero_slides
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. product_categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brief_description TEXT,
  full_description TEXT,
  technical_parameters JSONB,
  applications TEXT,
  image_url TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. industries
CREATE TABLE industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. machines
CREATE TABLE machines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  specifications JSONB,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. gallery
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  category TEXT,
  image_url TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. team
CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('blog', 'news')) DEFAULT 'blog',
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. faqs
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. downloads
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  category TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. careers
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT,
  department TEXT,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. form_submissions
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('contact', 'rfq', 'job_application', 'callback', 'complaint', 'feedback', 'vendor')) NOT NULL,
  payload JSONB NOT NULL,
  status TEXT CHECK (status IN ('new', 'read', 'archived')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 18. seo_meta
CREATE TABLE seo_meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;

-- Public READ policies (for content tables)
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public can read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read industries" ON industries FOR SELECT USING (true);
CREATE POLICY "Public can read machines" ON machines FOR SELECT USING (true);
CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public can read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can read team" ON team FOR SELECT USING (true);
CREATE POLICY "Public can read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public can read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public can read downloads" ON downloads FOR SELECT USING (true);
CREATE POLICY "Public can read careers" ON careers FOR SELECT USING (true);
CREATE POLICY "Public can read seo_meta" ON seo_meta FOR SELECT USING (true);

-- Authenticated READ policies (for private tables)
CREATE POLICY "Auth can read form_submissions" ON form_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can read newsletter_subscribers" ON newsletter_subscribers FOR SELECT TO authenticated USING (true);

-- Authenticated WRITE policies (Admin roles)
CREATE POLICY "Auth can manage site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage hero_slides" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage product_categories" ON product_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage industries" ON industries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage machines" ON machines FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage certificates" ON certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage team" ON team FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage articles" ON articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage downloads" ON downloads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage careers" ON careers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage seo_meta" ON seo_meta FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage form_submissions" ON form_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage newsletter_subscribers" ON newsletter_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public INSERT policies
CREATE POLICY "Public can insert form_submissions" ON form_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can insert newsletter_subscribers" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Storage Policies
CREATE POLICY "Public can read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Auth can insert images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
CREATE POLICY "Auth can update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images');
CREATE POLICY "Auth can delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');

CREATE POLICY "Public can read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Auth can insert documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Auth can update documents" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'documents');
CREATE POLICY "Auth can delete documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents');

-- Seed site_settings
INSERT INTO site_settings (company_name, about_text, address, phone, email) 
VALUES ('Deepali Engineering', 'A professional industrial manufacturing company manufacturing engineering components for export and domestic markets.', 'Industrial Estate, Mumbai, India', '+91 98765 43210', 'info@deepaliengineering.com');

-- Seed hero_slides
INSERT INTO hero_slides (title, subtitle, image_url, button_text, button_link) VALUES 
('Precision Engineering Solutions', 'Manufacturing high-quality engineering components for global markets.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9d8e42f5-8212-4d92-a70b-62f57f773445.jpg', 'Explore Products', '/products'),
('Advanced Manufacturing Facility', 'State-of-the-art machinery and rigorous quality control.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0d8d4398-c58c-4a45-8669-e722ec34d8ca.jpg', 'View Infrastructure', '/infrastructure');

-- Seed product_categories
INSERT INTO product_categories (name, slug, description, image_url) VALUES 
('Couplings', 'couplings', 'High-performance steel couplings for power transmission.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7a13c699-0728-4bed-a2ca-fb3cf44d3665.jpg'),
('Flanges', 'flanges', 'Stainless steel industrial flanges.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0d155152-b505-4898-8fd3-7e947ac1dc17.jpg'),
('Pipe Fittings', 'pipe-fittings', 'Durable industrial steel pipe fittings.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0ac6928d-52fe-4918-9121-2deab1d9df49.jpg'),
('Forgings', 'forgings', 'Heavy steel forging blocks for industrial use.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_8945601b-acd3-403c-acfd-5c90533d87ef.jpg');

-- Seed industries
INSERT INTO industries (name, slug, description, image_url) VALUES 
('Oil & Gas', 'oil-and-gas', 'Refineries and petrochemical plants.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_70a713d6-73bf-40a2-97f7-227d6344fae3.jpg'),
('Power Generation', 'power-generation', 'Modern power plant infrastructure.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_d93f9b5a-d954-4e54-8e2f-6c77c1292373.jpg'),
('Chemical', 'chemical', 'Chemical processing facilities.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7311a97b-51a7-4d6a-9a14-f0d2b9cfa9e8.jpg'),
('Maritime', 'maritime', 'Shipbuilding and maritime equipment.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_ce656356-52ac-497e-892f-34bcbf027b79.jpg');

-- Seed certificates
INSERT INTO certificates (name, image_url, description) VALUES 
('ISO 9001:2015', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9b0acbed-939c-46db-b9fb-8936ea3515c7.jpg', 'Quality Management System Certification');

-- Seed machines
INSERT INTO machines (name, description, image_url) VALUES 
('CNC Machining Center', 'High-precision computer numerical control machining center.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0d8d4398-c58c-4a45-8669-e722ec34d8ca.jpg'),
('Heavy Forging Press', 'Industrial forging press for heavy metal components.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1755b145-1e1b-4c68-b292-e01cc3dc1932.jpg'),
('Industrial Lathe', 'Precision turning and shaping machine tool.', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_a2c36066-c2bf-4fad-9be2-748045c981bf.jpg');