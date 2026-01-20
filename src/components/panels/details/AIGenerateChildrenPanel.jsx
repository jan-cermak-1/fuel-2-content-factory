import React, { useState } from 'react'
import { Sparkles, Plus, Check, X, Loader2, ChevronRight, Edit2 } from 'lucide-react'
import { aiService } from '../../../services/aiService'
import ProductBadges from '../../common/ProductBadges'

// Child type labels
const childTypeLabels = {
  objective: { child: 'tactic', childLabel: 'Tactics', childLabelSingular: 'Tactic' },
  tactic: { child: 'bestPractice', childLabel: 'Best Practices', childLabelSingular: 'Best Practice' },
  bestPractice: { child: 'step', childLabel: 'Steps', childLabelSingular: 'Step' },
}

// Focus areas by type
const focusAreasByType = {
  tactic: [
    { id: 'social', label: 'Social media', icon: '📱' },
    { id: 'influencer', label: 'Influencer marketing', icon: '⭐' },
    { id: 'paid', label: 'Paid advertising', icon: '💰' },
    { id: 'content', label: 'Content marketing', icon: '📝' },
    { id: 'community', label: 'Community building', icon: '👥' },
    { id: 'analytics', label: 'Analytics & reporting', icon: '📊' },
  ],
  bestPractice: [
    { id: 'setup', label: 'Setup & configuration', icon: '⚙️' },
    { id: 'tracking', label: 'Tracking & metrics', icon: '📈' },
    { id: 'content', label: 'Content creation', icon: '✍️' },
    { id: 'workflow', label: 'Workflow optimization', icon: '🔄' },
    { id: 'testing', label: 'Testing & iteration', icon: '🧪' },
  ],
  step: [
    { id: 'research', label: 'Research', icon: '🔍' },
    { id: 'planning', label: 'Planning', icon: '📋' },
    { id: 'execution', label: 'Execution', icon: '🚀' },
    { id: 'review', label: 'Review & optimize', icon: '✅' },
  ],
}

// Generated item card
function GeneratedItemCard({ item, isSelected, onToggle, onEdit }) {
  return (
    <div 
      className={`
        border rounded-lg p-3 transition-all cursor-pointer
        ${isSelected 
          ? 'border-violet-400 bg-violet-50' 
          : 'border-slate-200 hover:border-slate-300'
        }
      `}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5
          ${isSelected ? 'border-violet-500 bg-violet-500' : 'border-slate-300'}
        `}>
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-800 mb-1">{item.name}</h4>
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{item.description}</p>
          
          {item.requiredProducts?.length > 0 && (
            <ProductBadges productIds={item.requiredProducts} size="xs" maxVisible={3} />
          )}
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-400">
              {Math.round(parseFloat(item.confidence) * 100)}% confidence
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AIGenerateChildrenPanel({
  parentItem,
  onAdd,
  onClose,
}) {
  const childConfig = childTypeLabels[parentItem?.type] || childTypeLabels.objective
  const focusAreas = focusAreasByType[childConfig.child] || []
  
  const [count, setCount] = useState(3)
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedItems, setGeneratedItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)

  const handleGenerate = async () => {
    if (!parentItem) return
    
    setIsLoading(true)
    try {
      const result = await aiService.generateChildren(
        parentItem, 
        childConfig.child, 
        count
      )
      setGeneratedItems(result.children || [])
      setSelectedItems(result.children?.map(c => c.id) || [])
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFocusArea = (areaId) => {
    setSelectedFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    )
  }

  const toggleItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleAddSelected = () => {
    const itemsToAdd = generatedItems.filter(item => selectedItems.includes(item.id))
    if (onAdd && itemsToAdd.length > 0) {
      onAdd(itemsToAdd)
    }
    onClose?.()
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
  }

  const handleSaveEdit = (editedItem) => {
    setGeneratedItems(prev => 
      prev.map(item => item.id === editedItem.id ? editedItem : item)
    )
    setEditingItem(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">AI Generate {childConfig.childLabel}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Parent context */}
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Based on</span>
          <p className="text-sm font-medium text-slate-700 mt-1">{parentItem?.name}</p>
        </div>

        {generatedItems.length === 0 ? (
          /* Configuration */
          <>
            {/* Count selector */}
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                How many {childConfig.childLabel.toLowerCase()}?
              </span>
              <div className="flex gap-2">
                {[1, 3, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={`
                      w-10 h-10 rounded-lg font-medium transition-all
                      ${count === num 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus areas */}
            {focusAreas.length > 0 && (
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                  Focus areas (optional)
                </span>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map(area => (
                    <button
                      key={area.id}
                      onClick={() => toggleFocusArea(area.id)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-all
                        ${selectedFocusAreas.includes(area.id)
                          ? 'border-violet-400 bg-violet-50 text-violet-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }
                      `}
                    >
                      <span>{area.icon}</span>
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate {count} {count === 1 ? childConfig.childLabelSingular : childConfig.childLabel}
                </>
              )}
            </button>
          </>
        ) : (
          /* Results */
          <>
            {/* Edit modal */}
            {editingItem && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-4">
                  <h3 className="font-semibold text-slate-800">Edit {childConfig.childLabelSingular}</h3>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Name</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Description</label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(editingItem)}
                      className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generated items list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Generated ({selectedItems.length} selected)
                </span>
                <button
                  onClick={() => {
                    setGeneratedItems([])
                    setSelectedItems([])
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Start over
                </button>
              </div>
              
              <div className="space-y-2">
                {generatedItems.map(item => (
                  <GeneratedItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onToggle={() => toggleItem(item.id)}
                    onEdit={handleEditItem}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setGeneratedItems([])
                  setSelectedItems([])
                }}
                className="flex-1 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedItems.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {selectedItems.length} {selectedItems.length === 1 ? childConfig.childLabelSingular : childConfig.childLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
