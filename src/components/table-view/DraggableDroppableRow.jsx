import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import HierarchyRow from './HierarchyRow'

export default function DraggableDroppableRow({ item, ...props }) {
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
  
  // Droppable for sibling reordering (e.g., BP receives other BPs for reorder)
  const { isOver: isOverForReorder, setNodeRef: setReorderDropRef } = useDroppable({
    id: `reorder-${item.id}`,
  })
  
  const isOver = isOverForChildren || isOverForReorder
  
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined
  
  // Combine refs
  const setNodeRef = (node) => {
    setDragRef(node)
    setChildDropRef(node)
    setReorderDropRef(node)
  }
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-teal-400 ring-inset bg-teal-50' : ''}`}
    >
      <HierarchyRow
        item={item}
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        isDropTarget={isOver}
      />
    </div>
  )
}
