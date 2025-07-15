import { cn } from "@/lib/utils"
import { Rss, Zap } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
}

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const colorClasses = {
    default: "from-blue-600 via-purple-600 to-indigo-600",
    white: "from-white via-gray-100 to-gray-200",
    dark: "from-gray-800 via-gray-900 to-black",
  }

  const textColorClasses = {
    default: "from-blue-600 via-purple-600 to-indigo-600",
    white: "text-white",
    dark: "from-gray-800 via-gray-900 to-black",
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Logo Icon */}
      <div className={cn("relative rounded-xl p-2 shadow-lg", sizeClasses[size])}>
        <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br shadow-inner", colorClasses[variant])} />
        <div className="relative flex items-center justify-center">
          <div className="relative">
            <Rss className={cn("relative z-10 text-white", sizeClasses[size])} />
            <Zap className={cn("absolute top-0 left-0 text-white/30", sizeClasses[size])} />
          </div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent",
            textSizeClasses[size],
            variant === "white" ? textColorClasses[variant] : `bg-gradient-to-r ${textColorClasses[variant]}`,
          )}
        >
          FlexiFeeds
        </span>
        {size === "lg" || size === "xl" ? (
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Smart Content Hub</span>
        ) : null}
      </div>
    </div>
  )
}
