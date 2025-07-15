// API configuration
const API_BASE_URL = "https://blog-worker.abdellah2019gg.workers.dev"

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
}

export interface Comment {
  id: string
  articleId: string
  author: string
  avatar: string
  content: string
  date: string
  likes: number
}

// Mock comments for now (since we haven't implemented comments in the worker yet)
export const mockComments: Comment[] = [
  {
    id: "1",
    articleId: "1",
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Excellent guide! The explanation of Next.js 15 features is very comprehensive. The code examples really helped me understand the concepts better.",
    date: "2 hours ago",
    likes: 12,
  },
  {
    id: "2",
    articleId: "1",
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Thanks for sharing this detailed tutorial. I was looking for a complete guide on Next.js 15 and this covers everything I needed to know.",
    date: "4 hours ago",
    likes: 8,
  },
  {
    id: "3",
    articleId: "2",
    author: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Great insights into modern CSS! The Grid vs Flexbox comparison was particularly helpful. Looking forward to more content like this.",
    date: "1 day ago",
    likes: 15,
  },
  {
    id: "4",
    articleId: "3",
    author: "Sarah Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "As a TypeScript developer, I found these best practices very valuable. The utility types section was especially useful for my current project.",
    date: "2 days ago",
    likes: 23,
  },
]

// Enhanced fetch with better error handling and retries
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Fetching: ${url}`, { attempt: i + 1, options: defaultOptions })

      const response = await fetch(url, defaultOptions)

      console.log(`Response status: ${response.status}`, {
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (response.ok) {
        return response
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        const errorText = await response.text()
        console.error(`Client error ${response.status}:`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // For server errors (5xx), we'll retry
      if (i === retries - 1) {
        const errorText = await response.text()
        console.error(`Server error ${response.status} (final attempt):`, errorText)
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
            .map((t) => t.trim())
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
  }
}

// Fetch all published articles
export async function fetchArticles(): Promise<Article[]> {
  try {
    console.log("Fetching articles from:", `${API_BASE_URL}/api/articles`)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/articles`, {
      method: "GET",
      next: { revalidate: 60 }, // Cache data for 60 seconds
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
    throw error // Don't return fallback data, let the error bubble up
  }
}

// Fetch single article by slug
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    console.log("Fetching article by slug:", slug)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/articles/${slug}`, {
      method: "GET",
      next: { revalidate: 60 }, // Cache data for 60 seconds
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

// Admin API functions
export async function fetchAdminArticles(password: string): Promise<Article[]> {
  try {
    console.log("Fetching admin articles")

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      cache: "no-store", // Admin data should always be fresh
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
    }

    console.log("Create article payload:", payload)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store", // Admin actions should not be cached
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
    }

    console.log("Update article payload:", payload)

    const response = await fetchWithRetry(`${API_BASE_URL}/api/admin/articles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store", // Admin actions should not be cached
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
      cache: "no-store", // Admin actions should not be cached
    })

    const result = await response.json()
    console.log("Delete article response:", result)
  } catch (error) {
    console.error("Error deleting article:", error)
    throw error
  }
}

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    console.log("Checking API health")

    const response = await fetchWithRetry(`${API_BASE_URL}/api/health`, {
      method: "GET",
      cache: "no-store", // Health check should always be fresh
    })

    const data = await response.json()
    console.log("Health check response:", data)

    return data.status === "OK"
  } catch (error) {
    console.error("API health check failed:", error)
    return false
  }
}
