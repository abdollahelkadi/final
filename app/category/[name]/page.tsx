import { fetchCategoryWithArticles } from "@/lib/api"
import { ArticleCard } from "@/components/article-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Folder, BookOpen, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"

// Required for Cloudflare Pages
export const runtime = "edge"

interface CategoryPageProps {
  params: {
    name: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const decodedName = decodeURIComponent(params.name)

  try {
    const result = await fetchCategoryWithArticles(decodedName)

    if (!result) {
      notFound()
    }

    const { category, articles } = result
    const publishedArticles = articles.filter((article) => article.published)

    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8"> {/* reduced py-16 to py-8 */}
          {/* Back Button */}
          <div className="mb-4"> {/* reduced mb-8 to mb-4 */}
            <Link href="/categories">
              <Button variant="ghost" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
          </div>

          {/* Category Header */}
          <div className="mb-8"> {/* reduced mb-12 to mb-8 */}
            {category.cover && (
              <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6"> {/* reduced mb-8 to mb-6 */}
                <Image src={category.cover || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge className="bg-background/90 text-foreground mb-1"> {/* reduced mb-2 to mb-1 */}
                    <Folder className="h-3 w-3 mr-1" />
                    Category
                  </Badge>
                  <h1 className="text-4xl font-bold text-white">{category.name}</h1>
                </div>
              </div>
            )}

            {!category.cover && (
              <div className="text-center mb-6"> {/* reduced mb-8 to mb-6 */}
                <div className="flex items-center justify-center space-x-2 mb-2"> {/* reduced mb-4 to mb-2 */}
                  <Folder className="h-8 w-8 text-orange-600" />
                  <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
                </div>
              </div>
            )}

            {category.description && (
              <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-4">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{publishedArticles.length} articles</span>
              </div>
              {category.created_at && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    Created{" "}
                    {new Date(category.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Articles */}
          {publishedArticles.length > 0 ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-1"> {/* reduced mb-2 to mb-1 */}
                  Articles in {category.name}
                </h2>
                <p className="text-muted-foreground">Discover all articles in this category</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedArticles.map((article, index) => (
                  <div
                    key={article.id}
                    className="animate-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8"> {/* reduced py-16 to py-8 */}
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2"> {/* reduced mb-4 to mb-2 */}
                No Articles Found
              </h2>
              <p className="text-muted-foreground mb-4"> {/* reduced mb-6 to mb-4 */}
                There are no published articles in this category yet.
              </p>
              <Link href="/categories">
                <Button variant="outline">Browse Other Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading category:", error)
    notFound()
  }
}
