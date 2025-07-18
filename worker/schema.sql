-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  tags TEXT,
  cover_image TEXT,
  seo TEXT,
  is_published INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample articles
INSERT INTO articles (slug, title, author, content, summary, tags, cover_image, is_published, created_at, updated_at) VALUES
(
  'getting-started-nextjs-15-complete-guide',
  'Getting Started with Next.js 15: A Complete Guide',
  'Sarah Johnson',
  '# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make building React applications even more powerful and efficient.

## What''s New in Next.js 15

### Server Components by Default
Server Components are now the default in Next.js 15, providing better performance and SEO out of the box.

### Improved App Router
The App Router has been enhanced with better file-based routing and improved developer experience.

### Enhanced Performance
- Faster build times
- Improved bundle optimization
- Better caching strategies

## Getting Started

To create a new Next.js 15 project:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
\`\`\`

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  cover TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description, cover) VALUES
(
  'Technology',
  'Latest trends and innovations in technology, programming, and digital transformation.',
  '/placeholder.svg?height=400&width=600'
),
(
  'Web Development',
  'Frontend, backend, and full-stack web development tutorials and best practices.',
  '/placeholder.svg?height=400&width=600'
),
(
  'React',
  'React.js tutorials, tips, and advanced concepts for modern web development.',
  '/placeholder.svg?height=400&width=600'
),
(
  'Next.js',
  'Next.js framework guides, performance optimization, and deployment strategies.',
  '/placeholder.svg?height=400&width=600'
),
(
  'JavaScript',
  'JavaScript fundamentals, ES6+ features, and modern development techniques.',
  '/placeholder.svg?height=400&width=600'
);
