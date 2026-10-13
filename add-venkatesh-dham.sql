-- Adding Venkatesh Dham to the live listings
-- ---------------------------------------------------------------------------
-- Run once in Supabase → SQL Editor. Safe to run again: the second run only
-- refreshes the row. The photos ship with the website (images stays null), so
-- deploy the site as well or the listing shows the sketch instead.

-- make room for it at the top of the listings
update public.properties
   set sort_order = sort_order + 1
 where sort_order >= 0
   and not exists (select 1 from public.properties where id = 'MRS-205');

insert into public.properties
  (id, title, location, price, type, area, size_label, bedrooms, bathrooms,
   status, featured, art, description, amenities, images, sort_order)
values
  ('MRS-205', 'Venkatesh Dham', 'Old Indore, Indore', null, 'Row House', 0, 'Sizes on request', 0, 0,
   'Available', true, 'row',
   'Ready-possession modern row houses in the heart of old Indore — a gated lane of just 10 homes, each with its own lawn and car parking. Airport 1 km, metro station 500 m, railway station 5 km; DMart, Sarafa and MT Cloth Market within 3 km; Bijasan and Bada Ganpati 2 km. Sizes and rates on request.',
   '["Ready possession", "Gated campus", "Temple", "Car parking", "Individual lawn", "Narmada water", "Common tube well", "False ceiling", "COBA waterproofing on terrace", "Grocery mart"]'::jsonb,
   null, 0)
on conflict (id) do update set
  title = excluded.title, location = excluded.location, type = excluded.type,
  size_label = excluded.size_label, status = excluded.status, featured = excluded.featured,
  art = excluded.art, description = excluded.description, amenities = excluded.amenities,
  updated_at = now();
