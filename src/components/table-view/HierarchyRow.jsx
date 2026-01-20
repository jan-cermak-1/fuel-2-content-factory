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
import InlineEditor from './InlineEditor'
import QuickActions from './QuickActions'
import { useFuel } from '../../context/FuelContext'
import { formatDistanceToNow } from 'date-fns'

const typeConfig = {
  objective: { label: 'OBJ', color: 'bg-violet-100 text-violet-700', indent: 0 },
  tactic: { label: 'TAC', color: 'bg-blue-100 text-blue-700', indent: 1 },
  bestPractice: { label: 'BP', color: 'bg-emerald-100 text-emerald-700', indent: 2 },
  step: { label: 'STEP', color: 'bg-slate-100 text-slate-700', indent: 3 },
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
  isDropTarget,
  treeProps = { connectorLevels: [], isLastSibling: true },
  rowRef,
  rowStyle
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { updateItem, setAiPanelOpen, items, duplicateItem, deleteItem } = useFuel()
  
  const typeInfo = typeConfig[item.type]
  const indent = depth * 24
  const { connectorLevels, isLastSibling } = treeProps
  
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
    <>
    <tr 
      ref={rowRef}
      style={rowStyle}
      className={`group border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer
        ${isDragging ? 'bg-teal-50 shadow-lg opacity-30' : ''}
        ${isDropTarget ? 'bg-teal-50 ring-2 ring-teal-400 ring-inset' : ''}`}
      onClick={(e) => {
        // Don't select if clicking on interactive elements
        if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) {
          return
        }
        onSelect()
      }}
    >
      {/* STICKY: Drag Handle + Expand + Badge + Name */}
      <td className={`sticky left-0 z-10 px-2 border-r border-slate-200 shadow-[6px_0_20px_-5px_rgba(0,0,0,0.3)] transition-colors ${isDragging ? 'bg-teal-50' : isDropTarget ? 'bg-teal-50' : 'bg-white group-hover:bg-slate-50'}`} style={{ minWidth: '400px', width: 'auto' }}>
        <div className="flex items-center h-12 relative overflow-visible w-full" style={{ minHeight: 48 }}>
          {/* Drag Handle - FIRST */}
          {canDrag && dragHandleProps ? (
            <button
              {...dragHandleProps}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing transition-colors flex-shrink-0 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-7 flex-shrink-0" />
          )}
          
          {/* Expand/collapse button - SECOND (right after drag handle) */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              className="p-1.5 hover:bg-slate-200 rounded transition-colors flex-shrink-0 z-20"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.div>
            </button>
          ) : (
            <div className="w-7 flex-shrink-0" />
          )}
          
          {/* Tree connector lines - positioned absolutely to connect to badge */}
          {depth > 0 && Array.from({ length: depth }).map((_, levelIndex) => {
            const showContinuationLine = levelIndex < depth - 1 && connectorLevels[levelIndex]
            const isCurrentLevel = levelIndex === depth - 1
            // Base position: drag handle (28px) + expand button (28px) = 56px
            // Then add levelIndex * 24 for each level of indentation
            const verticalLineX = 56 + (levelIndex * 24) + 12
            
            return (
              <div key={levelIndex}>
                {/* Continuation vertical line - full height through cell */}
                {showContinuationLine && (
                  <div 
                    className="absolute bg-slate-300 z-10 pointer-events-none"
                    style={{ left: verticalLineX, width: 1, top: 0, bottom: 0 }}
                  />
                )}
                
                {/* Current level L/T connector */}
                {isCurrentLevel && (
                  <>
                    {/* Vertical line - from top, stops at middle if last sibling, full height if more siblings */}
                    <div 
                      className="absolute bg-slate-300 z-10 pointer-events-none"
                      style={{ 
                        left: verticalLineX, 
                        width: 1, 
                        top: 0, 
                        height: isLastSibling ? 24 : '100%'
                      }}
                    />
                    {/* Horizontal arm to badge - calculate distance to badge position */}
                    <div 
                      className="absolute bg-slate-300 z-10 pointer-events-none"
                      style={{ 
                        left: verticalLineX, 
                        top: 23, 
                        width: 56 + (depth * 24) + 8 - verticalLineX,
                        height: 1 
                      }}
                    />
                  </>
                )}
              </div>
            )
          })}
          
          {/* Downward line from expanded parent to first child */}
          {isExpanded && hasChildren && (
            <div 
              className="absolute bg-slate-300 z-10 pointer-events-none" 
              style={{ 
                left: 56 + (depth * 24) + 12,
                top: 24, 
                bottom: 0,
                width: 1
              }}
            />
          )}
          
          {/* Indentation spacer to push badge to the right */}
          {depth > 0 && (
            <div style={{ width: depth * 24 }} className="flex-shrink-0" />
          )}
          
          {/* Name with type badge */}
          <div className="flex items-center gap-2 min-w-0 ml-2 flex-1">
            
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
                className="text-sm font-medium text-slate-900 truncate cursor-text hover:bg-slate-100 px-1 rounded flex-1 min-w-0"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                title={item.name}
              >
                {item.name}
              </span>
            )}
            
            {/* Quick Actions - visible on hover, moved to NAME column */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto flex-shrink-0">
              <QuickActions 
                item={item} 
                onAiClick={() => {
                  setAiPanelOpen(true)
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(!menuOpen)
                }}
                className="p-1 hover:bg-slate-200 rounded transition-all"
              >
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </td>
      
      {/* Status - moved right after NAME */}
      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
        <StatusDropdown 
          status={item.status} 
          onChange={(newStatus) => updateItem(item.id, { status: newStatus })}
        />
      </td>
      
      {/* Targeting */}
      <td className="px-3 py-2.5 overflow-hidden">
        <TargetingPills targeting={item.targeting} maxPills={2} />
      </td>
      
      {/* Quality Score */}
      <td className="px-3 py-2.5">
        {item.qualityScore !== undefined && (
          <QualityScore score={item.qualityScore} />
        )}
      </td>
      
      {/* Usage */}
      <td className="px-3 py-2.5 text-sm text-slate-600">
        {item.usageCount !== undefined ? (
          <span>{item.usageCount}</span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      
      {/* Last Edit */}
      <td className="px-3 py-2.5 text-xs text-slate-500 truncate max-w-[100px]">
        {item.lastEditedBy && (
          <span title={`${item.lastEditedBy}, ${lastEdited}`}>{item.lastEditedBy}, {lastEdited}</span>
        )}
      </td>
    </tr>
    
    {/* Context Menu - rendered outside table row */}
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
            className="fixed z-20 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
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
    </>
  )
}
