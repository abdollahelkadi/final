import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import type { Article } from "@/lib/api"

interface TrendingTopicsProps {
  articles: Article[]
}

export function TrendingTopics({ articles }: TrendingTopicsProps) {
  // Get unique categories and tags
  const categories = [...new Set(articles.map((article) => article.category))]
  const allTags = articles.flatMap((article) => article.tags)
  const popularTags = [...new Set(allTags)].slice(0, 8)

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-400">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold">Trending Topics</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900 dark:hover:text-red-200 transition-colors duration-300 cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="hover:bg-orange-100 hover:text-orange-800 hover:border-orange-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-200 dark:hover:border-orange-700 transition-all duration-300 cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
