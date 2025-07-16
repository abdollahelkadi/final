"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Search,
  Filter,
  MoreHorizontal,
  ImageIcon,
  Settings,
} from "lucide-react"
import { fetchAdminArticles, createArticle, updateArticle, deleteArticle, type Article, type SEOData } from "@/lib/api"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SEOForm } from "@/components/seo/seo-form"
import { generateAutoSEO } from "@/lib/seo"

// Required for Cloudflare Pages
export const runtime = "edge"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [activeTab, setActiveTab] = useState("content")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    author: "",
    content: "",
    summary: "",
    tags: "",
    cover_image: "",
    is_published: false,
    seo: {} as SEOData,
  })

  // Filter articles based on search and status
  useEffect(() => {
    let filtered = articles

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((article) =>
        statusFilter === "published"
          ? article.is_published || article.published
          : !(article.is_published || article.published),
      )
    }

    setFilteredArticles(filtered)
  }, [articles, searchQuery, statusFilter])

  const handleLogin = async () => {
    if (password === "123") {
      setIsAuthenticated(true)
      await loadArticles()
    } else {
      toast.error("Invalid password")
    }
  }

  const loadArticles = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminArticles(password)
      setArticles(data)
    } catch (error) {
      toast.error("Failed to load articles")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      const articleData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      if (editingArticle) {
        await updateArticle(password, editingArticle.id, articleData)
        toast.success("Article updated successfully")
      } else {
        await createArticle(password, articleData)
        toast.success("Article created successfully")
      }

      await loadArticles()
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Failed to save article")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      author: article.author,
      content: article.content,
      summary: article.summary || article.excerpt,
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags?.toString() || "",
      cover_image: article.cover_image || article.image || "",
      is_published: article.is_published === 1 || article.published,
      seo: article.seo || {},
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await deleteArticle(password, id)
      toast.success("Article deleted successfully")
      await loadArticles()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete article")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      author: "",
      content: "",
      summary: "",
      tags: "",
      cover_image: "",
      is_published: false,
      seo: {},
    })
    setEditingArticle(null)
    setActiveTab("content")
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleAutoGenerateSEO = () => {
    if (formData.title && formData.summary) {
      const autoSEO = generateAutoSEO({
        title: formData.title,
        summary: formData.summary,
        tags: formData.tags,
        cover_image: formData.cover_image,
        slug: formData.slug,
      })
      setFormData((prev) => ({ ...prev, seo: autoSEO }))
      toast.success("SEO auto-generated successfully")
    } else {
      toast.error("Please fill in title and summary first")
    }
  }

  const getStats = () => {
    const total = articles.length
    const published = articles.filter((a) => a.is_published || a.published).length
    const drafts = total - published
    return { total, published, drafts }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <p className="text-muted-foreground">Enter password to access admin dashboard</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                className="h-12"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            >
              Login to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your FlexiFeeds content</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {editingArticle ? "Edit Article" : "Create New Article"}
                  </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      SEO Settings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => {
                              setFormData({ ...formData, title: e.target.value })
                              if (!editingArticle) {
                                setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                              }
                            }}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cover_image">Cover Image URL</Label>
                          <Input
                            id="cover_image"
                            value={formData.cover_image}
                            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                            placeholder="/placeholder.svg?height=400&width=600"
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                          id="summary"
                          value={formData.summary}
                          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          rows={3}
                          required
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="React, Next.js, TypeScript"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content (Markdown)</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows={15}
                          className="font-mono text-sm resize-none"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_published"
                          checked={formData.is_published}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                        />
                        <Label htmlFor="is_published" className="font-medium">
                          Published
                        </Label>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        >
                          {loading ? "Saving..." : editingArticle ? "Update Article" : "Create Article"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6">
                    <SEOForm
                      seo={formData.seo}
                      onChange={(seo) => setFormData((prev) => ({ ...prev, seo }))}
                      articleData={{
                        title: formData.title,
                        summary: formData.summary,
                        tags: formData.tags,
                        cover_image: formData.cover_image,
                        slug: formData.slug,
                      }}
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("content")}>
                        Back to Content
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        {loading ? "Saving..." : editingArticle ? "Update Article" : "Create Article"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Articles</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Published</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.published}</p>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Drafts</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.drafts}</p>
                </div>
                <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <EyeOff className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="all">All Articles</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredArticles.length} of {articles.length} articles
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="space-y-4">
          {loading && articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No articles found</p>
                <p className="text-muted-foreground">
                  {articles.length === 0
                    ? "Create your first article to get started!"
                    : "Try adjusting your search or filter criteria."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Article Image */}
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      {article.cover_image || article.image ? (
                        <Image
                          src={article.cover_image || article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-bold line-clamp-1">{article.title}</h3>
                          <Badge variant={article.is_published || article.published ? "default" : "secondary"}>
                            {article.is_published || article.published ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                          {article.seo && Object.keys(article.seo).length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Settings className="h-3 w-3 mr-1" />
                              SEO
                            </Badge>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(article)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/article/${article.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Article</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{article.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(article.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="font-medium">{article.author}</span>
                        <span>•</span>
                        <span>{article.date || new Date(article.created_at || "").toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.readTime || "5 min read"}</span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {article.summary || article.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(article.tags) ? article.tags : article.tags?.split(",") || [])
                          .slice(0, 4)
                          .map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag.trim()}
                            </Badge>
                          ))}
                        {(Array.isArray(article.tags) ? article.tags : article.tags?.split(",") || []).length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{(Array.isArray(article.tags) ? article.tags : article.tags?.split(",") || []).length - 4}{" "}
                            more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
