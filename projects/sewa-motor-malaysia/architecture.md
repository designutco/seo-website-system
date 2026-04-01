# Sewa Motor Malaysia — System Architecture

**Brand:** Sewa Motor Malaysia
**Domain:** sewamotor.my
**Target country:** Malaysia
**Languages:** English (en), Mandarin Chinese (zh)
**Primary product slug:** sewa-motor
**Deployment:** Vercel
**CTA:** WhatsApp only (dynamic phone numbers from Supabase)

---

## 1. Folder & Routing Structure

```
sewa-motor-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Root layout with locale context
│   │   ├── page.tsx                # Homepage
│   │   └── sewa-motor/
│   │       └── [location]/
│   │           └── page.tsx        # Location page
│   ├── layout.tsx                  # Root HTML layout (lang attribute)
│   ├── globals.css                 # Global styles
│   ├── icon.svg                    # Favicon
│   ├── robots.ts                   # Robots.txt generation
│   ├── sitemap.ts                  # Sitemap generation
│   └── not-found.tsx               # 404 page
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── ProductCard.tsx
│   ├── LocationListing.tsx
│   ├── WhatsAppButton.tsx
│   ├── FAQSection.tsx
│   ├── LanguageSwitcher.tsx
│   └── SchemaMarkup.tsx
├── config/
│   ├── locations.ts                # All 128 location slugs, display names, states
│   ├── products.ts                 # Product data (6 motorcycles, prices, badges)
│   └── site.ts                     # Site-wide config (domain, brand, WhatsApp defaults)
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── getPhoneNumber.ts           # Fetch phone number by website + product + location
│   └── i18n.ts                     # next-intl configuration
├── messages/
│   ├── en.json                     # English translations
│   └── zh.json                     # Mandarin Chinese translations
├── middleware.ts                    # Locale detection and redirect
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Route Table

| Route Pattern | Page |
|---|---|
| `/` | Redirects to `/en` (or detected locale) |
| `/[locale]` | Homepage |
| `/[locale]/sewa-motor/[location]` | Location page |

Middleware handles locale detection (Accept-Language header, cookie, default to `en`) and redirects bare `/` to the appropriate locale prefix. Only `en` and `zh` are valid locale values.

---

## 2. Page Inventory

### Homepage (`/[locale]`)
- 2 variants: `/en`, `/zh`
- Sections: Hero, Products (all 6 motorcycles with pricing tiers), Location listing (128 locations), WhatsApp CTA, FAQ
- Location listing displayed directly on homepage (no separate hub page)

### Location Pages (`/[locale]/sewa-motor/[location]`)
- 128 locations x 2 languages = **256 location pages**
- Layout mirrors homepage; only copy differs per location
- Each page has unique introduction, location-specific keywords, FAQ, and WhatsApp CTA with dynamic phone number
- All 6 motorcycle products displayed with daily/weekly/monthly pricing

### Complete Location List (128)

Same list as oxihome-malaysia, covering all Malaysian states:

sibu, dungun, kota-laksamana, seberang-jaya, arau, mont-kiara, subang-jaya, kuala-krai, gua-musang, damansara-heights, segambut, gombak, kuching, ipoh, rembau, shah-alam, sarawak, bangsar, padang-besar, bukit-cina, raub, setapak, nibong-tebal, puchong, bandar-puchong, kuala-lumpur, kota-setar, perak, kuala-pilah, mid-valley, sunway-velocity, jempol, kelantan, sri-petaling, ampang, marang, hulu-langat, george-town, kinta, perlis, muar, pulau-pinang, skudai, ayer-keroh, sungai-petani, temerloh, kemaman, sentul, cheras, taiping, klang-valley, bandar-utama, melaka, selangor, cameron-highlands, jerantut, sungai-buloh, seri-manjung, kuala-perlis, kuchai-lama, serdang, segamat, terengganu, machang, miri, manjung, sepang, batu-pahat, damansara, butterworth, kajang, kulim, seremban, rawang, johor, kulai, desa-parkcity, bangsar-south, pahang, putrajaya, besut, bintulu, kangar, jitra, kampar, alor-gajah, bukit-bintang, pekan, pantai-dalam, taman-desa, negeri-sembilan, petaling-jaya, seksyen-7, sabah, bandar-baru-bangi, kuantan, bukit-mertajam, setiawangsa, sungai-dua, jasin, tanah-merah, kota-kinabalu, penang, alor-setar, sandakan, kota-bharu, bahau, bangi, kedah, taman-tun-dr.-ismail-(ttdi), klang, johor-bahru, old-klang-road, langkawi, sri-hartamas, tawau, kepong, port-dickson, kuala-terengganu, balik-pulau, taman-melawati, cyberjaya

### Total Page Count
- 2 homepage variants
- 256 location page variants
- **258 pages total**

---

## 3. Data Flow

### Phone Numbers (Supabase)
1. Each location page calls `getPhoneNumber(website, product, location)` at build time
2. Query: `SELECT phone_number FROM phone_numbers WHERE website_slug = 'sewamotor-my' AND product_slug = 'sewa-motor' AND location_slug = :location AND is_active = true`
3. Multiple phone numbers may exist per location; one is selected at random on each WhatsApp button click (client-side)
4. Phone number is injected into the WhatsApp CTA button URL: `https://wa.me/{phone_number}`
5. Fallback chain: location-specific number -> product-specific default -> website-level default

