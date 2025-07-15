/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    // Enable server actions
    serverActions: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization configuration for Cloudflare
  images: {
    // Disable image optimization for Cloudflare Pages
    unoptimized: true,
    // Configure image domains
    domains: ["localhost", "images.unsplash.com", "via.placeholder.com", "picsum.photos"],
    // Remote patterns for more flexible image sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  // Performance optimizations
  // swcMinify: true, // Removed as per instructions

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/blog/:slug*",
        destination: "/article/:slug*",
        permanent: true,
      },
      {
        source: "/post/:slug*",
        destination: "/article/:slug*",
        permanent: true,
      },
    ]
  },

  // PoweredByHeader
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate ETags for pages
  generateEtags: true,

  // Page extensions
  pageExtensions: ["ts", "tsx", "js", "jsx"],

  // Environment variables to expose to the browser
  env: {
    SITE_NAME: "TechBlog",
    SITE_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  },
}

module.exports = nextConfig
