import { useState } from 'react'
import { X, Layers, Plus, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../context/FuelContext'

const industries = [
  'Advertising & Marketing',
  'Aerospace & Defense',
  'Agriculture',
  'Automotive',
  'Banking & Financial Services',
  'Biotechnology',
  'Chemicals',
  'Construction',
  'Consumer Goods',
  'E-commerce',
  'Education',
  'Energy & Utilities',
  'Entertainment & Media',
  'Fashion & Apparel',
  'Food & Beverage',
  'Government',
  'Healthcare',
  'Hospitality & Tourism',
  'Insurance',
  'Legal Services',
  'Logistics & Transportation',
  'Manufacturing',
  'Mining & Metals',
  'Non-Profit',
  'Pharmaceuticals',
  'Real Estate',
  'Retail',
  'Software & Technology',
  'Telecommunications',
  'Venture Capital & Private Equity',
]

const regions = [
  'North America',
  'South America',
  'Western Europe',
  'Eastern Europe',
  'Northern Europe',
  'Southern Europe',
  'Middle East',
  'North Africa',
  'Sub-Saharan Africa',
  'Central Asia',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Australia & New Zealand',
  'Pacific Islands',
  'Caribbean',
  'Central America',
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
  'Influencer Marketing Manager',
  'PR Manager',
  'Communications Director',
  'Creative Director',
  'Content Creator',
  'Marketing Analyst',
  'Growth Manager',
  'Customer Success Manager',
]

export default function CreateTacticModal({ isOpen, onClose, parentObjectiveId = null }) {
  const { addItem, items, updateItem, setAiPanelOpen } = useFuel()
  
  const objectives = items.filter(item => item.type === 'objective')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: parentObjectiveId || '',
    status: 'draft',
    industry: '',
    region: '',
    jobRole: '',
  })
  
  const [errors, setErrors] = useState({})
  
  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const tacticId = `tac-${Date.now()}`
    
    const newTactic = {
      id: tacticId,
      type: 'tactic',
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      qualityScore: 0,
      usageCount: 0,
      targeting: {
        industries: formData.industry ? [formData.industry] : [],
        regions: formData.region ? [formData.region] : [],
        jobRoles: formData.jobRole ? [formData.jobRole] : [],
        accounts: ['all'],
      },
      parentIds: formData.parentId ? [formData.parentId] : [],
      childIds: [],
      owner: 'Elizabeth Choos',
      lastEditedBy: 'Elizabeth Choos',
    }
    
    addItem(newTactic)
    
    // Update parent objective to include this tactic if parent selected
    if (formData.parentId) {
      const parent = items.find(i => i.id === formData.parentId)
      if (parent) {
        updateItem(formData.parentId, {
          childIds: [...(parent.childIds || []), tacticId]
        })
      }
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      parentId: parentObjectiveId || '',
      status: 'draft',
      industry: '',
      region: '',
      jobRole: '',
    })
    
    onClose()
  }
  
  const handleGenerateWithAI = () => {
    onClose()
    setAiPanelOpen(true)
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Create New Tactic</h2>
                  <p className="text-xs text-slate-500">Define how to achieve your objectives</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-5">
                {/* Parent Objective */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Parent Objective
                    <span className="text-slate-400 font-normal ml-1">(optional)</span>
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                  >
                    <option value="">No parent (standalone tactic)</option>
                    {objectives.map(obj => (
                      <option key={obj.id} value={obj.id}>{obj.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Link this tactic to an objective, or create it as standalone
                  </p>
                </div>
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tactic Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Influencer Partnerships"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white text-slate-900 placeholder:text-slate-400
                      ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the tactic and how it helps achieve the objective..."
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors bg-white text-slate-900 placeholder:text-slate-400
                      ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Initial Status
                  </label>
                  <div className="flex gap-2">
                    {['draft', 'in-review'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                          ${formData.status === status
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {status === 'draft' ? 'Draft' : 'In Review'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Targeting */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                    Targeting (Optional)
                  </h3>
                  
                  {/* Industry */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    >
                      <option value="">All industries</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Region */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    >
                      <option value="">All regions</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Job Role */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Job Role</label>
                    <select
                      value={formData.jobRole}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobRole: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    >
                      <option value="">All job roles</option>
                      {jobRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
            
            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={handleGenerateWithAI}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Tactic
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
