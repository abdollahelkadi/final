// API configuration - Update this to match your actual worker URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flexifeeds.me"

export interface SEOData {
  title?: string
  description?: string
  keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  canonical_url?: string
  robots?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  author: string
  content: string
  summary?: string
  excerpt: string
  tags: string[]
  cover_image?: string
  image: string
  is_published?: number
  published: boolean
  featured: boolean
  created_at?: string
  updated_at?: string
  date: string
  readTime: string
  category: string
  seo?: SEOData
}

export interface Category {
  id: string
  name: string
  description: string
  cover?: string
  created_at?: string
  updated_at?: string
}

// Enhanced fetch with better error handling and retries (no caching)
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    cache: "no-store", // Always fetch fresh data
    ...options,
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Fetching: ${url}`, { attempt: i + 1 })

      const response = await fetch(url, defaultOptions)

      console.log(`Response status: ${response.status}`, {
        ok: response.ok,
        statusText: response.statusText,
      })

      if (response.ok) {
        return response
      }

      // Log the error response for debugging
      const errorText = await response.text()
      console.error(`HTTP ${response.status} Error:`, errorText)

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // For server errors (5xx), we'll retry
      if (i === retries - 1) {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      console.warn(`Server error ${response.status}, retrying...`)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
    } catch (error) {
      console.error(`Fetch attempt ${i + 1} failed:`, error)

      if (i === retries - 1) {
        throw error
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }

  throw new Error("All retry attempts failed")
}

// Transform article data from API to frontend format
function transformArticle(apiArticle: any): Article {
  return {
    id: apiArticle.id?.toString() || "",
    slug: apiArticle.slug || "",
    title: apiArticle.title || "",
    author: apiArticle.author || "",
    content: apiArticle.content || "",
    summary: apiArticle.summary,
    excerpt: apiArticle.summary || apiArticle.excerpt || "",
    tags: Array.isArray(apiArticle.tags)
      ? apiArticle.tags
      : typeof apiArticle.tags === "string"
        ? apiArticle.tags
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [],
    cover_image: apiArticle.cover_image,
    image: apiArticle.cover_image || apiArticle.image || "/placeholder.svg?height=400&width=600",
    is_published: apiArticle.is_published,
    published: apiArticle.is_published === 1 || apiArticle.published === true,
    featured: apiArticle.featured || false,
    created_at: apiArticle.created_at,
    updated_at: apiArticle.updated_at,
    date:
      apiArticle.date ||
      (apiArticle.created_at
        ? new Date(apiArticle.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })),
    readTime: apiArticle.readTime || `${Math.ceil((apiArticle.content?.length || 1000) / 1000)} min read`,
    category:
      apiArticle.category ||
      (Array.isArray(apiArticle.tags) && apiArticle.tags.length > 0
        ? apiArticle.tags[0]
        : typeof apiArticle.tags === "string" && apiArticle.tags
          ? apiArticle.tags.split(",")[0].trim()
          : "General"),
    seo: apiArticle.seo ? JSON.parse(apiArticle.seo) : undefined,
  }
}

// Fetch all published articles
export async function fetchArticles(): Promise<Article[]> {
  try {
    console.log("Fetching articles from:", `${API_BASE_URL}/api/articles`)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/articles`, {
      method: "GET",
    })

    const data = await response.json()
    console.log("Articles API response:", data)

    if (!data.articles || !Array.isArray(data.articles)) {
      console.error("Invalid articles response format:", data)
      return []
    }

    const transformedArticles = data.articles.map(transformArticle)
    console.log("Transformed articles:", transformedArticles.length, "articles")

    return transformedArticles
  } catch (error) {
    console.error("Error fetching articles:", error)
    throw error
  }
}

