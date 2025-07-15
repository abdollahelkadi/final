"use client" // Mark as a client component

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Badge
          variant="secondary"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white"
        >
          {article.category}
        </Badge>
        {article.featured && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-800 text-white">Featured</Badge>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          <Link href={`/article/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>

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
              <span>24</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
