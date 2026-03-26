# Oxihome Malaysia — Database Schema & Logic

**Website slug:** oxihome-my
**Domain:** oxihome.my
**Product slug:** oxygen-machine
**Database:** Supabase (shared multi-tenant)

---

## 1. Schema SQL

Run this in the Supabase SQL Editor to create all tables, indexes, and constraints.

```sql
-- =============================================
-- Table: websites
-- =============================================
CREATE TABLE websites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Table: products
-- =============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  price_info JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (website_id, product_slug)
);

CREATE INDEX idx_products_website ON products(website_id);

-- =============================================
-- Table: locations
-- =============================================
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  state_region TEXT,
  country TEXT NOT NULL DEFAULT 'MY',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_country ON locations(country);

-- =============================================
-- Table: phone_numbers
-- =============================================
CREATE TABLE phone_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_slug TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  location_slug TEXT,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unique constraint: one number per website + product + location
-- location_slug NULL = fallback entry
CREATE UNIQUE INDEX idx_phone_numbers_unique
  ON phone_numbers (website_slug, product_slug, COALESCE(location_slug, '__default__'));

CREATE INDEX idx_phone_numbers_lookup
  ON phone_numbers (website_slug, product_slug, location_slug);

-- =============================================
-- Updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_websites_updated_at
  BEFORE UPDATE ON websites FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_phone_numbers_updated_at
  BEFORE UPDATE ON phone_numbers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 2. Query Examples

### Location-specific lookup
```sql
SELECT phone_number
FROM phone_numbers
WHERE website_slug = 'oxihome-my'
  AND product_slug = 'oxygen-machine'
  AND location_slug = 'kuala-lumpur'
LIMIT 1;
```

### Fallback (no location)
```sql
SELECT phone_number
FROM phone_numbers
WHERE website_slug = 'oxihome-my'
  AND product_slug = 'oxygen-machine'
  AND location_slug IS NULL
LIMIT 1;
```

### Combined with fallback in one round trip
```sql
SELECT phone_number
FROM phone_numbers
WHERE website_slug = 'oxihome-my'
  AND product_slug = 'oxygen-machine'
  AND (location_slug = 'kuala-lumpur' OR location_slug IS NULL)
ORDER BY location_slug IS NULL ASC
LIMIT 1;
```

---

## 3. Next.js Lib Function — `lib/getPhoneNumber.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WEBSITE_SLUG = "oxihome-my";
const PRODUCT_SLUG = "oxygen-machine";

/**
 * Fetch the phone number for a given location.
 * Fallback chain: location-specific → product default → siteConfig default.
 * Never throws — always returns a valid phone number string.
 */
export async function getPhoneNumber(locationSlug: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, location_slug")
      .eq("website_slug", WEBSITE_SLUG)
      .eq("product_slug", PRODUCT_SLUG)
      .or(`location_slug.eq.${locationSlug},location_slug.is.null`)
      .order("location_slug", { ascending: true, nullsFirst: false })
      .limit(2);

    if (error) {
      console.error("Supabase phone number query error:", error.message);
      return siteConfig.fallbackPhone;
    }

    if (!data || data.length === 0) return siteConfig.fallbackPhone;

    const locationSpecific = data.find((row) => row.location_slug === locationSlug);
    if (locationSpecific) return locationSpecific.phone_number;

    const fallback = data.find((row) => row.location_slug === null);
    if (fallback) return fallback.phone_number;

    return siteConfig.fallbackPhone;
  } catch (err) {
    console.error("Unexpected error fetching phone number:", err);
    return siteConfig.fallbackPhone;
  }
}
```

### Required `config/site.ts`
```typescript
export const siteConfig = {
  name: "Oxihome Malaysia",
  domain: "oxihome.my",
  websiteSlug: "oxihome-my",
  fallbackPhone: "60123456789",
};
```

### Environment variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 4. Seed Data SQL

```sql
-- Website
INSERT INTO websites (slug, domain, brand_name, status)
VALUES ('oxihome-my', 'oxihome.my', 'Oxihome Malaysia', 'active');

-- Product
INSERT INTO products (website_id, product_slug, display_name, description, price_info)
SELECT id, 'oxygen-machine', 'OxiHome Mesin Oksigen', 'Mesin oksigen rumah 5L dengan penghantaran 4 jam',
  '{"rent": "RM250/bulan", "buy": "RM2599", "installment": "RM279x10"}'::jsonb
