"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="block group">
      <article className="border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {article.category}
          </Badge>

          {/* Featured Badge */}
          {article.featured && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              Featured
            </Badge>
          )}
        </div>

        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {article.title}
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

            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
