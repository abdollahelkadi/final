"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchArticles, type Article } from "@/lib/api"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Article[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load articles on component mount
    fetchArticles().then(setArticles)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = articles.filter(
        (article) =>
          article.published &&
          (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [searchQuery, articles])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <div ref={searchRef} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 w-64 md:w-80 transition-all duration-300 focus:w-96 focus:border-red-500 focus:ring-red-500"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setResults([])
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (searchQuery || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-300">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-sm text-muted-foreground mb-2 px-2">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </div>
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  onClick={() => {
                    setIsOpen(false)
                    setSearchQuery("")
                  }}
                  className="block p-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{article.excerpt}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No articles found for "{searchQuery}"</p>
            </div>
          ) : null}
        </div>
      )}
    </form>
  )
}
