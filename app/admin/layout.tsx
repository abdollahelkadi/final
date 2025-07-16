import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlexiFeeds Admin Panel',
  description: 'Content management system for FlexiFeeds',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
