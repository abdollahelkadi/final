import Head from "next/head"
import type { SEOData } from "@/lib/api"
import { seoConfig } from "@/lib/seo"

interface MetaTagsProps {
  seo: SEOData
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function MetaTags({ seo, type = "website", publishedTime, modifiedTime, author, section, tags }: MetaTagsProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <meta name="author" content={author || seoConfig.author} />
      <meta name="robots" content={seo.robots || "index, follow"} />

      {/* Canonical URL */}
      {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seo.og_title || seo.title} />
      <meta property="og:description" content={seo.og_description || seo.description} />
      <meta property="og:image" content={seo.og_image} />
      <meta property="og:url" content={seo.canonical_url} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific Open Graph tags */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map((tag, index) => <meta key={index} property="article:tag" content={tag} />)}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.twitter_title || seo.title} />
      <meta name="twitter:description" content={seo.twitter_description || seo.description} />
      <meta name="twitter:image" content={seo.twitter_image || seo.og_image} />
      {seoConfig.twitterHandle && <meta name="twitter:site" content={seoConfig.twitterHandle} />}
      {seoConfig.twitterHandle && <meta name="twitter:creator" content={seoConfig.twitterHandle} />}

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Favicon and Icons - These will be provided by layout.tsx */}
      {/* They are commented out here to avoid duplicates with the ones in layout.tsx */}
      {/* <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}

      {/* Additional SEO enhancements */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
    </Head>
  )
}
