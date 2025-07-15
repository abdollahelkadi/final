"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
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

        // Code
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "")
          const language = match ? match[1] : ""

          return !inline && match ? (
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                {language}
              </div>
              <SyntaxHighlighter
                style={tomorrow}
                language={language}
                PreTag="div"
                className="!bg-gray-900 !m-0"
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
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
      {content}
    </ReactMarkdown>
  )
}
