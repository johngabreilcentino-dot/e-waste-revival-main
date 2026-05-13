create table if not exists public.iws_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  title text not null,
  location text not null,
  photo_url text not null,
  summary text not null,
  story text not null,
  focus text not null,
  goal text not null,
  sponsorship text,
  impact text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.iws_profiles
drop column if exists is_hidden;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.iws_profiles enable row level security;
alter table public.admin_users enable row level security;

insert into storage.buckets (id, name, public)
values ('iws-photos', 'iws-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "IWS profiles are publicly readable" on public.iws_profiles;
drop policy if exists "IWS profiles are admin insertable" on public.iws_profiles;
drop policy if exists "IWS profiles are admin updatable" on public.iws_profiles;
drop policy if exists "IWS profiles are admin deletable" on public.iws_profiles;
drop policy if exists "Admin users can read their own admin record" on public.admin_users;
drop policy if exists "IWS photos are publicly readable" on storage.objects;
drop policy if exists "IWS photos are admin insertable" on storage.objects;
drop policy if exists "IWS photos are admin updatable" on storage.objects;
drop policy if exists "IWS photos are admin deletable" on storage.objects;

create policy "IWS profiles are publicly readable"
on public.iws_profiles
for select
to anon, authenticated
using (true);

create policy "IWS profiles are admin insertable"
on public.iws_profiles
for insert
to authenticated
with check (
  (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
  or
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
      or admin_users.email = (auth.jwt() ->> 'email')
  )
);

create policy "IWS profiles are admin updatable"
on public.iws_profiles
for update
to authenticated
using (
  (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
  or
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
      or admin_users.email = (auth.jwt() ->> 'email')
  )
)
with check (
  (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
  or
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
      or admin_users.email = (auth.jwt() ->> 'email')
  )
);

create policy "IWS profiles are admin deletable"
on public.iws_profiles
for delete
to authenticated
using (
  (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
  or
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
      or admin_users.email = (auth.jwt() ->> 'email')
  )
);

create policy "Admin users can read their own admin record"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid() or email = (auth.jwt() ->> 'email'));

create policy "IWS photos are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'iws-photos');

create policy "IWS photos are admin insertable"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'iws-photos'
  and (
    (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
    or exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
        or admin_users.email = (auth.jwt() ->> 'email')
    )
  )
);

create policy "IWS photos are admin updatable"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'iws-photos'
  and (
    (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
    or exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
        or admin_users.email = (auth.jwt() ->> 'email')
    )
  )
)
with check (
  bucket_id = 'iws-photos'
  and (
    (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
    or exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
        or admin_users.email = (auth.jwt() ->> 'email')
    )
  )
);

create policy "IWS photos are admin deletable"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'iws-photos'
  and (
    (auth.jwt() ->> 'email') = 'johngabreilcentino@gmail.com'
    or exists (
      select 1
      from public.admin_users
      where admin_users.user_id = auth.uid()
        or admin_users.email = (auth.jwt() ->> 'email')
    )
  )
);

insert into public.iws_profiles (
  name,
  title,
  location,
  photo_url,
  summary,
  story,
  focus,
  goal,
  sponsorship,
  impact
)
values
  (
    'Maria Santos',
    'Community Repair Mentor',
    'Cebu City',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    'Maria trains youth to repair small electronics while recovering parts safely and sustainably.',
    'Maria grew up in a small barangay where old phones and laptops were left to rot. She now runs repair workshops that teach practical electronics skills and keep e-waste out of landfills.',
    'Repair training',
    'Raise PHP 120,000 for tools, parts, transport, and workshop supplies.',
    'Sponsor Maria to expand her training program and support 40 young learners this year.',
    'Your support helps 40 students gain repair skills, recycles 500kg of electronics, and creates local green jobs.'
  ),
  (
    'Ana Velasquez',
    'E-Waste Awareness Organizer',
    'Davao',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    'Ana leads awareness campaigns that connect families and schools to proper e-waste disposal.',
    'After seeing toxic waste contaminate a river near her community, Ana launched neighborhood campaigns to educate parents and teachers about safe disposal and recycling.',
    'Community outreach',
    'Secure PHP 90,000 for event materials, transport, and educational kits.',
    'Support Ana to reach 2,000 households with workshops and school visits.',
    'Each sponsorship helps prevent harmful electronics from entering waterways while building long-term recycling habits.'
  ),
  (
    'Camila Reyes',
    'Digital Inclusion Coach',
    'Quezon City',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    'Camila teaches women and seniors how to reuse refurbished devices safely and confidently.',
    'Camila collects donated devices, oversees safe data wiping, and coaches learners on using refurbished electronics for work and education.',
    'Refurbish + reuse',
    'Raise PHP 110,000 for refurbishment equipment, internet access, and training sessions.',
    'Help Camila provide 60 refurbished devices with training to families in need.',
    'Your support transforms old devices into tools for education, livelihood, and community resilience.'
  ),
  (
    'Jessica Castro',
    'Zero-Waste Policy Advocate',
    'Manila',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    'Jessica builds partnerships with LGUs and schools to make e-waste recycling widely accessible.',
    'Jessica works with local governments to create collection points and program guides, helping barangays comply with e-waste laws without extra cost.',
    'Policy + partnerships',
    'Secure PHP 130,000 for pilot collection points, training materials, and community events.',
    'Support Jessica to launch new drop-off hubs and awareness drives in Metro Manila.',
    'Every sponsorship helps communities access safe disposal and keeps toxic materials out of landfills.'
  )
on conflict (name) do nothing;
