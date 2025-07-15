import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comment-section"
import { RelatedArticles } from "@/components/related-articles"
import { fetchArticleBySlug, fetchArticles, mockComments } from "@/lib/api"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from "react-markdown"
import { Suspense } from "react"

export const runtime = "edge" // Enable Edge Runtime for dynamic fetching

interface ArticlePageProps {
  params: {
    slug: string
  }
}

function ArticlePageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-96 bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl space-y-4">
              <div className="h-6 bg-white/20 rounded w-24" />
              <div className="space-y-2">
                <div className="h-12 bg-white/20 rounded w-3/4" />
                <div className="h-12 bg-white/20 rounded w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded" />
                <div className="h-4 bg-white/20 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function ArticleContent({ slug }: { slug: string }) {
  try {
    console.log("Fetching article for slug:", slug)
    const article = await fetchArticleBySlug(slug)

    if (!article) {
      console.log("Article not found for slug:", slug)
      notFound()
    }

    console.log("Article found:", article.title)

    const allArticles = await fetchArticles()
    const relatedArticles = allArticles
      .filter((a) => a.category === article.category && a.id !== article.id && a.published)
      .slice(0, 3)

    const articleComments = mockComments.filter((c) => c.articleId === article.id)

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
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
                  className="hover:bg-red-50 hover:border-red-300 transition-all duration-300 bg-transparent"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  24
                </Button>
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
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
                  ),
                  ul: ({ children }) => <ul className="mb-6 pl-6 space-y-2">{children}</ul>,
                  li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                  code: ({ children }) => (
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 dark:bg-gray-950 p-6 rounded-lg overflow-x-auto mb-6 border">
                      {children}
                    </pre>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </article>

            <Separator className="my-12" />

            {/* Comments Section */}
            <CommentSection comments={articleComments} />

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

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense fallback={<ArticlePageSkeleton />}>
      <ArticleContent slug={params.slug} />
    </Suspense>
  )
}
