insert into storage.buckets (id, name, public) values ('product_images', 'product_images', true) on conflict do nothing;

create policy "Public Access" on storage.objects for select using (bucket_id = 'product_images');
create policy "Auth Insert" on storage.objects for insert with check (bucket_id = 'product_images' and auth.role() = 'authenticated');
create policy "Auth Update" on storage.objects for update using (bucket_id = 'product_images' and auth.role() = 'authenticated');