import type { Article, SEOData } from "./api"

export interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultImage: string
  twitterHandle?: string
  facebookAppId?: string
  author: string
  keywords: string[]
}

export const seoConfig: SEOConfig = {
  siteName: "FlexiFeeds",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://flexifeeds.me",
  defaultTitle: "FlexiFeeds - Modern Blog Platform for Technology Articles",
  defaultDescription:
    "Discover the latest technology articles, tutorials, and insights on FlexiFeeds. Your go-to source for web development, programming, and tech trends.",
  defaultImage: "/logo.png",
  twitterHandle: "@flexifeeds",
  author: "FlexiFeeds Team",
  keywords: ["technology", "programming", "web development", "tutorials", "tech news", "coding", "software"],
}

// Generate SEO data for home page
export function generateHomeSEO(): SEOData {
  return {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    keywords: seoConfig.keywords.join(", "),
    og_title: seoConfig.defaultTitle,
    og_description: seoConfig.defaultDescription,
    og_image: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    twitter_title: seoConfig.defaultTitle,
    twitter_description: seoConfig.defaultDescription,
    twitter_image: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    canonical_url: seoConfig.siteUrl,
    robots: "index, follow",
  }
}

// Generate SEO data for article
export function generateArticleSEO(article: Article): SEOData {
  const baseUrl = seoConfig.siteUrl
  const articleUrl = `${baseUrl}/article/${article.slug}`

  // Use custom SEO if available, otherwise generate from article data
  const customSEO = article.seo || {}

  const title = customSEO.title || `${article.title} | ${seoConfig.siteName}`
  const description =
    customSEO.description ||
    article.excerpt ||
    article.summary ||
    `Read about ${article.title} by ${article.author} on ${seoConfig.siteName}`
  const image = customSEO.og_image || article.image || `${baseUrl}${seoConfig.defaultImage}`

  // Generate keywords from article tags and category
  const articleKeywords = [...article.tags, article.category, article.author, ...seoConfig.keywords]
    .filter(Boolean)
    .slice(0, 10) // Limit to 10 keywords

  return {
    title,
    description: description.length > 160 ? description.substring(0, 157) + "..." : description,
    keywords: customSEO.keywords || articleKeywords.join(", "),
    og_title: customSEO.og_title || title,
    og_description: customSEO.og_description || description,
    og_image: image.startsWith("http") ? image : `${baseUrl}${image}`,
    twitter_title: customSEO.twitter_title || title,
    twitter_description: customSEO.twitter_description || description,
    twitter_image: customSEO.twitter_image || image,
    canonical_url: customSEO.canonical_url || articleUrl,
    robots: customSEO.robots || "index, follow",
  }
}

// Generate auto SEO from article data (for admin panel)
export function generateAutoSEO(articleData: {
  title: string
  summary: string
  tags: string
  cover_image: string
  slug: string
}): SEOData {
  const baseUrl = seoConfig.siteUrl
  const articleUrl = `${baseUrl}/article/${articleData.slug}`

  const title = `${articleData.title} | ${seoConfig.siteName}`
  const description =
    articleData.summary.length > 160 ? articleData.summary.substring(0, 157) + "..." : articleData.summary

  const keywords = articleData.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .concat(seoConfig.keywords)
    .slice(0, 10)
    .join(", ")

  const image = articleData.cover_image
    ? articleData.cover_image.startsWith("http")
      ? articleData.cover_image
      : `${baseUrl}${articleData.cover_image}`
    : `${baseUrl}${seoConfig.defaultImage}`

  return {
    title,
    description,
    keywords,
    og_title: title,
    og_description: description,
    og_image: image,
    twitter_title: title,
    twitter_description: description,
    twitter_image: image,
    canonical_url: articleUrl,
    robots: "index, follow",
  }
}

// Validate SEO data
export function validateSEO(seo: SEOData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!seo.title) {
    errors.push("Title is required")
  } else if (seo.title.length > 60) {
    errors.push("Title should be under 60 characters")
  }

  if (!seo.description) {
    errors.push("Description is required")
  } else if (seo.description.length > 160) {
    errors.push("Description should be under 160 characters")
  }

  if (seo.keywords && seo.keywords.split(",").length > 10) {
    errors.push("Too many keywords (max 10)")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Clean and optimize text for SEO
export function cleanTextForSEO(text: string, maxLength = 160): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
    .substring(0, maxLength)
}
