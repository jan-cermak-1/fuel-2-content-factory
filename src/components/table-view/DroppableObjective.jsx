import { useDroppable } from '@dnd-kit/core'
import HierarchyRow from './HierarchyRow'

export default function DroppableObjective({ item, ...props }) {
  const { isOver, setNodeRef } = useDroppable({
    id: item.id,
  })
  
  return (
    <div 
      ref={setNodeRef}
      className={`transition-colors ${isOver ? 'bg-teal-50 ring-2 ring-teal-400 ring-inset' : ''}`}
    >
      <HierarchyRow
        item={item}
        {...props}
        isDropTarget={isOver}
      />
    </div>
  )
}
