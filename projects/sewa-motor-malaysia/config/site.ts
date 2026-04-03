const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'sewamotor.my'

export const siteConfig = {
  name: 'Sewa Motor Malaysia',
  brandName: 'Sewa Motor Malaysia',
  domain,
  baseUrl: `https://${domain}`,
  siteUrl: `https://${domain}`,
  fallbackPhone: '60123456789',
  defaultWhatsApp: 'https://wa.me/60123456789',
}
