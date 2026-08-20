import React from 'react'
import { cn } from '@site/src/lib/utils'
import { Category } from './models'

const typeStyles: Record<Category, string> = {
  'Product news':
    'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  'Release notes':
    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
}

export const CategoryBadge: React.FC<{ type: Category }> = ({ type }) => (
  <span
    className={cn(
      'inline-block rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
      typeStyles[type]
    )}
  >
    {type}
  </span>
)

export default CategoryBadge
