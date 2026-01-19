import { useState } from 'react'
import { 
  Sparkles, 
  Loader2, 
  Building2, 
  Globe2, 
  Users,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const industries = [
  'Advertising & Marketing',
  'Automotive',
  'Banking & Financial Services',
  'Consumer Goods',
  'E-commerce',
  'Education',
  'Entertainment & Media',
  'Fashion & Apparel',
  'Food & Beverage',
  'Healthcare',
  'Hospitality & Tourism',
  'Real Estate',
  'Retail',
  'Software & Technology',
  'Telecommunications',
]

const regions = [
  'North America',
  'South America',
  'Western Europe',
  'Eastern Europe',
  'Middle East',
  'North Africa',
  'Sub-Saharan Africa',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Australia & New Zealand',
]

const jobRoles = [
  'CMO (Chief Marketing Officer)',
  'VP of Marketing',
  'Marketing Director',
  'Brand Manager',
  'Social Media Manager',
  'Content Marketing Manager',
  'Digital Marketing Manager',
  'Community Manager',
  'PR Manager',
  'Creative Director',
  'Content Creator',
  'Marketing Analyst',
]

const variantTypes = [
  {
    id: 'industry',
    label: 'By Industry',
    icon: Building2,
    description: 'Customize content for different industries',
    options: industries,
    // Static Tailwind classes
    selectedBg: 'bg-violet-50',
    selectedRing: 'ring-2 ring-violet-500',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    panelBorder: 'border-violet-200',
    panelBg: 'bg-violet-50',
    headingText: 'text-violet-900',
    badgeBg: 'bg-violet-200',
    badgeText: 'text-violet-800',
    pillSelectedBg: 'bg-violet-600',
    btnBg: 'bg-violet-600',
    btnHover: 'hover:bg-violet-700',
    numberBg: 'bg-violet-100',
    numberText: 'text-violet-600',
  },
  {
    id: 'region',
    label: 'By Region',
    icon: Globe2,
    description: 'Customize content for different regions',
    options: regions,
    selectedBg: 'bg-blue-50',
    selectedRing: 'ring-2 ring-blue-500',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    panelBorder: 'border-blue-200',
    panelBg: 'bg-blue-50',
    headingText: 'text-blue-900',
    badgeBg: 'bg-blue-200',
    badgeText: 'text-blue-800',
    pillSelectedBg: 'bg-blue-600',
    btnBg: 'bg-blue-600',
    btnHover: 'hover:bg-blue-700',
    numberBg: 'bg-blue-100',
    numberText: 'text-blue-600',
  },
  {
    id: 'jobRole',
    label: 'By Role',
    icon: Users,
    description: 'Customize content for different job roles',
    options: jobRoles,
    selectedBg: 'bg-emerald-50',
    selectedRing: 'ring-2 ring-emerald-500',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    panelBorder: 'border-emerald-200',
    panelBg: 'bg-emerald-50',
    headingText: 'text-emerald-900',
    badgeBg: 'bg-emerald-200',
    badgeText: 'text-emerald-800',
    pillSelectedBg: 'bg-emerald-600',
    btnBg: 'bg-emerald-600',
    btnHover: 'hover:bg-emerald-700',
    numberBg: 'bg-emerald-100',
    numberText: 'text-emerald-600',
  },
]

export default function VariantsStep({ data, updateData, isGenerating, setIsGenerating }) {
  const [expandedVariants, setExpandedVariants] = useState(new Set())
  
  const selectedType = variantTypes.find(t => t.id === data.variantBy)
  
  const handleTypeSelect = (typeId) => {
    if (data.variantBy === typeId) {
      updateData({ variantBy: null, selectedVariants: [], generatedVariants: [] })
    } else {
      updateData({ variantBy: typeId, selectedVariants: [], generatedVariants: [] })
    }
  }
  
  const handleOptionToggle = (option) => {
    const current = data.selectedVariants || []
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option]
    updateData({ selectedVariants: updated, generatedVariants: [] })
  }
  
  const handleGenerateVariants = async () => {
    if (!data.selectedVariants?.length) return
    
    setIsGenerating(true)
    
    // Simulate AI generation for each variant
    await new Promise(resolve => setTimeout(resolve, 2000 + data.selectedVariants.length * 500))
    
    const baseName = data.name || data.generatedContent?.name || 'Content Item'
    const baseDescription = data.description || data.generatedContent?.description || ''
    
    const variants = data.selectedVariants.map(variant => {
      // AI would adapt content here - we'll simulate it
      const adaptedContent = getAdaptedContent(baseName, baseDescription, data.variantBy, variant, data.type)
      
      return {
        id: `variant-${Date.now()}-${variant.replace(/\s+/g, '-').toLowerCase()}`,
        variantKey: variant,
        variantType: data.variantBy,
        ...adaptedContent,
      }
    })
    
    updateData({ generatedVariants: variants })
    setIsGenerating(false)
    
    // Expand first variant
    if (variants.length > 0) {
      setExpandedVariants(new Set([variants[0].id]))
    }
  }
  
  const getAdaptedContent = (baseName, baseDescription, variantType, variantValue, itemType) => {
    // Simulate AI content adaptation based on variant type
    const adaptations = {
      industry: {
        'Healthcare': {
          namePrefix: 'Healthcare-focused',
          contextTerms: ['patient engagement', 'HIPAA compliance', 'healthcare providers', 'clinical outcomes'],
          examples: ['patient testimonials', 'health awareness campaigns', 'medical professional endorsements'],
        },
        'E-commerce': {
          namePrefix: 'E-commerce optimized',
          contextTerms: ['conversion rate', 'cart abandonment', 'product discovery', 'customer journey'],
          examples: ['product showcases', 'flash sale promotions', 'user reviews integration'],
        },
        'Software & Technology': {
          namePrefix: 'Tech industry',
          contextTerms: ['B2B marketing', 'developer community', 'product demos', 'technical content'],
          examples: ['feature announcements', 'tutorial content', 'case studies'],
        },
        'Retail': {
          namePrefix: 'Retail-optimized',
          contextTerms: ['foot traffic', 'seasonal campaigns', 'loyalty programs', 'omnichannel'],
          examples: ['store promotions', 'new arrivals', 'customer spotlights'],
        },
      },
      region: {
        'North America': {
          namePrefix: 'NA market',
          contextTerms: ['US/Canada audience', 'English content', 'North American trends'],
          timezone: 'EST/PST optimization',
        },
        'Western Europe': {
          namePrefix: 'EU market',
          contextTerms: ['GDPR compliance', 'multi-language', 'European trends'],
          timezone: 'CET optimization',
        },
        'East Asia': {
          namePrefix: 'APAC market',
          contextTerms: ['localization', 'Asian platforms', 'cultural sensitivity'],
          timezone: 'JST/CST optimization',
        },
      },
      jobRole: {
        'CMO (Chief Marketing Officer)': {
          namePrefix: 'Executive-level',
          focus: ['strategic overview', 'ROI metrics', 'board-ready insights'],
          tone: 'high-level strategic',
        },
        'Social Media Manager': {
          namePrefix: 'Practitioner-focused',
          focus: ['tactical execution', 'daily workflows', 'hands-on tips'],
          tone: 'practical and actionable',
        },
        'Content Creator': {
          namePrefix: 'Creator-oriented',
          focus: ['creative guidelines', 'content formats', 'inspiration'],
          tone: 'creative and inspiring',
        },
      },
    }
    
    const adaptation = adaptations[variantType]?.[variantValue] || {
      namePrefix: variantValue,
      contextTerms: [],
    }
    
    return {
      name: `${baseName} (${variantValue})`,
      description: generateAdaptedDescription(baseDescription, variantValue, adaptation),
      targeting: {
        [variantType === 'industry' ? 'industries' : variantType === 'region' ? 'regions' : 'jobRoles']: [variantValue],
      },
      adaptationNotes: adaptation,
    }
  }
  
  const generateAdaptedDescription = (baseDesc, variant, adaptation) => {
    if (!baseDesc) {
      return `Content specifically tailored for ${variant}. ${
        adaptation.contextTerms?.length 
          ? `Key focus areas: ${adaptation.contextTerms.slice(0, 3).join(', ')}.`
          : ''
      }`
    }
    
    // Simple adaptation simulation
    let adapted = baseDesc
    if (adaptation.contextTerms?.length) {
      adapted += ` Specifically adapted for ${variant} with focus on ${adaptation.contextTerms[0]}.`
    }
    return adapted
  }
  
  const toggleVariantExpanded = (id) => {
    setExpandedVariants(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }
  
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Do you want to create variants?
        </h3>
        <p className="text-slate-600">
          AI will customize content for different segments - changing examples, terminology, and recommendations.
        </p>
      </div>
      
      {/* Skip option */}
      {!data.variantBy && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            This step is optional. You can skip it and create only one version.
          </p>
        </div>
      )}
      
      {/* Variant type selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {variantTypes.map((type) => {
          const Icon = type.icon
          const isSelected = data.variantBy === type.id
          
          return (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`p-4 rounded-xl text-left transition-all
                ${isSelected
                  ? `${type.selectedBg} ${type.selectedRing}`
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow'
                }`}
            >
              <div className={`w-10 h-10 rounded-lg ${type.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${type.iconText}`} />
              </div>
              <h4 className="font-medium text-slate-900 mb-1">{type.label}</h4>
              <p className="text-xs text-slate-500">{type.description}</p>
            </button>
          )
        })}
      </div>
      
      {/* Options selection */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className={`p-4 rounded-xl border-2 ${selectedType.panelBorder} ${selectedType.panelBg}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${selectedType.headingText}`}>
                  Select which {selectedType.label.toLowerCase()} to create variants for:
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${selectedType.badgeBg} ${selectedType.badgeText}`}>
                  {data.selectedVariants?.length || 0} selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {selectedType.options.map(option => {
                  const isOptionSelected = data.selectedVariants?.includes(option)
                  return (
                    <button
                      key={option}
                      onClick={() => handleOptionToggle(option)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all
                        ${isOptionSelected
                          ? `${selectedType.pillSelectedBg} text-white`
                          : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      {isOptionSelected && <Check className="w-3.5 h-3.5" />}
                      {option}
                    </button>
                  )
                })}
              </div>
              
              {/* Generate button */}
              {data.selectedVariants?.length > 0 && (
                <button
                  onClick={handleGenerateVariants}
                  disabled={isGenerating}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 ${selectedType.btnBg} text-white font-medium rounded-xl ${selectedType.btnHover} transition-colors disabled:opacity-50`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating {data.selectedVariants.length} variants...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate {data.selectedVariants.length} variants
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Generated variants preview */}
      {data.generatedVariants?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">
              Generated variants ({data.generatedVariants.length})
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Copy className="w-3.5 h-3.5" />
              Each variant has customized content
            </div>
          </div>
          
          {data.generatedVariants.map((variant, index) => (
            <div 
              key={variant.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleVariantExpanded(variant.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${selectedType?.numberBg || 'bg-slate-100'} flex items-center justify-center ${selectedType?.numberText || 'text-slate-600'} font-medium text-sm`}>
                  {index + 1}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900">{variant.variantKey}</p>
                  <p className="text-xs text-slate-500 truncate">{variant.name}</p>
                </div>
                {expandedVariants.has(variant.id) ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedVariants.has(variant.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-slate-100">
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                          <p className="text-sm text-slate-900">{variant.name}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description (customized)</label>
                          <p className="text-sm text-slate-700">{variant.description}</p>
                        </div>
                        {variant.adaptationNotes?.contextTerms && (
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <label className="block text-xs font-medium text-slate-500 mb-2">AI adaptation includes:</label>
                            <div className="flex flex-wrap gap-1.5">
                              {variant.adaptationNotes.contextTerms.map((term, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full">
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      )}
      
      {/* Summary */}
      {(data.generatedVariants?.length > 0 || !data.variantBy) && (
        <div className="mt-6 p-4 bg-teal-50 rounded-xl">
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="font-medium text-teal-900">
                {data.generatedVariants?.length > 0
                  ? `In the next step, you'll create ${data.generatedVariants.length + 1} items (1 main + ${data.generatedVariants.length} variants)`
                  : 'In the next step, you\'ll create 1 item'
                }
              </p>
              <p className="text-sm text-teal-700 mt-1">
                You can also generate nested items (tactics, best practices, steps).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
