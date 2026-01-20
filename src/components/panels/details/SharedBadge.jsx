import React from 'react'
import { Link2, Users, Eye } from 'lucide-react'

// Badge showing if item is shared/used as template
export default function SharedBadge({ 
  parentCount = 0, 
  usageCount = 0,
  showUsage = true,
  size = 'sm',
  onClick,
}) {
  const isShared = parentCount > 1

  if (!isShared && !showUsage) return null

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
  }

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }

  return (
    <div className="flex items-center gap-2">
      {/* Shared badge */}
      {isShared && (
        <button
          onClick={onClick}
          className={`
            inline-flex items-center font-medium rounded-full
            bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors
            ${sizeClasses[size]}
          `}
          title={`Used in ${parentCount} parents`}
        >
          <Link2 className={iconSizes[size]} />
          <span>Shared ({parentCount})</span>
        </button>
      )}

      {/* Usage count */}
      {showUsage && usageCount > 0 && (
        <span 
          className={`
            inline-flex items-center font-medium rounded-full
            bg-slate-100 text-slate-600
            ${sizeClasses[size]}
          `}
          title={`Used by ${usageCount} accounts`}
        >
          <Users className={iconSizes[size]} />
          <span>{usageCount.toLocaleString()}</span>
        </span>
      )}
    </div>
  )
}

// Inline version for table/list views
export function SharedBadgeInline({ parentCount = 0, onClick }) {
  const isShared = parentCount > 1
  
  if (!isShared) return null
  
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-0.5 text-[10px] text-violet-600 hover:text-violet-700"
      title={`Used in ${parentCount} parents`}
    >
      <Link2 className="w-2.5 h-2.5" />
      {parentCount}
    </button>
  )
}

// Detail panel showing all parents
export function SharedParentsList({ 
  parents = [],
  onNavigate,
}) {
  if (!parents || parents.length <= 1) return null
  
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4 text-violet-600" />
        <span className="text-sm font-medium text-violet-700">
          Shared across {parents.length} items
        </span>
      </div>
      <p className="text-xs text-violet-600 mb-3">
        Changes to this item will affect all linked parents.
      </p>
      <div className="space-y-1">
        {parents.map(parent => (
          <button
            key={parent.id}
            onClick={() => onNavigate?.(parent)}
            className="w-full flex items-center justify-between px-2 py-1.5 bg-white rounded border border-violet-200 hover:border-violet-300 transition-colors text-left"
          >
            <span className="text-sm text-slate-700 truncate">{parent.name}</span>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  )
}

// Hook to check if item is shared
export function useIsShared(item, items) {
  if (!item?.parentIds) return false
  return item.parentIds.length > 1
}
