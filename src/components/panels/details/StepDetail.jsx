import React, { useState } from 'react'
import { 
  CheckSquare, 
  Calendar,
  User,
  Clock,
  Edit2,
  BookOpen,
  Sparkles,
  Link,
  ExternalLink,
  FileText
} from 'lucide-react'
import AIImprovePanel from './AIImprovePanel'
import { SharedParentsList } from './SharedBadge'

// Tabs
const tabs = [
  { id: 'details', label: 'Details', icon: CheckSquare },
  { id: 'activity', label: 'Activity', icon: Clock },
]

export default function StepDetail({
  item,
  items = [],
  onUpdate,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('details')
  const [showAIImprove, setShowAIImprove] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(null)

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

  if (!item) return null

  return (
    <div className="h-full flex flex-col">
      {/* Tab navigation */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 bg-slate-50">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-white text-violet-700 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
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
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Part of:</span>
                <button 
                  onClick={() => onNavigate(parents[0])}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {parents[0].name}
                </button>
              </div>
            )}

            {/* Step Name (editable) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700">Step Name</h3>
                <button
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={editedItem?.name || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                />
              ) : (
                <p className="text-sm text-slate-800 font-medium">{item.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700">Description</h3>
                <button
                  onClick={() => setShowAIImprove(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Improve
                </button>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editedItem?.description || ''}
                    onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400 resize-none"
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
                      className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
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

            {/* Resources / Links section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Link className="w-4 h-4 text-slate-400" />
                Resources & Links
              </h3>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-2">Add links to documentation, templates, or tools</p>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Add Resource Link
                </button>
              </div>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Add Documentation
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