FROM websites WHERE slug = 'oxihome-my';

-- Locations (all 127)
INSERT INTO locations (slug, display_name, state_region, country) VALUES
  ('sibu', 'Sibu', 'Sarawak', 'MY'),
  ('dungun', 'Dungun', 'Terengganu', 'MY'),
  ('kota-laksamana', 'Kota Laksamana', 'Melaka', 'MY'),
  ('seberang-jaya', 'Seberang Jaya', 'Pulau Pinang', 'MY'),
  ('arau', 'Arau', 'Perlis', 'MY'),
  ('mont-kiara', 'Mont Kiara', 'Kuala Lumpur', 'MY'),
  ('subang-jaya', 'Subang Jaya', 'Selangor', 'MY'),
  ('kuala-krai', 'Kuala Krai', 'Kelantan', 'MY'),
  ('gua-musang', 'Gua Musang', 'Kelantan', 'MY'),
  ('damansara-heights', 'Damansara Heights', 'Kuala Lumpur', 'MY'),
  ('segambut', 'Segambut', 'Kuala Lumpur', 'MY'),
  ('gombak', 'Gombak', 'Selangor', 'MY'),
  ('kuching', 'Kuching', 'Sarawak', 'MY'),
  ('ipoh', 'Ipoh', 'Perak', 'MY'),
  ('rembau', 'Rembau', 'Negeri Sembilan', 'MY'),
  ('shah-alam', 'Shah Alam', 'Selangor', 'MY'),
  ('sarawak', 'Sarawak', 'Sarawak', 'MY'),
  ('bangsar', 'Bangsar', 'Kuala Lumpur', 'MY'),
  ('padang-besar', 'Padang Besar', 'Perlis', 'MY'),
  ('bukit-cina', 'Bukit Cina', 'Melaka', 'MY'),
  ('raub', 'Raub', 'Pahang', 'MY'),
  ('setapak', 'Setapak', 'Kuala Lumpur', 'MY'),
  ('nibong-tebal', 'Nibong Tebal', 'Pulau Pinang', 'MY'),
  ('puchong', 'Puchong', 'Selangor', 'MY'),
  ('bandar-puchong', 'Bandar Puchong', 'Selangor', 'MY'),
  ('kuala-lumpur', 'Kuala Lumpur', 'Kuala Lumpur', 'MY'),
  ('kota-setar', 'Kota Setar', 'Kedah', 'MY'),
  ('perak', 'Perak', 'Perak', 'MY'),
  ('kuala-pilah', 'Kuala Pilah', 'Negeri Sembilan', 'MY'),
  ('mid-valley', 'Mid Valley', 'Kuala Lumpur', 'MY'),
  ('sunway-velocity', 'Sunway Velocity', 'Kuala Lumpur', 'MY'),
  ('jempol', 'Jempol', 'Negeri Sembilan', 'MY'),
  ('kelantan', 'Kelantan', 'Kelantan', 'MY'),
  ('sri-petaling', 'Sri Petaling', 'Kuala Lumpur', 'MY'),
  ('ampang', 'Ampang', 'Selangor', 'MY'),
  ('marang', 'Marang', 'Terengganu', 'MY'),
  ('hulu-langat', 'Hulu Langat', 'Selangor', 'MY'),
  ('george-town', 'George Town', 'Pulau Pinang', 'MY'),
  ('kinta', 'Kinta', 'Perak', 'MY'),
  ('perlis', 'Perlis', 'Perlis', 'MY'),
  ('muar', 'Muar', 'Johor', 'MY'),
  ('pulau-pinang', 'Pulau Pinang', 'Pulau Pinang', 'MY'),
  ('skudai', 'Skudai', 'Johor', 'MY'),
  ('ayer-keroh', 'Ayer Keroh', 'Melaka', 'MY'),
  ('sungai-petani', 'Sungai Petani', 'Kedah', 'MY'),
  ('temerloh', 'Temerloh', 'Pahang', 'MY'),
  ('kemaman', 'Kemaman', 'Terengganu', 'MY'),
  ('sentul', 'Sentul', 'Kuala Lumpur', 'MY'),
  ('cheras', 'Cheras', 'Kuala Lumpur', 'MY'),
  ('taiping', 'Taiping', 'Perak', 'MY'),
  ('klang-valley', 'Klang Valley', 'Selangor', 'MY'),
  ('bandar-utama', 'Bandar Utama', 'Selangor', 'MY'),
  ('melaka', 'Melaka', 'Melaka', 'MY'),
  ('selangor', 'Selangor', 'Selangor', 'MY'),
  ('cameron-highlands', 'Cameron Highlands', 'Pahang', 'MY'),
  ('jerantut', 'Jerantut', 'Pahang', 'MY'),
  ('sungai-buloh', 'Sungai Buloh', 'Selangor', 'MY'),
  ('seri-manjung', 'Seri Manjung', 'Perak', 'MY'),
  ('kuala-perlis', 'Kuala Perlis', 'Perlis', 'MY'),
  ('kuchai-lama', 'Kuchai Lama', 'Kuala Lumpur', 'MY'),
  ('serdang', 'Serdang', 'Selangor', 'MY'),
  ('segamat', 'Segamat', 'Johor', 'MY'),
  ('terengganu', 'Terengganu', 'Terengganu', 'MY'),
  ('machang', 'Machang', 'Kelantan', 'MY'),
  ('miri', 'Miri', 'Sarawak', 'MY'),
  ('manjung', 'Manjung', 'Perak', 'MY'),
  ('sepang', 'Sepang', 'Selangor', 'MY'),
  ('batu-pahat', 'Batu Pahat', 'Johor', 'MY'),
  ('damansara', 'Damansara', 'Selangor', 'MY'),
  ('butterworth', 'Butterworth', 'Pulau Pinang', 'MY'),
  ('kajang', 'Kajang', 'Selangor', 'MY'),
  ('kulim', 'Kulim', 'Kedah', 'MY'),
  ('seremban', 'Seremban', 'Negeri Sembilan', 'MY'),
  ('rawang', 'Rawang', 'Selangor', 'MY'),
  ('johor', 'Johor', 'Johor', 'MY'),
  ('kulai', 'Kulai', 'Johor', 'MY'),
  ('desa-parkcity', 'Desa ParkCity', 'Kuala Lumpur', 'MY'),
  ('bangsar-south', 'Bangsar South', 'Kuala Lumpur', 'MY'),
  ('pahang', 'Pahang', 'Pahang', 'MY'),
  ('putrajaya', 'Putrajaya', 'Putrajaya', 'MY'),
  ('besut', 'Besut', 'Terengganu', 'MY'),
  ('bintulu', 'Bintulu', 'Sarawak', 'MY'),
  ('kangar', 'Kangar', 'Perlis', 'MY'),
  ('jitra', 'Jitra', 'Kedah', 'MY'),
  ('kampar', 'Kampar', 'Perak', 'MY'),
  ('alor-gajah', 'Alor Gajah', 'Melaka', 'MY'),
  ('bukit-bintang', 'Bukit Bintang', 'Kuala Lumpur', 'MY'),
  ('pekan', 'Pekan', 'Pahang', 'MY'),
  ('pantai-dalam', 'Pantai Dalam', 'Kuala Lumpur', 'MY'),
  ('taman-desa', 'Taman Desa', 'Kuala Lumpur', 'MY'),
  ('negeri-sembilan', 'Negeri Sembilan', 'Negeri Sembilan', 'MY'),
  ('petaling-jaya', 'Petaling Jaya', 'Selangor', 'MY'),
  ('seksyen-7', 'Seksyen 7', 'Selangor', 'MY'),
  ('sabah', 'Sabah', 'Sabah', 'MY'),
  ('bandar-baru-bangi', 'Bandar Baru Bangi', 'Selangor', 'MY'),
  ('kuantan', 'Kuantan', 'Pahang', 'MY'),
  ('bukit-mertajam', 'Bukit Mertajam', 'Pulau Pinang', 'MY'),
  ('setiawangsa', 'Setiawangsa', 'Kuala Lumpur', 'MY'),
  ('sungai-dua', 'Sungai Dua', 'Pulau Pinang', 'MY'),
  ('jasin', 'Jasin', 'Melaka', 'MY'),
  ('tanah-merah', 'Tanah Merah', 'Kelantan', 'MY'),
  ('kota-kinabalu', 'Kota Kinabalu', 'Sabah', 'MY'),
  ('penang', 'Penang', 'Pulau Pinang', 'MY'),
  ('alor-setar', 'Alor Setar', 'Kedah', 'MY'),
  ('sandakan', 'Sandakan', 'Sabah', 'MY'),
  ('kota-bharu', 'Kota Bharu', 'Kelantan', 'MY'),
  ('bahau', 'Bahau', 'Negeri Sembilan', 'MY'),
  ('bangi', 'Bangi', 'Selangor', 'MY'),
  ('kedah', 'Kedah', 'Kedah', 'MY'),
  ('taman-tun-dr.-ismail-(ttdi)', 'Taman Tun Dr. Ismail (TTDI)', 'Kuala Lumpur', 'MY'),
  ('klang', 'Klang', 'Selangor', 'MY'),
  ('johor-bahru', 'Johor Bahru', 'Johor', 'MY'),
  ('old-klang-road', 'Old Klang Road', 'Kuala Lumpur', 'MY'),
  ('langkawi', 'Langkawi', 'Kedah', 'MY'),
  ('sri-hartamas', 'Sri Hartamas', 'Kuala Lumpur', 'MY'),
  ('tawau', 'Tawau', 'Sabah', 'MY'),
  ('kepong', 'Kepong', 'Kuala Lumpur', 'MY'),
  ('port-dickson', 'Port Dickson', 'Negeri Sembilan', 'MY'),
  ('kuala-terengganu', 'Kuala Terengganu', 'Terengganu', 'MY'),
  ('balik-pulau', 'Balik Pulau', 'Pulau Pinang', 'MY'),
  ('taman-melawati', 'Taman Melawati', 'Selangor', 'MY')
