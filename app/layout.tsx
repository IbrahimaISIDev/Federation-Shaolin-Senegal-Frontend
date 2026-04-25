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
    default: 'ADSS — Disciples Shaolin Si Sénégal',
    template: '%s | ADSS Sénégal',
  },
  description:
    "L'Association Disciples Shaolin Si Sénégal (ADSS) — association nationale reconnue par le Ministère de l'Intérieur, dédiée à la promotion du Shaolin au Sénégal.",
  keywords: ['shaolin', 'kung fu', 'wushu', 'arts martiaux', 'sénégal', 'tai chi', 'ADSS', 'disciples shaolin', 'shaolin si'],
  authors: [{ name: 'Association Disciples Shaolin Si Sénégal' }],
  creator: 'ADSS — Disciples Shaolin Si Sénégal',
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: 'ADSS — Disciples Shaolin Si Sénégal',
    title: 'ADSS — Disciples Shaolin Si Sénégal',
    description: "Association Disciples Shaolin Si Sénégal — arts martiaux Shaolin officiels au Sénégal.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADSS — Disciples Shaolin Si Sénégal',
    description: "Association Disciples Shaolin Si Sénégal — arts martiaux Shaolin officiels au Sénégal.",
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
