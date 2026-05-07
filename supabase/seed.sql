-- Seed Brands
INSERT INTO public.brands (id, name, code, currency, country, domain) VALUES
  ('11111111-1111-1111-1111-111111111111', 'The American Patch', 'TAP', 'USD', 'US', 'theamericanpatch.com'),
  ('22222222-2222-2222-2222-222222222222', 'Patch Makers Canada', 'PMC', 'CAD', 'CA', 'patchmakers.ca'),
  ('33333333-3333-3333-3333-333333333333', 'The Eagle Patches', 'TEP', 'USD', 'US', 'theeaglepatches.com'),
  ('44444444-4444-4444-4444-444444444444', 'Eagle Patches UK', 'EAGLEUK', 'GBP', 'UK', 'eaglepatches.uk'),
  ('55555555-5555-5555-5555-555555555555', 'Embroidered Patches NZ', 'EPNZ', 'NZD', 'NZ', 'embroideredpatches.co.nz')
ON CONFLICT (code) DO NOTHING;

-- Seed Admin User in auth.users
-- Note: password is 'password123'
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@kamsoft.com',
    crypt('password123', gen_salt('bf')),
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ikhlaque A."}',
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Seed Profile for Admin User
INSERT INTO public.profiles (
    id,
    full_name,
    role,
    brand_ids,
    active_brand_id
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Ikhlaque A.',
    'Admin',
    ARRAY['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555']::uuid[],
    '11111111-1111-1111-1111-111111111111'
) ON CONFLICT (id) DO NOTHING;

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('artwork', 'artwork', false),
  ('qa-photos', 'qa-photos', false),
  ('attachments', 'attachments', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Authenticated users can upload artwork" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artwork');
CREATE POLICY "Authenticated users can read artwork" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'artwork');

CREATE POLICY "Authenticated users can upload qa-photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'qa-photos');
CREATE POLICY "Authenticated users can read qa-photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'qa-photos');

CREATE POLICY "Authenticated users can upload attachments" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'attachments');
CREATE POLICY "Authenticated users can read attachments" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'attachments');

CREATE POLICY "Public can read avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
