"use client"
import { ArticleCard } from "@/components/article-card"
import { fetchArticles, fetchCategories } from "@/lib/api"
import { useEffect, useState, useCallback } from "react"
import type { Article, Category } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Star, ArrowRight, Folder, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Required for Cloudflare Pages
export const runtime = "edge"

interface CategoryWithArticles extends Category {
  articles: Article[]
}

// Skeleton for consistent article grid
function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden bg-card animate-pulse">
          <div className="aspect-[16/10] bg-muted" />
          <div className="p-6 space-y-4">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded" />
              <div className="h-6 bg-muted rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
            <div className="flex justify-between text-xs">
              <div className="h-3 w-1/4 bg-muted rounded" />
              <div className="h-3 w-1/6 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="h-32 bg-muted" />
          <CardContent className="p-4 space-y-3">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ArticlesContent() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categoriesWithArticles, setCategoriesWithArticles] = useState<CategoryWithArticles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading articles and categories...")

      const [fetchedArticles, fetchedCategories] = await Promise.all([fetchArticles(), fetchCategories()])

      console.log("Fetched articles:", fetchedArticles.length)
      console.log("Fetched categories:", fetchedCategories.length)

      setArticles(fetchedArticles)

      // Group articles by category (limit to 4 categories, 3 articles each)
      const categoriesWithArticlesData: CategoryWithArticles[] = fetchedCategories
        .slice(0, 4)
        .map((category) => {
          const categoryArticles = fetchedArticles
            .filter((article) =>
              Array.isArray(article.tags)
                ? (article.tags as (string | undefined)[]).some(
                    (tag) =>
                      typeof tag === "string" &&
                      tag.toLowerCase() === category.name.toLowerCase()
                  )
                : typeof article.tags === "string" &&
                  (article.tags as string).toLowerCase().includes(category.name.toLowerCase()),
            )
            .slice(0, 3) // Limit to 3 articles per category

          return {
            ...category,
            articles: categoryArticles,
          }
        })
        .filter((category) => category.articles.length > 0) // Only show categories with articles

      setCategoriesWithArticles(categoriesWithArticlesData)
    } catch (error) {
      console.error("Error in ArticlesContent:", error)
      setError("Unable to load content. Please try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Categories Section Skeleton */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse" />
            <div className="h-5 bg-muted rounded w-64 animate-pulse" />
          </div>
          <CategoriesSkeleton />
        </section>

        {/* Articles Section Skeleton */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
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
          <h2 className="text-2xl font-bold mb-4 text-red-600">Unable to Load Content</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={loadData} className="bg-foreground text-background hover:bg-muted-foreground">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const publishedArticles = articles.filter((article) => article.published)

  return (
    <>
      {/* All Articles Grid */}
      <section className="container mx-auto px-4 py-8"> {/* reduced py-16 to py-8 */}
        {publishedArticles.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between mb-6"> {/* reduced mb-12 to mb-6 */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1"> {/* reduced mb-2 to mb-1 */}
                  Latest Articles
                </h2>
                <p className="text-muted-foreground">Explore our latest content</p>
              </div>
            </div>

            {/* Consistent Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {publishedArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Make poster smaller by wrapping in a div with a smaller aspect ratio */}
                  <div className="aspect-[16/8]">
                    <ArticleCard article={article} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {publishedArticles.length === 0 && (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                No Articles Found
              </h2>
              <p className="text-muted-foreground">
                There are no published articles available at the moment. Please check back later.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Categories Section */}
      {categoriesWithArticles.length > 0 && (
        <section className="container mx-auto px-4 py-8"> {/* reduced py-16 to py-8 */}
          <div className="animate-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between mb-6"> {/* reduced mb-12 to mb-6 */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1"> {/* reduced mb-2 to mb-1 */}
                  Browse by Category
                </h2>
                <p className="text-muted-foreground">Discover articles organized by topics</p>
              </div>
              <Link href="/categories">
                <Button variant="outline" className="hover:bg-accent hover:border-border bg-transparent">
                  View All Categories
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriesWithArticles.map((category, index) => (
                <Link key={category.id} href={`/category/${encodeURIComponent(category.name)}`}>
                  <Card
                    className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border-0 bg-card hover:bg-card animate-in slide-in-from-bottom-4 rounded-xl overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={category.cover || "/placeholder.svg?height=200&width=400"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge className="bg-white/90 text-foreground mb-1 dark:bg-card/90 dark:text-card-foreground">
                          <Folder className="h-3 w-3 mr-1" />
                          Category
                        </Badge>
                        <h3 className="font-semibold text-white text-lg group-hover:text-orange-200 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                    <CardContent className="p-4 bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                          <BookOpen className="h-4 w-4" />
                          <span>{category.articles.length} articles</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* If you have a header/footer component, reduce their vertical padding/margin similarly */}
      <ArticlesContent />
    </div>
  )
}
