"use client"

interface HtmlRendererProps {
  content: string
}

export function HtmlRenderer({ content }: HtmlRendererProps) {
  // Sanitize and enhance the HTML content
  const processHtml = (html: string) => {
    return (
      html
        // Add responsive classes to images
        .replace(
          /<img([^>]*)>/gi,
          '<img$1 class="w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-6" loading="lazy">',
        )

        // Style headings
        .replace(
          /<h1([^>]*)>/gi,
          '<h1$1 class="text-4xl font-bold mb-8 mt-12 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">',
        )
        .replace(
          /<h2([^>]*)>/gi,
          '<h2$1 class="text-3xl font-semibold mb-6 mt-10 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">',
        )
        .replace(/<h3([^>]*)>/gi, '<h3$1 class="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">')
        .replace(/<h4([^>]*)>/gi, '<h4$1 class="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">')
        .replace(/<h5([^>]*)>/gi, '<h5$1 class="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">')
        .replace(/<h6([^>]*)>/gi, '<h6$1 class="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">')

        // Style paragraphs
        .replace(/<p([^>]*)>/gi, '<p$1 class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">')

        // Style lists
        .replace(/<ul([^>]*)>/gi, '<ul$1 class="mb-6 pl-6 space-y-2 list-disc marker:text-red-500">')
        .replace(/<ol([^>]*)>/gi, '<ol$1 class="mb-6 pl-6 space-y-2 list-decimal marker:text-red-500">')
        .replace(/<li([^>]*)>/gi, '<li$1 class="text-gray-700 dark:text-gray-300 leading-relaxed">')

        // Style links
        .replace(
          /<a([^>]*)>/gi,
          '<a$1 class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline underline-offset-2 transition-colors duration-200" target="_blank" rel="noopener noreferrer">',
        )

        // Style emphasis
        .replace(/<strong([^>]*)>/gi, '<strong$1 class="font-bold text-gray-900 dark:text-gray-100">')
        .replace(/<b([^>]*)>/gi, '<b$1 class="font-bold text-gray-900 dark:text-gray-100">')
        .replace(/<em([^>]*)>/gi, '<em$1 class="italic text-gray-800 dark:text-gray-200">')
        .replace(/<i([^>]*)>/gi, '<i$1 class="italic text-gray-800 dark:text-gray-200">')

        // Style code blocks
        .replace(
          /<pre([^>]*)>/gi,
          '<div class="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"><pre$1 class="p-4 overflow-x-auto">',
        )
        .replace(/<\/pre>/gi, "</pre></div>")
        .replace(
          /<code([^>]*?)class="language-([^"]*)"([^>]*)>/gi,
          '<div class="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">$2</div><code$1$3 class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre">',
        )
        .replace(
          /<code(?![^>]*class="text-sm font-mono")([^>]*)>/gi,
          '<code$1 class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700">',
        )

        // Style blockquotes
        .replace(
          /<blockquote([^>]*)>/gi,
          '<blockquote$1 class="mb-6 pl-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 py-4 pr-4 rounded-r-lg text-gray-700 dark:text-gray-300 italic">',
        )

        // Style tables
        .replace(
          /<table([^>]*)>/gi,
          '<div class="mb-6 overflow-x-auto"><table$1 class="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">',
        )
        .replace(/<\/table>/gi, "</table></div>")
        .replace(/<thead([^>]*)>/gi, '<thead$1 class="bg-gray-50 dark:bg-gray-800">')
        .replace(/<tbody([^>]*)>/gi, '<tbody$1 class="divide-y divide-gray-200 dark:divide-gray-700">')
        .replace(/<tr([^>]*)>/gi, '<tr$1 class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">')
        .replace(
          /<th([^>]*)>/gi,
          '<th$1 class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">',
        )
        .replace(
          /<td([^>]*)>/gi,
          '<td$1 class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">',
        )

        // Style horizontal rules
        .replace(/<hr([^>]*)>/gi, '<hr$1 class="my-8 border-t-2 border-gray-200 dark:border-gray-700">')
    )
  }

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
      dangerouslySetInnerHTML={{ __html: processHtml(content) }}
    />
  )
}
