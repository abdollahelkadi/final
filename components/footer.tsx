import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <Logo width={40} height={40} />
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} FlexiFeeds. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
