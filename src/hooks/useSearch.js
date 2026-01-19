import { useState, useMemo } from 'react'

export function useSearch(items, searchFields = ['name', 'description']) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    
    const query = searchQuery.toLowerCase()
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field]
        if (!value) return false
        return String(value).toLowerCase().includes(query)
      })
    })
  }, [items, searchQuery, searchFields])
  
  const highlightMatch = (text, query = searchQuery) => {
    if (!query.trim() || !text) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }
  
  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    highlightMatch,
    hasResults: filteredItems.length > 0,
    resultCount: filteredItems.length,
  }
}

export default useSearch
