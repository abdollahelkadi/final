"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  variant?: "default" | "white" | "dark"
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-14 w-16",
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
  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <Image src="/logo.png" alt="FlexiFeeds Logo" fill className="object-contain rounded-lg" priority />
    </div>
  )
}
