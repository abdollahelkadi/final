import { seoConfig } from "@/lib/seo"

export const runtime = "edge"

export async function GET() {
  const robotsTxt = `# Robots.txt for ${seoConfig.siteName}
# Generated automatically

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Sitemap
Sitemap: ${seoConfig.siteUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow common search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Block AI training bots (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /
`

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  })
}
