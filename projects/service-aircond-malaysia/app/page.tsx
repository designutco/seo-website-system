'use client'

import { useState, useEffect, useRef } from 'react'

/* ── SVG Icons ── */
const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

const SnowflakeIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" aria-hidden="true">
    <path d="M16 4v24M16 4l-4 4M16 4l4 4M16 28l-4-4M16 28l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 16h24M4 16l4-4M4 16l4 4M28 16l-4-4M28 16l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M7.76 7.76l16.48 16.48M7.76 7.76l1.06 5.47M7.76 7.76l5.47 1.06M24.24 24.24l-1.06-5.47M24.24 24.24l-5.47-1.06" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24.24 7.76L7.76 24.24M24.24 7.76l-5.47 1.06M24.24 7.76l-1.06 5.47M7.76 24.24l5.47-1.06M7.76 24.24l1.06-5.47" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="16" r="2.5" fill="white" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="var(--brand-orange)" fillOpacity="0.15" />
    <path d="M6 10l3 3 5-5" stroke="var(--brand-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-hidden="true" style={{ color: '#FFB800' }}>
    <path d="M8 1l1.854 4.146H14l-3.382 2.708 1.236 4.146L8 9.708l-3.854 2.292 1.236-4.146L2 5.146h4.146L8 1z" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    className="w-5 h-5 shrink-0 transition-transform duration-300"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--brand-orange)' }}
    fill="none"
    aria-hidden="true"
  >
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Location data ── */
const regions = [
  {
    name: 'Klang Valley',
    cities: ['Kuala Lumpur', 'Petaling Jaya', 'Shah Alam', 'Subang Jaya', 'Cheras', 'Ampang', 'Puchong', 'Bangsar', 'Damansara', 'Cyberjaya', 'Putrajaya', 'Kajang', 'Bangi', 'Rawang', 'Klang', 'Setia Alam', 'Kepong'],
  },
  {
    name: 'Northern Malaysia',
    cities: ['Penang', 'Ipoh', 'Alor Setar', 'Sungai Petani', 'Taiping'],
  },
  {
    name: 'Southern Malaysia',
    cities: ['Johor Bahru', 'Melaka', 'Batu Pahat', 'Muar', 'Kluang', 'Skudai', 'Iskandar Puteri'],
  },
  {
    name: 'East Coast',
    cities: ['Kuantan', 'Kota Bharu', 'Kuala Terengganu', 'Temerloh'],
  },
  {
    name: 'East Malaysia',
    cities: ['Kota Kinabalu', 'Kuching', 'Miri', 'Sandakan', 'Sibu'],
  },
]

/* ── Services ── */
const services = [
  {
    title: 'Aircond Servicing',
    desc: 'Regular servicing keeps your aircond running cool and clean. We flush filters, clean coils, check gas levels, and inspect electrical components — so your unit lasts longer and bills stay low.',
    icon: '❄️',
  },
  {
    title: 'Aircond Installation',
    desc: "Getting a new unit? We handle the full installation from start to finish — wall mounting, piping, wiring, and commissioning. Clean workmanship guaranteed with no mess left behind.",
    icon: '🔧',
  },
  {
    title: 'Aircond Repair',
    desc: "Not cooling? Making strange noises? Leaking water? Our technicians diagnose the root cause fast and fix it right the first time. We carry common parts on the van for same-day repairs.",
    icon: '⚡',
  },
  {
    title: 'Chemical Wash',
    desc: "A deep clean that goes beyond the standard service. We disassemble the unit, soak components in chemical solution, and kill bacteria and mould growth — restoring airflow and hygiene.",
    icon: '💧',
  },
]

/* ── Why Choose reasons ── */
const whyReasons = [
  'Certified Technicians — Every technician is SIRIM-trained and background-checked before joining the team.',
  'Same-Day Service — We dispatch within 1 hour of your WhatsApp for urgent jobs across 38 cities.',
  'Transparent Pricing — Get a full quote upfront. No surprise charges, ever.',
  'All Major Brands — Daikin, Panasonic, Midea, York, Sharp, Hisense — we service them all.',
  'Warranty on Work — 30-day workmanship warranty on every service job we complete.',
  'Open 7 Days — We work weekends and public holidays. Your comfort doesn\'t take a day off.',
]

