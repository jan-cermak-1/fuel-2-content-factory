import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import HierarchyRow from './HierarchyRow'

export default function DraggableRow({ item, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
  })
  
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={isDragging ? 'opacity-50' : ''}
    >
      <HierarchyRow
        item={item}
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  )
}
