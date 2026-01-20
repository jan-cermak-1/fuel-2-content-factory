import React, { useState } from 'react'
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useFuel } from '../../context/FuelContext'
import { getRootItems, getChildrenOf } from '../../data/seedData'
import HierarchyRow from './HierarchyRow'
import DraggableRow from './DraggableRow'
import DroppableObjective from './DroppableObjective'
import DraggableDroppableRow from './DraggableDroppableRow'
import DragConfirmModal from './DragConfirmModal'

export default function TableView() {
  const { items, getFilteredItems, moveItem, duplicateItemTo, reorderChildInParent } = useFuel()
  const [activeId, setActiveId] = useState(null)
  const [activeItem, setActiveItem] = useState(null)
  
  // Drag confirm modal state
  const [dragConfirm, setDragConfirm] = useState({
    isOpen: false,
    item: null,
    targetParent: null,
  })
  
  const filteredItems = getFilteredItems()
  const objectives = filteredItems.filter(item => item.type === 'objective')
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
    const item = items.find(i => i.id === active.id)
    setActiveItem(item)
  }
  
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const draggedItem = items.find(i => i.id === active.id)
      let targetId = over.id
      let position = 'after' // default position for reorder
      
      // Handle dropzone prefix (for parent-child drops)
      if (targetId.startsWith('dropzone-')) {
        targetId = targetId.replace('dropzone-', '')
      }
      
      // Handle reorder-before prefix (sibling reordering - insert before)
      if (targetId.startsWith('reorder-before-')) {
        targetId = targetId.replace('reorder-before-', '')
        position = 'before'
      }
      
      // Handle reorder-after prefix (sibling reordering - insert after)
      if (targetId.startsWith('reorder-after-')) {
        targetId = targetId.replace('reorder-after-', '')
        position = 'after'
      }
      
      // Legacy reorder prefix
      if (targetId.startsWith('reorder-')) {
        targetId = targetId.replace('reorder-', '')
      }
      
      const targetItem = items.find(i => i.id === targetId)
      
      if (draggedItem && targetItem) {
        // Check if this is a sibling reorder (same type, same parent)
        if (draggedItem.type === targetItem.type && draggedItem.id !== targetItem.id) {
          // Find if they share a common parent
          const commonParentId = draggedItem.parentIds?.find(pid => 
            targetItem.parentIds?.includes(pid)
          )
          
          if (commonParentId) {
            // Reorder within parent - no confirmation needed
            reorderChildInParent(draggedItem.id, targetItem.id, position)
            setActiveId(null)
            setActiveItem(null)
            return
          } else {
            // Same type but different parent - move to target's parent with confirmation
            // Find the target's parent that can accept this item type
            const parentTypeMap = {
              'tactic': 'objective',
              'bestPractice': 'tactic',
              'step': 'bestPractice',
            }
            const neededParentType = parentTypeMap[draggedItem.type]
            
            if (neededParentType && targetItem.parentIds?.length > 0) {
              const targetParent = items.find(i => 
                targetItem.parentIds.includes(i.id) && i.type === neededParentType
              )
              
              if (targetParent) {
                setDragConfirm({
                  isOpen: true,
                  item: draggedItem,
                  targetParent: targetParent,
                })
                setActiveId(null)
                setActiveItem(null)
                return
              }
            }
          }
        }
        
        // Check if dropping on a valid parent (different parent)
        const validMoves = {
          'tactic': 'objective',
          'bestPractice': 'tactic',
          'step': 'bestPractice',
        }
        
        if (validMoves[draggedItem.type] === targetItem.type) {
          // Show confirmation modal for moving to different parent
          setDragConfirm({
            isOpen: true,
            item: draggedItem,
            targetParent: targetItem,
          })
        }
      }
    }
    
    setActiveId(null)
    setActiveItem(null)
  }
  
  const handleDragMove = () => {
    if (dragConfirm.item && dragConfirm.targetParent) {
      moveItem(dragConfirm.item.id, dragConfirm.targetParent.id)
    }
    setDragConfirm({ isOpen: false, item: null, targetParent: null })
  }
  
  const handleDragCopy = () => {
    if (dragConfirm.item && dragConfirm.targetParent) {
      duplicateItemTo(dragConfirm.item.id, dragConfirm.targetParent.id)
    }
    setDragConfirm({ isOpen: false, item: null, targetParent: null })
  }
  
  const handleDragConfirmClose = () => {
    setDragConfirm({ isOpen: false, item: null, targetParent: null })
  }
  
  const handleDragCancel = () => {
    setActiveId(null)
    setActiveItem(null)
  }
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-full flex flex-col">
        {/* Drag hint */}
        <div className="mb-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
          💡 Tip: Drag items to move them between parents. Right-click for more options.
        </div>
        
        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto bg-white rounded-lg border border-slate-200">
          <table className="w-full border-collapse min-w-[1000px]">
            <colgroup>
              <col style={{ minWidth: '400px' }} />
              <col className="w-[110px] min-w-[110px]" />
              <col className="w-[12%] min-w-[140px]" />
              <col className="w-[7%] min-w-[80px]" />
              <col className="w-[7%] min-w-[80px]" />
              <col className="w-[12%] min-w-[140px]" />
            </colgroup>
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-white border-b border-slate-200">
              <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="sticky left-0 z-30 bg-white text-left px-4 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-2">
                    <span className="w-14"></span>
                    <span>Name</span>
                  </div>
                </th>
                <th className="text-left px-3 py-3">Status</th>
                <th className="text-left px-3 py-3">Targeting</th>
                <th className="text-left px-3 py-3">Quality</th>
                <th className="text-left px-3 py-3">Usage</th>
                <th className="text-left px-3 py-3">Last Edit</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              <HierarchyView objectives={objectives} items={filteredItems} activeId={activeId} />
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeItem ? (
          <div className="bg-white shadow-xl rounded-lg border-2 border-teal-500 opacity-90 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                activeItem.type === 'objective' ? 'bg-violet-100 text-violet-700' :
                activeItem.type === 'tactic' ? 'bg-blue-100 text-blue-700' :
                activeItem.type === 'bestPractice' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {activeItem.type === 'objective' ? 'OBJ' :
                 activeItem.type === 'tactic' ? 'TAC' :
                 activeItem.type === 'bestPractice' ? 'BP' : 'STEP'}
              </span>
              <span className="text-sm font-medium text-slate-900">{activeItem.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
      
      {/* Drag Confirm Modal */}
      <DragConfirmModal
        isOpen={dragConfirm.isOpen}
        onClose={handleDragConfirmClose}
        item={dragConfirm.item}
        targetParent={dragConfirm.targetParent}
        onMove={handleDragMove}
        onCopy={handleDragCopy}
      />
    </DndContext>
  )
}

