import React from 'react'
import Link from '@docusaurus/Link'

// Mirrors the post-card style used on snowplow.io/blog: an icon banner,
// a category pill, the title, then an author initials avatar with date.
interface BlogPostCardProps {
  title: string
  category: string
  author: string
  date: string
  href: string
  icon: React.ReactNode
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  category,
  author,
  date,
  href,
  icon,
}) => {
  const initials = author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      to={href}
      className="blog-post-card block rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ border: '1px solid hsl(var(--border))' }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          height: '160px',
          background: 'linear-gradient(135deg, rgba(111, 76, 255, 0.16) 0%, rgba(111, 76, 255, 0.06) 100%)',
          color: 'hsl(var(--primary))',
        }}
      >
        {icon}
      </div>
      <div className="p-6">
        <span
          className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
        >
          {category}
        </span>
        <p className="mb-6 text-lg font-semibold text-foreground">{title}</p>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-sm font-semibold shrink-0"
            style={{
              width: '40px',
              height: '40px',
              background: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
            }}
          >
            {initials}
          </div>
          <div>
            <p className="mb-0 text-sm font-semibold text-foreground">{author}</p>
            <p className="mb-0 text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
