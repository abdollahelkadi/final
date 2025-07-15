import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, Heart, Rss } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="lg" />
            <p className="text-muted-foreground leading-relaxed max-w-md">
              FlexiFeeds is your smart content hub, delivering personalized articles, insights, and trends from across
              the web. Stay informed, stay ahead.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Stay Updated</h4>
              <div className="flex space-x-2 max-w-sm">
                <Input placeholder="Enter your email" className="bg-background border-border" />
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-orange-100 dark:hover:bg-orange-900/20">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-blue-900/20">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-green-100 dark:hover:bg-green-900/20">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-orange-100 dark:hover:bg-orange-900/20">
                <Rss className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/categories/technology", label: "Technology" },
                { href: "/categories/programming", label: "Programming" },
                { href: "/categories/design", label: "Design" },
                { href: "/categories/business", label: "Business" },
                { href: "/categories/ai-ml", label: "AI & Machine Learning" },
                { href: "/trending", label: "Trending Now" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-orange-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/careers", label: "Careers" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/help", label: "Help Center" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-orange-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} FlexiFeeds. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Made with</span>
            <Heart className="h-4 w-4 text-red-500 hidden md:inline" />
            <span className="hidden md:inline">for content creators</span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link href="/sitemap" className="text-muted-foreground hover:text-foreground">
              Sitemap
            </Link>
            <Link href="/rss" className="text-muted-foreground hover:text-foreground">
              RSS Feed
            </Link>
            <Link href="/api" className="text-muted-foreground hover:text-foreground">
              API
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
