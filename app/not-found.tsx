"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, ArrowLeft, RefreshCw, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchArticles, type Article } from "@/lib/api"

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  
  useEffect(() => {
    // Fetch the latest articles when component mounts
    fetchArticles()
      .then(articles => {
        // Get 3 latest published articles
        const latest = articles
          .filter(article => article.published)
          .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
          .slice(0, 3)
        setLatestArticles(latest)
      })
      .catch(err => console.error("Error fetching latest articles:", err))
  }, [])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Optimized background animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background that shifts slowly */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.07] animate-gradient-shift"
          style={{ 
            transform: "translateZ(0)",
            willChange: "transform, opacity"
          }}
        />
        
        {/* Reduced number of elements with optimized animations */}
        {Array.from({ length: 4 }).map((_, i) => {
          // Simplified fixed values
          const sizes = [200, 300, 250, 350]
          const positions = [15, 35, 65, 85]
          const delays = [0, 3, 1, 4]
          const durations = [30, 25, 35, 40]
          
          return (
            <div 
              key={i}
              className="absolute rounded-full blur-xl opacity-20 animate-drift"
              style={{
                width: `${sizes[i]}px`,
                height: `${sizes[i]}px`,
                top: `${positions[i]}%`,
                left: `${positions[(i + 2) % 4]}%`,
                background: `radial-gradient(circle, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0) 70%)`,
                animationDelay: `${delays[i]}s`,
                animationDuration: `${durations[i]}s`,
                transform: "translateZ(0)",
                willChange: "transform"
              }}
            />
          )
        })}
      </div>
      
      {/* Main content container */}
      <div className="container max-w-md px-4 z-10">
        <div className="text-center">
          {/* Animated 404 Number */}
          <div className="relative mb-6">
            <div className="text-[150px] font-bold text-primary/10 leading-none select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold text-foreground animate-pulse-slow">404</div>
            </div>
          </div>
          
          {/* Text with glitch effect */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground relative glitch-text">
            <span className="glitch-text__main">Page Not Found</span>
            <span className="glitch-text__alt hidden">Page Not Found</span>
          </h1>
          
          <p className="text-muted-foreground mb-8 animate-in fade-in-50 duration-500 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved to another URL.
          </p>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 rounded-full border-primary/20 focus:border-primary"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full">
                Search
              </Button>
            </div>
          </form>
          
          {/* Navigation Options */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
            <Button asChild variant="default" className="group">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="group">
              <Link href="/categories" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Browse Articles
              </Link>
            </Button>
            
            <Button variant="ghost" onClick={() => router.back()} className="group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Go Back
            </Button>
          </div>
          
          {/* Latest Articles Section - Replacing Popular Categories */}
          <div className="mt-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000 delay-300">
            <h2 className="text-lg font-medium text-foreground mb-4">Latest Articles</h2>
            
            <div className="space-y-3">
              {latestArticles.length > 0 ? (
                latestArticles.map(article => (
                  <Link key={article.id} href={`/article/${article.slug}`}>
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer text-left">
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-1">{article.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">Loading latest articles...</div>
              )}
            </div>
          </div>
          
          {/* Reload button with animation */}
          <div className="mt-8 text-xs text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-4 duration-1000 delay-500">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs hover:bg-transparent"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
