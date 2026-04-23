import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/lib/providers/query-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Fédération Shaolin Sénégal',
    template: '%s | Fédération Shaolin Sénégal',
  },
  description: 'Fédération officielle des arts martiaux Shaolin au Sénégal. Découvrez nos clubs, compétitions et rejoignez notre communauté de pratiquants.',
  keywords: ['shaolin', 'kung fu', 'wushu', 'arts martiaux', 'sénégal', 'tai chi', 'fédération'],
  authors: [{ name: 'Fédération Shaolin Sénégal' }],
  creator: 'Fédération Shaolin Sénégal',
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: 'Fédération Shaolin Sénégal',
    title: 'Fédération Shaolin Sénégal',
    description: 'Fédération officielle des arts martiaux Shaolin au Sénégal.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fédération Shaolin Sénégal',
    description: 'Fédération officielle des arts martiaux Shaolin au Sénégal.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#1E3A5F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
