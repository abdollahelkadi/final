import type { Article } from "@/lib/api"
import { seoConfig } from "@/lib/seo"

interface StructuredDataProps {
  type: "website" | "article" | "organization" | "breadcrumb"
  data?: any
  article?: Article
}

export function StructuredData({ type, data, article }: StructuredDataProps) {
  let structuredData: any = {}

  switch (type) {
    case "website":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        description: seoConfig.defaultDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        publisher: {
          "@type": "Organization",
          name: seoConfig.siteName,
          url: seoConfig.siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${seoConfig.siteUrl}/logo.png`,
          },
        },
      }
      break

    case "article":
      if (article) {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: article.image.startsWith("http") ? article.image : `${seoConfig.siteUrl}${article.image}`,
          author: {
            "@type": "Person",
            name: article.author,
            url: `${seoConfig.siteUrl}/author/${article.author.toLowerCase().replace(/\s+/g, "-")}`,
          },
          publisher: {
            "@type": "Organization",
            name: seoConfig.siteName,
            url: seoConfig.siteUrl,
            logo: {
              "@type": "ImageObject",
              url: `${seoConfig.siteUrl}/logo.png`,
            },
          },
          datePublished: article.created_at || new Date().toISOString(),
          dateModified: article.updated_at || article.created_at || new Date().toISOString(),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${seoConfig.siteUrl}/article/${article.slug}`,
          },
          articleSection: article.category,
          keywords: article.tags.join(", "),
          wordCount: article.content.split(/\s+/).length,
          timeRequired: article.readTime,
          url: `${seoConfig.siteUrl}/article/${article.slug}`,
        }
      }
      break

    case "organization":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        logo: `${seoConfig.siteUrl}/logo.png`,
        description: seoConfig.defaultDescription,
        sameAs: [
          // Add your social media URLs here
          // "https://twitter.com/flexifeeds",
          // "https://facebook.com/flexifeeds",
          // "https://linkedin.com/company/flexifeeds"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          url: `${seoConfig.siteUrl}/contact`,
        },
      }
      break

    case "breadcrumb":
      if (data) {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }
      }
      break
  }

  if (Object.keys(structuredData).length === 0) {
    return null
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
