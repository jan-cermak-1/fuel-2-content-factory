import { createContext, useContext, useState, useCallback } from 'react'
import { seedData, getItemById, getChildrenOf, getParentsOf } from '../data/seedData'
import { accountProfiles } from '../data/accountProfiles'
import { successStories } from '../data/successStories'
import { mockUsageData } from '../data/mockUsageData'

const FuelContext = createContext(null)

export function FuelProvider({ children }) {
  // Content state
  const [items, setItems] = useState(seedData)
  const [expandedIds, setExpandedIds] = useState(new Set(['obj-1', 'obj-2']))
  const [selectedId, setSelectedId] = useState(null)
  
  // View state
  const [activeTab, setActiveTab] = useState('content') // 'content' | 'shared' | 'analytics'
  const [viewMode, setViewMode] = useState('table') // 'table' | 'workshop'
  const [perspective, setPerspective] = useState('hierarchy') // 'hierarchy' | 'industry' | 'account'
  
  // Panel state
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    types: ['objective', 'tactic', 'bestPractice', 'step'],
    statuses: ['draft', 'in-review', 'approved', 'released'],
    industries: [],
    regions: [],
    jobRoles: [],
    minQuality: 0,
    minUsage: 0,
  })
  const [savedViews, setSavedViews] = useState([
    { id: 'sv-1', name: 'My drafts awaiting review', filters: { statuses: ['draft', 'in-review'] } },
    { id: 'sv-2', name: 'High-performing (Finance)', filters: { industries: ['Finance'], minQuality: 80 } },
    { id: 'sv-3', name: 'Low adoption items', filters: { minUsage: 0, maxUsage: 50 } },
  ])
  
  // View-as account
  const [viewAsAccount, setViewAsAccount] = useState('all')
  
  // AI generation state
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiResults, setAiResults] = useState([])
  
  // Toggle expand/collapse
  const toggleExpanded = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])
  
  // Select item and open detail panel
  const selectItem = useCallback((id) => {
    setSelectedId(id)
    setDetailPanelOpen(true)
  }, [])
  
  // Update item
  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, lastEditedAt: new Date().toISOString() } : item
    ))
  }, [])
  
  // Update item status (for drag-drop in Kanban)
  const updateItemStatus = useCallback((id, newStatus) => {
    updateItem(id, { status: newStatus })
  }, [updateItem])
  
  // Add new item
  const addItem = useCallback((item) => {
    setItems(prev => [...prev, {
      ...item,
      id: `${item.type}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
    }])
  }, [])
  
  // Delete item
  const deleteItem = useCallback((id) => {
    setItems(prev => {
      // Find item to delete
      const itemToDelete = prev.find(item => item.id === id)
      if (!itemToDelete) return prev
      
      // Remove from parent's childIds
      return prev
        .filter(item => item.id !== id)
        .map(item => {
          if (item.childIds?.includes(id)) {
            return { ...item, childIds: item.childIds.filter(cid => cid !== id) }
          }
          return item
        })
    })
  }, [])
  
  // Recursive function to duplicate item and all its children
  const duplicateItemRecursive = useCallback((itemId, itemsList, newParentId = null) => {
    const original = itemsList.find(item => item.id === itemId)
    if (!original) return { newId: null, newItems: [] }
    
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    const newId = `${original.type}-${timestamp}-${random}`
    
    // Duplicate the item
    const duplicate = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
      status: 'draft',
      childIds: [],
      parentIds: newParentId ? [newParentId] : original.parentIds || [],
    }
    
    const newItems = [duplicate]
    
    // Recursively duplicate all children
    if (original.childIds && original.childIds.length > 0) {
      original.childIds.forEach(childId => {
        const childResult = duplicateItemRecursive(childId, itemsList, newId)
        if (childResult.newId) {
          duplicate.childIds.push(childResult.newId)
          newItems.push(...childResult.newItems)
        }
      })
    }
    
    return { newId, newItems }
  }, [])
  
  // Duplicate item
  const duplicateItem = useCallback((id) => {
    const result = duplicateItemRecursive(id, items)
    if (!result.newId) return
    
    setItems(prev => {
      const newItems = [...prev, ...result.newItems]
      
      // If original has parents, add duplicate to same parents
      const original = items.find(item => item.id === id)
      if (original?.parentIds?.length > 0) {
        return newItems.map(item => {
          if (original.parentIds.includes(item.id)) {
            return { ...item, childIds: [...(item.childIds || []), result.newId] }
          }
          return item
        })
      }
      
      return newItems
    })
    
    return result.newId
  }, [items, duplicateItemRecursive])
  
  // Duplicate item to specific parent
  const duplicateItemTo = useCallback((id, targetParentId) => {
    const result = duplicateItemRecursive(id, items, targetParentId)
    if (!result.newId) return
    
    setItems(prev => {
      const newItems = [...prev, ...result.newItems]
      // Update target parent to include the duplicate
      return newItems.map(item => {
        if (item.id === targetParentId) {
          return { ...item, childIds: [...(item.childIds || []), result.newId] }
        }
        return item
      })
    })
    
    return result.newId
  }, [items, duplicateItemRecursive])
  
  // Duplicate item to multiple parents
  const duplicateItemToMultiple = useCallback((id, targetParentIds) => {
    if (!targetParentIds.length) return
    
    const allNewItems = []
    const parentUpdates = {}
    const newIds = []
    
    targetParentIds.forEach((parentId) => {
      const result = duplicateItemRecursive(id, items, parentId)
      if (result.newId) {
        newIds.push(result.newId)
        allNewItems.push(...result.newItems)
        
        if (!parentUpdates[parentId]) {
          parentUpdates[parentId] = []
        }
        parentUpdates[parentId].push(result.newId)
      }
    })
    
    setItems(prev => {
      const updated = [...prev, ...allNewItems]
      return updated.map(item => {
        if (parentUpdates[item.id]) {
          return { 
            ...item, 
            childIds: [...(item.childIds || []), ...parentUpdates[item.id]] 
          }
        }
        return item
      })
    })
    
    return newIds
  }, [items, duplicateItemRecursive])
  
  // Reorder item within the same parent (no confirmation needed)
  const reorderChildInParent = useCallback((itemId, targetSiblingId, position = 'after') => {
    setItems(prev => {
      const itemToMove = prev.find(i => i.id === itemId)
      const targetSibling = prev.find(i => i.id === targetSiblingId)
      
      if (!itemToMove || !targetSibling) return prev
      
      // Items must be of the same type
      if (itemToMove.type !== targetSibling.type) return prev
      
      // Find common parent
      const commonParentId = itemToMove.parentIds?.find(pid => 
        targetSibling.parentIds?.includes(pid)
      )
      
      if (!commonParentId) return prev
      
      return prev.map(item => {
        if (item.id === commonParentId && item.childIds) {
          const childIds = [...item.childIds]
          const fromIndex = childIds.indexOf(itemId)
          const toIndex = childIds.indexOf(targetSiblingId)
          
          if (fromIndex === -1 || toIndex === -1) return item
          if (fromIndex === toIndex) return item
          
          // Remove from current position
          childIds.splice(fromIndex, 1)
          
          // Calculate new index after removal
          let newToIndex = childIds.indexOf(targetSiblingId)
          
          // Insert before or after target
          if (position === 'before') {
            childIds.splice(newToIndex, 0, itemId)
          } else {
            childIds.splice(newToIndex + 1, 0, itemId)
          }
          
          return { ...item, childIds }
        }
        return item
      })
    })
  }, [])
  
  // Move item to new parent
  const moveItem = useCallback((itemId, newParentId) => {
    setItems(prev => {
      const itemToMove = prev.find(i => i.id === itemId)
      if (!itemToMove) return prev
      
      // Validate move is allowed
      const newParent = prev.find(i => i.id === newParentId)
      if (!newParent) return prev
      
      // Check type compatibility
      const validMoves = {
        'tactic': 'objective',
        'bestPractice': 'tactic',
        'step': 'bestPractice',
      }
      
      if (validMoves[itemToMove.type] !== newParent.type) {
        console.warn(`Cannot move ${itemToMove.type} to ${newParent.type}`)
        return prev
      }
      
      // Already a child of this parent?
      if (itemToMove.parentIds?.includes(newParentId)) {
        return prev
      }
      
      return prev.map(item => {
        // Remove from old parent's childIds
        if (item.childIds?.includes(itemId) && item.id !== newParentId) {
          return { ...item, childIds: item.childIds.filter(id => id !== itemId) }
        }
        
        // Add to new parent's childIds
        if (item.id === newParentId && !item.childIds?.includes(itemId)) {
          return { ...item, childIds: [...(item.childIds || []), itemId] }
        }
        
        // Update item's parentIds
        if (item.id === itemId) {
          // Replace old parents with new parent (or add to existing)
          const oldParentIds = item.parentIds || []
          const newParentIds = oldParentIds.filter(pid => {
            const parent = prev.find(p => p.id === pid)
            return parent?.type !== newParent.type
          })
          return { 
            ...item, 
            parentIds: [...newParentIds, newParentId],
            lastEditedAt: new Date().toISOString()
          }
        }
        
        return item
      })
    })
  }, [])
  
  // Get filtered items
  const getFilteredItems = useCallback(() => {
    return items.filter(item => {
      // Type filter
      if (!filters.types.includes(item.type)) return false
      
      // Status filter
      if (!filters.statuses.includes(item.status)) return false
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(searchLower)
        const matchesDescription = item.description?.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesDescription) return false
      }
      
      // Industry filter
      if (filters.industries.length > 0) {
        if (!item.targeting?.industries?.some(i => filters.industries.includes(i))) return false
      }
      
      // Region filter
      if (filters.regions.length > 0) {
        if (!item.targeting?.regions?.some(r => filters.regions.includes(r))) return false
      }
      
      // Quality filter
      if (item.qualityScore !== undefined && item.qualityScore < filters.minQuality) return false
      
      // Usage filter
      if (item.usageCount !== undefined && item.usageCount < filters.minUsage) return false
      
      return true
    })
  }, [items, filters])
  
  // Get items by status (for Kanban)
  const getItemsByStatus = useCallback((status) => {
    return getFilteredItems().filter(item => item.status === status)
  }, [getFilteredItems])
  
  // Get items by type
  const getItemsByType = useCallback((type) => {
    return items.filter(item => item.type === type)
  }, [items])
  
  // Get shared components (best practices and steps used in multiple places)
  const getSharedComponents = useCallback(() => {
    return items.filter(item => {
      if (item.type !== 'bestPractice' && item.type !== 'step') return false
      const parents = getParentsOf(item.id, items)
      return parents.length > 1
    })
  }, [items])
  
  // Simulate AI generation
  const generateWithAI = useCallback(async (config) => {
    setAiGenerating(true)
    setAiResults([])
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock results
    const results = []
    const { parentId, generateType, quantity, targetVariants } = config
    
    for (let i = 0; i < quantity; i++) {
      results.push({
        id: `ai-result-${Date.now()}-${i}`,
        type: generateType,
        name: `AI Generated ${generateType} ${i + 1}`,
        description: `This is an AI-generated ${generateType} based on the context of the parent item and targeting preferences.`,
        qualityScore: Math.floor(Math.random() * 20) + 75,
        targeting: targetVariants,
        aiTips: [
          'Consider adding specific metrics for ROI tracking',
          'Clarify target audience for better relevance',
          'Add compliance considerations for EU markets',
        ],
        status: 'draft',
      })
    }
    
    setAiResults(results)
    setAiGenerating(false)
    
    return results
  }, [])
  
  // Accept AI result
  const acceptAIResult = useCallback((result) => {
    addItem({
      ...result,
      id: undefined, // Will be generated by addItem
    })
    setAiResults(prev => prev.filter(r => r.id !== result.id))
  }, [addItem])
  
  // Dismiss AI result
  const dismissAIResult = useCallback((resultId) => {
    setAiResults(prev => prev.filter(r => r.id !== resultId))
  }, [])
  
  const value = {
    // Data
    items,
    accountProfiles,
    successStories,
    usageData: mockUsageData,
    
    // Expansion state
    expandedIds,
    toggleExpanded,
    
    // Selection state
    selectedId,
    selectItem,
    selectedItem: items.find(i => i.id === selectedId),
    
    // View state
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    perspective,
    setPerspective,
    
    // Panel state
    detailPanelOpen,
    setDetailPanelOpen,
    aiPanelOpen,
    setAiPanelOpen,
    filterPanelOpen,
    setFilterPanelOpen,
    
    // Filter state
    filters,
    setFilters,
    savedViews,
    setSavedViews,
    
    // View-as account
    viewAsAccount,
    setViewAsAccount,
    
    // Item operations
    updateItem,
    updateItemStatus,
    addItem,
    deleteItem,
    duplicateItem,
    duplicateItemTo,
    duplicateItemToMultiple,
    moveItem,
    reorderChildInParent,
    
    // Getters
    getFilteredItems,
    getItemsByStatus,
    getItemsByType,
    getSharedComponents,
    getItemById: (id) => getItemById(id, items),
    getChildrenOf: (id) => getChildrenOf(id, items),
    getParentsOf: (id) => getParentsOf(id, items),
    
    // AI
    aiGenerating,
    aiResults,
    generateWithAI,
    acceptAIResult,
    dismissAIResult,
  }
  
  return (
    <FuelContext.Provider value={value}>
      {children}
    </FuelContext.Provider>
  )
}

export function useFuel() {
  const context = useContext(FuelContext)
  if (!context) {
    throw new Error('useFuel must be used within a FuelProvider')
  }
  return context
}

export default FuelContext
