import { Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono()

// Enable CORS for all routes with more permissive settings
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: false,
  }),
)

// Add a simple logging middleware for debugging
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`)
  console.log("Headers:", Object.fromEntries(c.req.raw.headers.entries()))
  await next()
})

// Middleware to check admin password
const adminAuth = async (c, next) => {
  const password = c.req.header("Authorization")?.replace("Bearer ", "")
  console.log("Admin auth check, password provided:", !!password)

  if (password !== c.env.ADMIN_PASSWORD) {
    console.log("Admin auth failed")
    return c.json({ error: "Unauthorized" }, 401)
  }

  console.log("Admin auth successful")
  await next()
}

// Get all published articles - NO AUTH REQUIRED
app.get("/api/articles", async (c) => {
  try {
    console.log("Fetching articles - no auth required")

    // Check if DB is available
    if (!c.env.DB) {
      console.error("Database not available")
      return c.json({ error: "Database not configured" }, 500)
    }

    // No cache headers - always serve fresh data
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")
    c.header("Pragma", "no-cache")
    c.header("Expires", "0")

    console.log("Querying database for published articles")
    const { results } = await c.env.DB.prepare(`
      SELECT id, slug, title, author, summary, tags, cover_image, seo, created_at, updated_at
      FROM articles 
      WHERE is_published = 1 
      ORDER BY created_at DESC
    `).all()

    console.log(`Found ${results.length} published articles`)

    const articles = results.map((article) => ({
      ...article,
      tags: article.tags ? article.tags.split(",").map((tag) => tag.trim()) : [],
      excerpt: article.summary,
      image: article.cover_image || "/placeholder.svg?height=400&width=600",
      date: new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTime: `${Math.ceil(article.summary?.length / 200) || 5} min read`,
      category: article.tags ? article.tags.split(",")[0]?.trim() || "General" : "General",
      published: true,
      featured: false,
    }))

    console.log("Returning articles response")
    return c.json({ articles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return c.json(
      {
        error: "Failed to fetch articles",
        details: error.message,
      },
      500,
    )
  }
})

// Get single article by slug - NO AUTH REQUIRED
app.get("/api/articles/:slug", async (c) => {
  try {
    console.log("Fetching single article - no auth required")

    // Check if DB is available
    if (!c.env.DB) {
      console.error("Database not available")
      return c.json({ error: "Database not configured" }, 500)
    }

    // No cache headers - always serve fresh data
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")
    c.header("Pragma", "no-cache")
    c.header("Expires", "0")

    const slug = c.req.param("slug")
    console.log(`Querying database for article with slug: ${slug}`)

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM articles WHERE slug = ? AND is_published = 1
    `)
      .bind(slug)
      .all()

    if (results.length === 0) {
      console.log(`Article not found for slug: ${slug}`)
      return c.json({ error: "Article not found" }, 404)
    }

    const article = results[0]
    const formattedArticle = {
      ...article,
      tags: article.tags ? article.tags.split(",").map((tag) => tag.trim()) : [],
      excerpt: article.summary,
      image: article.cover_image || "/placeholder.svg?height=400&width=600",
      date: new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTime: `${Math.ceil((article.content?.length || 0) / 1000) || 5} min read`,
      category: article.tags ? article.tags.split(",")[0]?.trim() || "General" : "General",
      published: true,
      featured: false,
    }

    console.log(`Returning article: ${article.title}`)
    return c.json({ article: formattedArticle })
  } catch (error) {
    console.error("Error fetching article:", error)
    return c.json(
      {
        error: "Failed to fetch article",
        details: error.message,
      },
      500,
    )
  }
})

