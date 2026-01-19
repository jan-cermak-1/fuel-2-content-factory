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
  
  // We need to wrap in a tbody fragment to allow for drop zones
  // The HierarchyRow is now a <tr>, so we return it directly with ref attached via a wrapper
  return (
    <>
      {/* Drop indicator BEFORE - rendered as a separate row */}
      {showDropZones && (
        <tr className="h-0 relative">
          <td colSpan={8} className="p-0 relative">
            <div 
              ref={setBeforeDropRef}
              className="absolute -top-2 left-0 right-0 h-4 z-10"
            />
            {isOverBefore && (
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-teal-500 z-20 rounded-full shadow-lg shadow-teal-500/50" />
            )}
          </td>
        </tr>
      )}
      
      {/* Main row - using a wrapper approach */}
      <HierarchyRow
        item={item}
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        isDropTarget={isOver}
        rowRef={setNodeRef}
        rowStyle={style}
      />
      
      {/* Drop indicator AFTER - rendered as a separate row */}
      {showDropZones && (
        <tr className="h-0 relative">
          <td colSpan={8} className="p-0 relative">
            <div 
              ref={setAfterDropRef}
              className="absolute -bottom-2 left-0 right-0 h-4 z-10"
            />
            {isOverAfter && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-500 z-20 rounded-full shadow-lg shadow-teal-500/50" />
            )}
          </td>
        </tr>
      )}
    </>
  )
}
