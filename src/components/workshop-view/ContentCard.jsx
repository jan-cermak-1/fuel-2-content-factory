import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Link2 } from 'lucide-react'
import QualityScore from '../table-view/QualityScore'
import ImpactBadge from '../table-view/ImpactBadge'
import TargetingPills from '../table-view/TargetingPills'

const typeConfig = {
  objective: { label: 'OBJ', color: 'bg-violet-100 text-violet-700' },
  tactic: { label: 'TAC', color: 'bg-blue-100 text-blue-700' },
  bestPractice: { label: 'BP', color: 'bg-emerald-100 text-emerald-700' },
  step: { label: 'STEP', color: 'bg-slate-100 text-slate-700' },
}

export default function ContentCard({ item, onClick, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const typeInfo = typeConfig[item.type]
  const parentCount = item.parentIds?.length || 0
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200 p-3 cursor-pointer
        hover:shadow-md hover:border-slate-300 transition-all
        ${isDragging || isSortableDragging ? 'opacity-50 rotate-2 shadow-lg' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
        
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      
      {/* Title */}
      <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">
        {item.name}
      </h4>
      
      {/* Metrics Row */}
      <div className="flex items-center gap-2 mb-2">
        <ImpactBadge usageCount={item.usageCount} qualityScore={item.qualityScore} />
        {item.qualityScore !== undefined && (
          <QualityScore score={item.qualityScore} size="sm" />
        )}
      </div>
      
      {/* Targeting */}
      <div className="mb-2">
        <TargetingPills targeting={item.targeting} maxPills={2} />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        {item.usageCount !== undefined && (
          <span>{item.usageCount} accounts</span>
        )}
      </div>
    </div>
  )
}
