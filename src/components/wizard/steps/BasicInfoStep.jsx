import { useState } from 'react'
import { Sparkles, Loader2, Target, Layers, BookOpen, ListChecks } from 'lucide-react'
import { useFuel } from '../../../context/FuelContext'

const typeConfig = {
  objective: {
    label: 'Objective',
    icon: Target,
    color: 'violet',
    namePlaceholder: 'e.g. Increase Brand Awareness by 25%',
    descPlaceholder: 'Describe the main goal and why it matters for your strategy...',
    parentType: null,
  },
  tactic: {
    label: 'Tactic',
    icon: Layers,
    color: 'blue',
    namePlaceholder: 'e.g. Influencer Marketing Campaign',
    descPlaceholder: 'Describe the tactic and how it helps achieve the goal...',
    parentType: 'objective',
    parentLabel: 'Parent Objective',
  },
  bestPractice: {
    label: 'Best Practice',
    icon: BookOpen,
    color: 'emerald',
    namePlaceholder: 'e.g. Micro-influencer Vetting Process',
    descPlaceholder: 'Describe the best practice and when to use it...',
    parentType: 'tactic',
    parentLabel: 'Parent Tactic',
  },
  step: {
    label: 'Step',
    icon: ListChecks,
    color: 'slate',
    namePlaceholder: 'e.g. Set up UTM parameters',
    descPlaceholder: 'Describe the specific step or action...',
    parentType: 'bestPractice',
    parentLabel: 'Parent Best Practice',
  },
}

export default function BasicInfoStep({ data, updateData }) {
  const { items } = useFuel()
  const [isSuggestingName, setIsSuggestingName] = useState(false)
  const [isSuggestingDesc, setIsSuggestingDesc] = useState(false)
  
  const config = typeConfig[data.type]
  const Icon = config?.icon || Layers
  
  // Get possible parents based on type
  const possibleParents = config?.parentType 
    ? items.filter(item => item.type === config.parentType)
    : []
  
  const handleSuggestName = async () => {
    setIsSuggestingName(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const suggestions = {
      objective: [
        'Increase Social Media Engagement by 30%',
        'Drive 50% More Website Traffic from Social',
        'Build Brand Awareness in EMEA Market',
        'Improve Customer Response Time to < 2 hours',
      ],
      tactic: [
        'Influencer Partnership Program',
        'User-Generated Content Campaign',
        'Interactive Stories Strategy',
        'Social Listening & Rapid Response',
      ],
      bestPractice: [
        'Influencer Vetting Checklist',
        'Content Approval Workflow',
        'Optimal Posting Schedule',
        'Engagement Response Templates',
      ],
      step: [
        'Configure brand mention alerts',
        'Set up UTM tracking parameters',
        'Review weekly performance metrics',
        'Schedule content for next week',
      ],
    }
    
    const options = suggestions[data.type] || suggestions.tactic
    const randomName = options[Math.floor(Math.random() * options.length)]
    updateData({ name: randomName })
    setIsSuggestingName(false)
  }
  
  const handleSuggestDescription = async () => {
    if (!data.name) return
    
    setIsSuggestingDesc(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const descriptions = {
      objective: `Strategic initiative to ${data.name.toLowerCase()}. This objective focuses on measurable outcomes that align with our overall marketing goals and drive business value through social media excellence.`,
      tactic: `Comprehensive approach to implement ${data.name.toLowerCase()}. This tactic outlines the specific methods and channels we'll use to achieve our objectives, including timeline, resources, and success criteria.`,
      bestPractice: `Proven methodology for ${data.name.toLowerCase()}. This best practice document provides step-by-step guidance based on industry standards and our own successful implementations.`,
      step: `Action item: ${data.name}. Complete this step to progress toward the best practice goals. Includes specific instructions, links to documentation, and verification criteria.`,
    }
    
    updateData({ description: descriptions[data.type] || descriptions.tactic })
    setIsSuggestingDesc(false)
  }
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Type indicator */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${config?.color || 'slate'}-100 text-${config?.color || 'slate'}-700 mb-6`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config?.label}</span>
      </div>
      
      <div className="space-y-6">
        {/* Parent Selection */}
        {config?.parentType && possibleParents.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {config.parentLabel}
              <span className="text-slate-400 font-normal ml-1">(optional)</span>
            </label>
            <select
              value={data.parentId}
              onChange={(e) => updateData({ parentId: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
            >
              <option value="">No parent (standalone)</option>
              {possibleParents.map(parent => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder={config?.namePlaceholder}
              className="w-full px-4 py-3 pr-24 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={handleSuggestName}
              disabled={isSuggestingName}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSuggestingName ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Suggest
            </button>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder={config?.descPlaceholder}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder:text-slate-400 resize-none"
            />
            <button
              onClick={handleSuggestDescription}
              disabled={isSuggestingDesc || !data.name}
              className="absolute right-2 bottom-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSuggestingDesc ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Generate description
            </button>
          </div>
          {!data.name && (
            <p className="text-xs text-slate-400 mt-1">
              Fill in the name first to generate description with AI
            </p>
          )}
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Initial status
          </label>
          <div className="flex gap-2">
            {['draft', 'in-review'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => updateData({ status })}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all
                  ${data.status === status
                    ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {status === 'draft' ? 'Draft' : 'In Review'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Info box */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl">
        <p className="text-sm text-slate-600">
          <span className="font-medium">💡 Tip:</span> In the next step, you can use AI to generate more detailed content including metrics, structure, and recommendations.
        </p>
      </div>
    </div>
  )
}