/* ── Reviews ── */
const reviews = [
  {
    name: 'Hasmah Binti Rosli',
    location: 'Shah Alam',
    rating: 5,
    text: 'Servis yang sangat bagus! Technician datang tepat pada masa dan buat kerja dengan bersih. Aircond saya sejuk balik selepas chemical wash. Definitely will call again.',
    initials: 'HR',
  },
  {
    name: 'Kevin Tan',
    location: 'Johor Bahru',
    rating: 5,
    text: "Called at 10am, technician was here by 11:30. Fixed the gas leak and topped up the refrigerant on the spot. Price was fair and he explained everything clearly. Top service.",
    initials: 'KT',
  },
  {
    name: 'Norizan Ahmad',
    location: 'Penang',
    rating: 5,
    text: 'Saya hubungi melalui WhatsApp dan dapat respons dalam masa 10 minit. Servis cepat, bersih dan profesional. Syorkan kepada semua orang di Penang!',
    initials: 'NA',
  },
]

/* ── Stats ── */
const stats = [
  { value: '10,000+', label: 'Customers Served' },
  { value: '1-Hour',  label: 'Response Time' },
  { value: '5-Star',  label: 'Average Rating' },
  { value: '38 Cities', label: 'Covered Across Malaysia' },
]

/* ── Steps ── */
const steps = [
  {
    num: '01',
    title: 'WhatsApp Us',
    desc: 'Send us a message with your location and what service you need. We reply within minutes — no forms, no waiting.',
  },
  {
    num: '02',
    title: 'We Confirm and Dispatch',
    desc: "We'll confirm availability, give you a price estimate, and dispatch a certified technician to your address.",
  },
  {
    num: '03',
    title: 'Job Done',
    desc: 'Your aircond is serviced, repaired, or installed — and we clean up before we leave. Simple.',
  },
]

