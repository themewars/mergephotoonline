import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://mergephotosonline.com'),
  title: {
    // Google recommends 50-60 characters for title
    default: 'Merge Photos Online Free | Combine Images into One',
    template: '%s | Merge Photos Online'
  },
  // Google recommends 150-160 characters for description
  description: 'Merge photos online free. Combine multiple photos into one frame, merge photos to PDF, or create photo collages. AI-powered photo merger tool. No registration required.',
  // Note: Google doesn't use meta keywords tag anymore, but keeping for other search engines
  keywords: 'merge photos online, merge photos online free, combine photos, photo merger, merge photos to pdf, photo collage maker',
  authors: [{ name: 'Merge Photos Online' }],
  creator: 'Merge Photos Online',
  publisher: 'Merge Photos Online',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mergephotosonline.com',
    siteName: 'Merge Photos Online',
    // Optimized for social sharing
    title: 'Merge Photos Online Free | Combine Images into One',
    description: 'Free online tool to merge photos together. Combine multiple photos into one frame, merge photos to PDF. No registration required.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Merge Photos Online - Free Photo Merger Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge Photos Online Free | Combine Images',
    description: 'Free online tool to merge photos together. Combine multiple photos into one frame online.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://mergephotosonline.com',
  },
  category: 'Photo Editing Tools',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Merge Photos Online',
    applicationCategory: 'PhotoEditingApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free online tool to merge photos together. Combine multiple photos into one frame, merge photos to PDF, merge photos with AI.',
    url: 'https://mergephotosonline.com',
    featureList: [
      'Merge photos online free',
      'Combine multiple photos into one',
      'Merge photos to PDF',
      'Merge photos in one frame',
      'AI photo merger',
      'Photo collage maker',
      'No registration required',
      '100% free and secure',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  }

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How to merge photos online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply drag and drop your photos or click to select files. Choose merge direction (horizontal, vertical, or grid), customize settings, and download your merged photo. No registration required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is merge photos online free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our photo merger tool is completely free. You can merge unlimited photos without any registration or payment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I merge photos to PDF online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can merge photos and export them in various formats including PDF. Our tool supports multiple export formats.',
        },
      },
      {
        '@type': 'Question',
        name: 'How to merge multiple photos into one online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upload multiple photos, arrange them as desired, choose your merge direction (horizontal or vertical), customize padding and borders, then download your merged image.',
        },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google recommended meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="google-site-verification" content="f3TTs20ycUTUY44H1j8Ezyk-wy_MepIDqlU9H0_Tv3w" />
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

