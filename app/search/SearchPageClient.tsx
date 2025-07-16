"use client"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Filter, Grid, List, ArrowRight, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchArticles, type Article } from "@/lib/api"
import { ArticleCard } from "@/components/article-card"
import Link from "next/link"

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Load articles
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        const data = await fetchArticles()
        setArticles(data.filter(article => article.published))
      } catch (error) {
        console.error('Failed to load articles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  // Filter and search articles
  const filterArticles = useCallback(() => {
    let filtered = [...articles]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article =>
        selectedTags.every(tag => article.tags.includes(tag))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'author':
        filtered.sort((a, b) => a.author.localeCompare(b.author))
        break
      case 'relevance':
      default:
        // Keep original order for relevance
        break
    }

    setFilteredArticles(filtered)
  }, [articles, searchQuery, selectedCategory, selectedTags, sortBy])

  useEffect(() => {
    filterArticles()
  }, [filterArticles])

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory && selectedCategory !== "all") params.set('category', selectedCategory)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    if (sortBy !== 'relevance') params.set('sort', sortBy)

    const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedCategory, selectedTags, sortBy, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterArticles()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTags([])
    setSortBy('relevance')
  }

  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  // Get unique categories and tags
  const categories = [...new Set(articles.map(article => article.category))].sort()
  const allTags = [...new Set(articles.flatMap(article => article.tags))].sort()
  const popularTags = allTags.slice(0, 20) // Show top 20 tags

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Minimal Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Search Articles</h1>
          <p className="text-sm text-muted-foreground">
            Find articles across all topics
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-6 border bg-background shadow-sm">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for articles, topics, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-border"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 border-border">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 border-border">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Latest</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-10 w-10"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-10 w-10"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="h-10 bg-black text-white dark:bg-white dark:text-black font-medium"
                >
                  Search
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Tag Filters */}
              {selectedTags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Filters:</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                        onClick={() => removeTagFilter(tag)}
                      >
                        #{tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {selectedTags.length === 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Popular Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => addTagFilter(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-3"></div>
              <p className="text-muted-foreground">Searching articles...</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All Articles'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {filteredArticles.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Sorted by {sortBy === 'relevance' ? 'relevance' : sortBy}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Articles Grid/List */}
        {!loading && (
          <>
            {filteredArticles.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" 
                : "space-y-4"
              }>
                {filteredArticles.map((article) => (
                  <div key={article.id}>
                    {viewMode === 'grid' ? (
                      <Link href={`/article/${article.slug}`} className="block border rounded-md overflow-hidden hover:shadow-md transition-shadow bg-card">
                        <div className="relative h-32 bg-muted">
                          {article.image && (
                            <img
                              src={article.image}
                              alt={article.title}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium line-clamp-2 mb-1">{article.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <span className="line-clamp-1">{article.author}</span>
                            <span className="mx-1">·</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <ArticleCard 
                        article={article} 
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border shadow-sm bg-background">
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <div className="space-y-4">
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="border-muted-foreground text-foreground hover:bg-secondary"
                    >
                      Clear Filters
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      or{' '}
                      <Link href="/" className="text-foreground hover:underline">
                        browse all articles
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