const WA_NUMBER = '60123456789'
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20need%20aircond%20service`

/* ── Accordion item ── */
function AccordionItem({ region, defaultOpen = false }: { region: typeof regions[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: open ? '1.5px solid var(--brand-orange)' : '1.5px solid var(--brand-border)',
        background: '#fff',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold cursor-pointer"
        style={{
          fontFamily: 'var(--font-heading)',
          color: open ? 'var(--brand-orange)' : 'var(--brand-navy)',
          borderLeft: open ? '4px solid var(--brand-orange)' : '4px solid transparent',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        aria-expanded={open}
      >
        <span>{region.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--brand-text-muted)' }}>{region.cities.length} cities</span>
          <ChevronIcon open={open} />
        </div>
      </button>

      <div
        style={{
          maxHeight: open ? '600px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {region.cities.map(city => (
              <span
                key={city}
                className="text-sm px-3 py-1.5 rounded-lg"
                style={{
                  background: 'var(--brand-orange-xs)',
                  color: 'var(--brand-navy)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Fade-up observer hook ── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function FadeSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useFadeUp()
  return (
    <div
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      {/* ── STICKY NAV ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(27, 58, 92, 0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--brand-orange)' }}
            >
              <SnowflakeIcon />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-xl text-white tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Encik Beku
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                serviceaircond.my
              </span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium" aria-label="Main navigation">
            {[
              { label: 'Services', href: '#services' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Locations', href: '#locations' },
            ].map(link => (
              <a key={link.href} href={link.href} className="nav-link focus:outline-none">
                {link.label}
              </a>
            ))}
          </nav>

          {/* WhatsApp pill */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-opacity hover:opacity-90 active:opacity-80"
            style={{ background: 'var(--wa-green)' }}
          >
            <WAIcon />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      <main>

        {/* ════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1B3A5C 0%, #2A5280 45%, #1B4F72 75%, #2C3E50 100%)',
            minHeight: 'clamp(520px, 85vh, 800px)',
          }}
          aria-label="Hero"
        >
          {/* Decorative orbs */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(232,115,42,0.25) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(126,200,227,0.15) 0%, transparent 70%)',
            }}
          />

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1' fill='white' fill-opacity='0.06'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Content */}
          <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center text-white">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              style={{
                background: 'rgba(232,115,42,0.2)',
                border: '1px solid rgba(232,115,42,0.4)',
                color: 'var(--brand-orange-light)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              Certified Technicians · 38 Cities · Open 7 Days
            </div>

            {/* H1 */}
            <h1
              className="font-extrabold text-white mb-6 leading-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.75rem, 6vw, 5rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Professional Aircond Service{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, var(--brand-orange-light), var(--brand-orange))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Across Malaysia
              </span>
            </h1>

            {/* Sub */}
            <p
              className="text-xl mb-10 mx-auto max-w-2xl"
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.7',
              }}
            >
              From Kuala Lumpur to Kota Kinabalu — Encik Beku sends certified technicians to your door.
              Fast response. Fair price. Quality guaranteed.
            </p>

            {/* CTA */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white focus:outline-none focus:ring-4 focus:ring-green-400 transition-opacity hover:opacity-90 active:opacity-80"
              style={{ background: 'var(--wa-green)', fontFamily: 'var(--font-heading)' }}
            >
              <WAIcon />
              WhatsApp Us Now — It&apos;s Free to Ask
            </a>

            {/* Micro-copy */}
            <p
              className="mt-5 text-sm"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Response within 1 hour · No hidden charges · 7 days a week
            </p>

            {/* Floating snowflake deco */}
            <div
              className="absolute top-12 left-8 opacity-10 pointer-events-none hidden lg:block"
              style={{ fontSize: '6rem' }}
              aria-hidden="true"
            >
              ❄
            </div>
            <div
              className="absolute bottom-12 right-8 opacity-10 pointer-events-none hidden lg:block"
              style={{ fontSize: '4rem' }}
              aria-hidden="true"
            >
              ❄
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 2 — STATS BAR
        ════════════════════════════════ */}
        <section
          aria-label="Statistics"
          style={{ background: 'var(--brand-navy)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <FadeSection key={stat.label} delay={i * 80}>
                  <div
                    className="stat-number text-4xl md:text-5xl mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-sm font-medium uppercase tracking-widest"
                    style={{ color: 'var(--brand-sky)', fontFamily: 'var(--font-body)' }}
                  >
                    {stat.label}
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 3 — SERVICES
        ════════════════════════════════ */}
        <section
          id="services"
          className="dot-texture py-20 px-6"
          style={{ background: 'var(--brand-cream)' }}
          aria-labelledby="services-heading"
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-12">
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-body)' }}
                >
                  Our Services
                </p>
                <h2
                  id="services-heading"
                  className="text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)' }}
                >
                  What We Do
                </h2>
              </div>
            </FadeSection>

            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((svc, i) => (
                <FadeSection key={svc.title} delay={i * 80}>
                  <article className="service-card p-8 h-full">
                    <div className="text-4xl mb-4" aria-hidden="true">{svc.icon}</div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)' }}
                    >
                      {svc.title}
                    </h3>
                    <p style={{ color: 'var(--brand-text-muted)', lineHeight: '1.75' }}>
                      {svc.desc}
                    </p>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 4 — WHY CHOOSE
        ════════════════════════════════ */}
        <section
          id="why-choose"
          className="py-20 px-6"
          style={{ background: '#fff' }}
          aria-labelledby="why-heading"
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-12">
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-body)' }}
                >
                  Why Encik Beku
                </p>
                <h2
                  id="why-heading"
                  className="text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)' }}
                >
                  Why Customers Trust Encik Beku
                </h2>
              </div>
            </FadeSection>

            <div className="grid sm:grid-cols-2 gap-5">
              {whyReasons.map((reason, i) => {
                const [bold, ...rest] = reason.split(' — ')
                return (
                  <FadeSection key={i} delay={i * 60}>
                    <div
                      className="flex gap-4 p-6 rounded-2xl"
                      style={{
                        background: 'var(--brand-cream)',
                        border: '1px solid var(--brand-border)',
                      }}
                    >
                      <CheckIcon />
                      <p style={{ color: 'var(--brand-text)', lineHeight: '1.65' }}>
                        <strong style={{ color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)' }}>
                          {bold}
                        </strong>
                        {rest.length > 0 && <span style={{ color: 'var(--brand-text-muted)' }}> — {rest.join(' — ')}</span>}
                      </p>
                    </div>
                  </FadeSection>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 5 — HOW IT WORKS
        ════════════════════════════════ */}
        <section
          id="how-it-works"
          className="py-20 px-6"
          style={{ background: 'var(--brand-orange-xs)' }}
          aria-labelledby="how-heading"
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-14">
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-body)' }}
                >
                  Simple Process
                </p>
                <h2
                  id="how-heading"
                  className="text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)' }}
                >
                  Three Steps to a Cool Home
                </h2>
              </div>
            </FadeSection>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <FadeSection key={step.num} delay={i * 100}>
                  <div
                    className="relative p-8 rounded-2xl text-center"
                    style={{ background: '#fff', border: '1px solid var(--brand-border)' }}
                  >
                    {/* Step number */}
                    <div
                      className="text-6xl font-extrabold mb-4 leading-none"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--brand-orange)',
                        opacity: 0.2,
                        letterSpacing: '-0.04em',
                      }}
                      aria-hidden="true"
                    >
                      {step.num}
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)' }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ color: 'var(--brand-text-muted)', lineHeight: '1.7' }}>
                      {step.desc}
                    </p>

                    {/* Arrow connector — desktop only */}
                    {i < steps.length - 1 && (
                      <div
                        className="hidden md:block absolute -right-4 top-1/2 text-2xl z-10"
                        style={{ transform: 'translateY(-50%)', color: 'var(--brand-orange)' }}
                        aria-hidden="true"
                      >
                        →
                      </div>
                    )}
                  </div>
                </FadeSection>
              ))}
            </div>

            {/* CTA below steps */}
            <FadeSection>
              <div className="text-center mt-12">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-base font-semibold text-white focus:outline-none focus:ring-4 focus:ring-green-400 transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ background: 'var(--wa-green)', fontFamily: 'var(--font-heading)' }}
                >
                  <WAIcon />
                  Start with Step 1 — WhatsApp Us
                </a>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 6 — REVIEWS
        ════════════════════════════════ */}
        <section
          id="reviews"
          className="py-20 px-6"
          style={{ background: 'var(--brand-navy)' }}
          aria-labelledby="reviews-heading"
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-12">
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--brand-orange-light)', fontFamily: 'var(--font-body)' }}
                >
                  Customer Reviews
                </p>
                <h2
                  id="reviews-heading"
                  className="text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  What Customers Say
                </h2>
              </div>
            </FadeSection>

            {/* Horizontal scroll on mobile, 3-col grid on desktop */}
            <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-2 px-2 md:mx-0 md:px-0">
              {reviews.map((review, i) => (
                <FadeSection key={review.name} delay={i * 100}>
                  <article
                    className="review-card p-7 min-w-72 md:min-w-0 snap-start flex-shrink-0 md:flex-shrink"
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <StarIcon key={j} />
                      ))}
                    </div>

                    {/* Review text */}
                    <blockquote
                      className="text-sm mb-6 leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.82)' }}
                    >
                      &ldquo;{review.text}&rdquo;
                    </blockquote>

                    {/* Reviewer */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: 'var(--brand-orange)',
                          color: '#fff',
                          fontFamily: 'var(--font-heading)',
                        }}
                        aria-hidden="true"
                      >
                        {review.initials}
                      </div>
                      <div>
                        <div
                          className="text-sm font-semibold text-white"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {review.name}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--brand-sky)' }}>
                          {review.location}
                        </div>
                      </div>
                    </div>
                  </article>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 7 — LOCATION GRID
        ════════════════════════════════ */}
        <section
          id="locations"
          className="dot-texture py-20 px-6"
          style={{ background: 'var(--brand-cream)' }}
          aria-labelledby="locations-heading"
        >
          <div className="max-w-6xl mx-auto">
            <FadeSection>
              <div className="text-center mb-12">
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-body)' }}
                >
                  Service Coverage
                </p>
                <h2
                  id="locations-heading"
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)' }}
                >
                  We Cover 38 Cities Across Malaysia
                </h2>
                <p style={{ color: 'var(--brand-text-muted)' }}>
                  From the heart of Kuala Lumpur to Sabah and Sarawak — our technicians are near you.
                </p>
              </div>
            </FadeSection>

            <FadeSection>
              <div className="space-y-3">
                {regions.map((region, i) => (
                  <AccordionItem key={region.name} region={region} defaultOpen={i === 0} />
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 8 — FINAL CTA
        ════════════════════════════════ */}
        <section
          className="py-24 px-6 text-center text-white relative overflow-hidden"
          style={{ background: 'var(--brand-navy)' }}
          aria-label="Call to action"
        >
          {/* Decorative orb */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(232,115,42,0.18) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-3xl mx-auto">
            <FadeSection>
              <h2
                className="font-extrabold mb-5"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                Your Aircond Deserves Better.{' '}
                <span style={{ color: 'var(--brand-orange-light)' }}>So Do You.</span>
              </h2>

              <p
                className="text-xl mb-10"
                style={{ color: 'rgba(255,255,255,0.72)', fontFamily: 'var(--font-body)' }}
              >
                Join 10,000+ customers who trust Encik Beku for fast, professional aircond service
                across Malaysia. WhatsApp us — it&apos;s free to ask.
              </p>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-green-400 transition-opacity hover:opacity-90 active:opacity-80"
                style={{ background: 'var(--wa-green)', fontFamily: 'var(--font-heading)' }}
              >
                <WAIcon />
                WhatsApp Encik Beku Now
              </a>

              <p
                className="mt-5 text-sm"
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
              >
                Response within 1 hour · No hidden charges · 7 days a week
              </p>
            </FadeSection>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer
        className="py-14 px-6"
        style={{ background: '#0F2238' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--brand-orange)' }}
                >
                  <SnowflakeIcon />
                </div>
                <span
                  className="font-bold text-xl text-white tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Encik Beku
                </span>
              </div>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
              >
                Professional aircond servicing, repair, and installation across 38 cities in Malaysia.
                Certified technicians, fair prices, 7 days a week.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: 'var(--wa-green)', fontFamily: 'var(--font-body)' }}
              >
                <WAIcon />
                WhatsApp Us
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: 'var(--brand-orange-light)', fontFamily: 'var(--font-heading)' }}
              >
                Services
              </h3>
              <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {services.map(svc => (
                  <li key={svc.title}>
                    <a href="#services" className="hover:text-white transition-colors">{svc.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: 'var(--brand-orange-light)', fontFamily: 'var(--font-heading)' }}
              >
                Locations
              </h3>
              <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {['Kuala Lumpur', 'Petaling Jaya', 'Shah Alam', 'Penang', 'Johor Bahru'].map(city => (
                  <li key={city}>
                    <a href="#locations" className="hover:text-white transition-colors">{city}</a>
                  </li>
                ))}
                <li>
                  <a href="#locations" className="font-medium transition-colors hover:text-white" style={{ color: 'var(--brand-orange-light)' }}>
                    View all 38 cities →
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
          >
            <p>© {new Date().getFullYear()} Encik Beku · serviceaircond.my</p>
            <div className="flex gap-6">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#locations" className="hover:text-white transition-colors">Locations</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
