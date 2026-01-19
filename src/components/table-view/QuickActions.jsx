import { useState } from 'react'
import { Copy, Sparkles, ExternalLink, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../context/FuelContext'

const typeParentMap = {
  tactic: { parentType: 'objective', label: 'Objective' },
  bestPractice: { parentType: 'tactic', label: 'Tactic' },
  step: { parentType: 'bestPractice', label: 'Best Practice' },
}

export default function QuickActions({ item, onAiClick }) {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedParents, setSelectedParents] = useState([])
  const { items, duplicateItemToMultiple } = useFuel()
  
  const parentConfig = typeParentMap[item.type]
  const canDuplicate = !!parentConfig
  
  // Get potential parents
  const potentialParents = parentConfig 
    ? items.filter(i => i.type === parentConfig.parentType)
    : []
  
  const handleDuplicateClick = (e) => {
    e.stopPropagation()
    if (canDuplicate) {
      // Pre-select current parents
      setSelectedParents(item.parentIds || [])
      setShowDuplicateModal(true)
    }
  }
  
  const toggleParentSelection = (parentId) => {
    setSelectedParents(prev => 
      prev.includes(parentId)
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    )
  }
  
  const handleDuplicate = () => {
    if (selectedParents.length === 0) return
    duplicateItemToMultiple(item.id, selectedParents)
    setShowDuplicateModal(false)
    setSelectedParents([])
  }
  
  return (
    <>
      <div className="flex items-center gap-1">
        {/* Duplicate */}
        {canDuplicate && (
          <button
            onClick={handleDuplicateClick}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
        
        {/* AI Generate */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAiClick?.()
          }}
          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
          title="Generate with AI"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        
        {/* Preview */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          title="Preview in app"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      {/* Duplicate Modal */}
      <AnimatePresence>
        {showDuplicateModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDuplicateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                <div>
                  <h3 className="font-semibold text-slate-900">Duplicate {item.type}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Select one or more {parentConfig.label}s
                  </p>
                </div>
                <button
                  onClick={() => setShowDuplicateModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm text-slate-600">
                    Duplicating: <strong className="text-slate-900">{item.name}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Select multiple {parentConfig.label}s to create copies in each
                  </p>
                </div>
                
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {potentialParents.map((parent) => {
                    const isSelected = selectedParents.includes(parent.id)
                    const isCurrentParent = item.parentIds?.includes(parent.id)
                    return (
                      <button
                        key={parent.id}
                        onClick={() => toggleParentSelection(parent.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                          ${isSelected 
                            ? 'bg-blue-50 border-2 border-blue-400' 
                            : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                          }`}
                      >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                          ${isSelected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {parent.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {parent.childIds?.length || 0} items • {parent.status}
                          </p>
                        </div>
                        
                        {isCurrentParent && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-600 rounded-full">
                            Current
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                
                {selectedParents.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      Will create <strong>{selectedParents.length}</strong> cop{selectedParents.length === 1 ? 'y' : 'ies'} of this {item.type}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowDuplicateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDuplicate}
                  disabled={selectedParents.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate to {selectedParents.length || 0} {parentConfig.label}{selectedParents.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