### Static Generation (generateStaticParams)
All 256 location pages are statically generated at build time via `generateStaticParams()` returning all locale x location combinations.

### Translations (next-intl)
- Translation files in `messages/en.json`, `messages/zh.json`
- `next-intl` middleware detects locale from URL path (`/en/`, `/zh/`)
- All static text pulled from translation files
- Location-specific copy stored in translation files keyed by location slug

### ISR Revalidation
- `revalidate = 3600` (1 hour) on location pages — phone numbers may change
- Homepage: `revalidate = 86400` (24 hours)
- On-demand revalidation endpoint for Supabase webhook when phone numbers are updated

---

## 4. Database Requirements

Cyclops needs to build (using shared Supabase instance):

### Tables Required

1. **phone_numbers** — Maps phone numbers to website + product + location. Fields: website_slug, product_slug, location_slug, phone_number, is_active. Multiple numbers per combination allowed (random rotation). Fallback to website-level default when no location-specific number exists.

2. **websites** — Registry of all websites. Fields: slug (`sewamotor-my`), domain (`sewamotor.my`), brand name, status. This table is shared across projects; add a new row for sewamotor-my.

3. **products** — Product catalog per website. Fields: website reference, product_slug, display name, pricing info. Seed with all 6 motorcycles and their daily/weekly/monthly rates.

4. **locations** — Location registry (shared across websites). Fields: slug, display name, state/region, country. Same 128 locations as oxihome-my; no new rows needed if already seeded.

### Key Requirements
- RLS enabled — public read access for phone_numbers
- Index on phone_numbers for triple-key lookup (website_slug, product_slug, location_slug)
- Seed data: register `sewamotor-my` as a website, add 6 products, link 128 locations
- Phone number rotation: multiple active numbers per (website, product, location); random selection happens client-side

---

## 5. SEO Structure

Sora needs to plan:

### Keyword Targets
- **Primary (EN):** "motor rental Malaysia", "sewa motor Malaysia", "motorcycle rental Malaysia"
- **Primary (ZH):** "马来西亚摩托车出租", "马来西亚租摩托"
- **Product keywords:** Honda Vario rental, Yamaha NMax rental, PCX rental, scooter rental Malaysia, motorbike hire Malaysia
- **Location modifier:** "motor rental {location}", "sewa motor {location}" for each of 128 locations
- **Intent:** rent motorcycle, daily motorcycle rental, weekly motor rental, cheap motor rental, budget motorcycle hire