// Fetch single article by slug
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    console.log("Fetching article by slug:", slug)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/articles/${slug}`, {
      method: "GET",
    })

    const data = await response.json()
    console.log("Article API response:", data)

    if (!data.article) {
      console.log("No article found for slug:", slug)
      return null
    }

    const transformedArticle = transformArticle(data.article)
    console.log("Transformed article:", transformedArticle)

    return transformedArticle
  } catch (error) {
    console.error("Error fetching article:", error)
    if (error instanceof Error && error.message.includes("404")) {
      return null
    }
    throw error
  }
}

// Fetch article slugs for sitemap
export async function fetchArticleSlugs(): Promise<string[]> {
  try {
    console.log("Fetching article slugs for sitemap")

    const response = await fetchWithRetry(`${API_BASE_URL}/api/articles/slugs`, {
      method: "GET",
    })

    const data = await response.json()
    console.log("Article slugs API response:", data)

    if (!data.slugs || !Array.isArray(data.slugs)) {
      // Fallback: fetch all articles and extract slugs
      const articles = await fetchArticles()
      return articles.filter((article) => article.published).map((article) => article.slug)
    }

    return data.slugs
  } catch (error) {
    console.error("Error fetching article slugs:", error)
    // Fallback: fetch all articles and extract slugs
    try {
      const articles = await fetchArticles()
      return articles.filter((article) => article.published).map((article) => article.slug)
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError)
      return []
    }
  }
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    console.log("Fetching categories from:", `${API_BASE_URL}/api/categories`)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/categories`, {
      method: "GET",
    })

    const data = await response.json()
    console.log("Categories API response:", data)

    if (!data.categories || !Array.isArray(data.categories)) {
      console.error("Invalid categories response format:", data)
      return []
    }

    return data.categories.map((category: any) => ({
      ...category,
      id: category.id?.toString() || "",
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

// Fetch single category with articles
export async function fetchCategoryWithArticles(
  name: string,
): Promise<{ category: Category; articles: Article[] } | null> {
  try {
    console.log("Fetching category with articles:", name)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/categories/${encodeURIComponent(name)}`, {
      method: "GET",
    })

    const data = await response.json()
    console.log("Category with articles API response:", data)

    if (!data.category) {
      console.log("No category found for name:", name)
      return null
    }

    const transformedArticles = data.articles ? data.articles.map(transformArticle) : []

    return {
      category: {
        ...data.category,
        id: data.category.id?.toString() || "",
      },
      articles: transformedArticles,
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    if (error instanceof Error && error.message.includes("404")) {
      return null
    }
    throw error
  }
}

// Admin API functions
export async function fetchAdminArticles(password: string): Promise<Article[]> {
  try {
    console.log("Fetching admin articles")

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${password}`,
      },
    })

    const data = await response.json()
    console.log("Admin articles API response:", data)

    if (!data.articles || !Array.isArray(data.articles)) {
      console.error("Invalid admin articles response format:", data)
      return []
    }

    const transformedArticles = data.articles.map((article: any) => ({
      ...transformArticle(article),
      published: article.is_published === 1,
    }))

    console.log("Transformed admin articles:", transformedArticles.length, "articles")
    return transformedArticles
  } catch (error) {
    console.error("Error fetching admin articles:", error)
    throw error
  }
}

export async function createArticle(password: string, articleData: any): Promise<void> {
  try {
    console.log("Creating article:", articleData)

    const payload = {
      slug: articleData.slug,
      title: articleData.title,
      author: articleData.author,
      content: articleData.content,
      summary: articleData.summary,
      tags: Array.isArray(articleData.tags) ? articleData.tags.join(", ") : articleData.tags,
      cover_image: articleData.cover_image || null,
      is_published: articleData.is_published ? 1 : 0,
      seo: articleData.seo ? JSON.stringify(articleData.seo) : null,
    }

    console.log("Create article payload:", payload)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    console.log("Create article response:", result)
  } catch (error) {
    console.error("Error creating article:", error)
    throw error
  }
}

export async function updateArticle(password: string, id: string, articleData: any): Promise<void> {
  try {
    console.log("Updating article:", id, articleData)

    const payload = {
      slug: articleData.slug,
      title: articleData.title,
      author: articleData.author,
      content: articleData.content,
      summary: articleData.summary,
      tags: Array.isArray(articleData.tags) ? articleData.tags.join(", ") : articleData.tags,
      cover_image: articleData.cover_image || null,
      is_published: articleData.is_published ? 1 : 0,
      seo: articleData.seo ? JSON.stringify(articleData.seo) : null,
    }

    console.log("Update article payload:", payload)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    console.log("Update article response:", result)
  } catch (error) {
    console.error("Error updating article:", error)
    throw error
  }
}

export async function deleteArticle(password: string, id: string): Promise<void> {
  try {
    console.log("Deleting article:", id)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${password}`,
      },
    })

    const result = await response.json()
    console.log("Delete article response:", result)
  } catch (error) {
    console.error("Error deleting article:", error)
    throw error
  }
}

// Admin category functions
export async function fetchAdminCategories(password: string): Promise<Category[]> {
  try {
    console.log("Fetching admin categories")

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${password}`,
      },
    })

    const data = await response.json()
    console.log("Admin categories API response:", data)

    if (!data.categories || !Array.isArray(data.categories)) {
      console.error("Invalid admin categories response format:", data)
      return []
    }

    return data.categories.map((category: any) => ({
      ...category,
      id: category.id?.toString() || "",
    }))
  } catch (error) {
    console.error("Error fetching admin categories:", error)
    throw error
  }
}

export async function createCategory(password: string, categoryData: any): Promise<void> {
  try {
    console.log("Creating category:", categoryData)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(categoryData),
    })

    const result = await response.json()
    console.log("Create category response:", result)
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export async function updateCategory(password: string, id: string, categoryData: any): Promise<void> {
  try {
    console.log("Updating category:", id, categoryData)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(categoryData),
    })

    const result = await response.json()
    console.log("Update category response:", result)
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

export async function deleteCategory(password: string, id: string): Promise<void> {
  try {
    console.log("Deleting category:", id)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${password}`,
      },
    })

    const result = await response.json()
    console.log("Delete category response:", result)
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    console.log("Checking API health")

    const response = await fetchWithRetry(`${API_BASE_URL}/api/health`, {
      method: "GET",
    })

    const data = await response.json()
    console.log("Health check response:", data)

    return data.status === "OK"
  } catch (error) {
    console.error("API health check failed:", error)
    return false
  }
}
