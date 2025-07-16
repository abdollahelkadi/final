"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
  variant?: "default" | "white" | "dark"
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-14 w-16",
  xl: "h-[80px] w-[92px]",
  "2xl": "h-[100px] w-[115px]", // new, larger size for header
}

const colorClasses = {
  default: "from-orange-500 via-red-500 to-pink-500",
  white: "from-white via-background to-background",
  dark: "from-foreground via-muted to-muted-foreground",
}

const textColorClasses = {
  default: "from-orange-600 via-red-600 to-pink-600",
  white: "text-white",
  dark: "from-foreground via-muted to-muted-foreground",
}

export function Logo({ size = "md", className, variant = "default" }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)} />
    )
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/logo_dark.png"
      : "/logo_white.png"

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <Image src={logoSrc} alt="FlexiFeeds Logo" fill className="object-contain rounded-lg" priority />
    </div>
  )
}
