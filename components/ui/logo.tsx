import { cn } from "@/lib/utils"

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
    default: "from-orange-500 via-red-500 to-pink-500",
    white: "from-white via-gray-100 to-gray-200",
    dark: "from-gray-800 via-gray-900 to-black",
  }

  const textColorClasses = {
    default: "from-orange-600 via-red-600 to-pink-600",
    white: "text-white",
    dark: "from-gray-800 via-gray-900 to-black",
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Logo Icon */}
      <div className={cn("relative rounded-xl p-2", sizeClasses[size])}>
        <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br", colorClasses[variant])} />
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" className={cn("relative z-10", sizeClasses[size])}>
            {/* RSS/Feed Icon with modern twist */}
            <path d="M4 11a9 9 0 0 1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M4 4a16 16 0 0 1 16 16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="5" cy="19" r="1" fill="white" />
            {/* Additional modern elements */}
            <path
              d="M12 2L14 8L20 6L16 12L22 14L14 16L16 22L10 18L8 24L6 16L0 18L4 12L-2 10L6 8L4 2L10 6L12 2Z"
              fill="white"
              opacity="0.3"
              transform="scale(0.3) translate(20, 20)"
            />
          </svg>
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
