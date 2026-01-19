import { useState } from 'react'
import { 
  Sparkles, 
  Loader2, 
  Building2, 
  Globe2, 
  Users,
  Check,
  X,
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
    label: 'Podle odvětví',
    icon: Building2,
    description: 'Přizpůsobit obsah pro různá odvětví',
    options: industries,
    color: 'violet',
  },
  {
    id: 'region',
    label: 'Podle regionu',
    icon: Globe2,
    description: 'Přizpůsobit obsah pro různé regiony',
    options: regions,
    color: 'blue',
  },
  {
    id: 'jobRole',
    label: 'Podle role',
    icon: Users,
    description: 'Přizpůsobit obsah pro různé job role',
    options: jobRoles,
    color: 'emerald',
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
          Chceš vytvořit varianty?
        </h3>
        <p className="text-slate-600">
          AI přizpůsobí obsah pro různé segmenty - změní příklady, terminologii a doporučení.
        </p>
      </div>
      
      {/* Skip option */}
      {!data.variantBy && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            Tento krok je volitelný. Můžeš ho přeskočit a vytvořit pouze jednu verzi.
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
                  ? `bg-${type.color}-50 ring-2 ring-${type.color}-500`
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow'
                }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-${type.color}-100 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${type.color}-600`} />
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
            <div className={`p-4 rounded-xl border-2 border-${selectedType.color}-200 bg-${selectedType.color}-50`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium text-${selectedType.color}-900`}>
                  Vyber pro které {selectedType.label.toLowerCase()} vytvořit varianty:
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full bg-${selectedType.color}-200 text-${selectedType.color}-800`}>
                  {data.selectedVariants?.length || 0} vybráno
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {selectedType.options.map(option => {
                  const isSelected = data.selectedVariants?.includes(option)
                  return (
                    <button
                      key={option}
                      onClick={() => handleOptionToggle(option)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all
                        ${isSelected
                          ? `bg-${selectedType.color}-600 text-white`
                          : `bg-white text-slate-700 hover:bg-slate-100`
                        }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
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
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-${selectedType.color}-600 text-white font-medium rounded-xl hover:bg-${selectedType.color}-700 transition-colors disabled:opacity-50`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generuji {data.selectedVariants.length} variant...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Vygenerovat {data.selectedVariants.length} variant
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
              Vygenerované varianty ({data.generatedVariants.length})
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Copy className="w-3.5 h-3.5" />
              Každá varianta má přizpůsobený obsah
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
                <div className={`w-8 h-8 rounded-lg bg-${selectedType?.color || 'slate'}-100 flex items-center justify-center text-${selectedType?.color || 'slate'}-600 font-medium text-sm`}>
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
                          <label className="block text-xs font-medium text-slate-500 mb-1">Název</label>
                          <p className="text-sm text-slate-900">{variant.name}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Popis (přizpůsobený)</label>
                          <p className="text-sm text-slate-700">{variant.description}</p>
                        </div>
                        {variant.adaptationNotes?.contextTerms && (
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <label className="block text-xs font-medium text-slate-500 mb-2">AI adaptace zahrnuje:</label>
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
                  ? `V dalším kroku vytvoříš ${data.generatedVariants.length + 1} položek (1 hlavní + ${data.generatedVariants.length} variant)`
                  : 'V dalším kroku vytvoříš 1 položku'
                }
              </p>
              <p className="text-sm text-teal-700 mt-1">
                Můžeš také vygenerovat vnořené položky (tactics, best practices, steps).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
