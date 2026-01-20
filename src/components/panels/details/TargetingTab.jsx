import React, { useState } from 'react'
import { Save, Sparkles, Users, BarChart3, AlertCircle } from 'lucide-react'
import ScopeSelector from '../../common/ScopeSelector'
import ProductRequirements from '../../common/ProductRequirements'
import { aiService } from '../../../services/aiService'

export default function TargetingTab({
  item,
  onUpdate,
  readOnly = false,
}) {
  const [editedScope, setEditedScope] = useState(item?.scope || {
    type: 'universal',
    industries: [],
    accounts: [],
    regions: [],
    jobRoles: [],
  })
  const [editedProducts, setEditedProducts] = useState(item?.requiredProducts || [])
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const handleScopeChange = (newScope) => {
    setEditedScope(newScope)
    setHasChanges(true)
  }

  const handleProductsChange = (newProducts) => {
    setEditedProducts(newProducts)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...item,
        scope: editedScope,
        requiredProducts: editedProducts,
      })
    }
    setHasChanges(false)
  }

  const handleAISuggestAll = async () => {
    setIsLoadingAI(true)
    try {
      // Get scope suggestions
      const scopeResult = await aiService.suggestScope(item)
      if (scopeResult.suggestedScope) {
        setEditedScope(prev => ({
          ...prev,
          ...scopeResult.suggestedScope,
        }))
      }
      
      // Get product suggestions
      const productResult = await aiService.suggestProducts(item)
      if (productResult.suggestions) {
        const suggestedProducts = productResult.suggestions
          .filter(s => parseFloat(s.confidence) > 0.6)
          .map(s => s.id)
        setEditedProducts(prev => [...new Set([...prev, ...suggestedProducts])])
      }
      
      setHasChanges(true)
    } catch (error) {
      console.error('AI suggestion failed:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  // Calculate estimated reach (mock)
  const estimatedReach = React.useMemo(() => {
    let base = 5000
    
    if (editedScope.type === 'universal') {
      return base
    }
    
    if (editedScope.type === 'industry') {
      base = Math.max(500, base - (editedScope.industries?.length || 0) * 500)
    }
    
    if (editedScope.type === 'account') {
      base = (editedScope.accounts?.length || 0) * 50
    }
    
    if (editedScope.type === 'internal') {
      base = 150
    }
    
    if (editedScope.regions?.length > 0) {
      base = Math.round(base * (editedScope.regions.length / 5))
    }
    
    return base
  }, [editedScope])

  if (!item) return null

  return (
    <div className="p-4 space-y-6">
      {/* Header with AI button */}
      {!readOnly && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Targeting & Requirements</h3>
          <button
            onClick={handleAISuggestAll}
            disabled={isLoadingAI}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoadingAI ? 'animate-pulse' : ''}`} />
            {isLoadingAI ? 'Analyzing...' : 'AI Suggest All'}
          </button>
        </div>
      )}

      {/* Content Scope Section */}
      <div className="space-y-4">
        <ScopeSelector
          scope={editedScope}
          onChange={handleScopeChange}
          showAISuggestion={!readOnly}
          readOnly={readOnly}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Required Products Section */}
      <div className="space-y-4">
        <ProductRequirements
          selectedProducts={editedProducts}
          onChange={handleProductsChange}
          content={item}
          showAISuggestion={!readOnly}
          readOnly={readOnly}
          columns={3}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Preview Section */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Reach Preview
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-slate-500">This content will be visible to:</span>
          </div>
          
          <ul className="space-y-1 text-slate-600 ml-4">
            {editedScope.type === 'universal' && (
              <li>• All users</li>
            )}
            {editedScope.type === 'industry' && editedScope.industries?.length > 0 && (
              <li>• Users in {editedScope.industries.join(', ')} industries</li>
            )}
            {editedScope.type === 'account' && editedScope.accounts?.length > 0 && (
              <li>• Users from {editedScope.accounts.join(', ')} accounts</li>
            )}
            {editedScope.type === 'internal' && (
              <li>• Emplifi employees only</li>
            )}
            {editedScope.regions?.length > 0 && (
              <li>• In {editedScope.regions.join(', ')} regions</li>
            )}
            {editedScope.jobRoles?.length > 0 && (
              <li>• With roles: {editedScope.jobRoles.slice(0, 3).join(', ')}{editedScope.jobRoles.length > 3 ? '...' : ''}</li>
            )}
            {editedProducts.length > 0 && (
              <li>• With access to required products</li>
            )}
          </ul>
          
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 mt-3">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              Estimated reach: <strong className="text-slate-800">~{estimatedReach.toLocaleString()} accounts</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Warning if no products selected */}
      {editedProducts.length === 0 && !readOnly && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-700">No products specified</p>
            <p className="text-amber-600">Consider adding required products to help users understand what they need.</p>
          </div>
        </div>
      )}

      {/* Save button */}
      {!readOnly && hasChanges && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}
