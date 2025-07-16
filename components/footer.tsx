import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-muted/50 to-muted/30 dark:from-background dark:to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Logo size="lg" className="transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Simple Text */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">FlexiFeeds</p>
            <p className="text-sm text-muted-foreground">Your source for the latest insights and stories</p>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-border w-full">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FlexiFeeds. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
