# Oxihome Malaysia — System Architecture

**Brand:** Oxihome Malaysia
**Domain:** oxihome.my
**Target country:** Malaysia
**Languages:** English (en), Bahasa Melayu (ms), Mandarin Chinese (zh)
**Primary product slug:** oxygen-machine
**Deployment:** Vercel
**CTA:** WhatsApp only (dynamic phone numbers from Supabase)

---

## 1. Folder & Routing Structure

```
oxihome-malaysia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Root layout with locale context
│   │   ├── page.tsx                # Homepage
│   │   └── oxygen-machine/
│   │       └── [location]/
│   │           └── page.tsx        # Location page
│   ├── layout.tsx                  # Root HTML layout (lang attribute)
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
│   ├── locations.ts                # All 127 location slugs and display names
│   ├── products.ts                 # Product data (names, prices, descriptions)
│   └── site.ts                     # Site-wide config (domain, brand, WhatsApp defaults)
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── getPhoneNumber.ts           # Fetch phone number by website + product + location
│   └── i18n.ts                     # next-intl configuration
├── messages/
│   ├── en.json                     # English translations
│   ├── ms.json                     # Bahasa Melayu translations
│   └── zh.json                     # Mandarin Chinese translations
├── middleware.ts                    # Locale detection and redirect
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

### Route Table

| Route Pattern | Page |
|---|---|
| `/` | Redirects to `/en` (or detected locale) |
| `/[locale]` | Homepage |
| `/[locale]/oxygen-machine/[location]` | Location page |

Middleware handles locale detection (Accept-Language header, cookie, default to `en`) and redirects bare `/` to the appropriate locale prefix.

---

## 2. Page Inventory

### Homepage (`/[locale]`)
- 3 variants: `/en`, `/ms`, `/zh`
- Sections: Hero, Products (all 4), Location listing (127 locations), WhatsApp CTA, FAQ
- Location listing displayed directly on homepage (no separate hub page)

### Location Pages (`/[locale]/oxygen-machine/[location]`)
- 127 locations × 3 languages = **381 location pages**
- Layout mirrors homepage; only copy differs per location
- Each page has unique introduction, location-specific keywords, FAQ, and WhatsApp CTA with dynamic phone number

### Complete Location List (127)

sibu, dungun, kota-laksamana, seberang-jaya, arau, mont-kiara, subang-jaya, kuala-krai, gua-musang, damansara-heights, segambut, gombak, kuching, ipoh, rembau, shah-alam, sarawak, bangsar, padang-besar, bukit-cina, raub, setapak, nibong-tebal, puchong, bandar-puchong, kuala-lumpur, kota-setar, perak, kuala-pilah, mid-valley, sunway-velocity, jempol, kelantan, sri-petaling, ampang, marang, hulu-langat, george-town, kinta, perlis, muar, pulau-pinang, skudai, ayer-keroh, sungai-petani, temerloh, kemaman, sentul, cheras, taiping, klang-valley, bandar-utama, melaka, selangor, cameron-highlands, jerantut, sungai-buloh, seri-manjung, kuala-perlis, kuchai-lama, serdang, segamat, terengganu, machang, miri, manjung, sepang, batu-pahat, damansara, butterworth, kajang, kulim, seremban, rawang, johor, kulai, desa-parkcity, bangsar-south, pahang, putrajaya, besut, bintulu, kangar, jitra, kampar, alor-gajah, bukit-bintang, pekan, pantai-dalam, taman-desa, negeri-sembilan, petaling-jaya, seksyen-7, sabah, bandar-baru-bangi, kuantan, bukit-mertajam, setiawangsa, sungai-dua, jasin, tanah-merah, kota-kinabalu, penang, alor-setar, sandakan, kota-bharu, bahau, bangi, kedah, taman-tun-dr.-ismail-(ttdi), klang, johor-bahru, old-klang-road, langkawi, sri-hartamas, tawau, kepong, port-dickson, kuala-terengganu, balik-pulau, taman-melawati

### Total Page Count
- 3 homepage variants
- 381 location page variants
- **384 pages total**

---

## 3. Data Flow

### Phone Numbers (Supabase)
1. Each location page calls `getPhoneNumber(website, product, location)` at build time
2. Query: `SELECT phone_number FROM phone_numbers WHERE website_slug = 'oxihome-my' AND product_slug = 'oxygen-machine' AND location_slug = :location`
3. Phone number is injected into the WhatsApp CTA button URL: `https://wa.me/{phone_number}`
4. Fallback: if no location-specific number exists, use the default number for the website

