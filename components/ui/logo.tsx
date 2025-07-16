"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
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

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image src="/logo.png" alt="FlexiFeeds Logo" fill className="object-contain rounded-lg" priority />
    </div>
  )
}
