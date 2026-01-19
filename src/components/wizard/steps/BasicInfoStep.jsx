import { useState } from 'react'
import { Sparkles, Loader2, Target, Layers, BookOpen, ListChecks, Lightbulb, ArrowRight, Check, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../../context/FuelContext'

const typeConfig = {
  objective: {
    label: 'Objective',
    icon: Target,
    badgeClass: 'bg-violet-100 text-violet-700',
    namePlaceholder: 'e.g. Increase Brand Awareness by 25%',
    descPlaceholder: 'Describe the main goal and why it matters for your strategy...',
    parentType: null,
    promptPlaceholder: 'Describe your goal... e.g. "I want to increase engagement on Instagram for a fashion brand targeting Gen Z"',
    quickPrompts: [
      'Increase brand awareness for B2B SaaS',
      'Drive more leads from social media',
      'Improve customer engagement rates',
      'Build community around our product',
      'Increase website traffic from social',
      'Boost conversion from social campaigns',
    ],
  },
  tactic: {
    label: 'Tactic',
    icon: Layers,
    badgeClass: 'bg-blue-100 text-blue-700',
    namePlaceholder: 'e.g. Influencer Marketing Campaign',
    descPlaceholder: 'Describe the tactic and how it helps achieve the goal...',
    parentType: 'objective',
    parentLabel: 'Parent Objective',
    promptPlaceholder: 'Describe your approach... e.g. "Influencer campaign with micro-influencers in fitness niche"',
    quickPrompts: [
      'Influencer marketing campaign',
      'User-generated content strategy',
      'Paid social advertising',
      'Content calendar optimization',
      'Social listening & engagement',
      'Community building program',
    ],
  },
  bestPractice: {
    label: 'Best Practice',
    icon: BookOpen,
    badgeClass: 'bg-emerald-100 text-emerald-700',
    namePlaceholder: 'e.g. Micro-influencer Vetting Process',
    descPlaceholder: 'Describe the best practice and when to use it...',
    parentType: 'tactic',
    parentLabel: 'Parent Tactic',
    promptPlaceholder: 'Describe the process... e.g. "How to vet and select the right influencers"',
    quickPrompts: [
      'Influencer vetting checklist',
      'Content approval workflow',
      'Optimal posting schedule',
      'A/B testing framework',
      'Crisis response protocol',
      'Engagement templates',
    ],
  },
  step: {
    label: 'Step',
    icon: ListChecks,
    badgeClass: 'bg-slate-100 text-slate-700',
    namePlaceholder: 'e.g. Set up UTM parameters',
    descPlaceholder: 'Describe the specific step or action...',
    parentType: 'bestPractice',
    parentLabel: 'Parent Best Practice',
    promptPlaceholder: 'Describe the action... e.g. "Set up tracking for campaign links"',
    quickPrompts: [
      'Configure tracking parameters',
      'Set up automation rules',
      'Create content templates',
      'Schedule posts for the week',
      'Review analytics dashboard',
      'Update audience segments',
    ],
  },
}

export default function BasicInfoStep({ data, updateData }) {
  const { items } = useFuel()
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatedSuggestions, setGeneratedSuggestions] = useState(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  
  const config = typeConfig[data.type] || typeConfig.tactic
  const Icon = config.icon
  
  // Get possible parents based on type
  const possibleParents = config.parentType 
    ? items.filter(item => item.type === config.parentType)
    : []
  
  const handleGenerateFromPrompt = async (prompt) => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setAiPrompt(prompt)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate 3 suggestions based on prompt
    const suggestions = generateSuggestions(prompt, data.type)
    setGeneratedSuggestions(suggestions)
    setIsGenerating(false)
  }
  
  const generateSuggestions = (prompt, type) => {
    // Simulate AI-generated suggestions based on the prompt
    const baseWords = prompt.toLowerCase().split(' ').filter(w => w.length > 3)
    const firstWord = baseWords[0] || 'engagement'
    const secondWord = baseWords[1] || 'campaign'
    
    const templates = {
      objective: [
        {
          name: `Increase ${firstWord} by 30% in Q1`,
          description: `Strategic objective to boost ${prompt.toLowerCase()}. This initiative focuses on measurable outcomes through targeted social media campaigns, aiming to achieve significant growth in key performance metrics.`,
        },
        {
          name: `Build ${firstWord} awareness in target market`,
          description: `Comprehensive goal to expand reach and visibility based on ${prompt.toLowerCase()}. This objective will track brand mentions, share of voice, and audience growth metrics.`,
        },
        {
          name: `Optimize ${firstWord} performance metrics`,
          description: `Data-driven objective to improve overall performance related to ${prompt.toLowerCase()}. Focus on conversion rates, engagement quality, and ROI optimization.`,
        },
      ],
      tactic: [
        {
          name: `${prompt.split(' ').slice(0, 3).join(' ')} Campaign`,
          description: `Tactical approach to ${prompt.toLowerCase()}. This strategy outlines specific channels, content types, and timeline for execution with clear success metrics.`,
        },
        {
          name: `Strategic ${firstWord} initiative`,
          description: `Focused tactic implementing ${prompt.toLowerCase()}. Includes audience targeting, content calendar, and engagement protocols.`,
        },
        {
          name: `${firstWord} optimization program`,
          description: `Systematic approach to ${prompt.toLowerCase()}. Combines organic and paid strategies with continuous testing and optimization.`,
        },
      ],
      bestPractice: [
        {
          name: `${prompt.split(' ').slice(0, 3).join(' ')} Guide`,
          description: `Step-by-step best practice for ${prompt.toLowerCase()}. Based on industry standards and proven methodologies for consistent results.`,
        },
        {
          name: `${firstWord} optimization checklist`,
          description: `Comprehensive checklist for ${prompt.toLowerCase()}. Ensures quality and consistency across all implementations.`,
        },
        {
          name: `${firstWord} operating procedure`,
          description: `Documented procedure for ${prompt.toLowerCase()}. Includes templates, examples, and verification criteria.`,
        },
      ],
      step: [
        {
          name: `Configure ${firstWord} for ${secondWord}`,
          description: `Action item: ${prompt}. Specific instructions with verification steps to ensure completion.`,
        },
        {
          name: `Set up ${firstWord} parameters`,
          description: `Technical step to implement ${prompt.toLowerCase()}. Includes links to documentation and expected outcomes.`,
        },
        {
          name: `Review and validate ${firstWord}`,
          description: `Quality check step for ${prompt.toLowerCase()}. Verification criteria and approval workflow.`,
        },
      ],
    }
    
    return templates[type] || templates.tactic
  }
  
  const handleSelectSuggestion = (suggestion, index) => {
    setSelectedSuggestion(index)
    updateData({ 
      name: suggestion.name, 
      description: suggestion.description 
    })
  }
  
  const handleQuickPrompt = (prompt) => {
    setAiPrompt(prompt)
    handleGenerateFromPrompt(prompt)
  }
  
  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Type indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.badgeClass}`}>
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        
        {/* Parent Selection */}
        {config.parentType && possibleParents.length > 0 && (
          <select
            value={data.parentId || ''}
            onChange={(e) => updateData({ parentId: e.target.value })}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
          >
            <option value="">No parent (standalone)</option>
            {possibleParents.map(parent => (
              <option key={parent.id} value={parent.id}>{parent.name}</option>
            ))}
          </select>
        )}
      </div>
      
      {/* AI Prompt Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-teal-500" />
          <h3 className="font-semibold text-slate-900">Describe what you want to create</h3>
        </div>
        
        <div className="relative">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={config.promptPlaceholder}
            rows={3}
            className="w-full px-4 py-3 pr-32 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder:text-slate-400 resize-none"
          />
          <button
            onClick={() => handleGenerateFromPrompt(aiPrompt)}
            disabled={isGenerating || !aiPrompt.trim()}
            className="absolute right-2 bottom-2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Quick prompts */}
      {!generatedSuggestions && !isGenerating && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">Or pick a quick start:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Generated Suggestions */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
              <p className="text-sm text-teal-700 font-medium">AI is generating suggestions...</p>
              <p className="text-xs text-teal-600">Based on: "{aiPrompt}"</p>
            </div>
          </motion.div>
        )}
        
        {generatedSuggestions && !isGenerating && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Pick a suggestion or edit below:</span>
              </div>
              <button
                onClick={() => handleGenerateFromPrompt(aiPrompt)}
                className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
            
            <div className="space-y-3">
              {generatedSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectSuggestion(suggestion, index)}
                  className={`w-full p-4 rounded-xl text-left transition-all
                    ${selectedSuggestion === index
                      ? 'bg-teal-50 border-2 border-teal-500 ring-2 ring-teal-100'
                      : 'bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${selectedSuggestion === index 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {selectedSuggestion === index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 mb-1">{suggestion.name}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{suggestion.description}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 flex-shrink-0 transition-colors
                      ${selectedSuggestion === index ? 'text-teal-500' : 'text-slate-300'}
                    `} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Manual edit section */}
      <div className={`space-y-4 p-4 rounded-xl border transition-all ${
        generatedSuggestions ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            {generatedSuggestions ? 'Edit your selection:' : 'Or enter manually:'}
          </span>
          {data.status && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full
              ${data.status === 'draft' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}
            `}>
              {data.status === 'draft' ? 'Draft' : 'In Review'}
            </span>
          )}
        </div>
        
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder={config.namePlaceholder}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder:text-slate-400 text-sm"
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            Description
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder={config.descPlaceholder}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder:text-slate-400 resize-none text-sm"
          />
        </div>
        
        {/* Status toggle */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Status:</span>
          <div className="flex gap-1">
            {['draft', 'in-review'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => updateData({ status })}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all
                  ${data.status === status
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                {status === 'draft' ? 'Draft' : 'In Review'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
