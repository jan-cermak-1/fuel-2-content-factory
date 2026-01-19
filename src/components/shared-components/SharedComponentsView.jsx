import { useState } from 'react'
import { Link2, Edit3, Copy, Eye, AlertTriangle } from 'lucide-react'
import { useFuel } from '../../context/FuelContext'
import { getSharedBestPractices, getSharedSteps, getParentNames } from '../../data/relationships'
import QualityScore from '../table-view/QualityScore'
import TargetingPills from '../table-view/TargetingPills'
import ComponentUsageModal from './ComponentUsageModal'

const typeConfig = {
  bestPractice: { label: 'Best Practice', color: 'bg-emerald-100 text-emerald-700' },
  step: { label: 'Step', color: 'bg-slate-100 text-slate-700' },
}

export default function SharedComponentsView() {
  const { items, selectItem } = useFuel()
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [showUsageModal, setShowUsageModal] = useState(false)
  
  const sharedBestPractices = getSharedBestPractices(items)
  const sharedSteps = getSharedSteps(items)
  const allShared = [...sharedBestPractices, ...sharedSteps]
  
  const handleViewUsage = (component) => {
    setSelectedComponent(component)
    setShowUsageModal(true)
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Shared Components</h2>
        <p className="text-sm text-slate-500">
          Best Practices and Steps that are used across multiple parent items. 
          Edit globally to update all instances, or create a variant for specific contexts.
        </p>
      </div>
      
      {/* Warning Banner */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Shared components affect multiple items</p>
          <p className="text-xs text-amber-600 mt-1">
            Changes to these components will propagate to all parent items. Consider creating a variant if you need context-specific content.
          </p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{allShared.length}</p>
          <p className="text-sm text-slate-500">Shared Components</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-2xl font-bold text-emerald-600">{sharedBestPractices.length}</p>
          <p className="text-sm text-slate-500">Best Practices</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-600">{sharedSteps.length}</p>
          <p className="text-sm text-slate-500">Steps</p>
        </div>
      </div>
      
      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[100px_1fr_120px_120px_80px_140px] gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <div>Type</div>
          <div>Name</div>
          <div>Used In</div>
          <div>Targeting</div>
          <div>Quality</div>
          <div>Actions</div>
        </div>
        
        {/* Table Body */}
        <div className="overflow-auto max-h-[calc(100%-48px)]">
          {allShared.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              No shared components found
            </div>
          ) : (
            allShared.map((component) => {
              const typeInfo = typeConfig[component.type]
              const parentNames = getParentNames(component.id, items)
              
              return (
                <div 
                  key={component.id}
                  className="grid grid-cols-[100px_1fr_120px_120px_80px_140px] gap-2 px-4 py-3 items-center border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {/* Type */}
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  
                  {/* Name */}
                  <div 
                    className="text-sm font-medium text-slate-900 truncate cursor-pointer hover:text-teal-600"
                    onClick={() => selectItem(component.id)}
                  >
                    {component.name}
                  </div>
                  
                  {/* Used In */}
                  <div>
                    <button
                      onClick={() => handleViewUsage(component)}
                      className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Link2 className="w-4 h-4" />
                      {parentNames.length} items
                    </button>
                  </div>
                  
                  {/* Targeting */}
                  <div>
                    <TargetingPills targeting={component.targeting} maxPills={2} />
                  </div>
                  
                  {/* Quality */}
                  <div>
                    {component.qualityScore !== undefined && (
                      <QualityScore score={component.qualityScore} size="sm" />
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => selectItem(component.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit Global
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Variant
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      
      {/* Usage Modal */}
      {showUsageModal && selectedComponent && (
        <ComponentUsageModal
          component={selectedComponent}
          onClose={() => setShowUsageModal(false)}
        />
      )}
    </div>
  )
}
