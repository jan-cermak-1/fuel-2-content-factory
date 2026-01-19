import { useState } from 'react'
import { 
  X, 
  Sparkles, 
  Zap, 
  Target,
  Layers,
  BookOpen,
  ListChecks,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Loader2,
  FileText,
  BarChart3,
  Calendar,
  Database,
  Link2,
  Play,
  Image,
  Table,
  Video
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../context/FuelContext'

// Configuration based on item type
const typeConfig = {
  objective: {
    label: 'Objective',
    icon: Target,
    color: 'violet',
    description: 'Define measurable goals with metrics and deadlines',
    fields: ['metrics', 'dataSources', 'formula', 'deadline', 'baseline'],
    canGenerateChildren: true,
    childType: 'tactic',
  },
  tactic: {
    label: 'Tactic',
    icon: Layers,
    color: 'blue',
    description: 'Generate detailed tactic with content structure',
    fields: ['contentStructure', 'mediaTypes', 'audience'],
    canGenerateChildren: true,
    childType: 'bestPractice',
  },
  bestPractice: {
    label: 'Best Practice',
    icon: BookOpen,
    color: 'emerald',
    description: 'Create actionable best practices',
    fields: ['guidelines', 'examples', 'warnings'],
    canGenerateChildren: true,
    childType: 'step',
  },
  step: {
    label: 'Step',
    icon: ListChecks,
    color: 'slate',
    description: 'Generate todo items with actions and links',
    fields: ['actionType', 'automation', 'documentation'],
    canGenerateChildren: false,
  },
}

const metrics = [
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
  'Return on ad spend (ROAS)',
  'Social media ROI',
  'Video completion rate',
  'Story views',
]

const dataSources = [
  'Emplifi Analytics',
  'Google Analytics',
  'Meta Business Suite',
  'LinkedIn Analytics',
  'TikTok Analytics',
  'Twitter/X Analytics',
  'Salesforce',
  'HubSpot',
  'Custom API',
  'Manual tracking',
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
  'Crisis response protocol',
  'Product launch playbook',
]

const stepTypes = [
  { id: 'action', label: 'Manual action', icon: Check },
  { id: 'documentation', label: 'Read documentation', icon: FileText },
  { id: 'script', label: 'Run script', icon: Play },
  { id: 'automation', label: 'Trigger automation', icon: Zap },
  { id: 'link', label: 'External link', icon: Link2 },
]

export default function AIGenerationPanel() {
  const { 
    setAiPanelOpen, 
    selectedItem,
    items,
    addItem,
    updateItem,
  } = useFuel()
  
  const [generateType, setGenerateType] = useState(selectedItem?.type || 'tactic')
  const [prompt, setPrompt] = useState('')
  const [includeChildren, setIncludeChildren] = useState(true)
  const [childCount, setChildCount] = useState(3)
  const [stepCount, setStepCount] = useState(5)
  
  // Objective-specific settings
  const [selectedMetrics, setSelectedMetrics] = useState([])
  const [selectedDataSources, setSelectedDataSources] = useState([])
  const [deadline, setDeadline] = useState('')
  const [baseline, setBaseline] = useState('')
  const [targetValue, setTargetValue] = useState('')
  
  // Tactic-specific settings
  const [contentStructure, setContentStructure] = useState('')
  const [includeMedia, setIncludeMedia] = useState({ images: true, videos: false, tables: true })
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResults, setGeneratedResults] = useState(null)
  const [expandedResults, setExpandedResults] = useState(new Set())
  
  const config = typeConfig[generateType]
  const Icon = config?.icon || Layers
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedResults(null)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Generate mock results based on type
    const results = generateMockResults()
    setGeneratedResults(results)
    setIsGenerating(false)
    
    // Expand first result
    if (results) {
      setExpandedResults(new Set([results.id]))
    }
  }
  
  const generateMockResults = () => {
    const baseId = Date.now()
    
    if (generateType === 'objective') {
      return {
        id: `gen-obj-${baseId}`,
        type: 'objective',
        name: prompt || 'Increase Social Media Engagement by 25%',
        description: `Strategic objective to improve overall social media performance through targeted campaigns and content optimization.`,
        metric: selectedMetrics[0] || 'Engagement rate',
        settings: {
          metrics: selectedMetrics.length > 0 ? selectedMetrics : ['Engagement rate', 'Follower growth rate'],
          dataSources: selectedDataSources.length > 0 ? selectedDataSources : ['Emplifi Analytics', 'Meta Business Suite'],
          baseline: baseline || '2.5%',
          target: targetValue || '3.1%',
          deadline: deadline || '2024-Q2',
          formula: 'Weighted average of (Likes + Comments*2 + Shares*3) / Reach * 100',
        },
        children: includeChildren ? [
          {
            id: `gen-tac-${baseId}-1`,
            type: 'tactic',
            name: 'User-Generated Content Campaign',
            description: 'Launch a UGC campaign to increase authentic engagement',
          },
          {
            id: `gen-tac-${baseId}-2`,
            type: 'tactic',
            name: 'Influencer Micro-Partnership Program',
            description: 'Partner with micro-influencers for higher engagement rates',
          },
          {
            id: `gen-tac-${baseId}-3`,
            type: 'tactic',
            name: 'Interactive Stories & Polls',
            description: 'Use interactive features to boost direct engagement',
          },
        ] : [],
      }
    }
    
    if (generateType === 'tactic') {
      return {
        id: `gen-tac-${baseId}`,
        type: 'tactic',
        name: prompt || 'Influencer Marketing Campaign',
        description: `Comprehensive influencer marketing strategy to amplify brand reach and engagement.`,
        contentOutline: [
          { type: 'heading', content: '1. Campaign Overview' },
          { type: 'paragraph', content: 'Define campaign goals, timeline, and budget allocation.' },
          { type: 'image', placeholder: 'Campaign timeline visual' },
          { type: 'heading', content: '2. Influencer Selection Criteria' },
          { type: 'table', content: 'Criteria matrix for influencer evaluation' },
          { type: 'heading', content: '3. Content Guidelines' },
          { type: 'paragraph', content: 'Brand voice, messaging pillars, and visual requirements.' },
          { type: 'heading', content: '4. Performance Tracking' },
          { type: 'paragraph', content: 'KPIs and reporting framework.' },
        ],
        children: includeChildren ? [
          {
            id: `gen-bp-${baseId}-1`,
            type: 'bestPractice',
            name: 'Influencer Vetting Process',
            description: 'Systematic approach to evaluate and select influencers',
            children: [
              { id: `gen-step-${baseId}-1-1`, type: 'step', name: 'Check audience authenticity', actionType: 'action' },
              { id: `gen-step-${baseId}-1-2`, type: 'step', name: 'Review past brand collaborations', actionType: 'action' },
              { id: `gen-step-${baseId}-1-3`, type: 'step', name: 'Run influencer through vetting tool', actionType: 'automation', link: '/tools/influencer-vetting' },
            ],
          },
          {
            id: `gen-bp-${baseId}-2`,
            type: 'bestPractice',
            name: 'Contract & Briefing',
            description: 'Ensure clear agreements and creative direction',
            children: [
              { id: `gen-step-${baseId}-2-1`, type: 'step', name: 'Send contract template', actionType: 'documentation', link: '/docs/influencer-contract' },
              { id: `gen-step-${baseId}-2-2`, type: 'step', name: 'Schedule briefing call', actionType: 'action' },
              { id: `gen-step-${baseId}-2-3`, type: 'step', name: 'Share brand guidelines', actionType: 'documentation', link: '/docs/brand-guidelines' },
            ],
          },
          {
            id: `gen-bp-${baseId}-3`,
            type: 'bestPractice',
            name: 'Performance Monitoring',
            description: 'Track and optimize campaign performance',
            children: [
              { id: `gen-step-${baseId}-3-1`, type: 'step', name: 'Set up tracking pixels', actionType: 'script', link: '/scripts/pixel-setup' },
              { id: `gen-step-${baseId}-3-2`, type: 'step', name: 'Configure analytics dashboard', actionType: 'automation' },
              { id: `gen-step-${baseId}-3-3`, type: 'step', name: 'Schedule weekly reports', actionType: 'automation' },
            ],
          },
        ] : [],
      }
    }
    
    if (generateType === 'bestPractice') {
      return {
        id: `gen-bp-${baseId}`,
        type: 'bestPractice',
        name: prompt || 'Content Approval Workflow',
        description: 'Streamlined process for content review and approval',
        guidelines: [
          'All content must be reviewed within 24 hours',
          'Use standardized feedback format',
          'Track revision history',
        ],
        children: Array.from({ length: stepCount }, (_, i) => ({
          id: `gen-step-${baseId}-${i}`,
          type: 'step',
          name: [
            'Submit content for review',
            'Assign to content reviewer',
            'Complete first review pass',
            'Address feedback and revisions',
            'Final approval sign-off',
          ][i] || `Step ${i + 1}`,
          actionType: ['action', 'automation', 'action', 'action', 'automation'][i] || 'action',
        })),
      }
    }
    
    if (generateType === 'step') {
      return {
        id: `gen-step-${baseId}`,
        type: 'step',
        name: prompt || 'Configure social listening alerts',
        actionType: 'automation',
        description: 'Set up automated monitoring for brand mentions and keywords',
        documentation: '/docs/social-listening-setup',
        script: '/scripts/alert-config.sh',
      }
    }
    
    return null
  }
  
  const handleAcceptAll = () => {
    if (!generatedResults) return
    
    // Add all generated items to the system
    const addGeneratedItem = (item, parentId = null) => {
      const newItem = {
        type: item.type,
        name: item.name,
        description: item.description,
        status: 'draft',
        qualityScore: Math.floor(Math.random() * 15) + 80,
        targeting: { industries: [], regions: [], jobRoles: [] },
        parentIds: parentId ? [parentId] : [],
        childIds: [],
        ...(item.settings && { settings: item.settings }),
        ...(item.metric && { metric: item.metric }),
        ...(item.actionType && { actionType: item.actionType }),
      }
      
      addItem(newItem)
      
      // Add children recursively
      if (item.children) {
        item.children.forEach(child => {
          addGeneratedItem(child, newItem.id)
        })
      }
    }
    
    addGeneratedItem(generatedResults, selectedItem?.id)
    setGeneratedResults(null)
    setAiPanelOpen(false)
  }
  
  const toggleResultExpanded = (id) => {
    setExpandedResults(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }
  
  const renderResultItem = (item, depth = 0) => {
    const itemConfig = typeConfig[item.type]
    const ItemIcon = itemConfig?.icon || FileText
    const isExpanded = expandedResults.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    
    return (
      <div key={item.id} className="border-l-2 border-slate-200" style={{ marginLeft: depth * 16 }}>
        <div 
          className={`flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer
            ${depth === 0 ? 'bg-white border border-slate-200 rounded-lg' : ''}`}
          onClick={() => hasChildren && toggleResultExpanded(item.id)}
        >
          {hasChildren && (
            <button className="mt-0.5 p-0.5 hover:bg-slate-200 rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <div className={`p-1.5 rounded-lg bg-${itemConfig?.color || 'slate'}-100`}>
            <ItemIcon className={`w-4 h-4 text-${itemConfig?.color || 'slate'}-600`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 text-sm">{item.name}</p>
            {item.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
            )}
            {item.actionType && (
              <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs rounded-full
                ${item.actionType === 'automation' ? 'bg-purple-100 text-purple-700' : 
                  item.actionType === 'script' ? 'bg-amber-100 text-amber-700' :
                  item.actionType === 'documentation' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'}`}>
                {stepTypes.find(t => t.id === item.actionType)?.label || item.actionType}
              </span>
            )}
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {item.children.map(child => renderResultItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">AI Content Generator</h2>
            <p className="text-xs text-slate-500">Powered by Grok</p>
          </div>
        </div>
        <button
          onClick={() => setAiPanelOpen(false)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Context */}
        {selectedItem && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Generating for:</p>
            <p className="font-medium text-slate-900">{selectedItem.name}</p>
          </div>
        )}
        
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What to generate:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(typeConfig).map(([type, cfg]) => {
              const TypeIcon = cfg.icon
              return (
                <button
                  key={type}
                  onClick={() => setGenerateType(type)}
                  className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all
                    ${generateType === type
                      ? `bg-${cfg.color}-50 ring-2 ring-${cfg.color}-500`
                      : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                  <TypeIcon className={`w-5 h-5 ${generateType === type ? `text-${cfg.color}-600` : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${generateType === type ? `text-${cfg.color}-700` : 'text-slate-700'}`}>
                    {cfg.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Describe what you need:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              generateType === 'objective' ? 'e.g., Increase brand awareness in EMEA market by Q3...' :
              generateType === 'tactic' ? 'e.g., Influencer marketing campaign for product launch...' :
              generateType === 'bestPractice' ? 'e.g., Content approval workflow for social posts...' :
              'e.g., Configure automated alerts for brand mentions...'
            }
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none bg-white"
          />
        </div>
        
        {/* Type-specific settings */}
        {generateType === 'objective' && (
          <div className="space-y-4 p-4 bg-violet-50 rounded-lg">
            <h4 className="text-sm font-medium text-violet-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Objective Settings
            </h4>
            
            {/* Metrics */}
            <div>
              <label className="block text-xs text-violet-700 mb-1.5">Success Metrics</label>
              <select
                multiple
                value={selectedMetrics}
                onChange={(e) => setSelectedMetrics(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white h-24"
              >
                {metrics.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <p className="text-xs text-violet-600 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            
            {/* Data Sources */}
            <div>
              <label className="block text-xs text-violet-700 mb-1.5">Data Sources</label>
              <select
                multiple
                value={selectedDataSources}
                onChange={(e) => setSelectedDataSources(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white h-20"
              >
                {dataSources.map(ds => (
                  <option key={ds} value={ds}>{ds}</option>
                ))}
              </select>
            </div>
            
            {/* Baseline & Target */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-violet-700 mb-1.5">Baseline Value</label>
                <input
                  type="text"
                  value={baseline}
                  onChange={(e) => setBaseline(e.target.value)}
                  placeholder="e.g., 2.5%"
                  className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-violet-700 mb-1.5">Target Value</label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g., 5%"
                  className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white"
                />
              </div>
            </div>
            
            {/* Deadline */}
            <div>
              <label className="block text-xs text-violet-700 mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Deadline
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g., 2024-Q2, Dec 2024"
                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white"
              />
            </div>
          </div>
        )}
        
        {generateType === 'tactic' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tactic Content Settings
            </h4>
            
            {/* Content Structure */}
            <div>
              <label className="block text-xs text-blue-700 mb-1.5">Content Structure</label>
              <select
                value={contentStructure}
                onChange={(e) => setContentStructure(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white"
              >
                <option value="">Auto-detect from prompt</option>
                {contentStructures.map(cs => (
                  <option key={cs} value={cs}>{cs}</option>
                ))}
              </select>
            </div>
            
            {/* Media Types */}
            <div>
              <label className="block text-xs text-blue-700 mb-1.5">Include Media</label>
              <div className="flex gap-2">
                {[
                  { key: 'images', label: 'Images', icon: Image },
                  { key: 'videos', label: 'Videos', icon: Video },
                  { key: 'tables', label: 'Tables', icon: Table },
                ].map(({ key, label, icon: MediaIcon }) => (
                  <button
                    key={key}
                    onClick={() => setIncludeMedia(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${includeMedia[key]
                        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                        : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                  >
                    <MediaIcon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {generateType === 'step' && (
          <div className="space-y-4 p-4 bg-slate-100 rounded-lg">
            <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Step Settings
            </h4>
            
            <div>
              <label className="block text-xs text-slate-700 mb-1.5">Step Type</label>
              <div className="grid grid-cols-2 gap-2">
                {stepTypes.map(({ id, label, icon: StepIcon }) => (
                  <button
                    key={id}
                    className="flex items-center gap-2 p-2 rounded-lg text-left bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <StepIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Include Children Toggle */}
        {config?.canGenerateChildren && (
          <div className="p-4 bg-teal-50 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeChildren}
                onChange={(e) => setIncludeChildren(e.target.checked)}
                className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
              />
              <div>
                <p className="text-sm font-medium text-teal-900">
                  Also generate {config.childType === 'tactic' ? 'Tactics' : 
                    config.childType === 'bestPractice' ? 'Best Practices' : 'Steps'}
                </p>
                <p className="text-xs text-teal-700">
                  AI will suggest {childCount} items with detailed structure
                </p>
              </div>
            </label>
            
            {includeChildren && (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs text-teal-700">Count:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={childCount}
                  onChange={(e) => setChildCount(Number(e.target.value))}
                  className="flex-1 accent-teal-500"
                />
                <span className="text-sm font-medium text-teal-900 w-4">{childCount}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Generation Progress */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl text-center"
            >
              <div className="ai-thinking mb-3">
                <Zap className="w-8 h-8 text-teal-500 mx-auto" />
              </div>
              <p className="font-medium text-teal-700">Grok is generating content...</p>
              <p className="text-sm text-teal-600 mt-1">
                Creating {generateType} {includeChildren ? `with ${config?.childType}s` : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Generated Results */}
        {generatedResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Generated Content:</h3>
              <button
                onClick={handleAcceptAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Accept All
              </button>
            </div>
            
            {renderResultItem(generatedResults)}
            
            {generatedResults.settings && (
              <div className="p-3 bg-violet-50 rounded-lg mt-2">
                <h4 className="text-xs font-medium text-violet-900 mb-2">Objective Configuration:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-violet-600">Metrics:</span> {generatedResults.settings.metrics?.join(', ')}</div>
                  <div><span className="text-violet-600">Sources:</span> {generatedResults.settings.dataSources?.join(', ')}</div>
                  <div><span className="text-violet-600">Baseline:</span> {generatedResults.settings.baseline}</div>
                  <div><span className="text-violet-600">Target:</span> {generatedResults.settings.target}</div>
                  <div><span className="text-violet-600">Deadline:</span> {generatedResults.settings.deadline}</div>
                  <div className="col-span-2"><span className="text-violet-600">Formula:</span> {generatedResults.settings.formula}</div>
                </div>
              </div>
            )}
            
            {generatedResults.contentOutline && (
              <div className="p-3 bg-blue-50 rounded-lg mt-2">
                <h4 className="text-xs font-medium text-blue-900 mb-2">Content Structure:</h4>
                <div className="space-y-1">
                  {generatedResults.contentOutline.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {item.type === 'heading' && <span className="font-medium text-blue-900">{item.content}</span>}
                      {item.type === 'paragraph' && <span className="text-blue-700 ml-4">{item.content}</span>}
                      {item.type === 'image' && (
                        <span className="ml-4 flex items-center gap-1 text-blue-600">
                          <Image className="w-3 h-3" /> {item.placeholder}
                        </span>
                      )}
                      {item.type === 'table' && (
                        <span className="ml-4 flex items-center gap-1 text-blue-600">
                          <Table className="w-3 h-3" /> {item.content}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate {config?.label}
              {includeChildren && config?.canGenerateChildren && ` + ${config.childType}s`}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
