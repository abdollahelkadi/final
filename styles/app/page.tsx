"use client"

import { ArticleGrid } from "@/components/article-grid"
import { ArticleCard } from "@/components/article-card"
import { fetchArticles } from "@/lib/api"
import { TrendingTopics } from "@/components/trending-topics"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { useEffect, useState, useCallback } from "react"
import type { Article } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, Star, ArrowRight } from "lucide-react"

// Required for Cloudflare Pages
export const runtime = "edge"

// Enhanced loading components
function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16" />
            </div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-40" />
          </div>
        </div>
        <div className="h-64 lg:h-auto bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  )
}

function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden bg-card animate-pulse">
          <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700" />
          <div className="p-6 space-y-4">
            <div className="flex space-x-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ArticlesContent() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading articles...")

      const fetchedArticles = await fetchArticles()
      console.log("Fetched articles in page:", fetchedArticles.length)

      setArticles(fetchedArticles)
    } catch (error) {
      console.error("Error in ArticlesContent:", error)
      setError("Unable to load articles. Please try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6 w-96 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-2/3 animate-pulse" />
          </div>
          <HeroSkeleton />
        </section>

        {/* Articles Section Skeleton */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
          </div>
          <ArticleGridSkeleton />
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Unable to Load Articles</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={loadArticles}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
          <p className="text-muted-foreground">
            There are no published articles available at the moment. Please check back later.
          </p>
        </div>
      </div>
    )
  }

  const publishedArticles = articles.filter((article) => article.published)
  const featuredArticle = publishedArticles.find((article) => article.featured) || publishedArticles[0]
  const latestArticles = publishedArticles.filter((article) => article.id !== featuredArticle?.id).slice(0, 6)
  const trendingArticles = publishedArticles.slice(0, 4)

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-in fade-in-0 duration-1000">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Welcome to FlexiFeeds</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Your Smart Content Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover personalized articles, insights, and trends from across the web. Stay informed with content that
            adapts to your interests.
          </p>
        </div>

        {/* Featured Article Hero */}
        {featuredArticle && (
          <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-300">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900/50 dark:to-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Trending Now
                </h2>
                <p className="text-muted-foreground">Most popular articles this week</p>
              </div>
            </div>
            <Button variant="outline" className="hover:bg-orange-50 hover:border-orange-300 bg-transparent">
              View All Trending
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="container mx-auto px-4 py-16">
        {latestArticles.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500 mb-16">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  Latest Articles
                </h2>
                <p className="text-muted-foreground">Fresh content just for you</p>
              </div>
              <Button variant="outline" className="hover:bg-orange-50 hover:border-orange-300 bg-transparent">
                View All Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <ArticleGrid title="" articles={latestArticles} showViewAll={false} />
          </div>
        )}
      </section>

      {/* Topics Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <TrendingTopics articles={articles} />
        </div>
      </section>
    </>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ArticlesContent />

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-16">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  )
}
