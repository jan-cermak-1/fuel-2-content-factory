import { Move, Copy, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const typeLabels = {
  objective: 'Objective',
  tactic: 'Tactic',
  bestPractice: 'Best Practice',
  step: 'Step',
}

export default function DragConfirmModal({ 
  isOpen, 
  onClose, 
  item, 
  targetParent,
  onMove,
  onCopy 
}) {
  if (!isOpen || !item || !targetParent) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
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
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Move or Copy?</h3>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-900">{item.name}</strong>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  → to <strong>{targetParent.name}</strong>
                </p>
              </div>
              
              <div className="space-y-2">
                {/* Move Option */}
                <button
                  onClick={onMove}
                  className="w-full flex items-center gap-3 p-4 rounded-lg text-left bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-300 transition-colors"
                >
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Move className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-900">Move</p>
                    <p className="text-xs text-amber-700">
                      Remove from current parent and add to new one
                    </p>
                  </div>
                </button>
                
                {/* Copy Option */}
                <button
                  onClick={onCopy}
                  className="w-full flex items-center gap-3 p-4 rounded-lg text-left bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Copy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Copy</p>
                    <p className="text-xs text-blue-700">
                      Create a duplicate in the new location
                    </p>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
