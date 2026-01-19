import { 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal,
  Sparkles,
  Copy,
  Trash2,
  ExternalLink,
  GripVertical,
  MoveVertical,
  Link2,
  Unlink
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusDropdown from './StatusDropdown'
import QualityScore from './QualityScore'
import TargetingPills from './TargetingPills'
import ImpactBadge from './ImpactBadge'
import UsedInBadge from './UsedInBadge'
import InlineEditor from './InlineEditor'
import QuickActions from './QuickActions'
import { useFuel } from '../../context/FuelContext'
import { formatDistanceToNow } from 'date-fns'

const typeConfig = {
  objective: { label: 'OBJ', color: 'bg-violet-100 text-violet-700' },
  tactic: { label: 'TAC', color: 'bg-blue-100 text-blue-700' },
  bestPractice: { label: 'BP', color: 'bg-emerald-100 text-emerald-700' },
  step: { label: 'STEP', color: 'bg-slate-100 text-slate-700' },
}

export default function HierarchyRow({ 
  item, 
  depth = 0, 
  isExpanded, 
  hasChildren, 
  onToggle, 
  onSelect,
  dragHandleProps,
  isDragging,
  isDropTarget
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { updateItem, setAiPanelOpen, items, duplicateItem, deleteItem } = useFuel()
  
  const typeInfo = typeConfig[item.type]
  const indent = depth * 24
  
  // Get parent count for many-to-many indicator
  const parentCount = item.parentIds?.length || 0
  
  // Format last edited
  const lastEdited = item.lastEditedAt 
    ? formatDistanceToNow(new Date(item.lastEditedAt), { addSuffix: true })
    : '-'
  
  const handleNameSave = (newName) => {
    updateItem(item.id, { name: newName })
    setIsEditing(false)
  }
  
  const handleDuplicate = () => {
    duplicateItem(item.id)
    setMenuOpen(false)
  }
  
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItem(item.id)
    }
    setMenuOpen(false)
  }
  
  // Determine if this item can be dragged
  const canDrag = item.type !== 'objective'
  
  return (
    <div 
      className={`group grid grid-cols-[40px_1fr_100px_120px_100px_80px_80px_100px_140px] gap-2 px-4 py-2 items-center border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer
        ${isDragging ? 'bg-teal-50 shadow-lg' : ''}
        ${isDropTarget ? 'bg-teal-50' : ''}`}
      onClick={(e) => {
        // Don't select if clicking on interactive elements
        if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) {
          return
        }
        onSelect()
      }}
    >
      {/* Expand/Collapse + Drag Handle */}
      <div style={{ paddingLeft: indent }} className="flex items-center gap-1">
        {/* Drag Handle */}
        {canDrag && dragHandleProps && (
          <button
            {...dragHandleProps}
            className="p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
      
      {/* Name with type badge */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${typeInfo.color} flex-shrink-0`}>
          {typeInfo.label}
        </span>
        
        {/* Child count - subtle, after badge */}
        {(item.type === 'objective' || item.type === 'tactic' || item.type === 'bestPractice') && item.childIds?.length > 0 && (
          <span className="text-[10px] text-slate-400 font-normal">
            ({item.childIds.length})
          </span>
        )}
        
        {isEditing ? (
          <InlineEditor
            value={item.name}
            onSave={handleNameSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <span 
            className="text-sm font-medium text-slate-900 truncate cursor-text hover:bg-slate-100 px-1 rounded"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            {item.name}
          </span>
        )}
        
        {/* Many-to-many indicator */}
        {parentCount > 1 && (
          <UsedInBadge count={parentCount} type={item.type} />
        )}
      </div>
      
      {/* Impact */}
      <div>
        <ImpactBadge usageCount={item.usageCount} qualityScore={item.qualityScore} />
      </div>
      
      {/* Targeting */}
      <div className="overflow-hidden">
        <TargetingPills targeting={item.targeting} maxPills={2} />
      </div>
      
      {/* Status */}
      <div onClick={(e) => e.stopPropagation()}>
        <StatusDropdown 
          status={item.status} 
          onChange={(newStatus) => updateItem(item.id, { status: newStatus })}
        />
      </div>
      
      {/* Quality Score */}
      <div>
        {item.qualityScore !== undefined && (
          <QualityScore score={item.qualityScore} />
        )}
      </div>
      
      {/* Usage */}
      <div className="text-sm text-slate-600">
        {item.usageCount !== undefined ? (
          <span>{item.usageCount}</span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </div>
      
      {/* Last Edit */}
      <div className="text-xs text-slate-500 truncate">
        {item.lastEditedBy && (
          <span>{item.lastEditedBy}, {lastEdited}</span>
        )}
      </div>
      
      {/* Quick Actions + Menu */}
      <div className="relative flex items-center gap-1">
        {/* Quick Actions - visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <QuickActions 
            item={item} 
            onAiClick={() => {
              setAiPanelOpen(true)
            }}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition-all"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
        
        <AnimatePresence>
          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setMenuOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20"
              >
                <button
                  onClick={() => {
                    setAiPanelOpen(true)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  Generate with AI
                </button>
                
                <button
                  onClick={handleDuplicate}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                
                {item.type !== 'objective' && (
                  <>
                    <hr className="my-1 border-slate-200" />
                    <div className="px-3 py-1.5 text-xs font-medium text-slate-400 uppercase">
                      Move to...
                    </div>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <MoveVertical className="w-4 h-4" />
                      Drag to move
                    </button>
                  </>
                )}
                
                {parentCount > 1 && (
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Unlink className="w-4 h-4" />
                    Unlink from parent
                  </button>
                )}
                
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <Link2 className="w-4 h-4" />
                  Link to another parent
                </button>
                
                <hr className="my-1 border-slate-200" />
                
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <ExternalLink className="w-4 h-4" />
                  View in app.emplifi.io
                </button>
                
                <hr className="my-1 border-slate-200" />
                
                <button 
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
