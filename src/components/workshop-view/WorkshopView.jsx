import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useFuel } from '../../context/FuelContext'
import KanbanColumn from './KanbanColumn'
import ContentCard from './ContentCard'

const columns = [
  { id: 'draft', title: 'Draft', color: 'bg-sky-500' },
  { id: 'in-review', title: 'In Review', color: 'bg-amber-500' },
  { id: 'approved', title: 'Approved', color: 'bg-blue-500' },
  { id: 'released', title: 'Released', color: 'bg-emerald-500' },
]

export default function WorkshopView() {
  const { getFilteredItems, updateItemStatus, selectItem } = useFuel()
  const [activeId, setActiveId] = useState(null)
  
  const items = getFilteredItems()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )
  
  const getItemsByStatus = (status) => {
    return items.filter(item => item.status === status)
  }
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }
  
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      return
    }
    
    const activeItem = items.find(item => item.id === active.id)
    const overColumn = columns.find(col => col.id === over.id)
    
    if (overColumn && activeItem) {
      // Validate status transition
      const currentStatus = activeItem.status
      const newStatus = overColumn.id
      
      // Can't skip to Released without being Approved
      if (newStatus === 'released' && currentStatus !== 'approved') {
        // Show warning or prevent
        console.warn('Item must be approved before releasing')
        setActiveId(null)
        return
      }
      
      updateItemStatus(active.id, newStatus)
    }
    
    setActiveId(null)
  }
  
  const handleDragOver = (event) => {
    const { active, over } = event
    
    if (!over) return
    
    // Find if over is a column or item
    const overColumn = columns.find(col => col.id === over.id)
    const overItem = items.find(item => item.id === over.id)
    
    if (overColumn || overItem) {
      // Visual feedback handled by column
    }
  }
  
  const activeItem = activeId ? items.find(item => item.id === activeId) : null
  
  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-4 gap-4 h-full">
          {columns.map((column) => {
            const columnItems = getItemsByStatus(column.id)
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                items={columnItems}
                onSelectItem={selectItem}
              />
            )
          })}
        </div>
        
        <DragOverlay>
          {activeItem ? (
            <ContentCard item={activeItem} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
