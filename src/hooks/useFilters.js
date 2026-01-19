import { useState, useMemo, useCallback } from 'react'

const defaultFilters = {
  search: '',
  types: ['objective', 'tactic', 'bestPractice', 'step'],
  statuses: ['draft', 'in-review', 'approved', 'released'],
  industries: [],
  regions: [],
  jobRoles: [],
  minQuality: 0,
  minUsage: 0,
}

export function useFilters(items) {
  const [filters, setFilters] = useState(defaultFilters)
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (!filters.types.includes(item.type)) return false
      
      // Status filter
      if (!filters.statuses.includes(item.status)) return false
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = item.name?.toLowerCase().includes(searchLower)
        const matchesDescription = item.description?.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesDescription) return false
      }
      
      // Industry filter
      if (filters.industries.length > 0) {
        const itemIndustries = item.targeting?.industries || []
        if (!filters.industries.some(i => itemIndustries.includes(i))) return false
      }
      
      // Region filter
      if (filters.regions.length > 0) {
        const itemRegions = item.targeting?.regions || []
        if (!filters.regions.some(r => itemRegions.includes(r))) return false
      }
      
      // Job Role filter
      if (filters.jobRoles.length > 0) {
        const itemRoles = item.targeting?.jobRoles || []
        if (!filters.jobRoles.some(r => itemRoles.includes(r))) return false
      }
      
      // Quality filter
      if (filters.minQuality > 0 && item.qualityScore !== undefined) {
        if (item.qualityScore < filters.minQuality) return false
      }
      
      // Usage filter
      if (filters.minUsage > 0 && item.usageCount !== undefined) {
        if (item.usageCount < filters.minUsage) return false
      }
      
      return true
    })
  }, [items, filters])
  
  const toggleFilter = useCallback((field, value) => {
    setFilters(prev => {
      const current = prev[field] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }, [])
  
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])
  
  const activeFilterCount = useMemo(() => {
    return [
      filters.types.length < 4 ? 1 : 0,
      filters.statuses.length < 4 ? 1 : 0,
      filters.industries.length > 0 ? 1 : 0,
      filters.regions.length > 0 ? 1 : 0,
      filters.jobRoles.length > 0 ? 1 : 0,
      filters.minQuality > 0 ? 1 : 0,
      filters.minUsage > 0 ? 1 : 0,
    ].reduce((a, b) => a + b, 0)
  }, [filters])
  
  return {
    filters,
    setFilters,
    filteredItems,
    toggleFilter,
    resetFilters,
    activeFilterCount,
  }
}

export default useFilters
