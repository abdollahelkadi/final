import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RelatedArticles } from "@/components/related-articles"
import { fetchArticleBySlug, fetchArticles } from "@/lib/api"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/markdown-renderer"

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
export async function generateMetadata({ params }: ArticlePageProps) {
  try {
    const article = await fetchArticleBySlug(params.slug)

    if (!article) {
      return {
        title: "Article Not Found",
        description: "The requested article could not be found.",
      }
    }

    return {
      title: `${article.title} | TechBlog`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [article.image],
        type: "article",
        authors: [article.author],
        publishedTime: article.created_at,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt,
        images: [article.image],
      },
    }
  } catch (error) {
    return {
      title: "Article | TechBlog",
      description: "Read the latest articles on TechBlog",
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
      .slice(0, 3)

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Button variant="ghost" asChild className="mb-6 text-white hover:bg-white/20">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>

              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">{article.category}</Badge>
                {article.featured && (
                  <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white">Featured</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{article.title}</h1>

              <p className="text-xl text-white/90 mb-6 leading-relaxed">{article.excerpt}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-12 p-6 bg-gradient-to-r from-red-50 to-blue-50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>1.2k views</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-green-50 hover:border-green-300 transition-all duration-300 bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 bg-transparent"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950 transition-all duration-300 cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Article Content */}
            <article className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-16">
              <MarkdownRenderer content={article.content} />
            </article>

            <Separator className="my-12" />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading article:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Article</h1>
          <p className="text-muted-foreground mb-4">
            We're having trouble loading this article. Please try again later.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }
}
