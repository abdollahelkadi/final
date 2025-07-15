"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate subscription
    setIsSubscribed(true)
    setEmail("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <div className="text-center text-white animate-in slide-in-from-bottom-4 duration-1000 delay-600">
      <div className="max-w-2xl mx-auto">
        <Mail className="h-12 w-12 mx-auto mb-6 opacity-90" />
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl opacity-90 mb-8">
          Get the latest articles and insights delivered straight to your inbox.
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center space-x-2 text-green-200 animate-in zoom-in-50 duration-500">
            <CheckCircle className="h-5 w-5" />
            <span>Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 transition-all duration-300"
            />
            <Button
              type="submit"
              variant="secondary"
              className="bg-white text-red-800 hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
