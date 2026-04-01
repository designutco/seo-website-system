export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sewa Motor Malaysia",
    url: "https://sewamotor.my",
    logo: "https://sewamotor.my/logo.png",
    description:
      "Motorcycle rental service across 128 locations in Malaysia. Daily, weekly, and monthly rentals.",
    areaServed: {
      "@type": "Country",
      name: "Malaysia",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
