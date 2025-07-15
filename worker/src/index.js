import { Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono()

// Enable CORS for all routes
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
)

// Middleware to check admin password
const adminAuth = async (c, next) => {
  const password = c.req.header("Authorization")?.replace("Bearer ", "")
  if (password !== c.env.ADMIN_PASSWORD) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  await next()
}

// Get all published articles
app.get("/api/articles", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, slug, title, author, summary, tags, cover_image, created_at, updated_at
      FROM articles 
      WHERE is_published = 1 
      ORDER BY created_at DESC
    `).all()

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

    return c.json({ articles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return c.json({ error: "Failed to fetch articles" }, 500)
  }
})

// Get single article by slug
app.get("/api/articles/:slug", async (c) => {
  try {
    const slug = c.req.param("slug")
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM articles WHERE slug = ? AND is_published = 1
    `)
      .bind(slug)
      .all()

    if (results.length === 0) {
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

    return c.json({ article: formattedArticle })
  } catch (error) {
    console.error("Error fetching article:", error)
    return c.json({ error: "Failed to fetch article" }, 500)
  }
})

// Admin: Get all articles (including drafts)
app.get("/api/admin/articles", adminAuth, async (c) => {
  try {
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

// Admin: Create new article
app.post("/api/admin/articles", adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const { slug, title, author, content, summary, tags, cover_image, is_published } = body

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
      INSERT INTO articles (slug, title, author, content, summary, tags, cover_image, is_published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(slug, title, author, content, summary, tagsString, cover_image || null, is_published ? 1 : 0, now, now)
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

// Admin: Update article
app.put("/api/admin/articles/:id", adminAuth, async (c) => {
  try {
    const id = c.req.param("id")
    const body = await c.req.json()
    const { slug, title, author, content, summary, tags, cover_image, is_published } = body

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
      SET slug = ?, title = ?, author = ?, content = ?, summary = ?, tags = ?, cover_image = ?, is_published = ?, updated_at = ?
      WHERE id = ?
    `)
      .bind(slug, title, author, content, summary, tagsString, cover_image || null, is_published ? 1 : 0, now, id)
      .run()

    return c.json({ message: "Article updated successfully" })
  } catch (error) {
    console.error("Error updating article:", error)
    return c.json({ error: "Failed to update article" }, 500)
  }
})

// Admin: Delete article
app.delete("/api/admin/articles/:id", adminAuth, async (c) => {
  try {
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

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() })
})

export default app
