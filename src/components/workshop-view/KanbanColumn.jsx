import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import ContentCard from './ContentCard'

export default function KanbanColumn({ column, items, onSelectItem }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })
  
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full bg-slate-50 rounded-xl transition-colors
        ${isOver ? 'bg-slate-100 ring-2 ring-teal-500 ring-inset' : ''}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-slate-900">{column.title}</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-600 rounded-full">
            {items.length}
          </span>
        </div>
      </div>
      
      {/* Column Content */}
      <div className="flex-1 p-2 overflow-y-auto">
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onClick={() => onSelectItem(item.id)}
              />
            ))}
          </div>
        </SortableContext>
        
        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-slate-400">
            No items
          </div>
        )}
      </div>
    </div>
  )
}
