'use client'

import { MergeTool } from '@/components/MergeTool'
import { ThemeToggle } from '@/components/ThemeToggle'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Square, Check, Users, Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Square className="w-6 h-6 text-primary" />
                  <Square className="w-6 h-6 text-primary -ml-2" />
                </div>
                <span className="text-xl font-bold">Merge Images Online</span>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="container mx-auto px-4 py-8">
            <MergeTool />
          </div>

          {/* Informational Section */}
          <div className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Merge Photos Online Free - Combine Multiple Photos into One</h1>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
                  <strong>Merge photos online free</strong> with our powerful photo merger tool. <strong>Combine multiple photos into one</strong> frame online, merge photos to PDF, or create stunning photo collages. Our <strong>free AI photo merger</strong> lets you merge photos together online without any registration. Whether you want to <strong>merge photos in one frame</strong>, merge photos to panorama, or merge photos with effects - we've got you covered.
                </p>
                <p className="text-muted-foreground text-base max-w-3xl mx-auto">
                  Perfect for designers creating visual presentations, social media managers crafting engaging content, and anyone who wants to <strong>merge multiple photos into one online</strong>. Our tool works on iPhone, Android, and desktop browsers. <strong>Merge photos online free</strong> with size control, merge photos to JPG or PDF format, and download high-quality merged images instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* How It Works */}
                <div>
                  <h2 className="text-2xl font-semibold mb-6">How to Merge Photos Online</h2>
                  <div className="space-y-4">
                    {[
                      'Upload images via drag-and-drop or click to select',
                      'Arrange images as desired - reorder by dragging',
                      'Choose merge direction (horizontal/vertical/grid)',
                      'Customize settings - padding, borders, background',
                      'Preview merged image and download instantly'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Why Choose Our Photo Merger?</h2>
                  <div className="space-y-4">
                    {[
                      '100% Free - Merge photos online free, no registration',
                      'Merge photos in one frame - horizontal, vertical, or grid',
                      'Merge photos to PDF, JPG, PNG, or WebP formats',
                      'AI-powered photo merging with smart resizing',
                      'Customizable padding, borders, and backgrounds',
                      'Works on iPhone, Android, and all desktop browsers',
                      'No upload to server - 100% client-side processing',
                      'High-quality output for social media and printing'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <p className="text-muted-foreground">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Who Can Benefit */}
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-8 text-center">Who Can Benefit</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: Sparkles, title: 'Designers', desc: 'Create visual presentations and mockups' },
                    { icon: Zap, title: 'Social Media Managers', desc: 'Craft engaging content for platforms' },
                    { icon: Users, title: 'Everyone', desc: 'Make impressive image composites easily' }
                  ].map((item, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
                      <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Ready to Merge Photos Online?</h2>
                <p className="mb-6 opacity-90">
                  Start merging your photos online free - combine multiple photos into one, merge photos to PDF, or create stunning collages. No design skills required!
                </p>
                <a
                  href="#top"
                  className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-colors"
                >
                  Merge Photos Now - 100% Free
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-2">Image Merger</h4>
                <p className="text-sm text-muted-foreground">
                  Create stunning image composites with ease.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Use</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Connect</h4>
                <div className="flex gap-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/themewars/mergephotoonline" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
              © {new Date().getFullYear()} Image Merger. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </DndProvider>
  )
}