### Static Generation (generateStaticParams)
All 381 location pages are statically generated at build time via `generateStaticParams()` returning all locale × location combinations.

### Translations (next-intl)
- Translation files in `messages/en.json`, `messages/ms.json`, `messages/zh.json`
- `next-intl` middleware detects locale from URL path (`/en/`, `/ms/`, `/zh/`)
- All static text pulled from translation files
- Location-specific copy stored in translation files keyed by location slug

### ISR Revalidation
- `revalidate = 3600` (1 hour) on location pages — phone numbers may change
- Homepage: `revalidate = 86400` (24 hours)
- On-demand revalidation endpoint for Supabase webhook when phone numbers are updated

---

## 4. Database Requirements

Cyclops needs to build:

### Tables Required

1. **phone_numbers** — Maps a phone number to website + product + location. Fields: website_slug, product_slug, location_slug, phone_number. Unique constraint on all three. Fallback to website-level default.

2. **websites** — Registry of all websites. Fields: slug (`oxihome-my`), domain, brand name, status.

3. **products** — Product catalog per website. Fields: website reference, product_slug, display name, pricing info.

4. **locations** — Location registry. Fields: slug, display name, state/region, country.

### Key Requirements
- RLS enabled — public read access for phone_numbers
- Unique constraint on (website_slug, product_slug, location_slug)
- Index on phone_numbers for triple-key lookup
- Seed data: all 127 locations for oxihome-my with oxygen-machine product

---

## 5. SEO Structure

Sora needs to plan:

### Keyword Targets
- **Primary:** "oxygen machine Malaysia" / "mesin oksigen Malaysia" / "氧气机马来西亚"
- **Product:** oxygen concentrator, emergency oxygen tank, oximeter, oxygen rental Malaysia
- **Location modifier:** "oxygen machine {location}" for each of 127 locations
- **Intent:** rent oxygen machine, buy oxygen machine, 4-hour delivery oxygen

### Page Hierarchy
Flat — homepage is the hub, location pages are spokes:
```
/ (homepage)  →  /oxygen-machine/[location]  (127 pages)
```

### Internal Linking
- Homepage → all 127 location pages via location grid
- Each location page → 3–5 geographically nearby location pages
- Footer → top 6 locations
- Breadcrumbs on location pages: Home → City

### hreflang
Every page includes hreflang for all 3 locales + x-default pointing to English.

### Per-Page SEO
- Unique meta title and description per location per language
- H1 includes location name + primary keyword
- Schema: LocalBusiness, FAQPage, BreadcrumbList
- Unique introductory paragraph per location (no duplicate content)

---

## 6. i18n Requirements

### Confirmed Languages
| Language | Locale Code | URL Prefix |
|---|---|---|
| English | `en` | `/en` |
| Bahasa Melayu | `ms` | `/ms` |
| Mandarin Chinese | `zh` | `/zh` |

### Implementation
- **Library:** next-intl
- **Routing:** Locale prefix in URL path
- **Default locale:** `en` (x-default hreflang + redirect from `/`)
- **Locale detection:** Accept-Language header → cookie → default `en`

### Language Switcher
- In header on all pages
- Switches locale while preserving current page path
- Example: `/en/oxygen-machine/kuala-lumpur` → `/zh/oxygen-machine/kuala-lumpur`

---

## 7. Technical Decisions

| Technology | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG + ISR, nested layouts |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Database | Supabase | Multi-tenant, RLS, shared across websites |
| i18n | next-intl | Best App Router integration |
| Deployment | Vercel | Native Next.js support |

### Key Architectural Decisions

1. **Static generation** — All 384 pages pre-rendered at build time. ISR handles phone number updates.
2. **Locale in URL path** — `/en/`, `/ms/`, `/zh/` keeps SEO authority on one domain.
3. **No product hub page** — Location listing on homepage directly.
4. **Location page mirrors homepage layout** — Same sections, only copy and phone numbers differ.
5. **WhatsApp-only CTA** — All CTAs route to `wa.me/{phone}` with pre-filled message.
6. **Supabase fallback chain** — Location-specific → product-specific → website default.
7. **4-hour delivery messaging** — Prominent throughout as key differentiator.
8. **SVG logo** — Inline SVG icon + brand text in header (no flat CDN image).
9. **Hero floating animation** — Product image has CSS floating animation with decorative orbs, rings, dots.
10. **Dark sections use image backgrounds** — With dark overlay, not flat solid colors.
