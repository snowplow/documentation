import React from 'react'
import { Input } from '@site/src/components/ui/input'
import { Search } from 'lucide-react'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder: string
  className?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder,
  className,
}) => {
  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10 bg-white border border-gray-200 shadow-sm h-11 focus:border-purple-600 focus:ring-purple-600"
      />
    </div>
  )
}

export default SearchInput
