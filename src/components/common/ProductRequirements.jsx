import React, { useState } from 'react'
import { 
  Calendar, 
  BarChart3, 
  MessageCircle, 
  Users, 
  Star, 
  Headphones,
  Sparkles,
  Check,
  Loader2
} from 'lucide-react'
import { emplifiProducts, getProductById } from '../../data/products'
import { aiService } from '../../services/aiService'

// Icon mapping
const iconMap = {
  Calendar,
  BarChart3,
  MessageCircle,
  Users,
  Star,
  Headphones,
}

// Product card component
function ProductCard({ product, selected, onToggle, disabled = false }) {
  const Icon = iconMap[product.icon] || Calendar
  
  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(product.id)}
      disabled={disabled}
      className={`
        relative flex flex-col items-center p-3 rounded-lg border-2 transition-all
        ${selected 
          ? `${product.bgColor} ${product.borderColor.replace('border-', 'border-')} ${product.textColor}` 
          : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'
        }
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
    >
      {selected && (
        <div className={`absolute top-1 right-1 w-4 h-4 rounded-full ${product.bgColor.replace('100', '200')} flex items-center justify-center`}>
          <Check className="w-3 h-3" />
        </div>
      )}
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs font-medium text-center leading-tight">{product.shortName}</span>
    </button>
  )
}

// Compact badge for selected products
function ProductBadgeCompact({ productId }) {
  const product = getProductById(productId)
  if (!product) return null
  
  const Icon = iconMap[product.icon] || Calendar
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${product.bgColor} ${product.textColor}`}>
      <Icon className="w-3 h-3" />
      {product.shortName}
    </span>
  )
}

export default function ProductRequirements({
  selectedProducts = [],
  onChange,
  content = null, // Content for AI suggestions
  showAISuggestion = false,
  compact = false,
  readOnly = false,
  columns = 3,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)

  const handleToggle = (productId) => {
    if (readOnly) return
    
    if (selectedProducts.includes(productId)) {
      onChange(selectedProducts.filter(id => id !== productId))
    } else {
      onChange([...selectedProducts, productId])
    }
  }

  const handleAISuggest = async () => {
    if (!content) return
    
    setIsLoading(true)
    try {
      const result = await aiService.suggestProducts(content)
      setAiSuggestions(result.suggestions)
      
      // Auto-apply high-confidence suggestions
      const highConfidenceSuggestions = result.suggestions
        .filter(s => parseFloat(s.confidence) > 0.7)
        .map(s => s.id)
      
      if (highConfidenceSuggestions.length > 0) {
        const newSelection = [...new Set([...selectedProducts, ...highConfidenceSuggestions])]
        onChange(newSelection)
      }
    } catch (error) {
      console.error('AI suggestion failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyAllSuggestions = () => {
    if (!aiSuggestions) return
    const suggestedIds = aiSuggestions.map(s => s.id)
    const newSelection = [...new Set([...selectedProducts, ...suggestedIds])]
    onChange(newSelection)
    setAiSuggestions(null)
  }

  // Compact read-only view
  if (compact && readOnly) {
    if (selectedProducts.length === 0) {
      return <span className="text-xs text-slate-400">No products specified</span>
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {selectedProducts.map(productId => (
          <ProductBadgeCompact key={productId} productId={productId} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Required Products</h3>
        {showAISuggestion && content && !readOnly && (
          <button
            type="button"
            onClick={handleAISuggest}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            AI Suggest
          </button>
        )}
      </div>

      {/* AI Suggestions banner */}
      {aiSuggestions && aiSuggestions.length > 0 && !readOnly && (
        <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-violet-700 mb-1">AI Suggestions</p>
              <div className="flex flex-wrap gap-1">
                {aiSuggestions.map(suggestion => {
                  const product = getProductById(suggestion.id)
                  if (!product) return null
                  return (
                    <span 
                      key={suggestion.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${product.bgColor} ${product.textColor}`}
                    >
                      {product.shortName}
                      <span className="opacity-60">({Math.round(parseFloat(suggestion.confidence) * 100)}%)</span>
                    </span>
                  )
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={applyAllSuggestions}
              className="text-xs font-medium text-violet-600 hover:text-violet-700"
            >
              Apply All
            </button>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {emplifiProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedProducts.includes(product.id)}
            onToggle={handleToggle}
            disabled={readOnly}
          />
        ))}
      </div>

      {/* Helper text */}
      {!readOnly && (
        <p className="text-xs text-slate-500">
          Select the Emplifi products users need to achieve this {content?.type || 'goal'}.
        </p>
      )}
    </div>
  )
}

// Export compact badge separately for use elsewhere
export { ProductBadgeCompact }
