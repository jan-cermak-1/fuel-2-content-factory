import { useDroppable } from '@dnd-kit/core'
import HierarchyRow from './HierarchyRow'

export default function DroppableObjective({ item, ...props }) {
  const { isOver, setNodeRef } = useDroppable({
    id: item.id,
  })
  
  return (
    <HierarchyRow
      item={item}
      {...props}
      isDropTarget={isOver}
      rowRef={setNodeRef}
    />
  )
}
