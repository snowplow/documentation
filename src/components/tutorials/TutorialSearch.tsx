import React from 'react'
import SearchInput from '@site/src/components/ui/search-input'

interface TutorialSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export const TutorialSearch: React.FC<TutorialSearchProps> = ({
  onSearch,
  placeholder = 'Search by tutorial name',
  className,
}) => {
  return (
    <SearchInput
      onSearch={onSearch}
      placeholder={placeholder}
      className={className}
    />
  )
}

export default TutorialSearch
