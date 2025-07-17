import Script from 'next/script'
import { seoConfig } from '@/lib/seo'

export function GoogleAdSense() {
  if (!seoConfig.googleAdsenseId) {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${seoConfig.googleAdsenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
