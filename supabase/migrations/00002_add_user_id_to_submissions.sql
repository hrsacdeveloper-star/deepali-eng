ALTER TABLE form_submissions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE form_submissions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

CREATE POLICY "Users can read own submissions" ON form_submissions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own submissions" ON form_submissions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own submissions" ON form_submissions FOR DELETE TO authenticated USING (user_id = auth.uid());