export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  tags: string[]
  featured: boolean
  published: boolean
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
