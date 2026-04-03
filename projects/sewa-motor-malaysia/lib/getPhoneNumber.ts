import { createClient } from '@supabase/supabase-js'

const WEBSITE_SLUG = 'sewamotor-my'
const PRODUCT_SLUG = 'sewa-motor'
const FALLBACK_PHONE = '60123456789'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface PhoneRow {
  phone_number: string
  label: string | null
}

export interface PhoneResult {
  phones: string[]
  source: 'location' | 'product' | 'fallback'
}

export async function getPhoneNumbers(locationSlug: string): Promise<PhoneResult> {
  try {
    const { data: locationPhones, error: locError } = await supabase
      .from('phone_numbers')
      .select('phone_number, label')
      .eq('website_slug', WEBSITE_SLUG)
      .eq('product_slug', PRODUCT_SLUG)
      .eq('location_slug', locationSlug)
      .eq('is_active', true)

    if (!locError && locationPhones && locationPhones.length > 0) {
      return {
        phones: locationPhones.map((r: PhoneRow) => r.phone_number),
        source: 'location',
      }
    }

    const { data: productPhones, error: prodError } = await supabase
      .from('phone_numbers')
      .select('phone_number, label')
      .eq('website_slug', WEBSITE_SLUG)
      .eq('product_slug', PRODUCT_SLUG)
      .is('location_slug', null)
      .eq('is_active', true)

    if (!prodError && productPhones && productPhones.length > 0) {
      return {
        phones: productPhones.map((r: PhoneRow) => r.phone_number),
        source: 'product',
      }
    }

    return { phones: [FALLBACK_PHONE], source: 'fallback' }
  } catch {
    return { phones: [FALLBACK_PHONE], source: 'fallback' }
  }
}

export function getRandomPhone(phones: string[]): string {
  if (!phones || phones.length === 0) return FALLBACK_PHONE
  return phones[Math.floor(Math.random() * phones.length)]
}

export async function getPhoneNumber(locationSlug: string): Promise<string> {
  const result = await getPhoneNumbers(locationSlug)
  return getRandomPhone(result.phones)
}
