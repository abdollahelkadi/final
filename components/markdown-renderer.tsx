"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
        ul: ({ children }) => <ul className="mb-6 pl-6 space-y-2">{children}</ul>,
        li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
        code: ({ children }) => (
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-900 dark:bg-gray-950 p-6 rounded-lg overflow-x-auto mb-6 border">{children}</pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
