import { useState } from 'react'
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
      
      // Handle dropzone prefix
      if (targetId.startsWith('dropzone-')) {
        targetId = targetId.replace('dropzone-', '')
      }
      
      // Handle reorder prefix (sibling reordering)
      const isReorder = targetId.startsWith('reorder-')
      if (isReorder) {
        targetId = targetId.replace('reorder-', '')
      }
      
      const targetItem = items.find(i => i.id === targetId)
      
      if (draggedItem && targetItem) {
        // Check if this is a sibling reorder (same type, same parent)
        if (draggedItem.type === targetItem.type) {
          // Find if they share a common parent
          const commonParentId = draggedItem.parentIds?.find(pid => 
            targetItem.parentIds?.includes(pid)
          )
          
          if (commonParentId) {
            // Reorder within parent - no confirmation needed
            reorderChildInParent(draggedItem.id, targetItem.id, 'after')
            setActiveId(null)
            setActiveItem(null)
            return
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
        
        {/* Table Header */}
        <div className="bg-white rounded-t-lg border border-slate-200 border-b-0">
          <div className="grid grid-cols-[56px_1fr_100px_120px_100px_80px_80px_100px_140px] gap-2 px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <div></div>
            <div>Name</div>
            <div>Impact</div>
            <div>Targeting</div>
            <div>Status</div>
            <div>Quality</div>
            <div>Usage</div>
            <div>Last Edit</div>
            <div></div>
          </div>
        </div>
        
        {/* Table Body */}
        <div className="flex-1 bg-white rounded-b-lg border border-slate-200 overflow-auto">
          <HierarchyView objectives={objectives} items={filteredItems} activeId={activeId} />
        </div>
      </div>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeItem ? (
          <div className="bg-white shadow-xl rounded-lg border-2 border-teal-500 opacity-90">
            <HierarchyRow
              item={activeItem}
              depth={0}
              isExpanded={false}
              hasChildren={false}
              onToggle={() => {}}
              onSelect={() => {}}
              isDragging
            />
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
    const children = items.filter(i => item.childIds?.includes(i.id))
    const isExpanded = expandedIds.has(item.id)
    const hasChildren = children.length > 0
    const isDragging = activeId === item.id
    
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
    
    return (
      <div key={item.id} className={isDragging ? 'opacity-30' : ''}>
        {getRowComponent()}
        {isExpanded && hasChildren && (
          <div>
            {children.map((child, index) => {
              const isLast = index === children.length - 1
              return renderItemWithChildren(child, depth + 1, childConnectorLevels, isLast)
            })}
          </div>
        )}
      </div>
    )
  }
  
  if (objectives.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No items match your filters
      </div>
    )
  }
  
  return (
    <div>
      {objectives.map((obj, index) => renderItemWithChildren(obj, 0, [], index === objectives.length - 1))}
    </div>
  )
}
