"use client"
import { useState, useCallback } from "react"
import type React from "react"

import {
  fetchAdminArticles,
  fetchAdminCategories,
  createArticle,
  updateArticle,
  deleteArticle,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api"
import type { Article, Category } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  LayoutDashboard,
  FileText,
  Folder,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  BookOpen,
  LogOut,
} from "lucide-react"
import { toast } from "sonner"

// Required for Cloudflare Pages
export const runtime = "edge"

interface AdminStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalCategories: number
}

function AdminSidebar({
  activeTab,
  setActiveTab,
  onLogout,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "categories", label: "Categories", icon: Folder },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-background dark:bg-background border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Content Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

function DashboardTab({ articles, categories }: { articles: Article[]; categories: Category[] }) {
  const stats: AdminStats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.published).length,
    draftArticles: articles.filter((a) => !a.published).length,
    totalCategories: categories.length,
  }

  const recentArticles = articles
    .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalArticles}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.publishedArticles}</p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.draftArticles}</p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCategories}</p>
              </div>
              <Folder className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{article.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {article.author} • {article.date}
                  </p>
                </div>
                <Badge variant={article.published ? "default" : "secondary"}>
                  {article.published ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ArticlesTab({
  articles,
  categories,
  onRefresh,
}: {
  articles: Article[]
  categories: Category[]
  onRefresh: () => void
}) {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    author: "",
    content: "",
    summary: "",
    tags: "",
    cover_image: "",
    is_published: false,
  })

  const handleSubmit = async (password: string) => {
    try {
      if (editingArticle) {
        await updateArticle(password, editingArticle.id, formData)
        toast.success("Article updated successfully")
      } else {
        await createArticle(password, formData)
        toast.success("Article created successfully")
      }

      setEditingArticle(null)
      setIsCreateDialogOpen(false)
      setFormData({
        title: "",
        slug: "",
        author: "",
        content: "",
        summary: "",
        tags: "",
        cover_image: "",
        is_published: false,
      })
      onRefresh()
    } catch (error) {
      toast.error("Failed to save article")
      console.error("Error saving article:", error)
    }
  }

  const handleDelete = async (password: string, articleId: string) => {
    try {
      await deleteArticle(password, articleId)
      toast.success("Article deleted successfully")
      onRefresh()
    } catch (error) {
      toast.error("Failed to delete article")
      console.error("Error deleting article:", error)
    }
  }

  const openEditDialog = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      author: article.author,
      content: article.content,
      summary: article.summary || "",
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags,
      cover_image: article.cover_image || "",
      is_published: article.published,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Articles</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your blog articles</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
            </DialogHeader>
            <ArticleForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={false} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Articles List */}
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
                    <Badge variant={article.published ? "default" : "secondary"}>
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    By {article.author} • {article.date} • {article.readTime}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{article.excerpt}</p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(Array.isArray(article.tags)
                        ? article.tags
                        : (article.tags as string).split(",")
                      ).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Article</DialogTitle>
                      </DialogHeader>
                      <ArticleForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        isEditing={true}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                          onClick={() => {
                            const password = prompt("Enter admin password:")
                            if (password) handleDelete(password, article.id)
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CategoriesTab({
  categories,
  onRefresh,
}: {
  categories: Category[]
  onRefresh: () => void
}) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cover: "",
  })

  const handleSubmit = async (password: string) => {
    try {
      if (editingCategory) {
        await updateCategory(password, editingCategory.id, formData)
        toast.success("Category updated successfully")
      } else {
        await createCategory(password, formData)
        toast.success("Category created successfully")
      }

      setEditingCategory(null)
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        cover: "",
      })
      onRefresh()
    } catch (error) {
      toast.error("Failed to save category")
      console.error("Error saving category:", error)
    }
  }

  const handleDelete = async (password: string, categoryId: string) => {
    try {
      await deleteCategory(password, categoryId)
      toast.success("Category deleted successfully")
      onRefresh()
    } catch (error) {
      toast.error("Failed to delete category")
      console.error("Error deleting category:", error)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      cover: category.cover || "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <p className="text-gray-600 dark:text-gray-400">Organize your content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={false} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <CategoryForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        isEditing={true}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{category.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            const password = prompt("Enter admin password:")
                            if (password) handleDelete(password, category.id)
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>

              {category.created_at && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(category.created_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AnalyticsTab({ articles, categories }: { articles: Article[]; categories: Category[] }) {
  const publishedArticles = articles.filter((a) => a.published)
  const draftArticles = articles.filter((a) => !a.published)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">Content performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Health</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articles.length > 0 ? Math.round((publishedArticles.length / articles.length) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Published vs Draft</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Articles per Category</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.length > 0 ? Math.round(publishedArticles.length / categories.length) : 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Content distribution</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total categories</p>
              </div>
              <Folder className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Content Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Total Articles</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{articles.length}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900 dark:text-white">Published Articles</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{publishedArticles.length}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <EyeOff className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-gray-900 dark:text-white">Draft Articles</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{draftArticles.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ArticleForm({
  formData,
  setFormData,
  onSubmit,
  isEditing,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: (password: string) => void
  isEditing: boolean
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const password = prompt("Enter admin password:")
    if (password) {
      onSubmit(password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="cover_image">Cover Image URL</Label>
          <Input
            id="cover_image"
            value={formData.cover_image}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          required
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="technology, web development, react"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
          {isEditing ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  )
}

function CategoryForm({
  formData,
  setFormData,
  onSubmit,
  isEditing,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: (password: string) => void
  isEditing: boolean
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const password = prompt("Enter admin password:")
    if (password) {
      onSubmit(password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="cover">Cover Image URL</Label>
        <Input
          id="cover"
          value={formData.cover}
          onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
          {isEditing ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Test authentication by fetching admin articles
      const articlesData = await fetchAdminArticles(password)
      const categoriesData = await fetchAdminCategories(password)
      
      // If we get here, authentication was successful
      setIsAuthenticated(true)
      setArticles(articlesData)
      setCategories(categoriesData)
      toast.success("Login successful")
    } catch (error) {
      toast.error("Invalid password")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadData = useCallback(async () => {
    if (!password) return

    setLoading(true)
    try {
      const [articlesData, categoriesData] = await Promise.all([
        fetchAdminArticles(password),
        fetchAdminCategories(password),
      ])
      setArticles(articlesData)
      setCategories(categoriesData)
    } catch (error) {
      toast.error("Failed to load data")
      console.error("Error loading data:", error)
      // If data loading fails, it might be due to invalid auth
      setIsAuthenticated(false)
      setPassword("")
    } finally {
      setLoading(false)
    }
  }, [password])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword("")
    setArticles([])
    setCategories([])
    setActiveTab("dashboard")
    toast.success("Logged out successfully")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-background">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Admin Login</CardTitle>
            <p className="text-muted-foreground">Enter your password to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-foreground hover:bg-muted-foreground text-background" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted dark:bg-background flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "dashboard" && <DashboardTab articles={articles} categories={categories} />}
          {activeTab === "articles" && <ArticlesTab articles={articles} categories={categories} onRefresh={loadData} />}
          {activeTab === "categories" && <CategoriesTab categories={categories} onRefresh={loadData} />}
          {activeTab === "analytics" && <AnalyticsTab articles={articles} categories={categories} />}
        </div>
      </div>
    </div>
  )
}
