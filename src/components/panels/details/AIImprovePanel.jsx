import React, { useState } from 'react'
import { Sparkles, Wand2, ArrowRight, Check, X, Loader2, RefreshCw } from 'lucide-react'
import { aiService } from '../../../services/aiService'

// Quick improvement options
const quickOptions = [
  { id: 'specific', label: 'Make it more specific', icon: '🎯' },
  { id: 'metrics', label: 'Add metrics', icon: '📊' },
  { id: 'simplify', label: 'Simplify language', icon: '✨' },
  { id: 'actionable', label: 'Make it actionable', icon: '⚡' },
]

// Industry-specific adaptations
const industryOptions = [
  { id: 'finance', label: 'Adapt for Finance', icon: '🏦' },
  { id: 'healthcare', label: 'Adapt for Healthcare', icon: '🏥' },
  { id: 'retail', label: 'Adapt for Retail', icon: '🛒' },
  { id: 'tech', label: 'Adapt for Tech', icon: '💻' },
]

export default function AIImprovePanel({
  item,
  onApply,
  onClose,
}) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [customInstruction, setCustomInstruction] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleImprove = async (instruction) => {
    if (!item) return
    
    setIsLoading(true)
    setError(null)
    setSelectedOption(instruction)
    
    try {
      const response = await aiService.improveContent(item, instruction)
      setResult(response)
    } catch (err) {
      setError('Failed to generate improvement. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomImprove = () => {
    if (customInstruction.trim()) {
      handleImprove(customInstruction.trim())
    }
  }

  const handleApply = () => {
    if (result && onApply) {
      onApply({
        ...item,
        description: result.improved,
      })
      setResult(null)
      setSelectedOption(null)
    }
  }

  const handleRegenerate = () => {
    if (selectedOption) {
      handleImprove(selectedOption)
    }
  }

  const handleReset = () => {
    setResult(null)
    setSelectedOption(null)
    setCustomInstruction('')
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">AI Improve</span>
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
      <div className="p-4 space-y-4">
        {/* Original content preview */}
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current</span>
          <p className="text-sm text-slate-700 mt-1 line-clamp-2">
            {item?.description || item?.name || 'No content'}
          </p>
        </div>

        {!result ? (
          <>
            {/* Quick options */}
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                Quick improvements
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleImprove(option.label)}
                    disabled={isLoading}
                    className={`
                      flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg border transition-all
                      ${selectedOption === option.label && isLoading
                        ? 'border-violet-300 bg-violet-50'
                        : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                      }
                      disabled:opacity-50
                    `}
                  >
                    <span>{option.icon}</span>
                    <span className="text-slate-700">{option.label}</span>
                    {selectedOption === option.label && isLoading && (
                      <Loader2 className="w-3 h-3 animate-spin ml-auto text-violet-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry adaptations */}
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                Industry adaptations
              </span>
              <div className="grid grid-cols-2 gap-2">
                {industryOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleImprove(option.label)}
                    disabled={isLoading}
                    className={`
                      flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg border transition-all
                      ${selectedOption === option.label && isLoading
                        ? 'border-violet-300 bg-violet-50'
                        : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                      }
                      disabled:opacity-50
                    `}
                  >
                    <span>{option.icon}</span>
                    <span className="text-slate-700">{option.label}</span>
                    {selectedOption === option.label && isLoading && (
                      <Loader2 className="w-3 h-3 animate-spin ml-auto text-violet-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom instruction */}
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                Or describe what you want
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomImprove()}
                  placeholder="e.g., Make it more focused on ROI..."
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleCustomImprove}
                  disabled={!customInstruction.trim() || isLoading}
                  className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Result view */
          <div className="space-y-4">
            {/* Changes made */}
            {result.changes && result.changes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.changes.map((change, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                    {change.description}
                  </span>
                ))}
              </div>
            )}

            {/* Improved content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-medium text-violet-600 uppercase tracking-wide">Improved</span>
                <span className="text-xs text-slate-400">
                  ({Math.round(parseFloat(result.confidence) * 100)}% confidence)
                </span>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
                <p className="text-sm text-slate-700">{result.improved}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Keep Original
                </button>
                <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