// Admin: Get all articles (including drafts) - AUTH REQUIRED
app.get("/api/admin/articles", adminAuth, async (c) => {
  try {
    console.log("Fetching admin articles - auth required")

    // No cache for admin endpoints
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM articles ORDER BY created_at DESC
    `).all()

    const articles = results.map((article) => ({
      ...article,
      tags: article.tags ? article.tags.split(",").map((tag) => tag.trim()) : [],
      published: article.is_published === 1,
    }))

    return c.json({ articles })
  } catch (error) {
    console.error("Error fetching admin articles:", error)
    return c.json({ error: "Failed to fetch articles" }, 500)
  }
})

// Admin: Create new article - AUTH REQUIRED
app.post("/api/admin/articles", adminAuth, async (c) => {
  try {
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const body = await c.req.json()
    const { slug, title, author, content, summary, tags, cover_image, is_published, seo } = body

    // Check if slug already exists
    const existing = await c.env.DB.prepare(`
      SELECT id FROM articles WHERE slug = ?
    `)
      .bind(slug)
      .first()

    if (existing) {
      return c.json({ error: "Article with this slug already exists" }, 400)
    }

    const tagsString = Array.isArray(tags) ? tags.join(", ") : tags || ""
    const now = new Date().toISOString()

    const result = await c.env.DB.prepare(`
      INSERT INTO articles (slug, title, author, content, summary, tags, cover_image, seo, is_published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        slug,
        title,
        author,
        content,
        summary,
        tagsString,
        cover_image || null,
        seo || null,
        is_published ? 1 : 0,
        now,
        now,
      )
      .run()

    return c.json({
      message: "Article created successfully",
      id: result.meta.last_row_id,
    })
  } catch (error) {
    console.error("Error creating article:", error)
    return c.json({ error: "Failed to create article" }, 500)
  }
})

// Admin: Update article - AUTH REQUIRED
app.put("/api/admin/articles/:id", adminAuth, async (c) => {
  try {
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const id = c.req.param("id")
    const body = await c.req.json()
    const { slug, title, author, content, summary, tags, cover_image, is_published, seo } = body

    // Check if slug already exists for different article
    const existing = await c.env.DB.prepare(`
      SELECT id FROM articles WHERE slug = ? AND id != ?
    `)
      .bind(slug, id)
      .first()

    if (existing) {
      return c.json({ error: "Article with this slug already exists" }, 400)
    }

    const tagsString = Array.isArray(tags) ? tags.join(", ") : tags || ""
    const now = new Date().toISOString()

    await c.env.DB.prepare(`
      UPDATE articles 
      SET slug = ?, title = ?, author = ?, content = ?, summary = ?, tags = ?, cover_image = ?, seo = ?, is_published = ?, updated_at = ?
      WHERE id = ?
    `)
      .bind(
        slug,
        title,
        author,
        content,
        summary,
        tagsString,
        cover_image || null,
        seo || null,
        is_published ? 1 : 0,
        now,
        id,
      )
      .run()

    return c.json({ message: "Article updated successfully" })
  } catch (error) {
    console.error("Error updating article:", error)
    return c.json({ error: "Failed to update article" }, 500)
  }
})

// Admin: Delete article - AUTH REQUIRED
app.delete("/api/admin/articles/:id", adminAuth, async (c) => {
  try {
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const id = c.req.param("id")

    await c.env.DB.prepare(`
      DELETE FROM articles WHERE id = ?
    `)
      .bind(id)
      .run()

    return c.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return c.json({ error: "Failed to delete article" }, 500)
  }
})

