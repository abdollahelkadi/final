"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, ArrowRight, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchArticles, type Article } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Article[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load articles and recent searches on component mount
    const loadData = async () => {
      setLoading(true)
      try {
        const articlesData = await fetchArticles()
        setArticles(articlesData)
        const saved = localStorage.getItem('recentSearches')
        if (saved) {
          setRecentSearches(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Failed to load articles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = articles
        .filter(article => 
          article.published &&
          (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        )
        .slice(0, 5) // Limit to 5 results in dropdown
      setResults(filtered)
    } else {
      setResults([])
    }
    setSelectedIndex(-1)
  }, [searchQuery, articles])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setSearchQuery("")
      setSelectedIndex(-1)
      inputRef.current?.blur()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex])
      } else if (searchQuery.trim()) {
        handleSearchSubmit()
      }
    }
  }

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  const handleResultClick = (article: Article) => {
    saveRecentSearch(searchQuery.trim())
    setIsOpen(false)
    setSearchQuery("")
    router.push(`/article/${article.slug}`)
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    router.push(`/search?q=${encodeURIComponent(search)}`)
    setIsOpen(false)
  }

  const saveRecentSearch = (query: string) => {
    if (!query) return
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search articles, topics, authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 w-64 md:w-80 h-10 transition-all duration-300 focus:w-96 focus:ring-0 focus:outline-none focus:border-border rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-none"
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setResults([])
                setSelectedIndex(-1)
              }}
              className="h-7 w-7 p-0 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/search')}
            className="h-7 w-7 p-0 rounded-full hover:bg-muted"
            title="Advanced Search"
          >
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-2xl z-50 max-h-[500px] overflow-hidden animate-in slide-in-from-top-2 duration-300">
          {/* Search Results */}
          {searchQuery && results.length > 0 && (
            <div className="p-3 border-b border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">Search Results</span>
                  <Badge variant="secondary" className="text-xs">{results.length}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSearchSubmit}
                  className="text-xs hover:bg-muted"
                >
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {results.map((article, index) => (
                  <div
                    key={article.id}
                    onClick={() => handleResultClick(article)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedIndex === index 
                        ? 'bg-muted' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {article.image && (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1 text-foreground">{article.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{article.excerpt}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && results.length === 0 && !loading && (
            <div className="p-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium mb-1">No articles found</p>
              <p className="text-xs text-muted-foreground mb-4">Try searching for something else or browse our categories</p>
              <Button
                onClick={handleSearchSubmit}
                variant="outline"
                size="sm"
              >
                Search All Articles
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Recent Searches</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex items-center space-x-2"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
