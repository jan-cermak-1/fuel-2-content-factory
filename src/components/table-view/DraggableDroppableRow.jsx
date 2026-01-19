import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useDndContext } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import HierarchyRow from './HierarchyRow'

export default function DraggableDroppableRow({ item, ...props }) {
  // Get global drag state to know when ANY item is being dragged
  const { active } = useDndContext()
  const isSomethingDragging = !!active
  
  // Draggable functionality
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
  })
  
  // Droppable for children (e.g., BP receives steps)
  const { isOver: isOverForChildren, setNodeRef: setChildDropRef } = useDroppable({
    id: `dropzone-${item.id}`,
  })
  
  // Droppable for sibling reordering - drop BEFORE this item
  const { isOver: isOverBefore, setNodeRef: setBeforeDropRef } = useDroppable({
    id: `reorder-before-${item.id}`,
  })
  
  // Droppable for sibling reordering - drop AFTER this item
  const { isOver: isOverAfter, setNodeRef: setAfterDropRef } = useDroppable({
    id: `reorder-after-${item.id}`,
  })
  
  const isOver = isOverForChildren
  
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined
  
  // Combine refs for main element
  const setNodeRef = (node) => {
    setDragRef(node)
    setChildDropRef(node)
  }
  
  // Only show drop zones when something is being dragged (but not this item itself)
  const showDropZones = isSomethingDragging && !isDragging
  
  return (
    <div className="relative">
      {/* Drop indicator BEFORE - only active when dragging */}
      {showDropZones && (
        <div 
          ref={setBeforeDropRef}
          className="absolute top-0 left-0 right-0 h-1/2 z-10"
        />
      )}
      {isOverBefore && showDropZones && (
        <div className="absolute top-0 left-4 right-4 h-0.5 bg-teal-500 z-20 rounded-full shadow-lg shadow-teal-500/50" />
      )}
      
      {/* Main row */}
      <div 
        ref={setNodeRef} 
        style={style}
        className={`${isDragging ? 'opacity-30 bg-slate-100' : ''} ${isOver ? 'ring-2 ring-teal-400 ring-inset bg-teal-50' : ''}`}
      >
        <HierarchyRow
          item={item}
          {...props}
          dragHandleProps={{ ...attributes, ...listeners }}
          isDragging={isDragging}
          isDropTarget={isOver}
        />
      </div>
      
      {/* Drop indicator AFTER - only active when dragging */}
      {showDropZones && (
        <div 
          ref={setAfterDropRef}
          className="absolute bottom-0 left-0 right-0 h-1/2 z-10"
        />
      )}
      {isOverAfter && showDropZones && (
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-500 z-20 rounded-full shadow-lg shadow-teal-500/50" />
      )}
    </div>
  )
}