function HierarchyView({ objectives, items, activeId }) {
  const { expandedIds, toggleExpanded, selectItem } = useFuel()
  
  // Render item with tree structure info
  // connectorLevels: array of booleans indicating which depth levels have continuing vertical lines
  const renderItemWithChildren = (item, depth = 0, connectorLevels = [], isLastSibling = true) => {
    // Get children in the order specified by childIds (important for reordering!)
    const children = (item.childIds || [])
      .map(childId => items.find(i => i.id === childId))
      .filter(Boolean)
    const isExpanded = expandedIds.has(item.id)
    const hasChildren = children.length > 0
    
    // Tree structure props
    const treeProps = {
      connectorLevels,
      isLastSibling,
    }
    
    const getRowComponent = () => {
      switch (item.type) {
        case 'objective':
          return (
            <DroppableObjective
              key={item.id}
              item={item}
              depth={depth}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              onToggle={() => toggleExpanded(item.id)}
              onSelect={() => selectItem(item.id)}
              treeProps={treeProps}
            />
          )
        case 'tactic':
        case 'bestPractice':
          return (
            <DraggableDroppableRow
              key={item.id}
              item={item}
              depth={depth}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              onToggle={() => toggleExpanded(item.id)}
              onSelect={() => selectItem(item.id)}
              treeProps={treeProps}
            />
          )
        case 'step':
        default:
          return (
            <DraggableRow
              key={item.id}
              item={item}
              depth={depth}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              onToggle={() => toggleExpanded(item.id)}
              onSelect={() => selectItem(item.id)}
              treeProps={treeProps}
            />
          )
      }
    }
    
    // Calculate connector levels for children
    // If this item is not the last sibling, add a connector at current depth
    const childConnectorLevels = [...connectorLevels]
    if (depth > 0) {
      // At the current depth, if we're not the last sibling, we need a vertical line
      childConnectorLevels[depth - 1] = !isLastSibling
    }
    // Add a new level for children (will be set per-child based on their position)
    childConnectorLevels[depth] = true
    
    // Components now return <tr> elements (or fragments with <tr>), so we return them directly
    return (
      <React.Fragment key={item.id}>
        {getRowComponent()}
        {isExpanded && hasChildren && (
          children.map((child, index) => {
            const isLast = index === children.length - 1
            return renderItemWithChildren(child, depth + 1, childConnectorLevels, isLast)
          })
        )}
      </React.Fragment>
    )
  }
  
  if (objectives.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="text-center py-16 text-slate-500">
          No items match your filters
        </td>
      </tr>
    )
  }
  
  return (
    <>
      {objectives.map((obj, index) => renderItemWithChildren(obj, 0, [], index === objectives.length - 1))}
    </>
  )
}
