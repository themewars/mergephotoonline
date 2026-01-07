import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Merge Images Online - Free Image Merger Tool | Combine Multiple Photos',
  description: 'Merge multiple images online for free. Combine photos horizontally, vertically, or in grid layouts. High-quality image merger with advanced features. No upload required - 100% client-side processing.',
  keywords: 'merge images, combine photos, image merger, photo collage, merge pictures online, image combiner',
  authors: [{ name: 'Merge Photos Online' }],
  openGraph: {
    title: 'Merge Images Online - Free Image Merger Tool',
    description: 'Merge multiple images online for free. Combine photos horizontally, vertically, or in grid layouts.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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

