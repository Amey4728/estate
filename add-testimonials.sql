-- Adding real client reviews
-- ---------------------------------------------------------------------------
-- The carousel sizes itself to whatever is in this table — 3 rows or 100, no
-- code change needed. Collect reviews over WhatsApp or after a registry, then
-- paste them in here (Supabase → SQL Editor) or add rows in the Table Editor.
--
-- rating     1-5
-- role       what they did with you — this is what makes a review credible
-- source     where it came from, so you can trace it later
-- sort_order lower numbers show first

insert into public.testimonials (name, role, rating, text, source, sort_order) values
  ('<client name>', '<e.g. Bought a 1,200 sq ft plot on Ujjain Road>', 5,
   '<their own words>', 'whatsapp', 10);

-- Several at once:
-- insert into public.testimonials (name, role, rating, text, source, sort_order) values
--   ('Name One', 'Bought a plot at Mayakhedi',      5, 'Review text.', 'google', 10),
--   ('Name Two', 'Sold a 2 BHK in Sudama Nagar',    5, 'Review text.', 'whatsapp', 11),
--   ('Name Three', 'Invested in a Super Corridor plot', 4, 'Review text.', 'in person', 12);

-- Hide one without deleting it:
--   update public.testimonials set published = false where id = 4;

-- Reorder:
--   update public.testimonials set sort_order = 0 where id = 7;
