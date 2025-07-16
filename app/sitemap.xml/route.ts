import { fetchArticleSlugs } from "@/lib/api"
import { seoConfig } from "@/lib/seo"

export const runtime = "edge"

export async function GET() {
  try {
    // Fetch all published article slugs
    const slugs = await fetchArticleSlugs()

    const baseUrl = seoConfig.siteUrl
    const currentDate = new Date().toISOString()

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Admin page (noindex) -->
  <url>
    <loc>${baseUrl}/admin</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
  
  <!-- Article pages -->
  ${slugs
    .map(
      (slug) => `
  <url>
    <loc>${baseUrl}/article/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("")}
  
</urlset>`

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)

    // Return a basic sitemap if there's an error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seoConfig.siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new Response(basicSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300", // Shorter cache on error
      },
    })
  }
}
