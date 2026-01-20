import React, { useState, useEffect } from 'react'
import { 
  X, 
  Search, 
  Sparkles, 
  FolderOpen, 
  Link2, 
  Copy,
  Check,
  Loader2,
  Star,
  Users,
  ChevronDown,
  Eye
} from 'lucide-react'
import { aiService } from '../../services/aiService'
import ProductBadges from '../common/ProductBadges'
import { QualityScore } from './details/DetailHeader'

// Filter options
const typeFilters = [
  { id: 'all', label: 'All Types' },
  { id: 'tactic', label: 'Tactics' },
  { id: 'bestPractice', label: 'Best Practices' },
  { id: 'step', label: 'Steps' },
]

const statusFilters = [
  { id: 'all', label: 'All Status' },
  { id: 'released', label: 'Released' },
  { id: 'approved', label: 'Approved' },
  { id: 'in-review', label: 'In Review' },
]

// Template card
function TemplateCard({ 
  item, 
  matchScore, 
  isSelected, 
  onSelect,
  onPreview,
}) {
  return (
    <div 
      className={`
        border rounded-lg p-3 transition-all cursor-pointer
        ${isSelected 
          ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-slate-800 truncate">{item.name}</h4>
            {matchScore && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-violet-100 text-violet-700 rounded-full">
                {Math.round(parseFloat(matchScore) * 100)}% match
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onPreview?.(item); }}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {item.usageCount || 0}
          </span>
          {item.qualityScore && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {item.qualityScore}
            </span>
          )}
        </div>
        {item.requiredProducts?.length > 0 && (
          <ProductBadges productIds={item.requiredProducts} size="xs" maxVisible={3} showName={false} />
        )}
      </div>
      
      {/* Shared indicator */}
      {(item.parentIds?.length || 0) > 1 && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-violet-600">
          <Link2 className="w-3 h-3" />
          Used in {item.parentIds.length} parents
        </div>
      )}
    </div>
  )
}

export default function UseTemplateModal({
  isOpen,
  onClose,
  parentItem,
  childType = 'tactic',
  items = [],
  onUseAsLink,
  onUseAsCopy,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState(childType || 'all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [previewItem, setPreviewItem] = useState(null)

  // Filter items that can be used as templates
  const availableTemplates = items.filter(item => {
    // Filter by type
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    
    // Filter by status
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = item.name?.toLowerCase().includes(query)
      const descMatch = item.description?.toLowerCase().includes(query)
      if (!nameMatch && !descMatch) return false
    }
    
    // Exclude the parent item itself
    if (parentItem && item.id === parentItem.id) return false
    
    return true
  })

  // Get AI recommendations when modal opens
  useEffect(() => {
    if (isOpen && parentItem) {
      loadAIRecommendations()
    }
  }, [isOpen, parentItem])

  const loadAIRecommendations = async () => {
    setIsLoadingAI(true)
    try {
      const result = await aiService.findRelevantTemplates(
        parentItem,
        childType,
        items
      )
      setAiRecommendations(result.recommendations || [])
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleUseAsLink = () => {
    if (selectedTemplate && onUseAsLink) {
      onUseAsLink(selectedTemplate)
      onClose()
    }
  }

  const handleUseAsCopy = () => {
    if (selectedTemplate && onUseAsCopy) {
      onUseAsCopy(selectedTemplate)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">Use Existing Template</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and filters */}
        <div className="px-4 py-3 border-b border-slate-200 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
            >
              {typeFilters.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
            >
              {statusFilters.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* AI Recommendations */}
          {parentItem && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  AI Recommended
                </h3>
                {isLoadingAI && (
                  <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                )}
              </div>
              
              {aiRecommendations.length > 0 ? (
                <div className="grid gap-2">
                  {aiRecommendations.slice(0, 3).map(rec => (
                    <TemplateCard
                      key={rec.id}
                      item={rec}
                      matchScore={rec.matchScore}
                      isSelected={selectedTemplate?.id === rec.id}
                      onSelect={() => setSelectedTemplate(rec)}
                      onPreview={setPreviewItem}
                    />
                  ))}
                </div>
              ) : !isLoadingAI ? (
                <p className="text-xs text-slate-400 italic">No specific recommendations</p>
              ) : null}
            </div>
          )}

          {/* Divider */}
          {parentItem && aiRecommendations.length > 0 && (
            <div className="border-t border-slate-200" />
          )}

          {/* All templates */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              All Templates ({availableTemplates.length})
            </h3>
            
            {availableTemplates.length > 0 ? (
              <div className="grid gap-2">
                {availableTemplates.map(item => (
                  <TemplateCard
                    key={item.id}
                    item={item}
                    isSelected={selectedTemplate?.id === item.id}
                    onSelect={() => setSelectedTemplate(item)}
                    onPreview={setPreviewItem}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-sm text-slate-400">
                No templates found matching your criteria
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {selectedTemplate ? (
                <span>Selected: <strong>{selectedTemplate.name}</strong></span>
              ) : (
                <span>Select a template to continue</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUseAsCopy}
                disabled={!selectedTemplate}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Copy className="w-4 h-4" />
                Use as Copy
              </button>
              <button
                onClick={handleUseAsLink}
                disabled={!selectedTemplate}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Use as Link
              </button>
            </div>
          </div>
        </div>

        {/* Preview modal */}
        {previewItem && (
          <div className="absolute inset-0 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="font-medium text-slate-800">Preview: {previewItem.name}</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1">Description</h4>
                <p className="text-sm text-slate-600">{previewItem.description || 'No description'}</p>
              </div>
              {previewItem.requiredProducts?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Required Products</h4>
                  <ProductBadges productIds={previewItem.requiredProducts} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Status:</span>
                  <span className="ml-2 font-medium capitalize">{previewItem.status}</span>
                </div>
                <div>
                  <span className="text-slate-500">Quality:</span>
                  <span className="ml-2 font-medium">{previewItem.qualityScore || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Usage:</span>
                  <span className="ml-2 font-medium">{previewItem.usageCount || 0} accounts</span>
                </div>
                <div>
                  <span className="text-slate-500">Owner:</span>
                  <span className="ml-2 font-medium">{previewItem.owner || 'Unassigned'}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setSelectedTemplate(previewItem)
                  setPreviewItem(null)
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Select This Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
