"use client" // Mark as a client component

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"

interface FeaturedArticleProps {
  article: Article
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl">
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="relative h-64 lg:h-auto overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-6">
            <Badge className="bg-gradient-to-r from-red-800 to-red-600 text-white">Featured Article</Badge>
            <Badge variant="secondary">{article.category}</Badge>
          </div>

          <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 to-red-800 dark:from-gray-100 dark:to-red-400 bg-clip-text text-transparent">
            {article.title}
          </h1>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed line-clamp-3">{article.excerpt}</p>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="w-fit bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
          >
            <Link href={`/article/${article.slug}`} className="flex items-center space-x-2">
              <span>Read Article</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
