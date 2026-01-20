import React, { useState } from 'react'
import { 
  BookOpen, 
  CheckSquare,
  Plus, 
  Sparkles, 
  FolderOpen,
  ChevronRight,
  Calendar,
  User,
  Clock,
  Edit2,
  Globe,
  Layers
} from 'lucide-react'
import TargetingTab from './TargetingTab'
import AIImprovePanel from './AIImprovePanel'
import AIGenerateChildrenPanel from './AIGenerateChildrenPanel'
import SharedBadge, { SharedParentsList } from './SharedBadge'

// Tabs
const tabs = [
  { id: 'details', label: 'Details', icon: BookOpen },
  { id: 'targeting', label: 'Targeting', icon: Globe },
  { id: 'steps', label: 'Steps', icon: CheckSquare },
  { id: 'activity', label: 'Activity', icon: Clock },
]

// Step card
function StepCard({ item, index, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate(item)}
      className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all text-left group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-semibold text-violet-600">
          {index + 1}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-slate-800 truncate">{item.name}</h4>
          {item.description && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {item.qualityScore && (
          <span className="text-xs text-slate-500">Q: {item.qualityScore}</span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
      </div>
    </button>
  )
}

export default function BestPracticeDetail({
  item,
  items = [],
  onUpdate,
  onNavigate,
  onAddChild,
  onUseTemplate,
}) {
  const [activeTab, setActiveTab] = useState('details')
  const [showAIImprove, setShowAIImprove] = useState(false)
  const [showAIGenerate, setShowAIGenerate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(null)

  // Get children
  const childSteps = (item?.childIds || [])
    .map(id => items.find(i => i.id === id))
    .filter(Boolean)

  // Get parents
  const parents = (item?.parentIds || [])
    .map(id => items.find(i => i.id === id))
    .filter(Boolean)

  const handleStartEdit = () => {
    setEditedItem({ ...item })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editedItem && onUpdate) {
      onUpdate(editedItem)
    }
    setIsEditing(false)
    setEditedItem(null)
  }

  const handleApplyAIImprovement = (improvedItem) => {
    if (onUpdate) {
      onUpdate(improvedItem)
    }
    setShowAIImprove(false)
  }

  const handleAddGeneratedChildren = (generatedItems) => {
    if (onAddChild) {
      generatedItems.forEach(child => {
        onAddChild({
          ...child,
          type: 'step',
          status: 'draft',
          parentIds: [item.id],
        })
      })
    }
    setShowAIGenerate(false)
  }

  if (!item) return null

  return (
    <div className="h-full flex flex-col">
      {/* Tab navigation */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 bg-slate-50">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const count = tab.id === 'steps' ? childSteps.length : null
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count !== null && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="p-4 space-y-6">
            {/* Shared notification */}
            {parents.length > 1 && (
              <SharedParentsList 
                parents={parents} 
                onNavigate={onNavigate}
              />
            )}

            {/* AI Improve Panel */}
            {showAIImprove && (
              <div className="mb-4">
                <AIImprovePanel
                  item={item}
                  onApply={handleApplyAIImprovement}
                  onClose={() => setShowAIImprove(false)}
                />
              </div>
            )}

            {/* Parent info */}
            {parents.length === 1 && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Part of:</span>
                <button 
                  onClick={() => onNavigate(parents[0])}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {parents[0].name}
                </button>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700">Description</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAIImprove(true)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Improve
                  </button>
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editedItem?.description || ''}
                    onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setIsEditing(false); setEditedItem(null); }}
                      className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* AI Actions */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">AI Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowAIImprove(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Improve Description
                </button>
                <button
                  onClick={() => setShowAIGenerate(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                  Generate Steps
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-4 h-4" />
                  <span>Owner: {item.owner || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Targeting Tab */}
        {activeTab === 'targeting' && (
          <TargetingTab item={item} onUpdate={onUpdate} />
        )}

        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <div className="p-4 space-y-4">
            {showAIGenerate && (
              <div className="mb-4">
                <AIGenerateChildrenPanel
                  parentItem={item}
                  onAdd={handleAddGeneratedChildren}
                  onClose={() => setShowAIGenerate(false)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Steps ({childSteps.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAddChild?.()}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
                <button
                  onClick={() => setShowAIGenerate(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generate
                </button>
              </div>
            </div>

            {childSteps.length > 0 ? (
              <div className="space-y-2">
                {childSteps.map((step, index) => (
                  <StepCard 
                    key={step.id} 
                    item={step} 
                    index={index}
                    onNavigate={onNavigate} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No steps yet</p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="p-4">
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Activity timeline coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