### Page Hierarchy
Flat — homepage is the hub, location pages are spokes:
```
/ (homepage)  ->  /sewa-motor/[location]  (128 pages)
```

### Internal Linking
- Homepage -> all 128 location pages via location grid
- Each location page -> 3-5 geographically nearby location pages
- Footer -> top 6 locations (KL, PJ, Shah Alam, JB, George Town, Ipoh)
- Breadcrumbs on location pages: Home -> City

### hreflang
Every page includes hreflang for both locales + x-default pointing to English:
- `en` -> `/en/...`
- `zh` -> `/zh/...`
- `x-default` -> `/en/...`

### Per-Page SEO
- Unique meta title and description per location per language
- H1 includes location name + primary keyword
- Schema: LocalBusiness, FAQPage, BreadcrumbList, Product
- Unique introductory paragraph per location (no duplicate content)
- Product schema for each motorcycle with pricing (daily, weekly, monthly)

---

## 6. i18n Requirements

### Confirmed Languages
| Language | Locale Code | URL Prefix |
|---|---|---|
| English | `en` | `/en` |
| Mandarin Chinese | `zh` | `/zh` |

**Note:** Bahasa Melayu (`ms`) is explicitly excluded from this project.

### Implementation
- **Library:** next-intl
- **Routing:** Locale prefix in URL path
- **Default locale:** `en` (x-default hreflang + redirect from `/`)
- **Locale detection:** Accept-Language header -> cookie -> default `en`
- **Valid locales:** `['en', 'zh']` only

### Language Switcher
- In header on all pages
- Switches locale while preserving current page path
- Example: `/en/sewa-motor/kuala-lumpur` -> `/zh/sewa-motor/kuala-lumpur`

### Translation Scope
- All UI strings (header, footer, buttons, labels)
- Product names and descriptions
- Location-specific copy (introductions, FAQs)
- Meta titles and descriptions
- WhatsApp pre-filled messages

---

## 7. Technical Decisions

| Technology | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG + ISR, nested layouts |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Database | Supabase (shared instance) | Multi-tenant, RLS, shared across websites |
| i18n | next-intl | Best App Router integration |
| Deployment | Vercel | Native Next.js support |

### Key Architectural Decisions

1. **Static generation** — All 258 pages pre-rendered at build time. ISR handles phone number updates.
2. **Locale in URL path** — `/en/`, `/zh/` keeps SEO authority on one domain.
3. **No product hub page** — All 6 motorcycles displayed on homepage and location pages directly. No separate `/sewa-motor` index page.
4. **Location page mirrors homepage layout** — Same sections (hero, products, FAQ, CTA), only copy and phone numbers differ per location.
5. **WhatsApp-only CTA** — All CTAs route to `wa.me/{phone}` with pre-filled message. No booking system.
6. **Phone number rotation** — Multiple active numbers per location; random selection on click (client-side). Supabase returns all active numbers, JS picks one at random.
7. **Supabase fallback chain** — Location-specific -> product-specific -> website default.
8. **2 languages only** — English and Mandarin Chinese. No Bahasa Melayu for this project.
9. **6 motorcycle products** — Each with daily/weekly/monthly pricing and a badge (Most Popular, Best Value, Budget Pick).
10. **Same location list as oxihome** — 128 locations across all Malaysian states, reusing the shared location registry in Supabase.
11. **SVG logo** — Inline SVG icon + brand text in header (no external image dependency).
12. **Hero floating animation** — Product image has CSS floating animation with decorative elements.
13. **Dark sections use image backgrounds** — With dark overlay, not flat solid colors.

### Blockers / Notes

- **No blockers identified.** All inputs are provided.
- Brand colors are TBD by the design/frontend agent. Suggested direction: bold red/black or orange/dark theme appropriate for a motorcycle rental brand.
- Product data (6 motorcycles) uses placeholder pricing; to be updated with real data when available.
- The `sewamotor-my` website entry must be added to the shared Supabase `websites` table before phone numbers can be seeded.
