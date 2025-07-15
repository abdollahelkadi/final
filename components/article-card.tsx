"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Heart, Bookmark, Share2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"
import { useState } from "react"

interface ArticleCardProps {
  article: Article
  variant?: "default" | "featured" | "compact" | "large"
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 10)

  if (variant === "compact") {
    return (
      <article className="group flex space-x-4 p-4 rounded-xl hover:bg-accent/50 transition-all duration-300">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="secondary" className="mb-2 text-xs">
            {article.category}
          </Badge>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
            <Link href={`/article/${article.slug}`}>{article.title}</Link>
          </h3>
          <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    )
  }

  if (variant === "large") {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-500">
        <div className="aspect-[16/9] relative overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">Featured</Badge>
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900">
              {article.category}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current text-blue-500" : ""}`} />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white/90">
                  #{tag}
                </Badge>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-3 line-clamp-2 leading-tight">
              <Link href={`/article/${article.slug}`} className="hover:text-blue-300 transition-colors">
                {article.title}
              </Link>
            </h2>

            <p className="text-white/90 mb-4 line-clamp-2 leading-relaxed">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-white/80">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">1.2k</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setLikes(likes + 1)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {likes}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white"
        >
          {article.category}
        </Badge>

        {/* Featured Badge */}
        {article.featured && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            Featured
          </Badge>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current text-blue-500" : ""}`} />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          <Link href={`/article/${article.slug}`}>{article.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{article.date}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Heart className="h-3 w-3" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
