import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://mergephotosonline.com'),
  title: {
    default: 'Merge Photos Online Free - Combine Multiple Images into One | AI Photo Merger',
    template: '%s | Merge Photos Online'
  },
  description: 'Merge photos online free - Combine multiple photos into one frame online. Free AI photo merger tool to merge photos together, merge photos to PDF, merge photos in one frame. No registration required. 100% free and secure.',
  keywords: [
    'merge photos online',
    'merge photos online free',
    'merge photos online free ai',
    'merge photos online ai',
    'merge photos online to pdf',
    'merge photos online jpg',
    'merge photos online free with size',
    'merge photos online into one',
    'how to merge photos together online',
    'how to merge multiple photos into one online',
    'merge photos in one frame online',
    'merge photos together online free',
    'merge photos iphone online',
    'merge photos to pdf online',
    'merge photos into one online',
    'merge photos and videos online',
    'merge photos to panorama online',
    'merge photos to make video online',
    'merge photo online',
    'merge photo online free',
    'merge photo online ai',
    'merge photo online jpg',
    'merge photo online pdf',
    'merge photo online in one frame',
    'merge photo online editor',
    'merge photo online converter',
    'merge photo online ai free',
    'merge photos online with effects',
    'combine photos online',
    'photo merger',
    'image combiner',
    'photo collage maker',
    'merge images online',
    'combine images online'
  ].join(', '),
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
    title: 'Merge Photos Online Free - Combine Multiple Images into One',
    description: 'Free online tool to merge photos together. Combine multiple photos into one frame, merge photos to PDF, merge photos with AI. No registration required.',
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
    title: 'Merge Photos Online Free - Combine Multiple Images',
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