// Get all categories - NO AUTH REQUIRED
app.get("/api/categories", async (c) => {
  try {
    console.log("Fetching categories - no auth required")

    if (!c.env.DB) {
      console.error("Database not available")
      return c.json({ error: "Database not configured" }, 500)
    }

    c.header("Cache-Control", "no-cache, no-store, must-revalidate")
    c.header("Pragma", "no-cache")
    c.header("Expires", "0")

    console.log("Querying database for categories")
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM category 
      ORDER BY name ASC
    `).all()

    console.log(`Found ${results.length} categories`)

    return c.json({ categories: results })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return c.json(
      {
        error: "Failed to fetch categories",
        details: error.message,
      },
      500,
    )
  }
})

// Get single category by name with articles - NO AUTH REQUIRED
app.get("/api/categories/:name", async (c) => {
  try {
    console.log("Fetching category with articles - no auth required")

    if (!c.env.DB) {
      console.error("Database not available")
      return c.json({ error: "Database not configured" }, 500)
    }

    c.header("Cache-Control", "no-cache, no-store, must-revalidate")
    c.header("Pragma", "no-cache")
    c.header("Expires", "0")

    const categoryName = decodeURIComponent(c.req.param("name"))
    console.log(`Querying database for category: ${categoryName}`)

    // Get category details
    const categoryResult = await c.env.DB.prepare(`
      SELECT * FROM category WHERE name = ?
    `)
      .bind(categoryName)
      .first()

    if (!categoryResult) {
      console.log(`Category not found: ${categoryName}`)
      return c.json({ error: "Category not found" }, 404)
    }

    // Get articles that have this category name in their tags
    const { results: articles } = await c.env.DB.prepare(`
      SELECT id, slug, title, author, summary, tags, cover_image, seo, created_at, updated_at
      FROM articles 
      WHERE is_published = 1 AND (
        tags LIKE ? OR 
        tags LIKE ? OR 
        tags LIKE ? OR
        tags = ?
      )
      ORDER BY created_at DESC
    `)
      .bind(
        `%${categoryName},%`, // category at start or middle
        `%, ${categoryName},%`, // category in middle with space
        `%, ${categoryName}`, // category at end
        categoryName, // exact match
      )
      .all()

    console.log(`Found ${articles.length} articles for category ${categoryName}`)

    const formattedArticles = articles.map((article) => ({
      ...article,
      tags: article.tags ? article.tags.split(",").map((tag) => tag.trim()) : [],
      excerpt: article.summary,
      image: article.cover_image || "/placeholder.svg?height=400&width=600",
      date: new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTime: `${Math.ceil(article.summary?.length / 200) || 5} min read`,
      category: article.tags ? article.tags.split(",")[0]?.trim() || "General" : "General",
      published: true,
      featured: false,
    }))

    return c.json({
      category: categoryResult,
      articles: formattedArticles,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return c.json(
      {
        error: "Failed to fetch category",
        details: error.message,
      },
      500,
    )
  }
})

// Admin: Get all categories - AUTH REQUIRED
app.get("/api/admin/categories", adminAuth, async (c) => {
  try {
    console.log("Fetching admin categories - auth required")

    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM category ORDER BY name ASC
    `).all()

    return c.json({ categories: results })
  } catch (error) {
    console.error("Error fetching admin categories:", error)
    return c.json({ error: "Failed to fetch categories" }, 500)
  }
})

// Admin: Create new category - AUTH REQUIRED
app.post("/api/admin/categories", adminAuth, async (c) => {
  try {
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const body = await c.req.json()
    const { name, description, cover } = body

    // Check if category already exists
    const existing = await c.env.DB.prepare(`
      SELECT id FROM category WHERE name = ?
    `)
      .bind(name)
      .first()

    if (existing) {
      return c.json({ error: "Category with this name already exists" }, 400)
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO category (name, description, cover)
      VALUES (?, ?, ?)
    `)
      .bind(name, description, cover || null)
      .run()

    return c.json({
      message: "Category created successfully",
      id: result.meta.last_row_id,
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return c.json({ error: "Failed to create category" }, 500)
  }
})

// Admin: Update category - AUTH REQUIRED
app.put("/api/admin/categories/:id", adminAuth, async (c) => {
  try {
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const id = c.req.param("id")
    const body = await c.req.json()
    const { name, description, cover } = body

    // Check if name already exists for different category
    const existing = await c.env.DB.prepare(`
      SELECT id FROM category WHERE name = ? AND id != ?
    `)
      .bind(name, id)
      .first()

    if (existing) {
      return c.json({ error: "Category with this name already exists" }, 400)
    }

    await c.env.DB.prepare(`
      UPDATE category 
      SET name = ?, description = ?, cover = ?
      WHERE id = ?
    `)
      .bind(name, description, cover || null, id)
      .run()

    return c.json({ message: "Category updated successfully" })
  } catch (error) {
    console.error("Error updating category:", error)
    return c.json({ error: "Failed to update category" }, 500)
  }
})

// Admin: Delete category - AUTH REQUIRED
app.delete("/api/admin/categories/:id", adminAuth, async (c) => {
  try {
    c.header("Cache-Control", "no-cache, no-store, must-revalidate")

    const id = c.req.param("id")

    await c.env.DB.prepare(`
      DELETE FROM category WHERE id = ?
    `)
      .bind(id)
      .run()

    return c.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return c.json({ error: "Failed to delete category" }, 500)
  }
})

// Health check - should work without any auth
app.get("/api/health", (c) => {
  console.log("Health check called")
  c.header("Cache-Control", "no-cache, no-store, must-revalidate")
  return c.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: c.env ? "production" : "development",
  })
})

// Catch-all route for debugging
app.all("*", (c) => {
  console.log(`Unmatched route: ${c.req.method} ${c.req.url}`)
  return c.json(
    {
      error: "Route not found",
      method: c.req.method,
      path: c.req.url,
    },
    404,
  )
})

export default app