ON CONFLICT (slug) DO NOTHING;

-- Phone numbers: default fallback + 10 location-specific examples
INSERT INTO phone_numbers (website_slug, product_slug, location_slug, phone_number)
VALUES ('oxihome-my', 'oxygen-machine', NULL, '60123456789');

INSERT INTO phone_numbers (website_slug, product_slug, location_slug, phone_number) VALUES
  ('oxihome-my', 'oxygen-machine', 'kuala-lumpur', '60111234001'),
  ('oxihome-my', 'oxygen-machine', 'petaling-jaya', '60111234002'),
  ('oxihome-my', 'oxygen-machine', 'shah-alam', '60111234003'),
  ('oxihome-my', 'oxygen-machine', 'johor-bahru', '60111234004'),
  ('oxihome-my', 'oxygen-machine', 'george-town', '60111234005'),
  ('oxihome-my', 'oxygen-machine', 'ipoh', '60111234006'),
  ('oxihome-my', 'oxygen-machine', 'kuching', '60111234007'),
  ('oxihome-my', 'oxygen-machine', 'kota-kinabalu', '60111234008'),
  ('oxihome-my', 'oxygen-machine', 'melaka', '60111234009'),
  ('oxihome-my', 'oxygen-machine', 'seremban', '60111234010');
```

---

## 5. RLS Policy SQL

```sql
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

-- Public read on phone_numbers
CREATE POLICY "Allow public read access on phone_numbers"
  ON phone_numbers FOR SELECT USING (true);

-- Public read on locations
CREATE POLICY "Allow public read access on locations"
  ON locations FOR SELECT USING (true);

-- Public read on websites
CREATE POLICY "Allow public read access on websites"
  ON websites FOR SELECT USING (true);

-- Public read on products
CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE blocked for anon key by default.
-- Admin operations use service_role key or Supabase dashboard.
```

---

## 6. Supabase Client — `lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 7. Architecture Notes

### Fallback Chain
1. **Location-specific** — `WHERE location_slug = 'kuala-lumpur'`
2. **Product default** — `WHERE location_slug IS NULL`
3. **siteConfig default** — Hardcoded in `config/site.ts` (never fails)

### Multi-Tenancy
`phone_numbers` uses `website_slug` as a text field for fast lookups without JOINs. Scales to 100+ websites.

### Webhook for On-Demand Revalidation
```
POST https://oxihome.my/api/revalidate?secret=SECRET&path=/en/oxygen-machine/kuala-lumpur
```
Configure as a Supabase Database Webhook on `phone_numbers` UPDATE events.
