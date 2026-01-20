import { useState } from 'react'
import { 
  Sparkles, 
  Loader2, 
  Target, 
  Layers, 
  BookOpen, 
  ListChecks, 
  Lightbulb, 
  ArrowRight, 
  Check, 
  RefreshCw,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Database,
  Calendar,
  FileText,
  Image,
  Video,
  Table,
  Zap,
  Play,
  Link2,
  Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../../context/FuelContext'
import ScopeSelector from '../../common/ScopeSelector'
import ProductRequirements from '../../common/ProductRequirements'
import { aiService } from '../../../services/aiService'

// Metrics and data sources for objectives
const metricsOptions = [
  'Brand mention growth rate',
  'Share of voice',
  'Engagement rate',
  'Website traffic from social',
  'Lead generation rate',
  'Conversion rate',
  'Customer satisfaction (CSAT)',
  'Net Promoter Score (NPS)',
  'Follower growth rate',
  'Content reach',
  'Click-through rate (CTR)',
  'Cost per acquisition (CPA)',
]

const dataSourcesOptions = [
  'Emplifi Analytics',
  'Google Analytics',
  'Meta Business Suite',
  'LinkedIn Analytics',
  'TikTok Analytics',
  'Twitter/X Analytics',
  'Salesforce',
  'HubSpot',
]

const contentStructures = [
  'Campaign brief',
  'Content calendar',
  'Social post series',
  'Video script',
  'Blog article outline',
  'Influencer collaboration guide',
  'Paid ads strategy',
  'Community engagement plan',
]

const stepActionTypes = [
  { id: 'action', label: 'Manual action', icon: Check },
  { id: 'documentation', label: 'Documentation', icon: FileText },
  { id: 'script', label: 'Script/Code', icon: Play },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'link', label: 'External link', icon: Link2 },
]

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
    hasSettings: true,
    childType: 'tactic',
    childLabel: 'Tactics',
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
    hasSettings: true,
    childType: 'bestPractice',
    childLabel: 'Best Practices',
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
    hasSettings: false,
    childType: 'step',
    childLabel: 'Steps',
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
    hasSettings: true,
    childType: null,
    childLabel: null,
  },
}

