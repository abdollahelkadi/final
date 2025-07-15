import type React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Rss, Zap } from "lucide-react"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white" | "dark"
  width?: number
  height?: number
}

export function Logo({ className, size = "md", variant = "default", width = 32, height = 32, ...props }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
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

  const iconSize = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-9 w-9" : "h-7 w-7"
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl"

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {variant === "default" ? (
        <div className={cn("relative rounded-xl p-2 shadow-lg", sizeClasses[size])}>
          <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br shadow-inner", colorClasses[variant])} />
          <div className="relative flex items-center justify-center">
            <div className="relative">
              <Rss className={cn("relative z-10 text-white", iconSize)} />
              <Zap className={cn("absolute top-0 left-0 text-white/30", iconSize)} />
            </div>
          </div>
        </div>
      ) : (
        <Image src="/logo.jpg" alt="FlexiFeeds Logo" width={width} height={height} className="rounded-md" />
      )}

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
        {size === "lg" ? (
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Smart Content Hub</span>
        ) : null}
      </div>
    </div>
  )
}
