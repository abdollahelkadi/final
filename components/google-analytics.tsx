import Script from 'next/script'
import { seoConfig } from '@/lib/seo'

export function GoogleAnalytics() {
  if (!seoConfig.googleAnalyticsId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${seoConfig.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${seoConfig.googleAnalyticsId}');
        `}
      </Script>
    </>
  )
}
