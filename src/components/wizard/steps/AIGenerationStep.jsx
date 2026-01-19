import { useState } from 'react'
import { 
  Sparkles, 
  Loader2, 
  Target,
  Layers,
  BookOpen,
  ListChecks,
  BarChart3,
  Calendar,
  Database,
  FileText,
  Image,
  Video,
  Table,
  Check,
  Zap,
  Play,
  Link2,
  ChevronDown,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const stepTypes = [
  { id: 'action', label: 'Manual action', icon: Check },
  { id: 'documentation', label: 'Documentation', icon: FileText },
  { id: 'script', label: 'Script/Code', icon: Play },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'link', label: 'External link', icon: Link2 },
]

const typeConfig = {
  objective: { label: 'Objective', icon: Target, color: 'violet' },
  tactic: { label: 'Tactic', icon: Layers, color: 'blue' },
  bestPractice: { label: 'Best Practice', icon: BookOpen, color: 'emerald' },
  step: { label: 'Step', icon: ListChecks, color: 'slate' },
}

export default function AIGenerationStep({ data, updateData, isGenerating, setIsGenerating }) {
  const [expandedSections, setExpandedSections] = useState(new Set(['settings']))
  
  const config = typeConfig[data.type]
  
  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate content based on type
    const generatedContent = generateMockContent()
    updateData({ generatedContent })
    
    setIsGenerating(false)
    setExpandedSections(prev => new Set([...prev, 'preview']))
  }
  
  const generateMockContent = () => {
    const baseId = Date.now()
    const name = data.name || `Generated ${config.label}`
    
    if (data.type === 'objective') {
      return {
        id: `gen-obj-${baseId}`,
        type: 'objective',
        name,
        description: data.description || `Strategic objective to achieve measurable results through targeted social media initiatives.`,
        metric: data.metrics?.[0] || 'Engagement rate',
        settings: {
          metrics: data.metrics?.length > 0 ? data.metrics : ['Engagement rate', 'Follower growth rate'],
          dataSources: data.dataSources?.length > 0 ? data.dataSources : ['Emplifi Analytics', 'Meta Business Suite'],
          baseline: data.baseline || '2.5%',
          target: data.targetValue || '4.0%',
          deadline: data.deadline || '2024-Q4',
          formula: data.formula || 'Weighted average of (Likes + Comments*2 + Shares*3) / Reach * 100',
        },
        suggestedTactics: [
          { name: 'User-Generated Content Campaign', description: 'Launch a UGC campaign to increase authentic engagement' },
          { name: 'Influencer Micro-Partnership Program', description: 'Partner with micro-influencers for higher engagement rates' },
          { name: 'Interactive Stories & Polls', description: 'Use interactive features to boost direct engagement' },
        ],
      }
    }
    
    if (data.type === 'tactic') {
      return {
        id: `gen-tac-${baseId}`,
        type: 'tactic',
        name,
        description: data.description || `Comprehensive strategy to amplify brand reach and engagement through targeted campaigns.`,
        contentOutline: [
          { type: 'heading', content: '1. Campaign Overview' },
          { type: 'paragraph', content: 'Define campaign goals, timeline, and budget allocation.' },
          { type: 'image', placeholder: 'Campaign timeline visual' },
          { type: 'heading', content: '2. Target Audience' },
          { type: 'table', content: 'Audience segmentation matrix' },
          { type: 'heading', content: '3. Content Strategy' },
          { type: 'paragraph', content: 'Content pillars and messaging framework.' },
          { type: 'heading', content: '4. Performance Tracking' },
          { type: 'paragraph', content: 'KPIs and reporting framework.' },
        ],
        suggestedBestPractices: [
          { name: 'Audience Research Process', description: 'Systematic approach to understand target segments' },
          { name: 'Content Calendar Management', description: 'Best practices for planning and scheduling content' },
          { name: 'Performance Monitoring', description: 'Track and optimize campaign performance' },
        ],
      }
    }
    
    if (data.type === 'bestPractice') {
      return {
        id: `gen-bp-${baseId}`,
        type: 'bestPractice',
        name,
        description: data.description || `Proven methodology for achieving consistent results.`,
        guidelines: [
          'Always start with clear objectives',
          'Document every step for reproducibility',
          'Review and iterate based on results',
        ],
        suggestedSteps: [
          { name: 'Define success criteria', actionType: 'action' },
          { name: 'Set up tracking and monitoring', actionType: 'automation' },
          { name: 'Review documentation', actionType: 'documentation' },
          { name: 'Execute and validate', actionType: 'action' },
          { name: 'Document learnings', actionType: 'action' },
        ],
      }
    }
    
    return {
      id: `gen-step-${baseId}`,
      type: 'step',
      name,
      description: data.description || `Action item with specific instructions and verification.`,
      actionType: 'action',
      documentation: '/docs/how-to-guide',
      verification: 'Check that all criteria are met before marking complete',
    }
  }
  
  const renderTypeSettings = () => {
    if (data.type === 'objective') {
      return (
        <div className="space-y-5">
          {/* Metrics */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <BarChart3 className="w-4 h-4 inline mr-1.5" />
              Success Metrics
            </label>
            <div className="flex flex-wrap gap-2">
              {metrics.map(metric => (
                <button
                  key={metric}
                  onClick={() => {
                    const current = data.metrics || []
                    const updated = current.includes(metric)
                      ? current.filter(m => m !== metric)
                      : [...current, metric]
                    updateData({ metrics: updated })
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Database className="w-4 h-4 inline mr-1.5" />
              Data Sources
            </label>
            <div className="flex flex-wrap gap-2">
              {dataSources.map(source => (
                <button
                  key={source}
                  onClick={() => {
                    const current = data.dataSources || []
                    const updated = current.includes(source)
                      ? current.filter(s => s !== source)
                      : [...current, source]
                    updateData({ dataSources: updated })
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Baseline</label>
              <input
                type="text"
                value={data.baseline || ''}
                onChange={(e) => updateData({ baseline: e.target.value })}
                placeholder="e.g. 2.5%"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Target</label>
              <input
                type="text"
                value={data.targetValue || ''}
                onChange={(e) => updateData({ targetValue: e.target.value })}
                placeholder="e.g. 5%"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Deadline
              </label>
              <input
                type="text"
                value={data.deadline || ''}
                onChange={(e) => updateData({ deadline: e.target.value })}
                placeholder="e.g. Q4 2024"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      )
    }
    
    if (data.type === 'tactic') {
      return (
        <div className="space-y-5">
          {/* Content Structure */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1.5" />
              Content Structure
            </label>
            <select
              value={data.contentStructure || ''}
              onChange={(e) => updateData({ contentStructure: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="">Auto-detect from prompt</option>
              {contentStructures.map(cs => (
                <option key={cs} value={cs}>{cs}</option>
              ))}
            </select>
          </div>
          
          {/* Media Types */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Include media
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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${data.includeMedia?.[key]
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <MediaIcon className="w-4 h-4" />
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Action type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stepTypes.map(({ id, label, icon: StepIcon }) => (
              <button
                key={id}
                onClick={() => updateData({ stepType: id })}
                className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all
                  ${data.stepType === id
                    ? 'bg-slate-200 ring-1 ring-slate-400'
                    : 'bg-slate-100 hover:bg-slate-200'
                  }`}
              >
                <StepIcon className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }
    
    return null
  }
  
  const renderPreview = () => {
    if (!data.generatedContent) return null
    
    const content = data.generatedContent
    
    return (
      <div className="space-y-4">
        {/* Main content */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">{content.name}</h4>
          <p className="text-sm text-slate-600">{content.description}</p>
          
          {/* Objective settings */}
          {content.settings && (
                    <div className="mt-4 p-3 bg-violet-50 rounded-lg text-xs space-y-1">
                      <div><span className="font-medium text-violet-700">Metrics:</span> {content.settings.metrics?.join(', ')}</div>
                      <div><span className="font-medium text-violet-700">Sources:</span> {content.settings.dataSources?.join(', ')}</div>
                      <div><span className="font-medium text-violet-700">Baseline → Target:</span> {content.settings.baseline} → {content.settings.target}</div>
                      <div><span className="font-medium text-violet-700">Deadline:</span> {content.settings.deadline}</div>
                    </div>
          )}
          
          {/* Content outline */}
          {content.contentOutline && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="text-xs font-medium text-blue-900 mb-2">Content structure:</h5>
              <div className="space-y-1">
                {content.contentOutline.map((item, i) => (
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
        </div>
        
        {/* Suggested children */}
        {(content.suggestedTactics || content.suggestedBestPractices || content.suggestedSteps) && (
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
            <h4 className="text-sm font-semibold text-teal-900 mb-3">
              Suggested items (will be generated in Review):
            </h4>
            <div className="space-y-2">
              {(content.suggestedTactics || content.suggestedBestPractices || content.suggestedSteps || []).map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-white rounded-lg">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-slate-500">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Prompt input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Describe what you want to generate:
        </label>
        <textarea
          value={data.prompt || ''}
          onChange={(e) => updateData({ prompt: e.target.value })}
          placeholder={
            data.type === 'objective' ? 'e.g. Increase Instagram engagement by 30% by end of Q4...' :
            data.type === 'tactic' ? 'e.g. Influencer marketing campaign for new product launch...' :
            data.type === 'bestPractice' ? 'e.g. Content approval process for social media team...' :
            'e.g. Set up automatic alerts for brand mentions...'
          }
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder:text-slate-400 resize-none"
        />
      </div>
      
      {/* Settings Section */}
      <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('settings')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-medium text-slate-900">Settings for {config?.label}</span>
          {expandedSections.has('settings') ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('settings') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-slate-200">
                {renderTypeSettings()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating content...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate {config?.label}
          </>
        )}
      </button>
      
      {/* Preview Section */}
      {data.generatedContent && (
        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('preview')}
            className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span className="font-medium text-emerald-900">Generated content</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleGenerate()
                }}
                className="p-1.5 hover:bg-emerald-200 rounded-lg transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4 text-emerald-600" />
              </button>
              {expandedSections.has('preview') ? (
                <ChevronDown className="w-5 h-5 text-emerald-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-emerald-600" />
              )}
            </div>
          </button>
          
          <AnimatePresence>
            {expandedSections.has('preview') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-emerald-200 bg-emerald-50/50">
                  {renderPreview()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
