import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Professional Aircond Service Malaysia | Encik Beku',
  description:
    'From Kuala Lumpur to Kota Kinabalu — Encik Beku sends certified technicians to your door. Fast response. Fair price. Quality guaranteed.',
  metadataBase: new URL('https://serviceaircond.my'),
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://serviceaircond.my',
    siteName: 'Encik Beku',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
