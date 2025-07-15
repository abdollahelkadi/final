"use client"

import { ArticleGrid } from "@/components/article-grid"
import { FeaturedArticle } from "@/components/featured-article"
import { fetchArticles } from "@/lib/api"
import { TrendingTopics } from "@/components/trending-topics"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Suspense } from "react"

// Loading components
function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden bg-card animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeaturedArticleSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl animate-pulse">
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="h-64 lg:h-auto bg-gray-200 dark:bg-gray-700" />
        <div className="p-8 lg:p-12 space-y-4">
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    </div>
  )
}

async function ArticlesContent() {
  try {
    const articles = await fetchArticles()
    console.log("Fetched articles in page:", articles.length)

    if (!articles || articles.length === 0) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
          <p className="text-muted-foreground">
            There are no published articles available at the moment. Please check back later.
          </p>
        </div>
      )
    }

    const publishedArticles = articles.filter((article) => article.published)
    const featuredArticle = publishedArticles.find((article) => article.featured) || publishedArticles[0]
    const latestArticles = publishedArticles.filter((article) => article.id !== featuredArticle?.id).slice(0, 6)
    const popularArticles = publishedArticles.slice(0, 6)

    return (
      <>
        {/* Featured Article */}
        {featuredArticle && (
          <section className="container mx-auto px-4 py-12">
            <div className="text-center mb-12 animate-in fade-in-0 duration-1000">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-800 via-red-600 to-blue-800 bg-clip-text text-transparent">
                Welcome to TechBlog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover the latest insights, tutorials, and trends in web development, programming, and technology.
              </p>
            </div>

            <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              <FeaturedArticle article={featuredArticle} />
            </div>
          </section>
        )}

        {/* Trending Topics */}
        <section className="bg-gradient-to-r from-red-50 to-blue-50 dark:from-gray-900/50 dark:to-gray-800/50 py-16">
          <div className="container mx-auto px-4">
            <TrendingTopics articles={articles} />
          </div>
        </section>

        {/* Latest Articles */}
        <section className="container mx-auto px-4 py-16">
          {latestArticles.length > 0 && (
            <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500 mb-16">
              <ArticleGrid title="Latest Articles" articles={latestArticles} showViewAll />
            </div>
          )}

          {popularArticles.length > 0 && (
            <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-700">
              <ArticleGrid title="Popular This Week" articles={popularArticles} showViewAll />
            </div>
          )}
        </section>
      </>
    )
  } catch (error) {
    console.error("Error in ArticlesContent:", error)
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Unable to Load Articles</h2>
        <p className="text-muted-foreground mb-4">
          We're having trouble connecting to our content server. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    )
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="container mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6 w-96 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-2/3 animate-pulse" />
              </div>
              <FeaturedArticleSkeleton />
            </section>

            {/* Articles Section Skeleton */}
            <section className="container mx-auto px-4 py-16">
              <div className="mb-8">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
              </div>
              <ArticleGridSkeleton />
            </section>
          </div>
        }
      >
        <ArticlesContent />
      </Suspense>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-red-800 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  )
}
