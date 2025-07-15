"use client"
import { ArticleCard } from "@/components/article-card"
import { useEffect } from "react"

import { useCallback } from "react"

import { useState } from "react"

import { fetchArticles } from "@/lib/api"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Zap, Star } from "lucide-react"

// Required for Cloudflare Pages
export const runtime = "edge"
export const dynamic = "force-dynamic"

// Skeleton for consistent article grid
function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden bg-card animate-pulse">
          <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700" />
          <div className="p-6 space-y-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>
            <div className="flex justify-between text-xs">
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/6 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ArticlesContent() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          <Button onClick={loadArticles} className="bg-foreground text-background hover:bg-muted-foreground">
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

  return (
    <>
      {/* All Articles Grid */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
        <Separator className="my-12" />
      </main>
    </>
  )
}

export default async function HomePage() {
  const articles = await fetchArticles()

  return (
    <div className="min-h-screen">
      <ArticlesContent articles={articles} />
    </div>
  )
}