export default function ContentStep({ data, updateData, isGenerating, setIsGenerating }) {
  const { items } = useFuel()
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatedSuggestions, setGeneratedSuggestions] = useState(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
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
    
    // Generate 3 suggestions based on prompt with full content
    const suggestions = generateFullSuggestions(prompt, data.type)
    setGeneratedSuggestions(suggestions)
    setIsGenerating(false)
  }
  
  const generateFullSuggestions = (prompt, type) => {
    const baseWords = prompt.toLowerCase().split(' ').filter(w => w.length > 3)
    const firstWord = baseWords[0] || 'engagement'
    const secondWord = baseWords[1] || 'campaign'
    
    if (type === 'objective') {
      return [
        {
          name: `Increase ${firstWord} by 30% in Q1`,
          description: `Strategic objective to boost ${prompt.toLowerCase()}. This initiative focuses on measurable outcomes through targeted social media campaigns.`,
          settings: {
            metrics: ['Engagement rate', 'Follower growth rate'],
            dataSources: ['Emplifi Analytics', 'Meta Business Suite'],
            baseline: '2.5%',
            target: '4.0%',
            deadline: 'Q1 2025',
          },
          suggestedChildren: [
            { name: 'User-Generated Content Campaign', description: 'Launch UGC campaign to increase authentic engagement' },
            { name: 'Influencer Partnership Program', description: 'Partner with micro-influencers for higher engagement' },
            { name: 'Interactive Stories Strategy', description: 'Use interactive features to boost engagement' },
          ],
        },
        {
          name: `Build ${firstWord} awareness in target market`,
          description: `Comprehensive goal to expand reach based on ${prompt.toLowerCase()}. Track brand mentions and audience growth.`,
          settings: {
            metrics: ['Brand mention growth rate', 'Share of voice'],
            dataSources: ['Google Analytics', 'Emplifi Analytics'],
            baseline: '5K mentions/mo',
            target: '15K mentions/mo',
            deadline: 'Q2 2025',
          },
          suggestedChildren: [
            { name: 'Brand Ambassador Program', description: 'Recruit and manage brand ambassadors' },
            { name: 'Viral Content Initiative', description: 'Create shareable content for organic reach' },
          ],
        },
        {
          name: `Optimize ${firstWord} performance metrics`,
          description: `Data-driven objective to improve ${prompt.toLowerCase()}. Focus on conversion rates and ROI.`,
          settings: {
            metrics: ['Conversion rate', 'Click-through rate (CTR)'],
            dataSources: ['Google Analytics', 'HubSpot'],
            baseline: '1.2%',
            target: '3.0%',
            deadline: 'Q2 2025',
          },
          suggestedChildren: [
            { name: 'A/B Testing Framework', description: 'Systematic testing approach' },
            { name: 'Performance Monitoring Dashboard', description: 'Real-time tracking setup' },
          ],
        },
      ]
    }
    
    if (type === 'tactic') {
      return [
        {
          name: `${prompt.split(' ').slice(0, 3).join(' ')} Campaign`,
          description: `Tactical approach to ${prompt.toLowerCase()}. Outlines channels, content types, and timeline.`,
          settings: {
            contentStructure: 'Campaign brief',
            includeMedia: { images: true, videos: true, tables: false },
          },
          contentOutline: [
            { type: 'heading', content: '1. Campaign Overview' },
            { type: 'paragraph', content: 'Goals and KPIs for the campaign' },
            { type: 'heading', content: '2. Target Audience' },
            { type: 'table', content: 'Audience segments matrix' },
            { type: 'heading', content: '3. Content Plan' },
            { type: 'image', placeholder: 'Content calendar visual' },
          ],
          suggestedChildren: [
            { name: 'Audience Research Process', description: 'How to identify and segment target audience' },
            { name: 'Content Calendar Template', description: 'Weekly/monthly planning template' },
            { name: 'Performance Tracking Guide', description: 'KPIs and reporting setup' },
          ],
        },
        {
          name: `Strategic ${firstWord} initiative`,
          description: `Focused tactic for ${prompt.toLowerCase()}. Includes targeting and engagement protocols.`,
          settings: {
            contentStructure: 'Content calendar',
            includeMedia: { images: true, videos: false, tables: true },
          },
          suggestedChildren: [
            { name: 'Weekly Planning Checklist', description: 'Standard weekly prep tasks' },
            { name: 'Engagement Response Templates', description: 'Pre-approved response templates' },
          ],
        },
        {
          name: `${firstWord} optimization program`,
          description: `Systematic approach to ${prompt.toLowerCase()}. Combines organic and paid strategies.`,
          settings: {
            contentStructure: 'Paid ads strategy',
            includeMedia: { images: true, videos: true, tables: true },
          },
          suggestedChildren: [
            { name: 'Budget Allocation Framework', description: 'How to split budget across channels' },
            { name: 'Creative Testing Protocol', description: 'A/B testing for ad creatives' },
          ],
        },
      ]
    }
    
    if (type === 'bestPractice') {
      return [
        {
          name: `${prompt.split(' ').slice(0, 3).join(' ')} Guide`,
          description: `Step-by-step best practice for ${prompt.toLowerCase()}. Based on proven methodologies.`,
          suggestedChildren: [
            { name: 'Define success criteria', actionType: 'action' },
            { name: 'Set up tracking', actionType: 'automation' },
            { name: 'Execute and validate', actionType: 'action' },
            { name: 'Document learnings', actionType: 'documentation' },
          ],
        },
        {
          name: `${firstWord} optimization checklist`,
          description: `Comprehensive checklist for ${prompt.toLowerCase()}. Ensures consistency.`,
          suggestedChildren: [
            { name: 'Review prerequisites', actionType: 'action' },
            { name: 'Run automated checks', actionType: 'automation' },
            { name: 'Manual QA review', actionType: 'action' },
          ],
        },
        {
          name: `${firstWord} operating procedure`,
          description: `Documented procedure for ${prompt.toLowerCase()}. Includes templates.`,
          suggestedChildren: [
            { name: 'Read documentation', actionType: 'documentation' },
            { name: 'Configure settings', actionType: 'action' },
            { name: 'Verify setup', actionType: 'action' },
          ],
        },
      ]
    }
    
    // Steps
    return [
      {
        name: `Configure ${firstWord} for ${secondWord}`,
        description: `Action item: ${prompt}. Specific instructions with verification steps.`,
        settings: { stepType: 'action' },
      },
      {
        name: `Set up ${firstWord} parameters`,
        description: `Technical step to implement ${prompt.toLowerCase()}.`,
        settings: { stepType: 'automation' },
      },
      {
        name: `Review and validate ${firstWord}`,
        description: `Quality check step for ${prompt.toLowerCase()}.`,
        settings: { stepType: 'action' },
      },
    ]
  }
  
  const handleSelectSuggestion = (suggestion, index) => {
    setSelectedSuggestion(index)
    
    // Update all data from the suggestion
    const updates = {
      name: suggestion.name,
      description: suggestion.description,
    }
    
    // Add settings if present
    if (suggestion.settings) {
      if (suggestion.settings.metrics) updates.metrics = suggestion.settings.metrics
      if (suggestion.settings.dataSources) updates.dataSources = suggestion.settings.dataSources
      if (suggestion.settings.baseline) updates.baseline = suggestion.settings.baseline
      if (suggestion.settings.target) updates.targetValue = suggestion.settings.target
      if (suggestion.settings.deadline) updates.deadline = suggestion.settings.deadline
      if (suggestion.settings.contentStructure) updates.contentStructure = suggestion.settings.contentStructure
      if (suggestion.settings.includeMedia) updates.includeMedia = suggestion.settings.includeMedia
      if (suggestion.settings.stepType) updates.stepType = suggestion.settings.stepType
    }
    
    // Store generated content for use in later steps
    if (suggestion.suggestedChildren || suggestion.contentOutline) {
      updates.generatedContent = {
        name: suggestion.name,
        description: suggestion.description,
        suggestedTactics: data.type === 'objective' ? suggestion.suggestedChildren : undefined,
        suggestedBestPractices: data.type === 'tactic' ? suggestion.suggestedChildren : undefined,
        suggestedSteps: data.type === 'bestPractice' ? suggestion.suggestedChildren : undefined,
        contentOutline: suggestion.contentOutline,
        settings: suggestion.settings,
      }
    }
    
    updateData(updates)
  }
  
  const handleQuickPrompt = (prompt) => {
    setAiPrompt(prompt)
    handleGenerateFromPrompt(prompt)
  }
  
  const renderAdvancedSettings = () => {
    if (data.type === 'objective') {
      return (
        <div className="space-y-4">
          {/* Metrics */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Success Metrics
            </label>
            <div className="flex flex-wrap gap-1.5">
              {metricsOptions.map(metric => (
                <button
                  key={metric}
                  onClick={() => {
                    const current = data.metrics || []
                    const updated = current.includes(metric)
                      ? current.filter(m => m !== metric)
                      : [...current, metric]
                    updateData({ metrics: updated })
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all
                    ${(data.metrics || []).includes(metric)
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          
          {/* Data Sources */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <Database className="w-3.5 h-3.5" />
              Data Sources
            </label>
            <div className="flex flex-wrap gap-1.5">
              {dataSourcesOptions.map(source => (
                <button
                  key={source}
                  onClick={() => {
                    const current = data.dataSources || []
                    const updated = current.includes(source)
                      ? current.filter(s => s !== source)
                      : [...current, source]
                    updateData({ dataSources: updated })
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all
                    ${(data.dataSources || []).includes(source)
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
          
          {/* Baseline, Target, Deadline */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Baseline</label>
              <input
                type="text"
                value={data.baseline || ''}
                onChange={(e) => updateData({ baseline: e.target.value })}
                placeholder="e.g. 2.5%"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Target</label>
              <input
                type="text"
                value={data.targetValue || ''}
                onChange={(e) => updateData({ targetValue: e.target.value })}
                placeholder="e.g. 5%"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                <Calendar className="w-3 h-3" />
                Deadline
              </label>
              <input
                type="text"
                value={data.deadline || ''}
                onChange={(e) => updateData({ deadline: e.target.value })}
                placeholder="e.g. Q4 2024"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      )
    }
    
    if (data.type === 'tactic') {
      return (
        <div className="space-y-4">
          {/* Content Structure */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <FileText className="w-3.5 h-3.5" />
              Content Structure
            </label>
            <select
              value={data.contentStructure || ''}
              onChange={(e) => updateData({ contentStructure: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="">Auto-detect from prompt</option>
              {contentStructures.map(cs => (
                <option key={cs} value={cs}>{cs}</option>
              ))}
            </select>
          </div>
          
          {/* Media Types */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Include Media
            </label>
            <div className="flex gap-2">
              {[
                { key: 'images', label: 'Images', icon: Image },
                { key: 'videos', label: 'Videos', icon: Video },
                { key: 'tables', label: 'Tables', icon: Table },
              ].map(({ key, label, icon: MediaIcon }) => (
                <button
                  key={key}
                  onClick={() => updateData({ 
                    includeMedia: { 
                      ...data.includeMedia, 
                      [key]: !data.includeMedia?.[key] 
                    } 
                  })}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${data.includeMedia?.[key]
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <MediaIcon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    if (data.type === 'step') {
      return (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Action Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stepActionTypes.map(({ id, label, icon: StepIcon }) => (
              <button
                key={id}
                onClick={() => updateData({ stepType: id })}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-all text-sm
                  ${data.stepType === id
                    ? 'bg-slate-200 ring-1 ring-slate-400'
                    : 'bg-slate-100 hover:bg-slate-200'
                  }`}
              >
                <StepIcon className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }
    
    return null
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
                      
                      {/* Show what's included */}
                      {(suggestion.suggestedChildren || suggestion.settings) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {suggestion.settings?.metrics && (
                            <span className="px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded-full">
                              {suggestion.settings.metrics.length} metrics
                            </span>
                          )}
                          {suggestion.suggestedChildren && (
                            <span className="px-2 py-0.5 text-xs bg-teal-100 text-teal-700 rounded-full">
                              +{suggestion.suggestedChildren.length} {config.childLabel?.toLowerCase()}
                            </span>
                          )}
                          {suggestion.contentOutline && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                              Content outline
                            </span>
                          )}
                        </div>
                      )}
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
        <div className="flex items-center gap-2">
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
      
      {/* Advanced Settings Toggle */}
      {config.hasSettings && (
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {showAdvanced ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span>Advanced settings</span>
            {(data.metrics?.length > 0 || data.contentStructure || data.stepType) && (
              <span className="px-1.5 py-0.5 text-xs bg-teal-100 text-teal-700 rounded">
                configured
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  {renderAdvancedSettings()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Targeting & Products Section */}
      {(data.type === 'objective' || data.type === 'tactic') && (
        <div className="mt-6 space-y-6">
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900">Targeting & Requirements</h3>
            </div>
            
            {/* Scope selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
              <ScopeSelector
                scope={data.scope || { type: 'universal', industries: [], accounts: [], regions: [], jobRoles: [] }}
                onChange={(newScope) => updateData({ scope: newScope })}
                showAISuggestion={true}
                onAISuggest={async () => {
                  if (data.name || data.description) {
                    const result = await aiService.suggestScope({ name: data.name, description: data.description })
                    if (result.suggestedScope) {
                      updateData({ scope: result.suggestedScope })
                    }
                  }
                }}
              />
            </div>
            
            {/* Product requirements */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <ProductRequirements
                selectedProducts={data.requiredProducts || []}
                onChange={(newProducts) => updateData({ requiredProducts: newProducts })}
                content={{ name: data.name, description: data.description, type: data.type }}
                showAISuggestion={true}
                columns={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
