/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Transpile specific packages that might have issues with React 19 or Next.js bundling
  transpilePackages: ["react-markdown"],

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

  // Rewrites for subdomain handling
  async rewrites() {
    return [
      // Handle admin subdomain
      {
        source: '/',
        destination: '/admin',
        has: [
          {
            type: 'host',
            value: 'admin.flexifeeds.me'
          }
        ]
      }
    ]
  },

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
      // Cache static assets
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },
      // Ensure favicons are cached properly
      {
        source: "/(favicon.ico|favicon.png|apple-touch-icon.png)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          }
        ]
      }
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

  // Enable static optimization
  output: "standalone",

  // Optimize for performance
  swcMinify: true,

  // Enable React strict mode
  reactStrictMode: true,
}

module.exports = nextConfig
