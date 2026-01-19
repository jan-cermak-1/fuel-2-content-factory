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
import DragConfirmModal from './DragConfirmModal'
import PerspectiveSwitcher from './PerspectiveSwitcher'
import { groupByIndustry, groupByAccount } from '../../data/relationships'

export default function TableView() {
  const { items, perspective, getFilteredItems, moveItem, duplicateItemTo } = useFuel()
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
      
      const targetParent = items.find(i => i.id === targetId)
      
      // Check if dropping on a valid parent
      if (draggedItem && targetParent) {
        const validMoves = {
          'tactic': 'objective',
          'bestPractice': 'tactic',
          'step': 'bestPractice',
        }
        
        if (validMoves[draggedItem.type] === targetParent.type) {
          // Show confirmation modal
          setDragConfirm({
            isOpen: true,
            item: draggedItem,
            targetParent: targetParent,
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
  
  // Group items based on perspective
  const renderContent = () => {
    switch (perspective) {
      case 'industry':
        return <IndustryView items={filteredItems} />
      case 'account':
        return <AccountView items={filteredItems} />
      default:
        return <HierarchyView objectives={objectives} items={filteredItems} activeId={activeId} />
    }
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
        {/* Perspective Switcher */}
        <div className="mb-4">
          <PerspectiveSwitcher />
        </div>
        
        {/* Drag hint */}
        {perspective === 'hierarchy' && (
          <div className="mb-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            💡 Tip: Drag items to move them between parents. Right-click for more options.
          </div>
        )}
        
        {/* Table Header */}
        <div className="bg-white rounded-t-lg border border-slate-200 border-b-0">
          <div className="grid grid-cols-[40px_1fr_100px_120px_100px_80px_80px_100px_140px] gap-2 px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
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
          {renderContent()}
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
  
  const renderItemWithChildren = (item, depth = 0) => {
    const children = items.filter(i => item.childIds?.includes(i.id))
    const isExpanded = expandedIds.has(item.id)
    const hasChildren = children.length > 0
    const isDragging = activeId === item.id
    
    // Determine if this item can be dragged
    const canDrag = item.type !== 'objective' // Objectives cannot be dragged (they are top level)
    
    // Determine if this item can receive drops
    const canReceiveDrop = item.type === 'objective' || item.type === 'tactic' || item.type === 'bestPractice'
    
    return (
      <div key={item.id} className={isDragging ? 'opacity-30' : ''}>
        {canDrag ? (
          <DraggableRow
            item={item}
            depth={depth}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggle={() => toggleExpanded(item.id)}
            onSelect={() => selectItem(item.id)}
          />
        ) : canReceiveDrop ? (
          <DroppableObjective
            item={item}
            depth={depth}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggle={() => toggleExpanded(item.id)}
            onSelect={() => selectItem(item.id)}
          />
        ) : (
          <HierarchyRow
            item={item}
            depth={depth}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggle={() => toggleExpanded(item.id)}
            onSelect={() => selectItem(item.id)}
          />
        )}
        {isExpanded && hasChildren && (
          <div>
            {children.map(child => renderItemWithChildren(child, depth + 1))}
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
      {objectives.map(obj => renderItemWithChildren(obj, 0))}
    </div>
  )
}

function IndustryView({ items }) {
  const { selectItem } = useFuel()
  const groups = groupByIndustry(items)
  
  return (
    <div className="divide-y divide-slate-100">
      {Object.entries(groups).map(([industry, industryItems]) => (
        <div key={industry} className="py-2">
          <div className="px-4 py-2 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">
              {industry}
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({industryItems.length} items)
              </span>
            </h3>
          </div>
          {industryItems.map(item => (
            <HierarchyRow
              key={item.id}
              item={item}
              depth={0}
              isExpanded={false}
              hasChildren={false}
              onToggle={() => {}}
              onSelect={() => selectItem(item.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function AccountView({ items }) {
  const { selectItem } = useFuel()
  const groups = groupByAccount(items)
  
  return (
    <div className="divide-y divide-slate-100">
      {Object.entries(groups).map(([account, accountItems]) => (
        <div key={account} className="py-2">
          <div className="px-4 py-2 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">
              {account}
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({accountItems.length} items)
              </span>
            </h3>
          </div>
          {accountItems.map(item => (
            <HierarchyRow
              key={item.id}
              item={item}
              depth={0}
              isExpanded={false}
              hasChildren={false}
              onToggle={() => {}}
              onSelect={() => selectItem(item.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
