import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, TrendingUp, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchArticleBySlug, fetchArticles } from "@/lib/api"
import { notFound } from "next/navigation"
import { HtmlRenderer } from "@/components/html-renderer"
import { StructuredData } from "@/components/seo/structured-data"
import { generateArticleSEO, seoConfig } from "@/lib/seo"
import type { Metadata } from "next"

// Required for Cloudflare Pages
export const runtime = "edge"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Disable static generation to always fetch fresh data
export const dynamic = "force-dynamic"

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await fetchArticleBySlug(params.slug)

    if (!article) {
      return {
        title: "Article Not Found",
        description: "The requested article could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    const seo = generateArticleSEO(article)
    const articleUrl = `${seoConfig.siteUrl}/article/${article.slug}`
    const publishedTime = article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString()
    const modifiedTime = article.updated_at ? new Date(article.updated_at).toISOString() : publishedTime

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      authors: [{ name: article.author }],
      creator: article.author,
      publisher: seoConfig.siteName,
      alternates: {
        canonical: seo.canonical_url,
      },
      openGraph: {
        type: "article",
        locale: "en_US",
        url: articleUrl,
        title: seo.og_title || seo.title,
        description: seo.og_description || seo.description,
        siteName: seoConfig.siteName,
        publishedTime,
        modifiedTime,
        authors: [article.author],
        section: article.category,
        tags: article.tags,
        images: [
          {
            url: seo.og_image || article.image,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.twitter_title || seo.title,
        description: seo.twitter_description || seo.description,
        images: [seo.twitter_image || seo.og_image || article.image],
        creator: seoConfig.twitterHandle,
      },
      robots: {
        index: seo.robots?.includes("noindex") ? false : true,
        follow: seo.robots?.includes("nofollow") ? false : true,
        googleBot: {
          index: seo.robots?.includes("noindex") ? false : true,
          follow: seo.robots?.includes("nofollow") ? false : true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      category: article.category,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Article | FlexiFeeds",
      description: "Read the latest articles on FlexiFeeds",
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    console.log("Fetching article for slug:", params.slug)
    const article = await fetchArticleBySlug(params.slug)

    if (!article) {
      console.log("Article not found for slug:", params.slug)
      notFound()
    }

    console.log("Article found:", article.title)

    // Fetch related articles
    const allArticles = await fetchArticles()
    const relatedArticles = allArticles
      .filter((a) => a.category === article.category && a.id !== article.id && a.published)
      .slice(0, 4)

    // Generate breadcrumb data for structured data
    const breadcrumbData = [
      { name: "Home", url: seoConfig.siteUrl },
      { name: article.category, url: `${seoConfig.siteUrl}/category/${article.category.toLowerCase()}` },
      { name: article.title, url: `${seoConfig.siteUrl}/article/${article.slug}` },
    ]

    return (
      <>
        {/* Structured Data */}
        <StructuredData type="article" article={article} />
        <StructuredData type="breadcrumb" data={breadcrumbData} />

        <div className="min-h-screen bg-background">
          {/* Clean Hero Section */}
          <div className="relative h-[40vh] min-h-64 overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            {/* Light overlay for light mode, darker for dark mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent dark:from-background/90 dark:via-background/40" />

            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-6">
                <Button variant="ghost" asChild className="mb-4 text-foreground hover:bg-accent">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>

                <Badge className="mb-2 bg-primary text-primary-foreground">{article.category}</Badge>

                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 leading-tight max-w-4xl">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Content - Article */}
              <div className="lg:w-2/3 space-y-6">
                {/* Article Meta */}
                <div className="flex items-center space-x-6 text-sm text-muted-foreground border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.created_at}>{article.date}</time>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Article Excerpt */}
                <div className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 mb-2">
                  {article.excerpt}
                </div>

                {/* Article Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  <HtmlRenderer content={article.content} />
                </article>

                {/* Article Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Sidebar - Static */}
              <div className="lg:w-1/3">
                <div className="sticky top-20 space-y-4">
                  {/* Article Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Article Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <span className="font-semibold">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Reading Time</span>
                        <span className="font-semibold">{article.readTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Published</span>
                        <span className="font-semibold">{article.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Author Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        About the Author
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{article.author}</h4>
                        <p className="text-sm text-muted-foreground">
                          Experienced writer specializing in {article.category.toLowerCase()} topics with a passion for
                          sharing knowledge and insights.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-muted-foreground">Featured Author</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  {relatedArticles.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Related Articles
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {relatedArticles.slice(0, 3).map((relatedArticle) => (
                          <Link
                            key={relatedArticle.id}
                            href={`/article/${relatedArticle.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={relatedArticle.image || "/placeholder.svg"}
                                  alt={relatedArticle.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                  {relatedArticle.title}
                                </h5>
                                <p className="text-xs text-muted-foreground mt-1">{relatedArticle.readTime}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Category Badge */}
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Badge variant="outline" className="text-sm px-4 py-2">
                          #{article.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Explore more articles in this category
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error("Error loading article:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-destructive">Error Loading Article</h1>
            <p className="text-muted-foreground">We're having trouble loading this article. Please try again later.</p>
          </div>
          <Button asChild variant="default">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }
}
