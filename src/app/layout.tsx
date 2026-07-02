import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { AdminProvider } from '@/components/admin-provider'
import { AudioProvider } from '@/components/audio-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sanatansetu.example'),
  title: {
    default: 'Sanatan Setu — Hinduism Religious Content Library',
    template: '%s · Sanatan Setu',
  },
  description:
    'A sacred digital library to upload, preserve, and explore Hindu religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and more.',
  keywords: [
    'Hinduism',
    'Sanatan Dharma',
    'Vedas',
    'Upanishads',
    'Bhagavad Gita',
    'Mantras',
    'Bhajans',
    'Ramayana',
    'Mahabharata',
    'Puranas',
    'Sanskrit',
    'Spiritual Library',
  ],
  authors: [{ name: 'Sanatan Setu' }],
  creator: 'Sanatan Setu',
  openGraph: {
    title: 'Sanatan Setu — Bridge to Eternal Wisdom',
    description:
      'A sacred digital library of Hinduism religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and the teachings of the saints.',
    siteName: 'Sanatan Setu',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanatan Setu — Bridge to Eternal Wisdom',
    description:
      'A sacred digital library of Hinduism religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AdminProvider>
              <AudioProvider>
                {children}
                <Toaster position="top-center" richColors closeButton />
              </AudioProvider>
            </AdminProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
