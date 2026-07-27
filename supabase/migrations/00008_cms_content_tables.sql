-- CMS Content Tables for Deepali Engineering Website
-- All tables use UUID primary keys with auto-generation (no manual ID required)

-- 1. Home Page Sections (editable content blocks)
CREATE TABLE IF NOT EXISTS home_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  secondary_image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Home Page Stats / Counters
CREATE TABLE IF NOT EXISTS home_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Featured Items on Home Page
CREATE TABLE IF NOT EXISTS featured_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('products', 'industries', 'clients')),
  item_id UUID,
  item_type TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. About Us Page Sections
CREATE TABLE IF NOT EXISTS about_us_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  heading TEXT,
  content TEXT,
  image_url TEXT,
  secondary_image_url TEXT,
  highlights JSONB DEFAULT '[]',
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Core Values
CREATE TABLE IF NOT EXISTS core_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Extend Industries table with more details
ALTER TABLE industries ADD COLUMN IF NOT EXISTS applications TEXT;
ALTER TABLE industries ADD COLUMN IF NOT EXISTS key_benefits JSONB DEFAULT '[]';
ALTER TABLE industries ADD COLUMN IF NOT EXISTS specifications TEXT;
ALTER TABLE industries ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE industries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 7. Quality Page Sections
CREATE TABLE IF NOT EXISTS quality_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  heading TEXT,
  content TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Testing Procedures
CREATE TABLE IF NOT EXISTS testing_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Quality Standards
CREATE TABLE IF NOT EXISTS quality_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Extend site_settings for Contact page and more
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_heading TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS working_hours TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS emergency_phone TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS latitude TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS longitude TEXT;

-- 11. Tool Room Sections
CREATE TABLE IF NOT EXISTS tool_room_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  heading TEXT,
  content TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Tool Room Machines
CREATE TABLE IF NOT EXISTS tool_room_machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE testing_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_room_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_room_machines ENABLE ROW LEVEL SECURITY;

-- Public READ policies
CREATE POLICY "Public can read home_sections" ON home_sections FOR SELECT USING (true);
CREATE POLICY "Public can read home_stats" ON home_stats FOR SELECT USING (true);
CREATE POLICY "Public can read featured_items" ON featured_items FOR SELECT USING (true);
CREATE POLICY "Public can read about_us_sections" ON about_us_sections FOR SELECT USING (true);
CREATE POLICY "Public can read core_values" ON core_values FOR SELECT USING (true);
CREATE POLICY "Public can read quality_sections" ON quality_sections FOR SELECT USING (true);
CREATE POLICY "Public can read testing_procedures" ON testing_procedures FOR SELECT USING (true);
CREATE POLICY "Public can read quality_standards" ON quality_standards FOR SELECT USING (true);
CREATE POLICY "Public can read tool_room_sections" ON tool_room_sections FOR SELECT USING (true);
CREATE POLICY "Public can read tool_room_machines" ON tool_room_machines FOR SELECT USING (true);

-- Authenticated WRITE policies (admin management)
CREATE POLICY "Auth can manage home_sections" ON home_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage home_stats" ON home_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage featured_items" ON featured_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage about_us_sections" ON about_us_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage core_values" ON core_values FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage quality_sections" ON quality_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage testing_procedures" ON testing_procedures FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage quality_standards" ON quality_standards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage tool_room_sections" ON tool_room_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage tool_room_machines" ON tool_room_machines FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default CMS content
INSERT INTO home_sections (section_key, title, subtitle, content, button_text, button_link, order_index) VALUES
('about', 'About Deepali Engineering', 'Excellence Since 1995', 'A professional industrial manufacturing company established in 1995, producing precision-engineered couplings, flanges, pipe fittings, and custom forgings for export and domestic markets.', 'Learn More', '/about', 1),
('why_choose_us', 'Why Choose Us', 'Quality & Precision', 'We combine advanced manufacturing with strict quality control to deliver components that meet global standards.', 'Explore', '/quality', 2)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO home_stats (label, value, suffix, icon, order_index) VALUES
('Years of Experience', '25', '+', 'calendar', 1),
('Products Manufactured', '500', '+', 'cog', 2),
('Countries Served', '50', '+', 'globe', 3),
('Quality Certifications', '5', '+', 'award', 4)
ON CONFLICT DO NOTHING;

INSERT INTO about_us_sections (section_key, title, heading, content, order_index) VALUES
('story', 'Our Story', 'Legacy of Engineering Excellence', 'Deepali Engineering has been serving domestic and international markets since 1995 with precision-engineered components.', 1),
('vision_mission', 'Vision & Mission', 'Our Commitment', 'To deliver zero-defect engineering components while maintaining global standards and building long-term partnerships.', 2)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO core_values (title, description, icon, order_index) VALUES
('Quality First', 'Uncompromising dedication to precision and zero-defect products.', 'shield-check', 1),
('Customer Centric', 'Building long-term partnerships through reliable service.', 'users', 2),
('Global Standards', 'Investing in cutting-edge machinery and training.', 'globe', 3)
ON CONFLICT DO NOTHING;

INSERT INTO quality_sections (section_key, title, heading, content, order_index) VALUES
('policy', 'Quality Policy', 'Commitment to Excellence', 'We are committed to delivering products that meet or exceed customer expectations through continuous improvement and rigorous quality control.', 1),
('process', 'Quality Process', 'Rigorous Control', 'Every product undergoes strict inspection at multiple stages of manufacturing.', 2)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO quality_standards (name, description, icon, order_index) VALUES
('ISO 9001:2015', 'Quality Management System standard for consistent product quality.', 'certificate', 1),
('API Spec Q1', 'Specification for quality programs in petroleum and natural gas industries.', 'droplet', 2),
('ASME Standards', 'American Society of Mechanical Engineers certification for pressure equipment.', 'gauge', 3)
ON CONFLICT DO NOTHING;

INSERT INTO testing_procedures (title, description, order_index) VALUES
('Dimensional Inspection', 'Precision measurement of all critical dimensions.', 1),
('Material Testing', 'Chemical and mechanical testing of raw materials.', 2),
('Pressure Testing', 'Hydrostatic and pneumatic pressure testing.', 3)
ON CONFLICT DO NOTHING;

INSERT INTO tool_room_sections (section_key, title, heading, content, order_index) VALUES
('overview', 'Tool Room Overview', 'Precision Tooling', 'Our tool room is equipped with advanced measuring and machining equipment.', 1)
ON CONFLICT (section_key) DO NOTHING;
