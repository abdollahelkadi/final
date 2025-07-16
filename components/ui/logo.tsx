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
  "2xl": "h-[100px] w-[115px]",
}

// Preload both logo images for instant switching
if (typeof window !== "undefined") {
  const preload = (src: string) => {
    const img = new window.Image()
    img.src = src
  }
  preload("/logo_white.png")
  preload("/logo_dark.png")
}

export function Logo({ size = "md", className }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Wait until theme is resolved and component is mounted to render logo
  if (!mounted || !resolvedTheme) {
    // Optionally, render a placeholder or nothing
    return (
      <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)} />
    )
  }

  const logoSrc = resolvedTheme === "dark" ? "/logo_dark.png" : "/logo_white.png"

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <Image
        src={logoSrc}
        alt="FlexiFeeds Logo"
        fill
        className="object-contain rounded-lg"
        priority
        loading="eager"
        sizes="(max-width: 768px) 64px, 128px"
      />
    </div>
  )
}
