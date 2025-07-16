"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wand2, Eye, AlertCircle, CheckCircle } from "lucide-react"
import type { SEOData } from "@/lib/api"
import { generateAutoSEO, validateSEO } from "@/lib/seo"

interface SEOFormProps {
  seo: SEOData
  onChange: (seo: SEOData) => void
  articleData?: {
    title: string
    summary: string
    tags: string
    cover_image: string
    slug: string
  }
}

export function SEOForm({ seo, onChange, articleData }: SEOFormProps) {
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] })

  useEffect(() => {
    const result = validateSEO(seo)
    setValidation(result)
  }, [seo])

  const handleAutoGenerate = () => {
    if (articleData) {
      const autoSEO = generateAutoSEO(articleData)
      onChange(autoSEO)
    }
  }

  const handleInputChange = (field: keyof SEOData, value: string) => {
    onChange({
      ...seo,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            SEO Settings
          </CardTitle>
          {articleData && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoGenerate}
              className="flex items-center gap-2 bg-transparent"
            >
              <Wand2 className="h-4 w-4" />
              Auto Generate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Status */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">SEO Issues:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {validation.isValid && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>SEO settings look good! Your content is optimized for search engines.</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                value={seo.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter SEO title (recommended: 50-60 characters)"
                maxLength={60}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Recommended: 50-60 characters</span>
                <span>{(seo.title || "").length}/60</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={seo.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter meta description (recommended: 150-160 characters)"
                rows={3}
                maxLength={160}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Recommended: 150-160 characters</span>
                <span>{(seo.description || "").length}/160</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-keywords">Keywords</Label>
              <Input
                id="seo-keywords"
                value={seo.keywords || ""}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
                placeholder="Enter keywords separated by commas"
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas. Recommended: 5-10 keywords max.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-robots">Robots</Label>
              <select
                id="seo-robots"
                value={seo.robots || "index, follow"}
                onChange={(e) => handleInputChange("robots", e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="index, follow">Index, Follow (Default)</option>
                <option value="noindex, follow">No Index, Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Open Graph (Facebook, LinkedIn)</h4>

              <div className="space-y-2">
                <Label htmlFor="og-title">OG Title</Label>
                <Input
                  id="og-title"
                  value={seo.og_title || ""}
                  onChange={(e) => handleInputChange("og_title", e.target.value)}
                  placeholder="Open Graph title (leave empty to use SEO title)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-description">OG Description</Label>
                <Textarea
                  id="og-description"
                  value={seo.og_description || ""}
                  onChange={(e) => handleInputChange("og_description", e.target.value)}
                  placeholder="Open Graph description (leave empty to use meta description)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-image">OG Image URL</Label>
                <Input
                  id="og-image"
                  value={seo.og_image || ""}
                  onChange={(e) => handleInputChange("og_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Twitter Card</h4>

              <div className="space-y-2">
                <Label htmlFor="twitter-title">Twitter Title</Label>
                <Input
                  id="twitter-title"
                  value={seo.twitter_title || ""}
                  onChange={(e) => handleInputChange("twitter_title", e.target.value)}
                  placeholder="Twitter title (leave empty to use OG title)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter-description">Twitter Description</Label>
                <Textarea
                  id="twitter-description"
                  value={seo.twitter_description || ""}
                  onChange={(e) => handleInputChange("twitter_description", e.target.value)}
                  placeholder="Twitter description (leave empty to use OG description)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter-image">Twitter Image URL</Label>
                <Input
                  id="twitter-image"
                  value={seo.twitter_image || ""}
                  onChange={(e) => handleInputChange("twitter_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="canonical-url">Canonical URL</Label>
              <Input
                id="canonical-url"
                value={seo.canonical_url || ""}
                onChange={(e) => handleInputChange("canonical_url", e.target.value)}
                placeholder="https://example.com/article/slug (auto-generated if empty)"
              />
              <p className="text-xs text-muted-foreground">Leave empty to auto-generate from article URL</p>
            </div>

            <div className="space-y-2">
              <Label>SEO Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="space-y-2">
                  <div className="text-blue-600 text-lg font-medium line-clamp-1">{seo.title || "Your SEO Title"}</div>
                  <div className="text-green-700 text-sm">
                    {seo.canonical_url || "https://example.com/article/slug"}
                  </div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {seo.description || "Your meta description will appear here..."}
                  </div>
                </div>
              </div>
            </div>

            {seo.keywords && (
              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {seo.keywords.split(",").map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
