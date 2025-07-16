import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import { StructuredData } from "@/components/seo/structured-data"
import { seoConfig } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.author }],
  creator: seoConfig.siteName,
  publisher: seoConfig.siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(seoConfig.siteUrl),
  alternates: {
    canonical: seoConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seoConfig.siteUrl,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    siteName: seoConfig.siteName,
    images: [
      {
        url: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [`${seoConfig.siteUrl}${seoConfig.defaultImage}`],
    creator: seoConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  generator: "Next.js",
  applicationName: seoConfig.siteName,
  referrer: "origin-when-cross-origin",
  category: "technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
