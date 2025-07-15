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

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image src="/logo.png" alt="FlexiFeeds Logo" fill className="object-contain rounded-lg" priority />
    </div>
  )
}
