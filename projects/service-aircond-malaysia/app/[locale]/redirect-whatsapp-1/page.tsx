import { Metadata } from 'next'
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import RedirectClient from './RedirectClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ location?: string; message?: string }>
}

export default async function RedirectWhatsAppPage({ searchParams }: Props) {
  const { location, message } = await searchParams
  const { phone, whatsappText } = await getPhoneNumber(location)
  const url = waLink(phone, message ?? whatsappText)

  return <RedirectClient url={url} />
}
