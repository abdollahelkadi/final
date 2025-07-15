"use client"

import ReactMarkdown from "react-markdown"
import { useEffect, useState } from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [processedContent, setProcessedContent] = useState("")

  useEffect(() => {
    // Check if content contains HTML tags
    const hasHtmlTags = /<[^>]*>/g.test(content)

    if (hasHtmlTags) {
      // If it's HTML, convert common HTML tags to markdown
      const markdownContent = content
        // Convert HTML headings to markdown
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n")
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n")

        // Convert paragraphs
        .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")

        // Convert line breaks
        .replace(/<br\s*\/?>/gi, "\n")

        // Convert bold and italic
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
        .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
        .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")

        // Convert links
        .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")

        // Convert lists
        .replace(/<ul[^>]*>/gi, "")
        .replace(/<\/ul>/gi, "\n")
        .replace(/<ol[^>]*>/gi, "")
        .replace(/<\/ol>/gi, "\n")
        .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")

        // Convert code blocks
        .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, "```\n$1\n```\n\n")
        .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")

        // Convert blockquotes
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1\n\n")

        // Convert horizontal rules
        .replace(/<hr[^>]*\/?>/gi, "\n---\n\n")

        // Convert images
        .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, "![$2]($1)")
        .replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, "![$1]($2)")
        .replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, "![]($1)")

        // Remove remaining HTML tags
        .replace(/<[^>]*>/g, "")

        // Clean up extra whitespace
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim()

      setProcessedContent(markdownContent)
    } else {
      // If it's already markdown, use as is
      setProcessedContent(content)
    }
  }, [content])

  return (
    <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-8 mt-12 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mb-6 mt-10 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">{children}</h6>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">{children}</p>
          ),

          // Lists
          ul: ({ children }) => <ul className="mb-6 pl-6 space-y-2 list-disc marker:text-red-500">{children}</ul>,
          ol: ({ children }) => <ol className="mb-6 pl-6 space-y-2 list-decimal marker:text-red-500">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700 dark:text-gray-300 leading-relaxed">{children}</li>,

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline underline-offset-2 transition-colors duration-200"
            >
              {children}
            </a>
          ),

          // Emphasis
          strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,

          // Code - Simple styling without external dependencies
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""

            return !inline && match ? (
              <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {language && (
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    {language}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700"
                {...props}
              >
                {children}
              </code>
            )
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="mb-6 pl-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 py-4 pr-4 rounded-r-lg">
              <div className="text-gray-700 dark:text-gray-300 italic">{children}</div>
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>,
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),

          // Horizontal Rule
          hr: () => <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />,

          // Images
          img: ({ src, alt }) => (
            <div className="mb-6">
              <img
                src={src || "/placeholder.svg"}
                alt={alt || ""}
                className="w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                loading="lazy"
              />
              {alt && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{alt}</p>}
            </div>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
