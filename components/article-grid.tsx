import Link from "next/link"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ArticleGridProps {
  title: string
  articles: Article[]
  showViewAll?: boolean
  className?: string
}

export function ArticleGrid({ title, articles, showViewAll, className }: ArticleGridProps) {
  return (
    <section className={cn("", className)}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-red-800 dark:from-foreground dark:to-red-400 bg-clip-text text-transparent">
          {title}
        </h2>
        {showViewAll && (
          <Button
            variant="outline"
            asChild
            className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950 transition-all duration-300 bg-transparent"
          >
            <Link href="/articles">View All</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="animate-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  )
}
