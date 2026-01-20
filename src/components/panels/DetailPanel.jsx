import React, { useState, useCallback } from 'react'
import { useFuel } from '../../context/FuelContext'

// Import detail components
import DetailHeader from './details/DetailHeader'
import ObjectiveDetail from './details/ObjectiveDetail'
import TacticDetail from './details/TacticDetail'
import BestPracticeDetail from './details/BestPracticeDetail'
import StepDetail from './details/StepDetail'

// Map type to component
const detailComponents = {
  objective: ObjectiveDetail,
  tactic: TacticDetail,
  bestPractice: BestPracticeDetail,
  step: StepDetail,
}

export default function DetailPanel() {
  const { 
    selectedItem, 
    setSelectedItem,
    setDetailPanelOpen, 
    updateItem,
    addItem,
    deleteItem,
    items,
  } = useFuel()
  
  // Navigation stack for drill-down
  const [navigationStack, setNavigationStack] = useState([])
  
  // Current item being viewed (last in stack or selected)
  const currentItem = navigationStack.length > 0 
    ? navigationStack[navigationStack.length - 1] 
    : selectedItem

  // Build breadcrumb from navigation stack
  const breadcrumb = navigationStack.length > 0 
    ? [selectedItem, ...navigationStack]
    : selectedItem 
      ? [selectedItem]
      : []

  // Navigate to a child item (drill down)
  const handleNavigate = useCallback((item) => {
    if (!item) return
    setNavigationStack(prev => [...prev, item])
  }, [])

  // Go back one level
  const handleBack = useCallback(() => {
    setNavigationStack(prev => prev.slice(0, -1))
  }, [])

  // Navigate to a specific item in breadcrumb
  const handleBreadcrumbNavigate = useCallback((item) => {
    if (!item) return
    
    // Find index in breadcrumb and slice stack accordingly
    const breadcrumbIndex = breadcrumb.findIndex(b => b.id === item.id)
    if (breadcrumbIndex >= 0) {
      // If it's the root item (selectedItem)
      if (breadcrumbIndex === 0) {
        setNavigationStack([])
      } else {
        // Slice to that position
        setNavigationStack(prev => prev.slice(0, breadcrumbIndex))
      }
    }
  }, [breadcrumb])

  // Close the panel
  const handleClose = useCallback(() => {
    setNavigationStack([])
    setDetailPanelOpen(false)
  }, [setDetailPanelOpen])

  // Update current item
  const handleUpdate = useCallback((updatedItem) => {
    if (updateItem) {
      updateItem(updatedItem.id, updatedItem)
    }
    // Update in navigation stack if needed
    setNavigationStack(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    )
  }, [updateItem])

  // Add child item
  const handleAddChild = useCallback((childData) => {
    if (addItem && currentItem) {
      const newChild = {
        ...childData,
        id: `${childData.type}-${Date.now()}`,
        parentIds: [currentItem.id],
        createdAt: new Date().toISOString(),
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'Current User',
        owner: 'Current User',
        qualityScore: 50,
        usageCount: 0,
      }
      addItem(newChild)
      
      // Add child ID to current item
      if (updateItem) {
        updateItem(currentItem.id, {
          childIds: [...(currentItem.childIds || []), newChild.id]
        })
      }
    }
  }, [addItem, updateItem, currentItem])

  // Delete item
  const handleDelete = useCallback(() => {
    if (deleteItem && currentItem) {
      deleteItem(currentItem.id)
      if (navigationStack.length > 0) {
        handleBack()
      } else {
        handleClose()
      }
    }
  }, [deleteItem, currentItem, navigationStack.length, handleBack, handleClose])

  // Handle using a template
  const handleUseTemplate = useCallback((childType) => {
    // This would open UseTemplateModal
    console.log('Open template picker for:', childType)
    // For now, just log - we'll integrate UseTemplateModal separately
  }, [])

  if (!selectedItem) return null
  if (!currentItem) return null

  // Get the appropriate detail component
  const DetailComponent = detailComponents[currentItem.type] || ObjectiveDetail

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with breadcrumb navigation */}
      <DetailHeader
        item={currentItem}
        breadcrumb={breadcrumb}
        onBack={navigationStack.length > 0 ? handleBack : null}
        onClose={handleClose}
        onNavigate={handleBreadcrumbNavigate}
        onEdit={() => {}}
        onDuplicate={() => {}}
        onDelete={handleDelete}
      />

      {/* Type-specific detail content */}
      <div className="flex-1 overflow-hidden">
        <DetailComponent
          item={currentItem}
          items={items}
          onUpdate={handleUpdate}
          onNavigate={handleNavigate}
          onAddChild={handleAddChild}
          onUseTemplate={handleUseTemplate}
        />
      </div>
    </div>
  )
}
