// Helper functions for managing many-to-many relationships
// Used to track which items are shared across multiple parents

import { seedData, getItemById, getParentsOf as getParentsOfFromSeedData } from './seedData'

// Re-export getParentsOf for convenience
export { getParentsOf } from './seedData'

// Internal alias
const getParentsOf = getParentsOfFromSeedData

// Get all items that are used in multiple places
export function getSharedItems(items = seedData) {
  return items.filter(item => {
    const parents = getParentsOf(item.id, items)
    return parents.length > 1
  })
}

// Get shared best practices
export function getSharedBestPractices(items = seedData) {
  return getSharedItems(items).filter(item => item.type === 'bestPractice')
}

// Get shared steps
export function getSharedSteps(items = seedData) {
  return getSharedItems(items).filter(item => item.type === 'step')
}

// Get usage count (how many parents an item has)
export function getUsageCount(itemId, items = seedData) {
  const parents = getParentsOf(itemId, items)
  return parents.length
}

// Get all parent names for an item
export function getParentNames(itemId, items = seedData) {
  const parents = getParentsOf(itemId, items)
  return parents.map(p => p.name)
}

// Check if item is shared (has multiple parents)
export function isSharedItem(itemId, items = seedData) {
  return getUsageCount(itemId, items) > 1
}

// Get items affected by editing a shared item
export function getAffectedItems(itemId, items = seedData) {
  const item = getItemById(itemId, items)
  if (!item) return []
  
  const affected = new Set()
  
  // Get all parents recursively
  function addParents(id) {
    const parents = getParentsOf(id, items)
    parents.forEach(parent => {
      affected.add(parent.id)
      addParents(parent.id)
    })
  }
  
  addParents(itemId)
  
  return [...affected].map(id => getItemById(id, items)).filter(Boolean)
}

// Get all items in a subtree (children recursively)
export function getSubtreeItems(itemId, items = seedData) {
  const item = getItemById(itemId, items)
  if (!item) return []
  
  const subtree = [item]
  
  function addChildren(parentItem) {
    if (!parentItem.childIds) return
    parentItem.childIds.forEach(childId => {
      const child = getItemById(childId, items)
      if (child) {
        subtree.push(child)
        addChildren(child)
      }
    })
  }
  
  addChildren(item)
  
  return subtree
}

// Get breadcrumb path for an item (from root to item)
export function getBreadcrumbPath(itemId, items = seedData) {
  const path = []
  let currentId = itemId
  
  while (currentId) {
    const item = getItemById(currentId, items)
    if (!item) break
    
    path.unshift(item)
    
    // Get first parent (for breadcrumb we just show one path)
    const parents = getParentsOf(currentId, items)
    currentId = parents.length > 0 ? parents[0].id : null
  }
  
  return path
}

// Group items by type
export function groupByType(items = seedData) {
  return {
    objectives: items.filter(i => i.type === 'objective'),
    tactics: items.filter(i => i.type === 'tactic'),
    bestPractices: items.filter(i => i.type === 'bestPractice'),
    steps: items.filter(i => i.type === 'step'),
  }
}

// Group items by status
export function groupByStatus(items = seedData) {
  return {
    draft: items.filter(i => i.status === 'draft'),
    'in-review': items.filter(i => i.status === 'in-review'),
    approved: items.filter(i => i.status === 'approved'),
    released: items.filter(i => i.status === 'released'),
  }
}

// Group items by industry
export function groupByIndustry(items = seedData) {
  const groups = {}
  
  items.forEach(item => {
    const industries = item.targeting?.industries || ['General']
    industries.forEach(industry => {
      if (!groups[industry]) {
        groups[industry] = []
      }
      groups[industry].push(item)
    })
  })
  
  return groups
}

// Group items by account
export function groupByAccount(items = seedData) {
  const groups = {
    'Nike': [],
    'Ford': [],
    'All': [],
  }
  
  items.forEach(item => {
    const accounts = item.targeting?.accounts || ['all']
    accounts.forEach(account => {
      const key = account === 'all' ? 'All' : account
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
  })
  
  return groups
}

export default {
  getSharedItems,
  getSharedBestPractices,
  getSharedSteps,
  getUsageCount,
  getParentNames,
  isSharedItem,
  getAffectedItems,
  getSubtreeItems,
  getBreadcrumbPath,
  groupByType,
  groupByStatus,
  groupByIndustry,
  groupByAccount,
}
