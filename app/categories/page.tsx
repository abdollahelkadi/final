"use client"
import { fetchCategories, fetchArticles } from "@/lib/api"
import { useEffect, useState, useCallback } from "react"
import type { Article, Category } from "@/lib/api"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Folder, BookOpen, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

// Required for Cloudflare Pages
export const runtime = "edge"

interface CategoryWithArticles extends Category {
  articles: Article[]
  articleCount: number
}

function CategoriesPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse" />
          <div className="h-5 bg-muted rounded w-96 animate-pulse" />
        </div>

        {/* Search Skeleton */}
        <div className="max-w-md mb-8">
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-6">
              <div className="bg-muted/10 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-48 mb-4" />
                <div className="h-4 bg-muted rounded w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="border rounded-xl overflow-hidden bg-card animate-pulse">
                      <div className="aspect-[16/10] bg-muted" />
                      <div className="p-6 space-y-4">
                        <div className="h-5 bg-muted rounded w-1/3" />
                        <div className="space-y-2">
                          <div className="h-6 bg-muted rounded" />
                          <div className="h-6 bg-muted rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CategoriesContent() {
  const [categoriesWithArticles, setCategoriesWithArticles] = useState<CategoryWithArticles[]>([])
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithArticles[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading categories and articles...")

      const [fetchedCategories, fetchedArticles] = await Promise.all([fetchCategories(), fetchArticles()])

      console.log("Fetched categories:", fetchedCategories.length)
      console.log("Fetched articles:", fetchedArticles.length)

      // Group articles by category (limit to 6 articles per category)
      const categoriesWithArticlesData: CategoryWithArticles[] = fetchedCategories
        .map((category) => {
          const categoryArticles = fetchedArticles
            .filter((article) =>
              Array.isArray(article.tags)
                ? article.tags.some((tag) => tag.toLowerCase() === category.name.toLowerCase())
                : typeof article.tags === "string" &&
                  (article.tags as string).toLowerCase().includes(category.name.toLowerCase()),
            )
            .filter((article) => article.published)
            .slice(0, 6) // Limit to 6 articles per category

          return {
            ...category,
            articles: categoryArticles,
            articleCount: categoryArticles.length,
          }
        })
        .filter((category) => category.articles.length > 0) // Only show categories with articles
        .sort((a, b) => b.articleCount - a.articleCount) // Sort by article count

      setCategoriesWithArticles(categoriesWithArticlesData)
      setFilteredCategories(categoriesWithArticlesData)
    } catch (error) {
      console.error("Error in CategoriesContent:", error)
      setError("Unable to load categories. Please try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categoriesWithArticles)
    } else {
      const filtered = categoriesWithArticles.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCategories(filtered)
    }
  }, [searchTerm, categoriesWithArticles])

  if (loading) {
    return <CategoriesPageSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Unable to Load Categories</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={loadData} className="bg-foreground text-background hover:bg-muted-foreground">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Left aligned and smaller like home page */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">All Categories</h1>
            <p className="text-muted-foreground">
              Browse articles organized by categories. Each category shows up to 6 recent articles.
            </p>
          </div>
        </div>

        {/* Search - Left aligned */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories with Articles */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div
                key={category.id}
                className="animate-in slide-in-from-bottom-4 duration-700 bg-card/50 rounded-xl border border-border/50 overflow-hidden"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                {/* Category Header with modern design */}
                <div className="bg-gradient-to-r from-muted/30 to-transparent p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <Folder className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              {category.articleCount} articles
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-muted-foreground text-sm max-w-2xl">{category.description}</p>
                      )}
                    </div>
                    <Link href={`/category/${encodeURIComponent(category.name)}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-900/20 dark:hover:border-orange-700 bg-transparent group"
                      >
                        View All
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Articles Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.articles.map((article, articleIndex) => (
                      <div
                        key={article.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${categoryIndex * 200 + articleIndex * 100}ms` }}
                      >
                        <ArticleCard article={article} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No Categories Found</h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? `No categories match "${searchTerm}"` : "No categories available at the moment."}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")} variant="outline" className="mt-4">
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return <CategoriesContent />
}
