import { supabase } from './supabase'
import { siteConfig } from '@/config/site'

const WEBSITE_SLUG = 'oxihome-my'
const PRODUCT_SLUG = 'oxygen-machine'

/**
 * Fetch phone number for a location.
 * Fallback chain: location-specific → product default → siteConfig.fallbackPhone
 * Never throws — always returns a valid phone string.
 */
export async function getPhoneNumber(locationSlug: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('phone_numbers')
      .select('phone_number, location_slug')
      .eq('website_slug', WEBSITE_SLUG)
      .eq('product_slug', PRODUCT_SLUG)
      .or(`location_slug.eq.${locationSlug},location_slug.is.null`)
      .order('location_slug', { ascending: true, nullsFirst: false })
      .limit(2)

    if (error) {
      console.error('Supabase phone number query error:', error.message)
      return siteConfig.fallbackPhone
    }

    if (!data || data.length === 0) return siteConfig.fallbackPhone

    const locationSpecific = data.find(row => row.location_slug === locationSlug)
    if (locationSpecific) return locationSpecific.phone_number

    const fallback = data.find(row => row.location_slug === null)
    if (fallback) return fallback.phone_number

    return siteConfig.fallbackPhone
  } catch {
    return siteConfig.fallbackPhone
  }
}

export function waLink(phone: string, message?: string): string {
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${encoded}`
}
