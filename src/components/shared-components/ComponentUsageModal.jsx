import { X, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFuel } from '../../context/FuelContext'
import { getParentsOf } from '../../data/seedData'
import { getBreadcrumbPath } from '../../data/relationships'

export default function ComponentUsageModal({ component, onClose }) {
  const { items, selectItem, setActiveTab } = useFuel()
  
  const parents = getParentsOf(component.id, items)
  
  const handleViewParent = (parentId) => {
    onClose()
    setActiveTab('content')
    selectItem(parentId)
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-slate-900">Component Usage</h3>
            <p className="text-sm text-slate-500 truncate max-w-xs">{component.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          <p className="text-sm text-slate-600 mb-4">
            This component is used in {parents.length} parent item{parents.length !== 1 ? 's' : ''}. 
            Editing it will affect all of them.
          </p>
          
          <div className="space-y-2">
            {parents.map((parent) => {
              const breadcrumb = getBreadcrumbPath(parent.id, items)
              
              return (
                <div
                  key={parent.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {parent.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {breadcrumb.map(item => item.name).join(' > ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewParent(parent.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}
